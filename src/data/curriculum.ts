import {
  BookOpen,
  Boxes,
  CheckCircle2,
  Cloud,
  Code2,
  GitBranch,
  GraduationCap,
  Layers,
  LockKeyhole,
  Route,
  ShieldCheck,
  Terminal
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Lesson = {
  id: string;
  stage: "入門" | "基礎" | "中級" | "実務" | "上級";
  title: string;
  outcome: string;
  topics: string[];
  lab: string;
  references: { label: string; url: string }[];
  icon: LucideIcon;
};

export const lessons: Lesson[] = [
  {
    id: "iac",
    stage: "入門",
    title: "Infrastructure as CodeとTerraformの役割",
    outcome: "手作業のインフラ変更と宣言的管理の違いを説明できる。",
    topics: ["IaC", "宣言的なdesired state", "providerとresource", "変更前にplanを読む文化"],
    lab: "resourceを1つ宣言し、create予定が出ることを見る。",
    references: [
      { label: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
      { label: "Terraform Language", url: "https://developer.hashicorp.com/terraform/language" }
    ],
    icon: GraduationCap
  },
  {
    id: "cli-workflow",
    stage: "入門",
    title: "init / plan / apply / destroyの基本ワークフロー",
    outcome: "Terraform CLIの主要コマンドがいつ何をするかを理解する。",
    topics: ["init", "plan", "apply", "destroy", "plan file", "review before apply"],
    lab: "疑似planを作成し、apply後にno-opになる流れを体験する。",
    references: [
      { label: "Terraform CLI", url: "https://developer.hashicorp.com/terraform/cli" },
      { label: "Create a Terraform plan", url: "https://developer.hashicorp.com/terraform/tutorials/cli/plan" }
    ],
    icon: Terminal
  },
  {
    id: "hcl",
    stage: "基礎",
    title: "HCLの構文とTerraform Language",
    outcome: "block、argument、expression、resource addressを読める。",
    topics: ["block", "argument", "expression", "resource address", "comments"],
    lab: "属性値を変えてupdate差分を確認する。",
    references: [
      { label: "Terraform Language", url: "https://developer.hashicorp.com/terraform/language" },
      { label: "Style Guide", url: "https://developer.hashicorp.com/terraform/language/style" }
    ],
    icon: Code2
  },
  {
    id: "providers",
    stage: "基礎",
    title: "providers、resources、version constraints",
    outcome: "providerのsourceとversionを固定する理由を説明できる。",
    topics: ["required_providers", "provider source", "version constraints", "provider credentials"],
    lab: "AWS風resourceの属性を読み、provider固有の責務を分けて考える。",
    references: [
      { label: "Provider Requirements", url: "https://developer.hashicorp.com/terraform/language/providers/requirements" },
      { label: "Version Constraints", url: "https://developer.hashicorp.com/terraform/language/expressions/version-constraints" }
    ],
    icon: Cloud
  },
  {
    id: "variables-outputs",
    stage: "中級",
    title: "variables、locals、outputs、data sources",
    outcome: "再利用性のために入力、内部計算、出力を分けられる。",
    topics: ["input variables", "local values", "output values", "data sources", "sensitive values"],
    lab: "module化する前に、変わる値と外へ出す値を分類する。",
    references: [
      { label: "Terraform Language", url: "https://developer.hashicorp.com/terraform/language" },
      { label: "Style Guide Variables", url: "https://developer.hashicorp.com/terraform/language/style#variables" }
    ],
    icon: Route
  },
  {
    id: "state",
    stage: "中級",
    title: "state、remote state、drift",
    outcome: "stateがなぜ必要で、共有と秘匿で何に注意すべきかを説明できる。",
    topics: ["state binding", "refresh", "remote backend", "state locking", "drift", "sensitive state"],
    lab: "stateに存在するresourceをコードから消し、delete予定になる理由を確認する。",
    references: [
      { label: "State", url: "https://docs.hashicorp.com/terraform/language/state" },
      { label: "Remote State", url: "https://docs.hashicorp.com/terraform/language/state/remote" }
    ],
    icon: Layers
  },
  {
    id: "modules",
    stage: "実務",
    title: "modulesとリポジトリ構成",
    outcome: "root moduleとchild moduleを分け、再利用単位を設計できる。",
    topics: ["root module", "child module", "module source", "module versioning", "modules directory"],
    lab: "似たresourceの共通部分を見つけ、module input/outputを設計する。",
    references: [
      { label: "Modules", url: "https://developer.hashicorp.com/terraform/language/modules" },
      { label: "Style Guide Repository structure", url: "https://developer.hashicorp.com/terraform/language/style#repository-structure" }
    ],
    icon: Boxes
  },
  {
    id: "team-workflow",
    stage: "実務",
    title: "チーム運用、CI/CD、環境分離",
    outcome: "PR上のspeculative plan、環境ごとのstate、mainをsource of truthにする運用を設計できる。",
    topics: ["GitHub flow", "speculative plan", "workspaces", "environment directories", "review gates"],
    lab: "差分サマリをレビューし、applyしてよい変更か判断する。",
    references: [
      { label: "Style Guide Workflow", url: "https://developer.hashicorp.com/terraform/language/style#workflow-style" },
      { label: "GitHub Pages", url: "https://docs.github.com/en/pages" }
    ],
    icon: GitBranch
  },
  {
    id: "security",
    stage: "上級",
    title: "secrets、policy、guardrails",
    outcome: "stateやCIに残る秘匿情報を前提に、credentialとpolicyを安全に扱える。",
    topics: ["dynamic provider credentials", "Vault", "sensitive outputs", "policy enforcement", "least privilege"],
    lab: "危険な値をstateへ入れない設計判断をクイズで確認する。",
    references: [
      { label: "Style Guide Secrets management", url: "https://developer.hashicorp.com/terraform/language/style#secrets-management" },
      { label: "Policy", url: "https://developer.hashicorp.com/terraform/language/style#policy" }
    ],
    icon: LockKeyhole
  },
  {
    id: "testing",
    stage: "上級",
    title: "terraform validate / test / lint",
    outcome: "moduleの破壊的変更を検知するテスト戦略を作れる。",
    topics: ["terraform fmt", "validate", "terraform test", "TFLint", "pre-merge checks"],
    lab: "変更前後のplanと期待値を比べ、テストで守るべき観点を選ぶ。",
    references: [
      { label: "terraform test", url: "https://developer.hashicorp.com/terraform/cli/commands/test" },
      { label: "Style Guide Code validation", url: "https://developer.hashicorp.com/terraform/language/style#code-validation" }
    ],
    icon: CheckCircle2
  },
  {
    id: "architecture",
    stage: "上級",
    title: "実務アーキテクチャ設計",
    outcome: "state分割、module境界、依存方向、blast radiusを踏まえた構成をレビューできる。",
    topics: ["blast radius", "state decomposition", "shared outputs", "provider aliasing", "operational runbooks"],
    lab: "小さなAWS風構成を見て、stateとmodule境界をレビューする。",
    references: [
      { label: "Style Guide Multiple environments", url: "https://developer.hashicorp.com/terraform/language/style#multiple-environments" },
      { label: "Modules Workflow", url: "https://developer.hashicorp.com/terraform/language/modules#workflows" }
    ],
    icon: ShieldCheck
  },
  {
    id: "capstone",
    stage: "上級",
    title: "Capstone: PRレビューできるTerraform実践者へ",
    outcome: "planを読み、リスクを指摘し、改善案を出せる。",
    topics: ["plan review", "backward compatibility", "cost risk", "security risk", "rollback thinking"],
    lab: "複数resourceのcreate/update/deleteを読み、レビューコメントを組み立てる。",
    references: [
      { label: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
      { label: "Style Guide", url: "https://developer.hashicorp.com/terraform/language/style" }
    ],
    icon: BookOpen
  }
];

export const officialReferences = [
  { label: "Terraform Tutorials", url: "https://developer.hashicorp.com/terraform/tutorials" },
  { label: "Terraform Language", url: "https://developer.hashicorp.com/terraform/language" },
  { label: "Terraform CLI", url: "https://developer.hashicorp.com/terraform/cli" },
  { label: "Terraform Style Guide", url: "https://developer.hashicorp.com/terraform/language/style" },
  { label: "Terraform Modules", url: "https://developer.hashicorp.com/terraform/language/modules" },
  { label: "Terraform State", url: "https://docs.hashicorp.com/terraform/language/state" },
  { label: "terraform test", url: "https://developer.hashicorp.com/terraform/cli/commands/test" },
  { label: "Vite GitHub Pages Deploy", url: "https://vitejs.dev/guide/static-deploy.html" }
];
