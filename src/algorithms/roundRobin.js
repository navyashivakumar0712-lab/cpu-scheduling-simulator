export function roundRobin(processes, timeQuantum = 2) {
  const remaining = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  let currentTime = 0;
  let completed = 0;

  const completedProcesses = [];
  const ganttChart = [];
  const readyQueue = [];

  // Sort by arrival time
  remaining.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }

    return a.id.localeCompare(b.id);
  });

  let nextProcessIndex = 0;

  while (completed < remaining.length) {
    // Add newly arrived processes to ready queue
    while (
      nextProcessIndex < remaining.length &&
      remaining[nextProcessIndex].arrivalTime <= currentTime
    ) {
      readyQueue.push(remaining[nextProcessIndex]);
      nextProcessIndex++;
    }

    // If queue is empty, CPU is idle
    if (readyQueue.length === 0) {
      if (nextProcessIndex < remaining.length) {
        const nextArrival =
          remaining[nextProcessIndex].arrivalTime;

        ganttChart.push({
          type: "idle",
          start: currentTime,
          end: nextArrival,
        });

        currentTime = nextArrival;
        continue;
      }
    }

    const process = readyQueue.shift();

    // Record first response
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }

    const executionTime = Math.min(
      timeQuantum,
      process.remainingTime
    );

    const startTime = currentTime;
    currentTime += executionTime;
    process.remainingTime -= executionTime;

    // Add to Gantt chart
    ganttChart.push({
      type: "process",
      processId: process.id,
      start: startTime,
      end: currentTime,
    });

    // Add processes that arrived during execution
    while (
      nextProcessIndex < remaining.length &&
      remaining[nextProcessIndex].arrivalTime <= currentTime
    ) {
      readyQueue.push(remaining[nextProcessIndex]);
      nextProcessIndex++;
    }

    // Process finished
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
    } else {
      // Process still needs CPU time
      readyQueue.push(process);
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