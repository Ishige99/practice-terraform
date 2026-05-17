import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileJson,
  FlaskConical,
  Play,
  RotateCcw,
  Save,
  SearchCheck,
  Sparkles
} from "lucide-react";
import { lessons, officialReferences, type Lesson } from "./data/curriculum";
import { applyPlan, createPlan, summarizePlan, type PlanChange, type TerraformState } from "./simulator/engine";
import { initialScenario, scenarios, type LabScenario } from "./simulator/scenarios";

type Progress = Record<string, boolean>;

const progressKey = "terraform-practice-progress";
const stateKey = "terraform-practice-state";
const completedCount = (progress: Progress) => Object.values(progress).filter(Boolean).length;

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenario.id);
  const [code, setCode] = useState(initialScenario.starterCode);
  const [state, setState] = useState<TerraformState>(() => readJson(stateKey, initialScenario.initialState ?? {}));
  const [progress, setProgress] = useState<Progress>(() => readJson(progressKey, {}));
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? initialScenario;
  const plan = useMemo(() => createPlan(code, state), [code, state]);
  const summary = useMemo(() => summarizePlan(plan.changes), [plan.changes]);
  const progressPercent = Math.round((completedCount(progress) / lessons.length) * 100);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }, [state]);

  const handleSelectScenario = (scenario: LabScenario) => {
    setSelectedScenarioId(scenario.id);
    setCode(scenario.starterCode);
    setState(scenario.initialState ?? {});
    setLastApplied(null);
  };

  const handleApply = () => {
    if (plan.errors.length > 0) return;
    setState(applyPlan(plan.changes, state));
    setLastApplied(new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  };

  const handleReset = () => {
    setState({});
    setLastApplied(null);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Terraform Practice Lab">
          <span className="brand-mark">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <span>
            <strong>Terraform Practice Lab</strong>
            <small>zero to production reviewer</small>
          </span>
        </a>
        <nav className="topnav" aria-label="主要ナビゲーション">
          <a href="#roadmap">Roadmap</a>
          <a href="#lab">Lab</a>
          <a href="#references">References</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <BookMarked size={16} aria-hidden="true" />
              HashiCorp公式情報ベース
            </div>
            <h1 id="hero-title">Terraformを、手を動かして学ぶ。</h1>
            <p>
              入門から実務レビューまでを、短いレッスンとブラウザ上の疑似 <code>plan / apply / state</code> で確認できます。
              実クラウドや認証情報は使いません。
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#lab">
                演習を始める
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="secondary-link" href="#roadmap">
                ロードマップを見る
              </a>
            </div>
          </div>
          <div className="hero-summary" aria-label="サイトの学習範囲">
            <div>
              <span>Lessons</span>
              <strong>{lessons.length}</strong>
              <small>初学者から上級まで</small>
            </div>
            <div>
              <span>Labs</span>
              <strong>{scenarios.length}</strong>
              <small>疑似Terraform演習</small>
            </div>
            <div>
              <span>Safety</span>
              <strong>Local</strong>
              <small>ブラウザ内だけで完結</small>
            </div>
          </div>
        </section>

        <section className="progress-band" aria-label="学習進捗">
          <div>
            <span className="metric-label">Progress</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <div>
            <span className="metric-label">Lessons</span>
            <strong>
              {completedCount(progress)} / {lessons.length}
            </strong>
          </div>
          <div>
            <span className="metric-label">State objects</span>
            <strong>{Object.keys(state).length}</strong>
          </div>
        </section>

        <section id="roadmap" className="roadmap-section" aria-labelledby="roadmap-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Learning roadmap</p>
              <h2 id="roadmap-title">初学者から上級レビューまでの12ステップ</h2>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => setProgress({})}
              title="進捗をリセット"
              aria-label="進捗をリセット"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <div className="roadmap-grid">
            <LessonRail lessons={lessons} selectedLessonId={selectedLessonId} progress={progress} onSelect={setSelectedLessonId} />
            <LessonDetail
              lesson={selectedLesson}
              done={Boolean(progress[selectedLesson.id])}
              onToggleDone={() => setProgress((current) => ({ ...current, [selectedLesson.id]: !current[selectedLesson.id] }))}
            />
          </div>
        </section>

        <section id="lab" className="lab-section" aria-labelledby="lab-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Browser hands-on</p>
              <h2 id="lab-title">疑似Terraformで plan / apply / state を体験する</h2>
            </div>
            <button className="danger-ghost-button" type="button" onClick={handleReset}>
              <RotateCcw size={18} aria-hidden="true" />
              State reset
            </button>
          </div>

          <div className="lab-steps" aria-label="演習手順">
            <span>1. コードを読む</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>2. plan差分を見る</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>3. applyしてstateを確認</span>
          </div>

          <div className="scenario-tabs" role="tablist" aria-label="演習シナリオ">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                role="tab"
                type="button"
                className={scenario.id === selectedScenarioId ? "scenario-tab active" : "scenario-tab"}
                aria-selected={scenario.id === selectedScenarioId}
                onClick={() => handleSelectScenario(scenario)}
              >
                <span>{scenario.level}</span>
                <strong>{scenario.title}</strong>
              </button>
            ))}
          </div>

          <div className="lab-grid">
            <section className="editor-panel" aria-label="Terraform風コードエディタ">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">{selectedScenario.level}</span>
                  <h3>{selectedScenario.title}</h3>
                </div>
                <span className="panel-chip">limited HCL</span>
              </div>
              <p className="objective">{selectedScenario.objective}</p>
              <textarea
                spellCheck={false}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                aria-label="Terraform風コード"
              />
              <div className="editor-footer">
                <span>{selectedScenario.successHint}</span>
                <button type="button" className="primary-button" onClick={handleApply} disabled={plan.errors.length > 0}>
                  <Play size={17} aria-hidden="true" />
                  Apply
                </button>
              </div>
            </section>

            <section className="plan-panel" aria-label="疑似Terraform plan">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">terraform plan</span>
                  <h3>Execution plan</h3>
                </div>
                <PlanSummary create={summary.create} update={summary.update} deleteCount={summary.delete} noOp={summary.noOp} />
              </div>
              {plan.errors.length > 0 ? (
                <div className="error-list">
                  {plan.errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : (
                <PlanList changes={plan.changes} />
              )}
              {lastApplied && (
                <p className="applied-note">
                  <Save size={15} aria-hidden="true" />
                  {lastApplied} にstateへ反映しました。
                </p>
              )}
            </section>

            <section className="state-panel" aria-label="疑似Terraform state">
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">terraform.tfstate</span>
                  <h3>State snapshot</h3>
                </div>
                <FileJson size={20} aria-hidden="true" />
              </div>
              <pre>{JSON.stringify(state, null, 2)}</pre>
            </section>
          </div>
        </section>

        <section id="references" className="reference-section" aria-labelledby="references-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Source material</p>
              <h2 id="references-title">一次情報として確認する公式ドキュメント</h2>
            </div>
            <SearchCheck size={28} aria-hidden="true" />
          </div>
          <div className="reference-grid">
            {officialReferences.map((reference) => (
              <a key={reference.url} className="reference-card" href={reference.url} target="_blank" rel="noreferrer">
                <span>{reference.label}</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function LessonRail({
  lessons: lessonItems,
  selectedLessonId,
  progress,
  onSelect
}: {
  lessons: Lesson[];
  selectedLessonId: string;
  progress: Progress;
  onSelect: (lessonId: string) => void;
}) {
  return (
    <div className="lesson-rail">
      {lessonItems.map((lesson, index) => {
        const Icon = lesson.icon;
        const active = selectedLessonId === lesson.id;
        const done = Boolean(progress[lesson.id]);
        return (
          <button key={lesson.id} type="button" className={active ? "lesson-row active" : "lesson-row"} onClick={() => onSelect(lesson.id)}>
            <span className="lesson-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="lesson-icon">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className="lesson-row-copy">
              <strong>{lesson.title}</strong>
              <small>{lesson.stage}</small>
            </span>
            {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function LessonDetail({ lesson, done, onToggleDone }: { lesson: Lesson; done: boolean; onToggleDone: () => void }) {
  const Icon = lesson.icon;
  return (
    <article className="lesson-detail">
      <div className="lesson-detail-header">
        <span className="large-icon">
          <Icon size={26} aria-hidden="true" />
        </span>
        <div>
          <span className="panel-kicker">{lesson.stage}</span>
          <h3>{lesson.title}</h3>
        </div>
      </div>
      <p className="outcome">{lesson.outcome}</p>
      <div className="topic-cloud">
        {lesson.topics.map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>
      <div className="lab-note">
        <FlaskConical size={20} aria-hidden="true" />
        <span>{lesson.lab}</span>
      </div>
      <div className="lesson-links">
        {lesson.references.map((reference) => (
          <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">
            {reference.label}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        ))}
      </div>
      <button className={done ? "complete-button done" : "complete-button"} type="button" onClick={onToggleDone}>
        <CheckCircle2 size={18} aria-hidden="true" />
        {done ? "完了済み" : "このレッスンを完了"}
      </button>
    </article>
  );
}

function PlanSummary({ create, update, deleteCount, noOp }: { create: number; update: number; deleteCount: number; noOp: number }) {
  return (
    <div className="plan-summary" aria-label={`create ${create}, update ${update}, delete ${deleteCount}, no-op ${noOp}`}>
      <span className="create">+{create}</span>
      <span className="update">~{update}</span>
      <span className="delete">-{deleteCount}</span>
      <span>{noOp} no-op</span>
    </div>
  );
}

function PlanList({ changes }: { changes: PlanChange[] }) {
  if (changes.length === 0) {
    return <p className="empty-plan">設定が空で、stateにもリソースがありません。</p>;
  }

  return (
    <div className="plan-list">
      {changes.map((change) => (
        <article key={change.address} className={`plan-change ${change.action}`}>
          <div>
            <strong>{actionSymbol(change.action)} {change.address}</strong>
            <span>{actionLabel(change.action)}</span>
          </div>
          {change.changes.length > 0 && (
            <ul>
              {change.changes.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}

function actionSymbol(action: PlanChange["action"]) {
  if (action === "create") return "+";
  if (action === "update") return "~";
  if (action === "delete") return "-";
  return "=";
}

function actionLabel(action: PlanChange["action"]) {
  if (action === "create") return "create after apply";
  if (action === "update") return "update in-place";
  if (action === "delete") return "delete from state";
  return "no changes";
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default App;
