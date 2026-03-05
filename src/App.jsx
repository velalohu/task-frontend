import { Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="h-screen flex w-full overflow-hidden">
      <main className="h-full w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <div
                className="h-full w-full px-6 py-8 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%), #353144"
                }}
              >
                <TasksPage />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}