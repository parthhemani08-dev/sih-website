"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, CircleHelp, Cpu, ExternalLink, Sparkles } from "lucide-react";
import { conceptLessons } from "@/lib/concepts";
import { getLearningActivity, recordLearningActivity, subscribeToLearningActivity } from "@/lib/learning-activity";

export default function ConceptsPage() {
  const [selected, setSelected] = useState(conceptLessons[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const active = useMemo(() => conceptLessons.find((lesson) => lesson.id === selected) ?? conceptLessons[0], [selected]);

  useEffect(() => {
    const syncCompleted = () => {
      const completedIds = getLearningActivity()
        .filter((activity) => activity.activityType === "concept_completed" && activity.entityId)
        .map((activity) => activity.entityId as string);
      setCompleted([...new Set(completedIds)]);
    };
    syncCompleted();
    return subscribeToLearningActivity(syncCompleted);
  }, []);

  const selectConcept = (id: string) => {
    const lesson = conceptLessons.find((item) => item.id === id) ?? conceptLessons[0];
    setSelected(lesson.id);
    setAnswers({});
    setSubmitted(false);
    recordLearningActivity("concept_started", lesson.title, { entityId: lesson.id });
  };

  const submitQuiz = () => {
    const score = active.quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
    setSubmitted(true);
    recordLearningActivity("concept_completed", active.title, {
      entityId: active.id,
      metadata: { quizScore: score, quizTotal: active.quiz.length, mastery: score === active.quiz.length ? "mastered" : score >= Math.ceil(active.quiz.length * 0.6) ? "developing" : "review" },
    });
    if (!completed.includes(active.id)) setCompleted((current) => [...current, active.id]);
  };

  const markComplete = () => {
    if (completed.includes(active.id)) return;
    setCompleted((current) => [...current, active.id]);
    recordLearningActivity("concept_completed", active.title, { entityId: active.id });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
      <section className="glass rounded-[28px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="eyebrow">Concept library</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">Build your understanding from first principles.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Every topic is a complete lesson with intuition, mathematics, circuit connections, resources, and a knowledge check.</p></div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d141a] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300"><BookOpen size={14} className="text-[#9fe7b7]" /> Foundations track</div>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          {conceptLessons.map((lesson) => <button key={lesson.id} type="button" onClick={() => selectConcept(lesson.id)} className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition ${selected === lesson.id ? "border-[#214d3d] bg-[#10241d] text-white" : "border-slate-800 bg-[#0d141a] text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}>{lesson.title}</button>)}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
        <aside className="glass rounded-[24px] p-4 sm:p-5">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Lessons</p>
          <div className="space-y-2">
            {conceptLessons.map((lesson) => <button key={lesson.id} type="button" onClick={() => selectConcept(lesson.id)} className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition ${selected === lesson.id ? "border-[#214d3d] bg-[#10241d]" : "border-slate-800 bg-[#0d141a] hover:border-slate-700"}`}><span><span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{lesson.badge} · {lesson.level}</span><span className="mt-1 block text-sm font-medium text-white">{lesson.title}</span></span>{completed.includes(lesson.id) ? <CheckCircle2 size={15} className="mt-1 text-[#9fe7b7]" /> : <ArrowRight size={14} className="mt-1 text-slate-500" />}</button>)}
          </div>
        </aside>

        <article className="glass rounded-[24px] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{active.badge} · {active.category}</p><h2 className="mt-2 text-3xl font-semibold text-white">{active.title}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{active.summary}</p></div><span className="rounded-full border border-[#1f3d37] bg-[#10271f] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#9fe7b7]">{active.level}</span></div>

          <div className="mt-8 space-y-6">
            <LessonBlock number="01" title="Introduction" icon={<BookOpen size={15} />}><p>{active.introduction}</p></LessonBlock>
            <LessonBlock number="02" title="Intuition" icon={<Sparkles size={15} />}><p>{active.intuition}</p></LessonBlock>
            <LessonBlock number="03" title="Formal explanation" icon={<BrainCircuit size={15} />}><p>{active.formal}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{active.equations.map((equation) => <div key={equation} className="rounded-xl border border-[#214d3d] bg-[#10241d] p-3 font-mono text-sm text-[#d7f9e6]">{equation}</div>)}</div></LessonBlock>
            <div className="grid gap-5 lg:grid-cols-2"><LessonBlock number="04" title="Worked example"><p>{active.workedExample}</p></LessonBlock><LessonBlock number="05" title="Visualization"><p>{active.visualization}</p><div className="mt-4 rounded-xl border border-slate-700 bg-[#0d141a] p-4 font-mono text-xs leading-6 text-[#9fe7b7] whitespace-pre-line">{active.circuitExample}</div></LessonBlock></div>
            <LessonBlock number="06" title="Practical connection" icon={<Cpu size={15} />}><p>{active.practical}</p><a href="/circuit-lab" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#9fe7b7] hover:text-white">Try this in Circuit Lab <ArrowRight size={15} /></a></LessonBlock>
            <LessonBlock number="07" title="Common misconceptions" icon={<CircleHelp size={15} />}><ul className="space-y-2">{active.misconceptions.map((item) => <li key={item} className="flex gap-2"><span className="text-[#9fe7b7]">•</span><span>{item}</span></li>)}</ul></LessonBlock>
            <LessonBlock number="08" title="Further resources" icon={<ExternalLink size={15} />}><div className="grid gap-2 sm:grid-cols-2">{active.resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-[#0d141a] p-3 text-sm text-slate-300 transition hover:border-[#214d3d] hover:text-[#9fe7b7]">{resource.label} ↗</a>)}</div></LessonBlock>

            <section className="rounded-2xl border border-[#1f3d37] bg-[#0d1d1d] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Quiz</p><h3 className="mt-1 text-xl font-semibold text-white">Check your {active.title.toLowerCase()} understanding</h3></div>{submitted && <span className="inline-flex items-center gap-1 text-xs text-[#9fe7b7]"><CheckCircle2 size={14} /> Score saved</span>}</div>
              <div className="mt-5 space-y-5">{active.quiz.map((question, index) => <div key={question.question}><p className="text-sm font-medium text-white">{index + 1}. {question.question}</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} className={`rounded-lg border px-3 py-2 text-left text-xs transition ${submitted && optionIndex === question.answer ? "border-emerald-500 bg-emerald-950/40 text-emerald-200" : answers[index] === optionIndex ? "border-[#9fe7b7] bg-[#10241d] text-white" : "border-slate-700 bg-[#0d141a] text-slate-400 hover:border-slate-500"}`}>{option}</button>)}</div>{submitted && <p className="mt-2 text-xs leading-5 text-slate-400">{question.explanation}</p>}</div>)}</div>
              <div className="mt-5 flex flex-wrap items-center gap-4"><button type="button" onClick={submitQuiz} disabled={Object.keys(answers).length < active.quiz.length} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{submitted ? "Update quiz score" : "Submit quiz"}</button><button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-500">Try again</button>{submitted && <span className="text-sm text-slate-400">Score: {active.quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0)} / {active.quiz.length}</span>}</div>
            </section>
            <button type="button" onClick={markComplete} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"><CheckCircle2 size={15} />{completed.includes(active.id) ? "Concept completed" : "Mark concept complete"}</button>
          </div>
        </article>
      </section>
    </div>
  );
}

function LessonBlock({ number, title, icon, children }: { number: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-800 bg-[#0d141a] p-4 sm:p-5"><div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9fe7b7]"><span className="font-mono text-slate-500">{number}</span>{icon}{title}</div><div className="text-sm leading-7 text-slate-300">{children}</div></section>;
}
