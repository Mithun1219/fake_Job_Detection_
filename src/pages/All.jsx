import Login from "./Login";
import Dashboard from "./Dashboard";
import CheckJob from "./CheckJob";

export default function All() {
  return (
    <div style={{ padding: 20 }}>
      <h2>All Pages in One Screen</h2>

      <hr />
      <Login />

      <hr />
      <Dashboard />

      <hr />
      <CheckJob />
    </div>
  );
}