import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendarPage.css";
import format12HourTime from "../utils/time";
import formatDate from "../utils/date";
import useCalendarEvents from "../hooks/useCalendarEvents";

function CalendarPage() {
  const [date, setDate] = useState(new Date());

  // hook encapsulates events-by-date, socket, and addEvent
  const { eventsByDate, ensureDateLoaded, addEvent } = useCalendarEvents();

  // ensure events for current date are loaded
  useEffect(() => {
    ensureDateLoaded(date);
  }, [date, ensureDateLoaded]);

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => formatDate(new Date()));
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const selectedEvents = eventsByDate[formatDate(date)] || [];

  function openModal() {
    setEventDate(formatDate(date));
    setTitle("");
    setTime("");
    setDescription("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    const payload = {
      date: eventDate,
      title: title.trim(),
      time: time || "",
      description: description || "",
    };
    try {
      await addEvent(payload);
    } catch (err) {
      // addEvent already logs; you could show user-facing error here
    }
    setShowModal(false);
  }

  return (
    <div className="calendar-page">
      <h1>Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date: d, view }) => {
          if (view !== "month") return null;
          return eventsByDate[formatDate(d)] && eventsByDate[formatDate(d)].length ? "has-event" : null;
        }}
      />

      <div className="events">
        <div className="events-header">
          <h2>Events for {date.toDateString()}</h2>
          <button className="add-event-btn" onClick={openModal} aria-label="Add event">+</button>
        </div>

        {selectedEvents.length > 0 ? (
          <ul className="events-list">
            {selectedEvents.map((ev) => (
              <li key={ev.id} className="event-item">
                <div className="event-main">
                  <strong className="event-title">{ev.title}</strong>
                  {ev.time ? <span className="event-time">{format12HourTime(ev.time)}</span> : null}
                </div>
                {ev.description ? <div className="event-desc">{ev.description}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Event</h3>
            <form onSubmit={handleAddEvent} className="event-form">
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>

              <label>
                Date
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
              </label>

              <label>
                Time (optional)
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </label>

              <label>
                Description (optional)
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
