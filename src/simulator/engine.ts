export type AttributeValue = string | number | boolean | Record<string, string>;

export type ResourceConfig = {
  type: string;
  name: string;
  address: string;
  attributes: Record<string, AttributeValue>;
};

export type TerraformState = Record<string, ResourceConfig>;

export type PlanAction = "create" | "update" | "delete" | "no-op";

export type PlanChange = {
  action: PlanAction;
  address: string;
  before?: ResourceConfig;
  after?: ResourceConfig;
  changes: string[];
};

export type ParseResult = {
  resources: ResourceConfig[];
  errors: string[];
};

const resourceStartPattern = /^resource\s+"([^"]+)"\s+"([^"]+)"\s*\{\s*$/;
const blockEndPattern = /^\}\s*$/;
const mapStartPattern = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{\s*$/;
const stringAttributePattern = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"([^"]*)"\s*$/;
const numberAttributePattern = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/;
const booleanAttributePattern = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(true|false)\s*$/;
const mapEntryPattern = /^([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*"([^"]*)"\s*,?\s*$/;

export function parseConfiguration(source: string): ParseResult {
  const resources: ResourceConfig[] = [];
  const errors: string[] = [];
  const lines = source.split(/\r?\n/);
  let current: ResourceConfig | null = null;
  let openResourceAddress: string | null = null;
  let currentMapKey: string | null = null;
  let currentMap: Record<string, string> = {};

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = stripComment(rawLine).trim();

    if (!line) {
      return;
    }

    if (!current) {
      const match = line.match(resourceStartPattern);
      if (!match) {
        errors.push(`${lineNumber}行目: resource "type" "name" { の形式で始めてください。`);
        return;
      }

      const [, type, name] = match;
      current = {
        type,
        name,
        address: `${type}.${name}`,
        attributes: {}
      };
      openResourceAddress = current.address;
      return;
    }

    if (currentMapKey) {
      if (blockEndPattern.test(line)) {
        current.attributes[currentMapKey] = currentMap;
        currentMapKey = null;
        currentMap = {};
        return;
      }

      const entry = line.match(mapEntryPattern);
      if (!entry) {
        errors.push(`${lineNumber}行目: mapは key = "value" の形式で書いてください。`);
        return;
      }

      currentMap[entry[1]] = entry[2];
      return;
    }

    if (blockEndPattern.test(line)) {
      resources.push(current);
      current = null;
      openResourceAddress = null;
      return;
    }

    const mapStart = line.match(mapStartPattern);
    if (mapStart) {
      currentMapKey = mapStart[1];
      currentMap = {};
      return;
    }

    const parsed = parseAttribute(line);
    if (!parsed) {
      errors.push(`${lineNumber}行目: サポートされる属性は key = "value"、key = number、key = true/false、mapです。`);
      return;
    }

    current.attributes[parsed.key] = parsed.value;
  });

  if (currentMapKey) {
    errors.push(`最後の ${currentMapKey} map が閉じられていません。`);
  }

  if (openResourceAddress) {
    errors.push(`最後の ${openResourceAddress} resource ブロックが閉じられていません。`);
  }

  const seen = new Set<string>();
  for (const resource of resources) {
    if (seen.has(resource.address)) {
      errors.push(`${resource.address} が重複しています。resource type と name は一意にしてください。`);
    }
    seen.add(resource.address);
  }

  return { resources, errors };
}

export function createPlan(source: string, state: TerraformState): { changes: PlanChange[]; errors: string[] } {
  const parsed = parseConfiguration(source);
  if (parsed.errors.length > 0) {
    return { changes: [], errors: parsed.errors };
  }

  const desired = Object.fromEntries(parsed.resources.map((resource) => [resource.address, resource]));
  const addresses = Array.from(new Set([...Object.keys(state), ...Object.keys(desired)])).sort();
  const changes: PlanChange[] = addresses.map((address) => {
    const before = state[address];
    const after = desired[address];

    if (!before && after) {
      return { action: "create", address, after, changes: Object.keys(after.attributes).sort() };
    }

    if (before && !after) {
      return { action: "delete", address, before, changes: Object.keys(before.attributes).sort() };
    }

    if (before && after) {
      const changedKeys = diffAttributeKeys(before.attributes, after.attributes);
      return {
        action: changedKeys.length > 0 ? "update" : "no-op",
        address,
        before,
        after,
        changes: changedKeys
      };
    }

    return { action: "no-op", address, changes: [] };
  });

  return { changes, errors: [] };
}

export function applyPlan(changes: PlanChange[], state: TerraformState): TerraformState {
  const nextState: TerraformState = { ...state };

  for (const change of changes) {
    if (change.action === "create" || change.action === "update") {
      if (change.after) {
        nextState[change.address] = change.after;
      }
    }

    if (change.action === "delete") {
      delete nextState[change.address];
    }
  }

  return nextState;
}

export function summarizePlan(changes: PlanChange[]): { create: number; update: number; delete: number; noOp: number } {
  return changes.reduce(
    (summary, change) => {
      if (change.action === "create") summary.create += 1;
      if (change.action === "update") summary.update += 1;
      if (change.action === "delete") summary.delete += 1;
      if (change.action === "no-op") summary.noOp += 1;
      return summary;
    },
    { create: 0, update: 0, delete: 0, noOp: 0 }
  );
}

function parseAttribute(line: string): { key: string; value: AttributeValue } | null {
  const stringMatch = line.match(stringAttributePattern);
  if (stringMatch) {
    return { key: stringMatch[1], value: stringMatch[2] };
  }

  const numberMatch = line.match(numberAttributePattern);
  if (numberMatch) {
    return { key: numberMatch[1], value: Number(numberMatch[2]) };
  }

  const booleanMatch = line.match(booleanAttributePattern);
  if (booleanMatch) {
    return { key: booleanMatch[1], value: booleanMatch[2] === "true" };
  }

  return null;
}

function diffAttributeKeys(
  before: Record<string, AttributeValue>,
  after: Record<string, AttributeValue>
): string[] {
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
  return keys.filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])).sort();
}

function stripComment(line: string): string {
  const commentIndex = line.indexOf("#");
  return commentIndex === -1 ? line : line.slice(0, commentIndex);
}
