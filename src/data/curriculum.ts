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
  explanation: string[];
  example: string;
  topics: string[];
  lab: string;
  quiz: {
    question: string;
    choices: { text: string; correct: boolean; feedback: string }[];
  };
  references: { label: string; url: string }[];
  icon: LucideIcon;
};

export const lessons: Lesson[] = [
  {
    id: "iac",
    stage: "入門",
    title: "Infrastructure as CodeとTerraformの役割",
    outcome: "手作業のインフラ変更と宣言的管理の違いを説明できる。",
    explanation: [
      "Terraformはインフラの完成形をコードで宣言し、その状態に近づけるための変更を計算するツールです。画面で手作業する代わりに、何を作りたいかを設定ファイルに残します。",
      "重要なのは、手順書ではなくdesired stateを書くことです。Terraformは現在のstateとコードを比較し、作成・変更・削除の差分をplanとして出します。"
    ],
    example: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
}`,
    topics: ["IaC", "宣言的なdesired state", "providerとresource", "変更前にplanを読む文化"],
    lab: "resourceを1つ宣言し、create予定が出ることを見る。",
    quiz: {
      question: "Terraformの設定ファイルで主に書くものはどれですか？",
      choices: [
        { text: "インフラを変更するクリック手順", correct: false, feedback: "手順ではなく、最終的にどうなっていてほしいかを宣言します。" },
        { text: "インフラの望ましい状態", correct: true, feedback: "正解です。Terraformは望ましい状態と現在状態の差分を計算します。" },
        { text: "実行済みコマンドの履歴", correct: false, feedback: "履歴は主目的ではありません。stateは管理対象との対応を記録します。" }
      ]
    },
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
    explanation: [
      "`terraform init` は作業ディレクトリを準備し、providerやmoduleなど実行に必要なものを揃えます。",
      "`terraform plan` は変更予定を表示します。`terraform apply` はplanに基づいて作成・変更を実行します。`destroy` はstateで管理している対象を削除する危険な操作なので、plan確認が特に重要です。"
    ],
    example: `terraform init
terraform plan
terraform apply`,
    topics: ["init", "plan", "apply", "destroy", "plan file", "review before apply"],
    lab: "疑似planを作成し、apply後にno-opになる流れを体験する。",
    quiz: {
      question: "変更前にレビューすべき内容を確認するコマンドはどれですか？",
      choices: [
        { text: "terraform init", correct: false, feedback: "initは初期化です。変更差分を見るコマンドではありません。" },
        { text: "terraform plan", correct: true, feedback: "正解です。planでcreate/update/deleteを確認してからapplyします。" },
        { text: "terraform fmt", correct: false, feedback: "fmtはコード整形です。実行計画の確認ではありません。" }
      ]
    },
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
    explanation: [
      "Terraformの設定はblockとargumentを中心に読みます。`resource \"TYPE\" \"NAME\" { ... }` は、TYPEのリソースをNAMEというローカル名で管理するという意味です。",
      "`aws_s3_bucket.learning` のようなresource addressは、planやstateで対象を特定するために使われます。レビューでは、どのaddressが変わるのかをまず見ます。"
    ],
    example: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
  tags = {
    Environment = "dev"
  }
}`,
    topics: ["block", "argument", "expression", "resource address", "comments"],
    lab: "属性値を変えてupdate差分を確認する。",
    quiz: {
      question: "`resource \"aws_s3_bucket\" \"learning\"` のaddressはどれですか？",
      choices: [
        { text: "resource.aws_s3_bucket.learning", correct: false, feedback: "`resource` はaddressには入りません。" },
        { text: "aws_s3_bucket.learning", correct: true, feedback: "正解です。type.name の形で参照します。" },
        { text: "learning.aws_s3_bucket", correct: false, feedback: "順序は type が先、name が後です。" }
      ]
    },
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
    explanation: [
      "providerはAWS、GitHub、Datadogなど外部APIとの橋渡しです。resourceはproviderが扱う具体的な管理対象です。",
      "providerのversionを固定しないと、ある日同じコードでも挙動やschemaが変わる可能性があります。チーム運用ではsourceとversion constraintを明示して、lock fileもレビュー対象にします。"
    ],
    example: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}`,
    topics: ["required_providers", "provider source", "version constraints", "provider credentials"],
    lab: "AWS風resourceの属性を読み、provider固有の責務を分けて考える。",
    quiz: {
      question: "provider versionを固定する主な理由は何ですか？",
      choices: [
        { text: "planを必ず速くするため", correct: false, feedback: "速度よりも再現性と予期しない変更の抑制が主目的です。" },
        { text: "同じコードの挙動を安定させるため", correct: true, feedback: "正解です。provider更新による差分や破壊的変更を管理しやすくします。" },
        { text: "stateを不要にするため", correct: false, feedback: "provider versionを固定してもstateは必要です。" }
      ]
    },
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
    explanation: [
      "variablesは外から渡す値、localsはmodule内部で計算・整理する値、outputsは外へ公開する値です。何でもvariableにすると利用者が迷い、何でもoutputにすると依存が増えます。",
      "data sourceはTerraformが直接作らない既存情報を読み取る仕組みです。作るものと読むものを分けると、moduleの責務が明確になります。"
    ],
    example: `variable "environment" {
  type = string
}

