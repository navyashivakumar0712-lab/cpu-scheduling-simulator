export function srtf(processes) {
  const remaining = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  let currentTime = 0;
  let completed = 0;

  const completedProcesses = [];
  const ganttChart = [];

  while (completed < remaining.length) {
    // Find processes that have arrived and still need CPU time
    const available = remaining.filter(
      (process) =>
        process.arrivalTime <= currentTime &&
        process.remainingTime > 0
    );

    // CPU is idle if no process is available
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

    // Select process with shortest remaining time
    available.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime) {
        return a.remainingTime - b.remainingTime;
      }

      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }

      return a.id.localeCompare(b.id);
    });

    const process = available[0];

    // Run for one unit of time
    const startTime = currentTime;

    process.remainingTime--;
    currentTime++;

    // Add/merge Gantt chart segment
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

      const firstSegment = ganttChart.find(
        (segment) =>
          segment.type === "process" &&
          segment.processId === process.id
      );

      const responseTime =
        firstSegment.start - process.arrivalTime;

      completedProcesses.push({
        ...process,
        startTime: firstSegment.start,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      });

      completed++;
    }
  }

  // Keep results in process ID order
  completedProcesses.sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  return {
    processes: completedProcesses,
    ganttChart,
  };
}