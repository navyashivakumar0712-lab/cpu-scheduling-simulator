function GanttChart({ ganttChart }) {
  if (!ganttChart || ganttChart.length === 0) {
    return null;
  }

  const totalTime = ganttChart[ganttChart.length - 1].end;

  return (
    <div>
      <h2>Gantt Chart</h2>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "80px",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      >
        {ganttChart.map((segment, index) => {
          const duration = segment.end - segment.start;
          const width = (duration / totalTime) * 100;

          return (
            <div
              key={index}
              style={{
                width: `${width}%`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid white",
                backgroundColor:
                  segment.type === "idle"
                    ? "#9ca3af"
                    : "#2563eb",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {segment.type === "process"
                ? segment.processId
                : "IDLE"}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "5px",
        }}
      >
        {ganttChart.map((segment, index) => {
          const duration = segment.end - segment.start;
          const width = (duration / totalTime) * 100;

          return (
            <div
              key={index}
              style={{
                width: `${width}%`,
                textAlign: "left",
                fontSize: "12px",
              }}
            >
              {segment.start}
            </div>
          );
        })}

        <span style={{ fontSize: "12px" }}>
          {totalTime}
        </span>
      </div>
    </div>
  );
}

export default GanttChart;