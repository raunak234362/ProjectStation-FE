import { Signal } from "@preact/signals-react";

// Holds the currently viewed estimation details
export const estimationSignal = new Signal(null);

// Holds the list of estimations for tables/views
export const estimationsSignal = new Signal([]);
