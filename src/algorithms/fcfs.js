export function fcfs(processes) {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }

    return a.id.localeCompare(b.id);
  });

  let currentTime = 0;

  const completedProcesses = [];
  const ganttChart = [];

  for (const process of sortedProcesses) {
    // CPU remains idle if the process has not arrived yet
    if (currentTime < process.arrivalTime) {
      ganttChart.push({
        type: "idle",
        start: currentTime,
        end: process.arrivalTime,
      });

      currentTime = process.arrivalTime;
    }

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
  }

  return {
    processes: completedProcesses,
    ganttChart,
  };
}