locals {
  bucket_name = "app-\${var.environment}"
}

output "bucket_name" {
  value = local.bucket_name
}`,
    topics: ["input variables", "local values", "output values", "data sources", "sensitive values"],
    lab: "module化する前に、変わる値と外へ出す値を分類する。",
    quiz: {
      question: "moduleの外から環境名を渡したい場合、基本的に使うものはどれですか？",
      choices: [
        { text: "variable", correct: true, feedback: "正解です。外部から変わる値はvariableで受け取ります。" },
        { text: "output", correct: false, feedback: "outputはmoduleの外へ値を出すためのものです。" },
        { text: "state", correct: false, feedback: "stateは入力値を定義する場所ではありません。" }
      ]
    },
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
    explanation: [
      "stateはTerraformの設定と実際のリモートオブジェクトを結びつける記録です。stateがあるから、次回planで何を更新・削除すべきか判断できます。",
      "チームではローカルstateではなくremote backendとlockを使うのが基本です。stateには秘匿値が含まれる場合があるため、誰が読めるかも設計対象です。"
    ],
    example: `terraform {
  backend "s3" {
    bucket = "team-terraform-state"
    key    = "prod/app.tfstate"
    region = "ap-northeast-1"
  }
}`,
    topics: ["state binding", "refresh", "remote backend", "state locking", "drift", "sensitive state"],
    lab: "stateに存在するresourceをコードから消し、delete予定になる理由を確認する。",
    quiz: {
      question: "stateの重要な役割はどれですか？",
      choices: [
        { text: "設定ファイルを自動生成する", correct: false, feedback: "stateは設定ファイル生成が主目的ではありません。" },
        { text: "設定と実物リソースの対応を記録する", correct: true, feedback: "正解です。Terraformはstateを使って管理対象を追跡します。" },
        { text: "providerの認証情報を配布する", correct: false, feedback: "認証情報の配布先にするべきではありません。" }
      ]
    },
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
    explanation: [
      "moduleはTerraform設定のまとまりです。実行するディレクトリはroot module、そこから呼び出す再利用部品はchild moduleです。",
      "module化は重複削除だけが目的ではありません。入力、出力、責務、versioningを明確にして、利用者が安全に使える境界を作ることが目的です。"
    ],
    example: `module "app_bucket" {
  source      = "./modules/s3_bucket"
  name        = "app-assets"
  environment = "prod"
}`,
    topics: ["root module", "child module", "module source", "module versioning", "modules directory"],
    lab: "似たresourceの共通部分を見つけ、module input/outputを設計する。",
    quiz: {
      question: "よいmodule境界として最も近いものはどれですか？",
      choices: [
        { text: "すべてのresourceを1つの巨大moduleに入れる", correct: false, feedback: "変更範囲が大きくなり、利用者もレビューしづらくなります。" },
        { text: "責務と入出力が説明できる単位で切る", correct: true, feedback: "正解です。moduleは再利用できる責務の境界として設計します。" },
        { text: "ファイル数が増えたら必ずmodule化する", correct: false, feedback: "ファイル数だけではなく、責務と再利用性で判断します。" }
      ]
    },
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
    explanation: [
      "チーム運用では、PRでplanを出してレビューし、merge後に決められた環境へapplyする流れが基本です。人のPCで直接本番applyする運用は再現性と監査性が弱くなります。",
      "環境分離では、dev/stg/prodでstateを分け、blast radiusを小さくします。共通moduleは同じでも、stateと権限は環境ごとに切るのが安全です。"
    ],
    example: `pull_request: terraform plan
