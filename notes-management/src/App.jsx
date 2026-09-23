import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-note"
          element={<CreateNote />}
        />

        <Route
          path="/edit-note/:id"
          element={<CreateNote />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;