import { Link } from "react-router-dom";

export default function BottomNav() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "70px",
        background: "#111827",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #374151",
      }}
    >
      <Link to="/">🏠</Link>
      <Link to="/plants">🌿</Link>
      <Link to="/alerts">🚨</Link>
      <Link to="/settings">⚙️</Link>
    </div>
  );
}