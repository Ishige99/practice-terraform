export type LabScenario = {
  id: string;
  title: string;
  level: "入門" | "基礎" | "実務" | "上級";
  objective: string;
  starterCode: string;
  successHint: string;
};

export const scenarios: LabScenario[] = [
  {
    id: "first-resource",
    title: "最初のresourceを作る",
    level: "入門",
    objective: "宣言したresourceがplanでcreateになり、apply後にstateへ保存されることを確認します。",
    starterCode: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
  acl    = "private"
  tags = {
    Environment = "dev"
    Owner       = "student"
  }
}`,
    successHint: "apply後にもう一度planすると no-op になります。"
  },
  {
    id: "change-diff",
    title: "差分を読む",
    level: "基礎",
    objective: "属性値を変更し、planがupdateとしてどのキーの差分を示すかを確認します。",
    starterCode: `resource "aws_s3_bucket" "learning" {
  bucket = "tf-practice-learning"
  acl    = "private"
  versioning = true
  tags = {
    Environment = "staging"
    Owner       = "student"
  }
}`,
    successHint: "stateにある値とコードの値がずれるとupdateになります。"
  },
  {
    id: "delete-resource",
    title: "削除予定を理解する",
    level: "基礎",
    objective: "stateには存在するがコードから消えたresourceがdeleteになることを確認します。",
    starterCode: `# resourceブロックを消すと、stateに残ったリソースはdelete予定になります。
resource "aws_s3_bucket" "logs" {
  bucket = "tf-practice-logs"
  acl    = "private"
}`,
    successHint: "apply前にplanを読む習慣が、意図しないdestroyを防ぎます。"
  },
  {
    id: "module-shape",
    title: "module化の前準備",
    level: "実務",
    objective: "同じようなresourceをまとめる前に、入力と出力に分けるべき値を見極めます。",
    starterCode: `resource "aws_s3_bucket" "app_assets" {
  bucket = "tf-practice-app-assets"
  acl    = "private"
  tags = {
    Environment = "prod"
    Service     = "web"
  }
}

resource "aws_s3_bucket" "app_logs" {
  bucket = "tf-practice-app-logs"
  acl    = "private"
  tags = {
    Environment = "prod"
    Service     = "web"
  }
}`,
    successHint: "共通化できる値、環境ごとに変わる値、outputにすべき値を分けて考えます。"
  }
];

export const initialScenario = scenarios[0];
