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
    title: "Terraformは何をする道具？",
    outcome: "Terraformを「インフラの設計図を書く道具」として説明できる。",
    explanation: [
      "Terraformは、インターネット上にあるサーバーや保存場所を作るための「設計図ノート」です。料理のレシピに材料を書くように、「S3バケットを1つ作りたい」「名前はこれにしたい」と書きます。",
      "人が画面をポチポチ押して作ると、何をしたか忘れやすくなります。Terraformなら設計図が残るので、あとから見ても「何を作る予定だったか」がわかります。"
    ],
    example: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
}`,
    topics: ["設計図", "作りたい形", "resource", "変更前の確認"],
    lab: "小さな保存場所を1つ作る設計図を書き、作成予定が出ることを見る。",
    quiz: {
      question: "Terraformのファイルには、主に何を書くものですか？",
      choices: [
        { text: "画面でどこをクリックしたか", correct: false, feedback: "クリック手順ではなく、作りたいものの形を書きます。" },
        { text: "作りたいインフラの設計図", correct: true, feedback: "正解です。Terraformは設計図を読んで、何を作るか考えます。" },
        { text: "今日の作業日記", correct: false, feedback: "日記ではありません。みんなで同じものを作るための設計図です。" }
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
    title: "作る前に何が起きるか確認する",
    outcome: "init、plan、apply、destroyを日常の作業に置き換えて説明できる。",
    explanation: [
      "`terraform init` は、工作を始める前に道具箱をそろえる作業です。必要な部品や説明書を準備します。",
      "`terraform plan` は「このまま進めると何が起きる？」を見る下書き確認です。`apply` は実際に作ること、`destroy` は消すことです。消す操作は危ないので、planで必ず確認します。"
    ],
    example: `terraform init
