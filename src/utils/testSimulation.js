import { runSimulation } from "./simulation.js";

const processes = [
  {
    id: "P1",
    arrivalTime: 0,
    burstTime: 5,
    priority: 2,
  },
  {
    id: "P2",
    arrivalTime: 1,
    burstTime: 3,
    priority: 1,
  },
  {
    id: "P3",
    arrivalTime: 2,
    burstTime: 2,
    priority: 3,
  },
  {
    id: "P4",
    arrivalTime: 4,
    burstTime: 4,
    priority: 2,
  },
];

const algorithms = [
  "FCFS",
  "SJF",
  "SRTF",
  "PRIORITY",
  "PRIORITY_PREEMPTIVE",
  "ROUND_ROBIN",
];

console.log("===== CPU SCHEDULING ALGORITHM TEST =====");

for (const algorithm of algorithms) {
  const result = runSimulation(processes, algorithm, 2);

  console.log(`\n===== ${algorithm} =====`);

  console.log("Gantt Chart:");
  console.table(result.ganttChart);

  console.log("Metrics:");
  console.table(result.metrics);
}