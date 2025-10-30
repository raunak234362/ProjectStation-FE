import { signal } from "@preact/signals-react";

// Global Submittals signals
export const submittalsList = signal([]);
export const submittalsLoading = signal(false);
export const submittalsError = signal(null);

export const setSubmittals = (items) => {
  submittalsList.value = Array.isArray(items) ? items : [];
};

export const prependSubmittal = (item) => {
  if (!item) return;
  submittalsList.value = [item, ...(submittalsList.value || [])];
};

export const updateSubmittal = (id, patch) => {
  submittalsList.value = (submittalsList.value || []).map((s) =>
    s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) } : s
  );
};
