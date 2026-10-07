
export function calculateMetrics(processes, ganttChart) {
  const totalBurstTime = processes.reduce(
    (sum, process) => sum + process.burstTime,
    0
  );

  const totalWaitingTime = processes.reduce(
    (sum, process) => sum + process.waitingTime,
    0
  );

  const totalTurnaroundTime = processes.reduce(
    (sum, process) => sum + process.turnaroundTime,
    0
  );

  const totalResponseTime = processes.reduce(
    (sum, process) => sum + process.responseTime,
    0
  );

  const totalExecutionTime =
    ganttChart.length > 0
      ? ganttChart[ganttChart.length - 1].end -
        ganttChart[0].start
      : 0;

  const totalIdleTime = ganttChart.reduce(
    (sum, segment) => {
      return segment.type === "idle"
        ? sum + (segment.end - segment.start)
        : sum;
    },
    0
  );

  const totalProcesses = processes.length;

  const totalContextSwitches = ganttChart.reduce(
    (count, segment, index) => {
      if (index === 0) return count;

      const previous = ganttChart[index - 1];

      if (
        segment.type === "process" &&
        previous.type === "process" &&
        segment.processId !== previous.processId
      ) {
        return count + 1;
      }

      return count;
    },
    0
  );

  const finalCompletionTime = processes.reduce(
    (max, process) =>
      Math.max(max, process.completionTime),
    0
  );

  return {
    averageWaitingTime:
      totalProcesses > 0
        ? totalWaitingTime / totalProcesses
        : 0,

    averageTurnaroundTime:
      totalProcesses > 0
        ? totalTurnaroundTime / totalProcesses
        : 0,

    averageResponseTime:
      totalProcesses > 0
        ? totalResponseTime / totalProcesses
        : 0,

    cpuUtilization:
      totalExecutionTime > 0
        ? ((totalExecutionTime - totalIdleTime) /
            totalExecutionTime) *
          100
        : 0,

    throughput:
      finalCompletionTime > 0
        ? totalProcesses / finalCompletionTime
        : 0,

    contextSwitches: totalContextSwitches,

    totalBurstTime,
    totalIdleTime,
    totalExecutionTime,
  };
}