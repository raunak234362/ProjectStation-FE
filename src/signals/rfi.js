import { signal } from "@preact/signals-react";

// Global RFI signals
export const rfiList = signal([]);
export const rfiLoading = signal(false);
export const rfiError = signal(null);

// Helpers
export const setRFIs = (items) => {
  rfiList.value = Array.isArray(items) ? items : [];
};

export const prependRFI = (item) => {
  if (!item) return;
  rfiList.value = [item, ...(rfiList.value || [])];
};

export const updateRFI = (id, patch) => {
  rfiList.value = (rfiList.value || []).map((rfi) =>
    rfi.id === id ? { ...rfi, ...(typeof patch === 'function' ? patch(rfi) : patch) } : rfi
  );
};
