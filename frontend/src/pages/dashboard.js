import React from "react";

function Dashboard() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AggieFlow Dashboard</h1>
      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Tasks</h3>
          <p>12</p>
        </div>

        <div style={cardStyle}>
          <h3>Completed</h3>
          <p>5</p>
        </div>

        <div style={cardStyle}>
          <h3>In Progress</h3>
          <p>7</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  width: "150px",
  backgroundColor: "#f4f4f4",
  textAlign: "center"
};

export default Dashboard;

