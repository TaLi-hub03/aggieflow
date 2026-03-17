import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/sidebarLayout";

import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import CalendarPage from "./pages/calendarPage";
import Team from "./pages/team";
import Settings from "./pages/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Wrap all authenticated pages with the sidebar layout */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
