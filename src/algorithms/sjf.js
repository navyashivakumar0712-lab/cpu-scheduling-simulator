export function sjf(processes) {
  const remaining = processes.map((process) => ({
    ...process,
  }));

  let currentTime = 0;
  const completedProcesses = [];
  const ganttChart = [];

  while (remaining.length > 0) {
    // Find processes that have already arrived
    const available = remaining.filter(
      (process) => process.arrivalTime <= currentTime
    );

    // If no process has arrived, CPU stays idle
    if (available.length === 0) {
      const nextArrival = Math.min(
        ...remaining.map((process) => process.arrivalTime)
      );

      ganttChart.push({
        type: "idle",
        start: currentTime,
        end: nextArrival,
      });

      currentTime = nextArrival;
      continue;
    }

    // Select the shortest burst time
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }

      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }

      return a.id.localeCompare(b.id);
    });

    const process = available[0];

    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;

    ganttChart.push({
      type: "process",
      processId: process.id,
      start: startTime,
      end: completionTime,
    });

    const turnaroundTime =
      completionTime - process.arrivalTime;

    const waitingTime =
      turnaroundTime - process.burstTime;

    const responseTime =
      startTime - process.arrivalTime;

    completedProcesses.push({
      ...process,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    currentTime = completionTime;

    // Remove completed process
    const index = remaining.findIndex(
      (p) => p.id === process.id
    );

    remaining.splice(index, 1);
  }

  return {
    processes: completedProcesses,
    ganttChart,
  };
}