terraform plan
terraform apply`,
    topics: ["準備 init", "確認 plan", "実行 apply", "削除 destroy"],
    lab: "作成予定を確認し、実行後に「もう変更なし」になる流れを体験する。",
    quiz: {
      question: "本当に作る前に「何が起きるか」を見るコマンドはどれですか？",
      choices: [
        { text: "terraform init", correct: false, feedback: "initは道具を準備する作業です。" },
        { text: "terraform plan", correct: true, feedback: "正解です。planで作る・変える・消す予定を先に見ます。" },
        { text: "terraform fmt", correct: false, feedback: "fmtは文字の並びをきれいにする作業です。" }
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
    title: "Terraformの書き方を読む",
    outcome: "resourceの形を見て、何を作ろうとしているか読める。",
    explanation: [
      "Terraformのコードは、箱の中にメモを書くような形です。`resource` は「作りたいもの」、その後ろの言葉は「何を」「何という名前で」作るかを表します。",
      "`aws_s3_bucket.learning` は、学校の持ち物に名前シールを貼るようなものです。Terraformはこの名前を使って、どの部品を変えるのか見分けます。"
    ],
    example: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
  tags = {
    Environment = "dev"
  }
}`,
    topics: ["resource", "名前", "中身の設定", "コメント"],
    lab: "値を書き換えて、どこが変わる予定かを見る。",
    quiz: {
      question: "`resource \"aws_s3_bucket\" \"learning\"` の名前シールに近いものはどれですか？",
      choices: [
        { text: "resource.aws_s3_bucket.learning", correct: false, feedback: "`resource` という言葉は名前シールには入りません。" },
        { text: "aws_s3_bucket.learning", correct: true, feedback: "正解です。「種類.名前」の形で見分けます。" },
        { text: "learning.aws_s3_bucket", correct: false, feedback: "順番が逆です。先に種類、あとに名前です。" }
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
    title: "どのサービスに作るのか決める",
    outcome: "providerを「Terraformが話しかける相手」として説明できる。",
    explanation: [
      "TerraformだけではAWSやGitHubに直接お願いできません。そこでproviderという通訳を使います。AWS providerならAWSに、GitHub providerならGitHubに話しかけます。",
      "providerにもバージョンがあります。ゲームやアプリの更新で画面が変わることがあるように、providerも更新で動きが変わることがあります。だから使うバージョンを決めておきます。"
    ],
    example: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}`,
    topics: ["provider", "AWSへの通訳", "バージョン", "ログイン情報"],
    lab: "AWS風のresourceを見て、Terraformがどの相手にお願いするか考える。",
    quiz: {
      question: "providerのバージョンを決めておく理由は何ですか？",
      choices: [
        { text: "必ず速く動くようにするため", correct: false, feedback: "速さよりも、同じ動きをしてくれることが大事です。" },
        { text: "急に動きが変わらないようにするため", correct: true, feedback: "正解です。みんなの環境で同じ動きにしやすくなります。" },
        { text: "記録を全部消すため", correct: false, feedback: "バージョンを決めても記録は必要です。" }
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
    title: "変わる値を外から渡す",
    outcome: "variable、local、outputを「入力・メモ・結果」として説明できる。",
    explanation: [
      "同じ工作でも、色だけ変えたいことがあります。Terraformのvariableは、その「あとから変えたい値」を外から入れるための箱です。",
      "localは作業中のメモ、outputはできあがったあとに見せる結果です。たとえば「バケット名を作るためのメモ」はlocal、「完成したバケット名を他の人に教える」のはoutputです。"
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
    topics: ["入力 variable", "メモ local", "結果 output", "読むだけの情報"],
    lab: "あとから変えたい値と、外へ教えたい値を分けて考える。",
    quiz: {
      question: "外から「dev」「prod」のような値を渡したいときに使うものはどれですか？",
      choices: [
        { text: "variable", correct: true, feedback: "正解です。外から入れる値はvariableで受け取ります。" },
        { text: "output", correct: false, feedback: "outputは外へ見せる結果です。" },
        { text: "state", correct: false, feedback: "stateはTerraformの記録です。入力箱ではありません。" }
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
    title: "Terraformの記録ノート state",
    outcome: "stateを「何を作ったか覚えておくノート」として説明できる。",
    explanation: [
      "stateは、Terraformが「前に何を作ったか」を覚えておく記録ノートです。ノートがあるから、次にコードを見たときに「これはもう作った」「これは変える必要がある」と判断できます。",
      "みんなで作業するときは、そのノートを自分の机だけに置くと困ります。チームで見られる安全な場所に置き、同時に2人が書き換えないようにします。"
    ],
    example: `terraform {
  backend "s3" {
    bucket = "team-terraform-state"
    key    = "prod/app.tfstate"
    region = "ap-northeast-1"
  }
}`,
    topics: ["記録ノート", "共有場所", "同時編集防止", "実物との差"],
    lab: "記録ノートに残っているものを設計図から消すと、削除予定になることを確認する。",
    quiz: {
      question: "stateは何のためのものですか？",
      choices: [
        { text: "作ったものを覚えておくため", correct: true, feedback: "正解です。Terraformはstateを見て、次に何をするか考えます。" },
        { text: "コードを勝手に書いてもらうため", correct: false, feedback: "stateはコードを書く道具ではなく、記録ノートです。" },
        { text: "パスワードを配るため", correct: false, feedback: "パスワードを配る場所にしてはいけません。" }
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
    title: "よく使う部品をまとめる module",
    outcome: "moduleを「何度も使える部品セット」として説明できる。",
    explanation: [
      "moduleは、よく使う作り方をまとめた部品セットです。毎回同じ説明を長く書く代わりに、「この部品セットを使う」と呼び出せます。",
      "ただし、何でも1つの箱に詰め込むと使いにくくなります。何を入れるか、外から何を渡すか、使ったあと何を教えるかを決めることが大事です。"
    ],
    example: `module "app_bucket" {
  source      = "./modules/s3_bucket"
  name        = "app-assets"
  environment = "prod"
}`,
    topics: ["部品セット", "入力", "結果", "使い回し"],
    lab: "似た設定の共通部分を見つけ、部品にするなら何を外から渡すか考える。",
    quiz: {
      question: "使いやすいmoduleに近いものはどれですか？",
      choices: [
        { text: "何でも全部入った巨大な箱", correct: false, feedback: "大きすぎる箱は、何が入っているかわかりにくくなります。" },
        { text: "役目がはっきりした部品セット", correct: true, feedback: "正解です。何をする部品か説明できる大きさがよいです。" },
        { text: "ファイルが増えたら何でもmodule", correct: false, feedback: "数だけでなく、使い回す意味があるかで考えます。" }
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
    title: "みんなで安全に変更する",
    outcome: "チームでTerraformを使うときの確認手順を説明できる。",
    explanation: [
      "学校の掲示物を勝手に貼り替えると、みんなが困ります。Terraformでも同じで、本番環境を1人のパソコンから直接変えるのは危険です。",
      "チームでは、まず変更案を出し、planを見て、ほかの人に確認してもらいます。練習用、確認用、本番用の場所を分けておくと、失敗しても影響を小さくできます。"
    ],
    example: `pull_request: terraform plan
main merge:   terraform apply
state:        dev / stg / prod で分離`,
    topics: ["変更案", "レビュー", "環境分け", "本番を守る"],
    lab: "差分を見て、本当に実行してよい変更か判断する。",
    quiz: {
      question: "チームで本番を変えるとき、避けたいことはどれですか？",
      choices: [
        { text: "変更前にplanを見る", correct: false, feedback: "これはよい確認です。" },
        { text: "練習用と本番用を分ける", correct: false, feedback: "これは安全にするためによい方法です。" },
        { text: "1人のパソコンから本番を直接変える", correct: true, feedback: "正解です。誰が何を変えたか見えにくく、事故につながります。" }
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
    title: "パスワードや秘密を守る",
    outcome: "Terraformで秘密情報を扱うときの危険を説明できる。",
    explanation: [
      "パスワードを黒板に書いたら、みんなに見えてしまいます。Terraformでも、秘密の値をコードや記録ノートにそのまま置くと危険です。",
      "sensitiveという設定は、画面に見えにくくする目隠しです。でも、目隠しをしても保管場所が安全とは限りません。秘密は専用の金庫のようなサービスに置くのが基本です。"
    ],
    example: `variable "db_password" {
  type      = string
  sensitive = true
}`,
    topics: ["秘密", "目隠し", "安全な保管場所", "必要な人だけ"],
    lab: "秘密の値をどこに置くと危ないかを考える。",
    quiz: {
      question: "sensitiveという設定は何をしてくれるものですか？",
      choices: [
        { text: "画面に見えにくくする", correct: true, feedback: "正解です。ただし保管場所まで完全に安全になるわけではありません。" },
        { text: "秘密を絶対に保存しなくなる", correct: false, feedback: "保存場所の安全は別に考える必要があります。" },
        { text: "Gitにパスワードを書いても安全にする", correct: false, feedback: "Gitに秘密を書くのは避けます。" }
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
    title: "間違いを早く見つける",
    outcome: "fmt、validate、testを「整える・確認する・試す」として説明できる。",
    explanation: [
      "作文を書くとき、字をそろえたり、誤字を見つけたり、先生に見てもらったりします。Terraformにも似た確認があります。",
      "`fmt` は見た目をそろえる、`validate` は書き方の大きな間違いを探す、`test` は部品が期待どおり動くか試すものです。早く見つけるほど、直すのが簡単です。"
    ],
    example: `terraform fmt -check
terraform validate
terraform test`,
    topics: ["整える fmt", "確認 validate", "試す test", "自動チェック"],
    lab: "変更が期待どおりか、どこをテストで守るべきか考える。",
    quiz: {
      question: "部品が期待どおり動くか試すコマンドはどれですか？",
      choices: [
        { text: "terraform test", correct: true, feedback: "正解です。部品が思った通りかを試します。" },
        { text: "terraform destroy", correct: false, feedback: "destroyは消す操作です。テストではありません。" },
        { text: "terraform output", correct: false, feedback: "outputは結果を見るためのものです。" }
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
    title: "大きな仕組みを小さく分ける",
    outcome: "大きなTerraformを小さく分ける理由を説明できる。",
    explanation: [
      "大きなレゴ作品を全部1つの箱に入れると、1か所直すだけでも大変です。Terraformも同じで、ネットワーク、アプリ、データベースなどを分けると扱いやすくなります。",
      "分けると、失敗したときの影響を小さくできます。誰がどこを担当するかもわかりやすくなります。上級者は、コードだけでなく運用しやすさも見ます。"
    ],
    example: `network state -> shared outputs
app state     -> network outputsを参照
database state -> appと独立して変更`,
    topics: ["小さく分ける", "影響を小さく", "担当を分ける", "直しやすさ"],
    lab: "小さなAWS風構成を見て、どこで分けると安全か考える。",
    quiz: {
      question: "大きなTerraformを小さく分ける大事な理由はどれですか？",
      choices: [
        { text: "失敗したときの影響を小さくするため", correct: true, feedback: "正解です。小さく分けると直す範囲も小さくなります。" },
        { text: "必ずファイル数を増やすため", correct: false, feedback: "ファイル数を増やすこと自体が目的ではありません。" },
        { text: "確認をしなくてよくするため", correct: false, feedback: "分けても確認は必要です。" }
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
    title: "最後の練習: 変更をレビューする",
    outcome: "planを見て、危ない変更に気づける。",
    explanation: [
      "Terraformが上手な人は、コードを書けるだけではありません。planを見て「これは本当に消していいの？」「お金が増えすぎない？」「秘密が見えていない？」と確認できます。",
      "レビューは、友だちの宿題をいじわるに見ることではありません。事故を防ぐために、みんなで安全確認をする作業です。"
    ],
    example: `Plan: 2 to add, 1 to change, 1 to destroy.

review:
- destroyは意図通りか
- state moveが必要ではないか
- secretや権限の変更はないか`,
    topics: ["planを見る", "削除確認", "お金", "秘密", "戻し方"],
    lab: "作成・変更・削除の予定を見て、危ないところを探す。",
    quiz: {
      question: "planを見たとき、特に注意して確認したいものはどれですか？",
      choices: [
        { text: "消す予定が本当に正しいか", correct: true, feedback: "正解です。まちがって消すと大きな事故になります。" },
        { text: "文章の句読点だけ", correct: false, feedback: "文章も大事ですが、まず実際に何が変わるかを見ます。" },
        { text: "READMEの文字数だけ", correct: false, feedback: "文字数より、変更の影響と危険を確認します。" }
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
