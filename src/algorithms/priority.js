export function priorityScheduling(processes) {
  const remaining = processes.map((process) => ({
    ...process,
  }));

  let currentTime = 0;
  const completedProcesses = [];
  const ganttChart = [];

  while (remaining.length > 0) {
    // Find processes that have arrived
    const available = remaining.filter(
      (process) => process.arrivalTime <= currentTime
    );

    // CPU is idle if no process has arrived
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

    // Smaller priority number = higher priority
    available.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      // Tie-breaker: earlier arrival time
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }

      return a.id.localeCompare(b.id);
    });

    const process = available[0];

    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;

    // Add process to Gantt chart
    ganttChart.push({
      type: "process",
      processId: process.id,
      start: startTime,
      end: completionTime,
    });

    // Calculate metrics
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