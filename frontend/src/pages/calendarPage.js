import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendarPage.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());

  // Example events
  const events = {
    "2026-02-14": ["Valentine's Day Event"],
    "2026-02-20": ["Project Meeting"],
  };

  const formatDate = (d) => d.toISOString().split("T")[0];
  const selectedEvents = events[formatDate(date)] || [];

  return (
    <div className="calendar-page">
      <h1>Calendar</h1>
      <Calendar onChange={setDate} value={date} />
      <div className="events">
        <h2>Events for {date.toDateString()}</h2>
        {selectedEvents.length > 0 ? (
          <ul>
            {selectedEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
