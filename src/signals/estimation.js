import { signal } from "@preact/signals-react";

// Holds the currently viewed estimation details
export const estimationSignal = signal(null);

// Holds the list of estimations for tables/views
export const estimationsSignal = signal([]);
