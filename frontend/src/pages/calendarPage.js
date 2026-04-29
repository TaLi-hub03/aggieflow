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
  const { eventsByDate, ensureDateLoaded, addEvent, updateEvent, deleteEvent } = useCalendarEvents();

  // ensure events for current date are loaded
  useEffect(() => {
    ensureDateLoaded(date);
  }, [date, ensureDateLoaded]);

  // Modal / form state for adding
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => formatDate(new Date()));
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // Modal / form state for editing
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  function openEditModal(event) {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDate(event.date);
    setEditTime(event.time);
    setEditDescription(event.description);
    setShowEditModal(true);
  }

  function closeEditModal() {
    setShowEditModal(false);
    setEditingEvent(null);
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

  async function handleUpdateEvent(e) {
    e.preventDefault();
    if (!editTitle.trim() || !editDate) return;
    const payload = {
      date: editDate,
      title: editTitle.trim(),
      time: editTime || "",
      description: editDescription || "",
    };
    try {
      await updateEvent(editingEvent.id, payload);
    } catch (err) {
      console.error("Update failed:", err);
    }
    setShowEditModal(false);
  }

  async function handleDeleteEvent(eventId) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  }

  return (
    <div className="calendar-page">
      <h1>Calendar</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date: d, view }) => {
          if (view !== "month") return null;
          return eventsByDate[formatDate(d)]?.length ? "has-event" : null;
        }}
        tileContent={({ date: d, view }) => {
          if (view !== "month") return null;
          return eventsByDate[formatDate(d)]?.length ? <div className="event-dot" /> : null;
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
                  <div className="event-content">
                    <strong className="event-title">{ev.title}</strong>
                    {ev.time ? <span className="event-time">{format12HourTime(ev.time)}</span> : null}
                  </div>
                  <div className="event-actions">
                    <button className="event-btn edit" onClick={() => openEditModal(ev)} title="Edit">✏️</button>
                    <button className="event-btn delete" onClick={() => handleDeleteEvent(ev.id)} title="Delete">🗑️</button>
                  </div>
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

      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Event</h3>
            <form onSubmit={handleUpdateEvent} className="event-form">
              <label>
                Title
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
              </label>

              <label>
                Date
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
              </label>

              <label>
                Time (optional)
                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
              </label>

              <label>
                Description (optional)
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Update Event
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
