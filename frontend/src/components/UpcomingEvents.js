import React from "react";
import "../styles/components.css";
import format12HourTime from "../utils/time";

function UpcomingEvents({ events = [] }) {
  const hasEvents = Array.isArray(events) && events.length > 0;

  return (
    <div className="section">
      <h2 className="section-title">Upcoming Events</h2>
      {hasEvents ? (
        <ul className="event-list">
          {events.map((ev) => (
            <li key={ev.id} className="event-item">
              <div className="event-header">
                <strong className="event-title">{ev.title}</strong>
                <time className="event-date" dateTime={ev.date}>{ev.date}</time>
              </div>
              {ev.time && (
                <p className="event-time">@ {format12HourTime(ev.time)}</p>
              )}
              {ev.description && (
                <p className="event-description">{ev.description}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No upcoming events</p>
      )}
    </div>
  );
}

export default UpcomingEvents;
