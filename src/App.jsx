import { useState } from "react";
import ProcessInput from "./components/ProcessInput";
import GanttChart from "./components/GanttChart";
import PerformanceTable from "./components/PerformanceTable";
import { runSimulation } from "./utils/simulation.js";
import { validateProcesses } from "./utils/validation.js";

function App() {
  const [processes, setProcesses] = useState([
    {
      id: "P1",
      arrivalTime: 0,
      burstTime: 5,
      priority: 2,
    },
    {
      id: "P2",
      arrivalTime: 1,
      burstTime: 3,
      priority: 1,
    },
    {
      id: "P3",
      arrivalTime: 2,
      burstTime: 2,
      priority: 3,
    },
  ]);

  const [algorithm, setAlgorithm] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(2);

  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [errors, setErrors] = useState([]);

  const algorithmInfo = {
    FCFS: {
      name: "First Come First Serve",
      description:
        "Processes are executed in the order in which they arrive.",
    },

    SJF: {
      name: "Shortest Job First",
      description:
        "The process with the shortest burst time is selected first.",
    },

    SRTF: {
      name: "Shortest Remaining Time First",
      description:
        "The process with the shortest remaining execution time is selected.",
    },

    PRIORITY: {
      name: "Priority Scheduling",
      description:
        "The available process with the highest priority is selected first.",
    },

    PRIORITY_PREEMPTIVE: {
      name: "Preemptive Priority",
      description:
        "A running process can be interrupted when a higher-priority process arrives.",
    },

    ROUND_ROBIN: {
      name: "Round Robin",
      description:
        "Each process receives a fixed time quantum in a cyclic manner.",
    },
  };

  function handleRunSimulation() {
    const validationErrors = validateProcesses(processes);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    if (
      algorithm === "ROUND_ROBIN" &&
      (!Number.isFinite(timeQuantum) || timeQuantum <= 0)
    ) {
      setErrors(["Time Quantum must be greater than 0."]);
      setResult(null);
      return;
    }

    setErrors([]);

    const simulationResult = runSimulation(
      processes,
      algorithm,
      timeQuantum
    );

    setResult(simulationResult);
  }

  function handleCompareAlgorithms() {
    const validationErrors = validateProcesses(processes);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setComparison(null);
      return;
    }

    if (
      !Number.isFinite(timeQuantum) ||
      timeQuantum <= 0
    ) {
      setErrors(["Time Quantum must be greater than 0."]);
      setComparison(null);
      return;
    }

    setErrors([]);

    const algorithms = [
      "FCFS",
      "SJF",
      "SRTF",
      "PRIORITY",
      "PRIORITY_PREEMPTIVE",
      "ROUND_ROBIN",
    ];

    const results = algorithms.map((algorithmName) =>
      runSimulation(
        processes,
        algorithmName,
        timeQuantum
      )
    );

    setComparison(results);
  }

  function loadSampleData() {
    setProcesses([
      {
        id: "P1",
        arrivalTime: 0,
        burstTime: 5,
        priority: 2,
      },
      {
        id: "P2",
        arrivalTime: 1,
        burstTime: 3,
        priority: 1,
      },
      {
        id: "P3",
        arrivalTime: 2,
        burstTime: 2,
        priority: 3,
      },
      {
        id: "P4",
        arrivalTime: 4,
        burstTime: 4,
        priority: 2,
      },
    ]);

    setResult(null);
    setComparison(null);
    setErrors([]);
  }

  function getAlgorithmName(name) {
    if (name === "PRIORITY") {
      return "Priority";
    }

    if (name === "PRIORITY_PREEMPTIVE") {
      return "Priority Preemptive";
    }

    if (name === "ROUND_ROBIN") {
      return "Round Robin";
    }

    if (name === "SJF") {
      return "SJF";
    }

    if (name === "SRTF") {
      return "SRTF";
    }

    return "FCFS";
  }

  return (
    <div className="app-container">

      {/* HERO SECTION */}
      <header className="hero">

        <div className="hero-badge">
          CPU SCHEDULING LAB
        </div>

        <h1>
          CPU Scheduling Algorithm Simulator
        </h1>

        <p>
          Visualize. Simulate. Compare. Understand.
        </p>

      </header>

      {/* SIMULATION CONTROLS */}
      <section className="card">

        <div className="section-title">
          <span>⚙️</span>
          Simulation Controls
        </div>

        <div className="control-grid">

          <div className="control-group">

            <label>
              Scheduling Algorithm
            </label>

            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setResult(null);
              }}
            >
              <option value="FCFS">
                FCFS
              </option>

              <option value="SJF">
                SJF — Non-Preemptive
              </option>

              <option value="SRTF">
                SRTF — Preemptive
              </option>

              <option value="PRIORITY">
                Priority — Non-Preemptive
              </option>

              <option value="PRIORITY_PREEMPTIVE">
                Priority — Preemptive
              </option>

              <option value="ROUND_ROBIN">
                Round Robin
              </option>
            </select>

          </div>

          {algorithm === "ROUND_ROBIN" && (
            <div className="control-group">

              <label>
                Time Quantum
              </label>

              <input
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) =>
                  setTimeQuantum(
                    Number(e.target.value)
                  )
                }
              />

            </div>
          )}

        </div>

        <div className="algorithm-info">

          <strong>
            {algorithmInfo[algorithm].name}
          </strong>

          <span>
            {algorithmInfo[algorithm].description}
          </span>

        </div>

      </section>

      {/* PROCESS CONFIGURATION */}
      <section className="card">

        <div className="section-title">
          <span>📋</span>
          Process Configuration
        </div>

        <ProcessInput
          processes={processes}
          setProcesses={setProcesses}
        />

        <div className="action-buttons">

          <button
            className="secondary-button"
            onClick={loadSampleData}
          >
            Load Sample Data
          </button>

          <button
            className="primary-button"
            onClick={handleRunSimulation}
          >
            ▶ Run Simulation
          </button>

          <button
            className="compare-button"
            onClick={handleCompareAlgorithms}
          >
            📊 Compare Algorithms
          </button>

        </div>

      </section>

      {/* ERRORS */}
      {errors.length > 0 && (
        <section className="error-box">

          <h3>
            Input Errors
          </h3>

          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                {error}
              </li>
            ))}
          </ul>

        </section>
      )}

      {/* SIMULATION RESULT */}
      {result && (
        <>
          <section className="result-header">

            <div>

              <span className="result-label">
                SIMULATION RESULT
              </span>

              <h2>
                {algorithmInfo[algorithm].name}
              </h2>

            </div>

            <div className="success-badge">
              ✓ Simulation Complete
            </div>

          </section>

          {/* GANTT CHART */}
          <section className="card">

            <div className="section-title">
              <span>📊</span>
              CPU Execution Timeline
            </div>

            <GanttChart
              ganttChart={result.ganttChart}
            />

          </section>

          {/* METRICS */}
          <section className="card">

            <div className="section-title">
              <span>📈</span>
              Performance Metrics
            </div>

            <div className="metrics-grid">

              <div className="metric-card">
                <span>
                  AVG WAITING TIME
                </span>

                <strong>
                  {result.metrics.averageWaitingTime.toFixed(2)}
                </strong>

                <small>
                  Time units
                </small>
              </div>

              <div className="metric-card">
                <span>
                  AVG TURNAROUND
                </span>

                <strong>
                  {result.metrics.averageTurnaroundTime.toFixed(2)}
                </strong>

                <small>
                  Time units
                </small>
              </div>

              <div className="metric-card">
                <span>
                  AVG RESPONSE
                </span>

                <strong>
                  {result.metrics.averageResponseTime.toFixed(2)}
                </strong>

                <small>
                  Time units
                </small>
              </div>

              <div className="metric-card">
                <span>
                  CPU UTILIZATION
                </span>

                <strong>
                  {result.metrics.cpuUtilization.toFixed(2)}%
                </strong>

                <small>
                  Processor efficiency
                </small>
              </div>

              <div className="metric-card">
                <span>
                  THROUGHPUT
                </span>

                <strong>
                  {result.metrics.throughput.toFixed(2)}
                </strong>

                <small>
                  Processes / time
                </small>
              </div>

              <div className="metric-card">
                <span>
                  CONTEXT SWITCHES
                </span>

                <strong>
                  {result.metrics.contextSwitches}
                </strong>

                <small>
                  Process switches
                </small>
              </div>

            </div>

          </section>

          {/* PROCESS PERFORMANCE */}
          <section className="card">

            <div className="section-title">
              <span>🧮</span>
              Process Performance
            </div>

            <PerformanceTable
              processes={result.processes}
            />

          </section>

          {/* EXPLANATION */}
          <section className="card explanation">

            <div className="section-title">
              <span>💡</span>
              Understanding the Result
            </div>

            <p>
              <strong>
                {algorithmInfo[algorithm].name}
              </strong>{" "}
              was used to schedule{" "}
              <strong>
                {processes.length}
              </strong>{" "}
              processes.
            </p>

            <p>
              The simulator generated the CPU execution
              timeline and calculated waiting time,
              turnaround time, response time, CPU
              utilization, throughput and context
              switches.
            </p>

            <p>
              Lower waiting and response times generally
              indicate better responsiveness, while high
              CPU utilization indicates efficient
              processor usage.
            </p>

          </section>
        </>
      )}

      {/* ALGORITHM COMPARISON */}
      {comparison && (
        <section className="card comparison-section">

          <div className="section-title">
            <span>🏆</span>
            Algorithm Comparison
          </div>

          <p className="comparison-description">
            Same workload evaluated using all six
            scheduling algorithms.
          </p>

          <div className="comparison-table-wrapper">

            <table className="comparison-table">

              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Avg Waiting</th>
                  <th>Avg Turnaround</th>
                  <th>Avg Response</th>
                  <th>CPU Utilization</th>
                  <th>Context Switches</th>
                </tr>
              </thead>

              <tbody>

                {comparison.map((item) => (
                  <tr key={item.algorithm}>

                    <td>
                      <strong>
                        {getAlgorithmName(
                          item.algorithm
                        )}
                      </strong>
                    </td>

                    <td>
                      {item.metrics.averageWaitingTime.toFixed(2)}
                    </td>

                    <td>
                      {item.metrics.averageTurnaroundTime.toFixed(2)}
                    </td>

                    <td>
                      {item.metrics.averageResponseTime.toFixed(2)}
                    </td>

                    <td>
                      {item.metrics.cpuUtilization.toFixed(2)}%
                    </td>

                    <td>
                      {item.metrics.contextSwitches}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>
      )}

      {/* FOOTER */}
      <footer>

        <p>
          CPU Scheduling Lab • Interactive Operating
          Systems Learning Tool
        </p>

      </footer>

    </div>
  );
}

export default App;