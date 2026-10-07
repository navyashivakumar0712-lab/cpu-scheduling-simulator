import { useState } from "react";

function ProcessInput({ processes, setProcesses }) {
 

  function addProcess() {
    const nextNumber = processes.length + 1;

    setProcesses([
      ...processes,
      {
        id: `P${nextNumber}`,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
      },
    ]);
  }

  function deleteProcess(id) {
    setProcesses(
      processes.filter((process) => process.id !== id)
    );
  }

  function updateProcess(id, field, value) {
    setProcesses(
      processes.map((process) =>
        process.id === id
          ? {
              ...process,
              [field]:
                field === "id"
                  ? value
                  : Number(value),
            }
          : process
      )
    );
  }

  return (
    <div>
      <h2>Process Input</h2>

      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>
                <input
                  type="text"
                  value={process.id}
                  onChange={(e) =>
                    updateProcess(
                      process.id,
                      "id",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  min="0"
                  value={process.arrivalTime}
                  onChange={(e) =>
                    updateProcess(
                      process.id,
                      "arrivalTime",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  min="1"
                  value={process.burstTime}
                  onChange={(e) =>
                    updateProcess(
                      process.id,
                      "burstTime",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  min="1"
                  value={process.priority}
                  onChange={(e) =>
                    updateProcess(
                      process.id,
                      "priority",
                      e.target.value
                    )
                  }
                />
              </td>

              <td>
                <button
                  onClick={() =>
                    deleteProcess(process.id)
                  }
                  disabled={processes.length === 1}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addProcess}>
        + Add Process
      </button>
    </div>
  );
}

export default ProcessInput;