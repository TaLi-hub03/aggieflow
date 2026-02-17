import React, { useState, useEffect } from "react";
import { io as ioClient } from "socket.io-client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendarPage.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  // events keyed by date for highlighting and list
  const [eventsByDate, setEventsByDate] = useState({});

  // load events for selected date and cache
  useEffect(() => {
    const load = async () => {
      const key = formatDate(date);
      try {
        const response = await fetch(`/api/events?date=${key}`);
        if (response.ok) {
          const data = await response.json();
          setEventsByDate((prev) => ({ ...prev, [key]: data }));
        } else {
          console.error("failed to fetch events", response.status);
          setEventsByDate((prev) => ({ ...prev, [key]: [] }));
        }
      } catch (err) {
        console.error(err);
        setEventsByDate((prev) => ({ ...prev, [key]: [] }));
      }
    };
    load();
  }, [date]);

  // Socket.IO: listen for events added by other clients
  useEffect(() => {
    const socket = ioClient();
    socket.on("eventAdded", (ev) => {
      setEventsByDate((prev) => {
        const list = prev[ev.date] ? [...prev[ev.date], ev] : [ev];
        return { ...prev, [ev.date]: list };
      });
    });
    return () => socket.disconnect();
  }, []);

  // Modal / form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => formatDate(new Date()));
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");


  function formatDate(d) {
    if (!d) return "";
    const dd = new Date(d);
    return dd.toISOString().split("T")[0];
  }

  function format12HourTime(military) {
    if (!military) return "";
    const [h, min] = military.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min} ${suffix}`;
  }

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
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const added = await response.json();
        const key = formatDate(eventDate);
        setEventsByDate((prev) => {
          const list = prev[key] ? [...prev[key], added] : [added];
          return { ...prev, [key]: list };
        });
      } else {
        console.error("failed to add event", response.status);
      }
    } catch (err) {
      console.error(err);
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
                  <strong>{ev.title}</strong>
                  {ev.time ? <span className="event-time"> — {format12HourTime(ev.time)}</span> : null}
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
