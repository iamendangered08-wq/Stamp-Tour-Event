export type StampState = Record<number, { at: string }>;

const STORAGE_KEY = "energy_highway_stamp_state_v1";

export function loadState(): StampState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as StampState;
    return {};
  } catch {
    return {};
  }
}

export function saveState(state: StampState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function markDone(state: StampState, id: number): StampState {
  return { ...state, [id]: { at: new Date().toISOString() } };
}

export function resetAll() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function countDone(state: StampState) {
  return Object.keys(state).length;
}
