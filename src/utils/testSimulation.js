import { runSimulation } from "./simulation";

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
];

const result = runSimulation(processes, "FCFS");

console.log("===== CPU SCHEDULING TEST =====");

console.log("Algorithm:", result.algorithm);

console.log("Processes:");
console.table(result.processes);

console.log("Gantt Chart:");
console.table(result.ganttChart);

console.log("Metrics:");
console.table(result.metrics);