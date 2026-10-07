export function validateProcesses(processes) {
  const errors = [];

  if (!Array.isArray(processes) || processes.length === 0) {
    errors.push("At least one process is required.");
    return errors;
  }

  const processIds = new Set();

  processes.forEach((process, index) => {
    const processNumber = index + 1;

    // Process ID
    if (!process.id || process.id.trim() === "") {
      errors.push(`Process ${processNumber}: Process ID is required.`);
    } else if (processIds.has(process.id)) {
      errors.push(`Duplicate Process ID: ${process.id}.`);
    } else {
      processIds.add(process.id);
    }

    // Arrival Time
    if (
      !Number.isFinite(process.arrivalTime) ||
      process.arrivalTime < 0
    ) {
      errors.push(
        `${process.id || `Process ${processNumber}`}: Arrival time must be 0 or greater.`
      );
    }

    // Burst Time
    if (
      !Number.isFinite(process.burstTime) ||
      process.burstTime <= 0
    ) {
      errors.push(
        `${process.id || `Process ${processNumber}`}: Burst time must be greater than 0.`
      );
    }

    // Priority
    if (
      !Number.isFinite(process.priority) ||
      process.priority <= 0
    ) {
      errors.push(
        `${process.id || `Process ${processNumber}`}: Priority must be greater than 0.`
      );
    }
  });

  return errors;
}