main merge:   terraform apply
state:        dev / stg / prod で分離`,
    topics: ["GitHub flow", "speculative plan", "workspaces", "environment directories", "review gates"],
    lab: "差分サマリをレビューし、applyしてよい変更か判断する。",
    quiz: {
      question: "本番Terraformのチーム運用で避けたいものはどれですか？",
      choices: [
        { text: "PRでplanを確認する", correct: false, feedback: "これは推奨されるレビュー手順です。" },
        { text: "環境ごとにstateを分ける", correct: false, feedback: "blast radiusを小さくするために有効です。" },
        { text: "個人PCから本番へ直接applyする", correct: true, feedback: "正解です。監査性・再現性・権限管理の面でリスクが高い運用です。" }
      ]
    },
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
    explanation: [
      "Terraformでは、コードだけでなくstateやplanにも秘匿値が現れる可能性があります。`sensitive` は表示抑制に役立ちますが、保存自体を完全になくすものではありません。",
      "実務ではVaultやクラウドのsecret manager、OIDCによる短命credential、policy checkを組み合わせます。秘密情報をtfvarsやGitに置かないことが前提です。"
    ],
    example: `variable "db_password" {
  type      = string
  sensitive = true
}`,
    topics: ["dynamic provider credentials", "Vault", "sensitive outputs", "policy enforcement", "least privilege"],
    lab: "危険な値をstateへ入れない設計判断をクイズで確認する。",
    quiz: {
      question: "`sensitive = true` について正しい理解はどれですか？",
      choices: [
        { text: "値がstateに一切保存されなくなる", correct: false, feedback: "表示は抑制されますが、保存や権限設計の検討は残ります。" },
        { text: "表示抑制に役立つが、state保護は別途必要", correct: true, feedback: "正解です。stateの保管先とアクセス権限も設計します。" },
        { text: "Gitに秘密情報を置いても安全になる", correct: false, feedback: "Gitに秘密情報を置く設計は避けるべきです。" }
      ]
    },
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
    explanation: [
      "`terraform fmt` は整形、`validate` は構文や設定の妥当性確認、`terraform test` はmoduleの期待動作を検証するために使います。",
      "テストでは、moduleの入力を変えたときに期待するoutputやcheckが満たされるかを確認します。CIではfmt、validate、test、lint、planを役割ごとに組み合わせます。"
    ],
    example: `terraform fmt -check
terraform validate
terraform test`,
    topics: ["terraform fmt", "validate", "terraform test", "TFLint", "pre-merge checks"],
    lab: "変更前後のplanと期待値を比べ、テストで守るべき観点を選ぶ。",
    quiz: {
      question: "moduleの期待動作を継続的に検証する目的に最も近いコマンドはどれですか？",
      choices: [
        { text: "terraform test", correct: true, feedback: "正解です。test fileを使ってmoduleの動作を検証します。" },
        { text: "terraform destroy", correct: false, feedback: "destroyは管理対象を削除するコマンドです。" },
        { text: "terraform output", correct: false, feedback: "outputは値の表示であり、検証そのものではありません。" }
      ]
    },
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
    explanation: [
      "Terraform設計では、どの単位でstateを分けるかが運用リスクに直結します。1つの巨大stateは依存関係を見やすい反面、plan/applyの影響範囲が大きくなります。",
      "上級レビューでは、moduleの美しさだけでなく、障害時の切り戻し、権限境界、依存方向、チームの所有範囲まで見ます。"
    ],
    example: `network state -> shared outputs
app state     -> network outputsを参照
database state -> appと独立して変更`,
    topics: ["blast radius", "state decomposition", "shared outputs", "provider aliasing", "operational runbooks"],
    lab: "小さなAWS風構成を見て、stateとmodule境界をレビューする。",
    quiz: {
      question: "state分割を考える主な理由として最も重要なものはどれですか？",
      choices: [
        { text: "Terraformファイルを短くするためだけ", correct: false, feedback: "ファイルの長さより、運用上の影響範囲が重要です。" },
        { text: "applyの影響範囲と所有境界を制御するため", correct: true, feedback: "正解です。blast radiusとチーム境界を小さくできます。" },
        { text: "provider version固定を不要にするため", correct: false, feedback: "state分割してもprovider管理は必要です。" }
      ]
    },
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
    explanation: [
      "Terraformの実務力は、コードを書くだけでなくplanを読んでリスクを説明できることです。create/update/deleteの数だけでなく、どのaddressがなぜ変わるのかを追います。",
      "レビューでは、意図しないdestroy、secret露出、権限過多、state移動、moduleの互換性、コスト増、rollback手段を確認します。"
    ],
    example: `Plan: 2 to add, 1 to change, 1 to destroy.

review:
- destroyは意図通りか
- state moveが必要ではないか
- secretや権限の変更はないか`,
    topics: ["plan review", "backward compatibility", "cost risk", "security risk", "rollback thinking"],
    lab: "複数resourceのcreate/update/deleteを読み、レビューコメントを組み立てる。",
    quiz: {
      question: "Terraform PRレビューで最初に強く確認すべきものはどれですか？",
      choices: [
        { text: "plan上のdeleteが意図通りか", correct: true, feedback: "正解です。意図しないdestroyは特に重大な事故につながります。" },
        { text: "コメントの句読点が統一されているか", correct: false, feedback: "重要ではありますが、まずは実行影響の確認が優先です。" },
        { text: "READMEの文字数が多いか", correct: false, feedback: "レビューの主眼は変更影響と運用リスクです。" }
      ]
    },
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
