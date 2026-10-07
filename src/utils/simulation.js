import { fcfs } from "../algorithms/fcfs";
import { sjf } from "../algorithms/sjf";
import { srtf } from "../algorithms/srtf";
import { priorityScheduling } from "../algorithms/priority";
import { priorityPreemptive } from "../algorithms/priorityPreemptive";
import { roundRobin } from "../algorithms/roundRobin";

import { calculateMetrics } from "./metrics";

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