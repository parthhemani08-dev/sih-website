export type ActivityType =
  | "concept_started"
  | "concept_completed"
  | "experiment_started"
  | "experiment_completed"
  | "circuit_run"
  | "ai_tutor_question";

export type LearningActivity = {
  id: string;
  userId: string | null;
  activityType: ActivityType;
  entityId?: string;
  entityName: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
};

const STORAGE_KEY = "nirvana-learning-activity";
const ACTIVITY_EVENT = "nirvana-learning-activity-updated";

export function getLearningActivity(): LearningActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as LearningActivity[]) : [];
  } catch {
    return [];
  }
}

export function recordLearningActivity(
  activityType: ActivityType,
  entityName: string,
  options: { entityId?: string; metadata?: LearningActivity["metadata"] } = {},
) {
  if (typeof window === "undefined") return;
  const activity: LearningActivity = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: null,
    activityType,
    entityId: options.entityId,
    entityName,
    metadata: options.metadata,
    createdAt: new Date().toISOString(),
  };
  const next = [activity, ...getLearningActivity()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT));
}

export function subscribeToLearningActivity(onUpdate: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handleUpdate = () => onUpdate();
  window.addEventListener(ACTIVITY_EVENT, handleUpdate);
  window.addEventListener("storage", handleUpdate);
  return () => {
    window.removeEventListener(ACTIVITY_EVENT, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
