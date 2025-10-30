import { signal } from "@preact/signals-react";

// Global Change Orders signals (per-view usage)
export const coList = signal([]);
export const coLoading = signal(false);
export const coError = signal(null);

export const setCOs = (items) => {
  coList.value = Array.isArray(items) ? items : [];
};

export const prependCO = (item) => {
  if (!item) return;
  coList.value = [item, ...(coList.value || [])];
};

export const updateCO = (id, patch) => {
  coList.value = (coList.value || []).map((c) =>
    c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c
  );
};
