import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/sidebarLayout";

import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import CalendarPage from "./pages/calendarPage";
import Team from "./pages/team";
import Settings from "./pages/settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all pages with the sidebar layout */}
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Dashboard />} />
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
