import { describe, expect, it } from "vitest";
import { applyPlan, createPlan, parseConfiguration } from "./engine";

const bucket = `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
  acl    = "private"
}`;

describe("terraform practice simulator", () => {
  it("parses supported resource blocks", () => {
    const result = parseConfiguration(bucket);

    expect(result.errors).toEqual([]);
    expect(result.resources[0].address).toBe("aws_s3_bucket.learning");
    expect(result.resources[0].attributes.bucket).toBe("tf-practice-learning");
  });

  it("plans create from empty state and no-op after apply", () => {
    const firstPlan = createPlan(bucket, {});

    expect(firstPlan.errors).toEqual([]);
    expect(firstPlan.changes[0].action).toBe("create");

    const state = applyPlan(firstPlan.changes, {});
    const secondPlan = createPlan(bucket, state);

    expect(secondPlan.changes[0].action).toBe("no-op");
  });

  it("plans update when an attribute changes", () => {
    const firstPlan = createPlan(bucket, {});
    const state = applyPlan(firstPlan.changes, {});
    const updated = bucket.replace('acl    = "private"', 'acl    = "public-read"');
    const updatePlan = createPlan(updated, state);

    expect(updatePlan.changes[0].action).toBe("update");
    expect(updatePlan.changes[0].changes).toEqual(["acl"]);
  });

  it("plans delete when a resource disappears from configuration", () => {
    const firstPlan = createPlan(bucket, {});
    const state = applyPlan(firstPlan.changes, {});
    const deletePlan = createPlan("", state);

    expect(deletePlan.changes[0].action).toBe("delete");
  });
});
