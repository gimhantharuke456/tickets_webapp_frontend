import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/BackOffice/Dashboard";
import "antd/dist/reset.css";
import { useSnapshot } from "valtio";
import state from "./store";
import Loading from "./components/Loading";

function App() {
  const snap = useSnapshot(state);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userNic = localStorage.getItem("userNic");

    if (userId && userNic) {
      state.userId = userId;
      state.userNic = userNic;
    }
  }, []);

  if (snap.isLoading) return <Loading />;

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={state.userId ? <Dashboard /> : <LoginForm />}
        />
        <Route
          exact
          path="/dashboard"
          element={state.userId ? <Dashboard /> : <LoginForm />}
        />
      </Routes>
    </Router>
  );
}

export default App;
