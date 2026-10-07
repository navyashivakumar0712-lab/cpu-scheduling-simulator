export function priorityPreemptive(processes) {
  const remaining = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  let currentTime = 0;
  let completed = 0;

  const completedProcesses = [];
  const ganttChart = [];

  while (completed < remaining.length) {
    const available = remaining.filter(
      (process) =>
        process.arrivalTime <= currentTime &&
        process.remainingTime > 0
    );

    // CPU idle
    if (available.length === 0) {
      const futureProcesses = remaining.filter(
        (process) =>
          process.remainingTime > 0 &&
          process.arrivalTime > currentTime
      );

      const nextArrival = Math.min(
        ...futureProcesses.map((process) => process.arrivalTime)
      );

      ganttChart.push({
        type: "idle",
        start: currentTime,
        end: nextArrival,
      });

      currentTime = nextArrival;
      continue;
    }

    // Smaller number = higher priority
    available.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }

      return a.id.localeCompare(b.id);
    });

    const process = available[0];

    // Record first response
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }

    const startTime = currentTime;

    // Run for one unit of time
    process.remainingTime--;
    currentTime++;

    // Merge consecutive execution of the same process
    const lastSegment = ganttChart[ganttChart.length - 1];

    if (
      lastSegment &&
      lastSegment.type === "process" &&
      lastSegment.processId === process.id &&
      lastSegment.end === startTime
    ) {
      lastSegment.end = currentTime;
    } else {
      ganttChart.push({
        type: "process",
        processId: process.id,
        start: startTime,
        end: currentTime,
      });
    }

    // Process completed
    if (process.remainingTime === 0) {
      const completionTime = currentTime;

      const turnaroundTime =
        completionTime - process.arrivalTime;

      const waitingTime =
        turnaroundTime - process.burstTime;

      const responseTime =
        process.startTime - process.arrivalTime;

      completedProcesses.push({
        ...process,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      });

      completed++;
    }
  }

  completedProcesses.sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  return {
    processes: completedProcesses,
    ganttChart,
  };
}