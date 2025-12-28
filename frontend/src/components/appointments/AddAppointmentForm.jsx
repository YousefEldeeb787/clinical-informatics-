import { useMemo, useState } from "react";
import "./AddAppointmentForm.css";

/** ====== Demo Data (dynamic schedules) ======
 * timeSlots: كل نص ساعة من 9:00–11:30 ثم 2:00–3:30
 * لكل دكتور جدول بمواعيد "المحجوزة" blockedTimes في أيام مختلفة
 */
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM",
];

const DOCTORS = [
  {
    id: "reed",
    name: "Dr. Mahmoud Badran",
    specialty: "Cardiology",
    blockedTimes: {
      "2025-10-28": ["10:00 AM", "11:30 AM", "02:30 PM"],
      "2025-10-29": ["09:30 AM", "03:00 PM"],
    },
  },
  {
    id: "hayes",
    name: "Dr. Mahmoud Badran",
    specialty: "Cardiology",
    blockedTimes: {
      "2025-10-28": ["09:00 AM", "10:30 AM"],
      "2025-10-30": ["02:00 PM", "02:30 PM", "03:30 PM"],
    },
  },
  {
    id: "sharma",
    name: "Dr. Mahmoud Badran",
    specialty: "Cardiology",
    blockedTimes: {
      "2025-10-28": ["11:00 AM"],
      "2025-10-29": ["10:00 AM", "10:30 AM", "11:00 AM"],
    },
  },
];

export default function AddAppointmentForm() {
  // ====== Form State ======
  const [patient, setPatient] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [date, setDate] = useState("2025-10-28"); // default demo date
  const [reason, setReason] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [showPopup, setShowPopup] = useState(false);

  const selectedDoctor = useMemo(
    () => DOCTORS.find((d) => d.id === doctorId),
    [doctorId]
  );

  // ====== Dynamic availability (per doctor + date) ======
  const unavailable = useMemo(() => {
    const day = selectedDoctor.blockedTimes[date] || [];
    return new Set(day);
  }, [selectedDoctor, date]);

  // ====== Derived summary ======
  const summary = {
    doctor: `${selectedDoctor.name} – ${selectedDoctor.specialty}`,
    dateStr: new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }),
    time: selectedTime || "—",
    type: reason || "—",
  };

  const disabledConfirm =
    !patient.trim() || !phone.trim() || !selectedTime || !date;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (disabledConfirm) return;
    setShowPopup(true);
  };

  return (
    <div className="add-appt-page">
      {/* ====== Top Nav (dummy) ====== */}
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          FuturaClinic
        </div>
        <nav>
          <a href="#" className="active">Home</a>
          <a href="#">Doctors</a>
          <a href="#">Appointments</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* ====== HERO ====== */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Book Your Appointment</h1>
          <p>Seamless scheduling with next-generation healthcare.</p>
          <button className="btn btn-primary">Book Now</button>
        </div>
        <div className="hero-glass" />
      </section>

      {/* ====== FORM + TIME SLOTS ====== */}
      <section className="form-area">
        <div className="form-grid">
          {/* LEFT: Form */}
          <form className="card form-card" onSubmit={handleConfirm}>
            <h3 className="section-title">Schedule Your Visit</h3>

            <div className="grid-2">
              <div className="field">
                <label>Patient Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Select Doctor</label>
                <div className="select-wrap">
                  <select
                    value={doctorId}
                    onChange={(e) => {
                      setDoctorId(e.target.value);
                      setSelectedTime("");
                    }}
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} – {d.specialty}
                      </option>
                    ))}
                  </select>
                  <span className="chev">▾</span>
                </div>
              </div>

              <div className="field">
                <label>Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedTime("");
                  }}
                />
              </div>

              <div className="field field-full">
                <label>Reason for Visit</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your reason for visiting..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            {/* Summary (always visible) */}
            <div className="summary card">
              <h4>Booking Summary</h4>
              <div className="summary-row">
                <span>Doctor:</span>
                <span className="muted">{summary.doctor}</span>
              </div>
              <div className="summary-row">
                <span>Date:</span>
                <span className="muted">{summary.dateStr}</span>
              </div>
              <div className="summary-row">
                <span>Time:</span>
                <span className="muted">{summary.time}</span>
              </div>
              <div className="summary-row">
                <span>Visit Type:</span>
                <span className="muted">{summary.type}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary wide"
                disabled={disabledConfirm}
              >
                Confirm Booking
              </button>
            </div>
          </form>

          {/* RIGHT: Time Slots */}
          <aside className="card times-card">
            <h3 className="section-title">Available Time Slots</h3>

            <div className="slots">
              {TIME_SLOTS.map((t) => {
                const isBlocked = unavailable.has(t);
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={[
                      "slot",
                      isSelected ? "active" : "",
                      isBlocked ? "disabled" : "",
                    ].join(" ")}
                    onClick={() => !isBlocked && setSelectedTime(t)}
                    disabled={isBlocked}
                  >
                    <span>{t}</span>
                    {isBlocked && <small>Unavailable</small>}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* ====== SPECIALISTS (static preview) ====== */}
      <section className="specialists">
        <h3 className="section-title center">Meet Our Specialists</h3>
        <div className="docs">
          {DOCTORS.map((d) => (
            <div key={d.id} className="doc-card">
              <div className={`avatar ${d.id}`} />
              <div className="doc-name">{d.name}</div>
              <div className="doc-spec">{d.specialty}</div>
              <div className="badge success">Available Today</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== POPUP (Success) ====== */}
      {showPopup && (
        <div className="modal-backdrop" onClick={() => setShowPopup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Booking Successful 🎉</h3>
            <p>
              Your appointment with <strong>{selectedDoctor.name}</strong> on{" "}
              <strong>{summary.dateStr}</strong> at{" "}
              <strong>{selectedTime}</strong> has been confirmed.
            </p>
            <button className="btn btn-primary" onClick={() => setShowPopup(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
