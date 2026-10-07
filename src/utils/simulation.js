import { fcfs } from "../algorithms/fcfs.js";
import { sjf } from "../algorithms/sjf.js";
import { srtf } from "../algorithms/srtf.js";
import { priorityScheduling } from "../algorithms/priority.js";
import { priorityPreemptive } from "../algorithms/priorityPreemptive.js";
import { roundRobin } from "../algorithms/roundRobin.js";

import { calculateMetrics } from "./metrics.js";

export function runSimulation(
  processes,
  algorithm,
  timeQuantum = 2
) {
  let result;

  switch (algorithm) {
    case "FCFS":
      result = fcfs(processes);
      break;

    case "SJF":
      result = sjf(processes);
      break;

    case "SRTF":
      result = srtf(processes);
      break;

    case "PRIORITY":
      result = priorityScheduling(processes);
      break;

    case "PRIORITY_PREEMPTIVE":
      result = priorityPreemptive(processes);
      break;

    case "ROUND_ROBIN":
      result = roundRobin(processes, timeQuantum);
      break;

    default:
      throw new Error(
        `Unknown scheduling algorithm: ${algorithm}`
      );
  }

  const metrics = calculateMetrics(
    result.processes,
    result.ganttChart
  );

  return {
    algorithm,
    processes: result.processes,
    ganttChart: result.ganttChart,
    metrics,
  };
}