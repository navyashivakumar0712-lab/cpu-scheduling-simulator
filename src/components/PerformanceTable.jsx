function PerformanceTable({ processes }) {
  if (!processes || processes.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Process Performance</h2>

      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
            <th>Completion Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
            <th>Response Time</th>
          </tr>
        </thead>

        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.priority}</td>
              <td>{process.completionTime}</td>
              <td>{process.turnaroundTime}</td>
              <td>{process.waitingTime}</td>
              <td>{process.responseTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PerformanceTable;