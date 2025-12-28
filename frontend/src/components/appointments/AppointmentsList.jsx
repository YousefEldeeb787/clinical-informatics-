import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAppointments,
  selectStats,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../features/appointments/appointmentsSlice";
import appointmentsService from "../../services/appointmentsService";
import "./appointmentsList.css";

const STATUSES = ["Scheduled", "Completed", "Cancelled"];
const VISIT_TYPES = ["Diagnosis", "Surgery", "Follow-Up"];

export default function AppointmentsList() {
  const rows = useSelector(selectAppointments);
  const stats = useSelector(selectStats);
  const dispatch = useDispatch();

  // ===== State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Filters
  const [search, setSearch] = useState("");
  const [fDate, setFDate] = useState("");
  const [fStatus, setFStatus] = useState("");

  // ===== Sorting
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // ===== Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // ===== Hybrid Card Modal (view/edit), and Add Modal
  const [activeRow, setActiveRow] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  // ===== Fetch appointments from API on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentsService.getAllAppointments();
      
      // Transform backend data to match frontend format
      const appointments = (response.items || response || []).map(apt => ({
        id: apt.id,
        apptId: apt.appointmentNumber || `#${apt.id}`,
        date: new Date(apt.startTime).toISOString().split('T')[0],
        time: new Date(apt.startTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        patient: apt.patientName || `${apt.patient?.user?.firstName} ${apt.patient?.user?.lastName}` || 'Unknown',
        doctor: apt.clinicianName || `${apt.clinician?.user?.firstName} ${apt.clinician?.user?.lastName}` || 'Unknown',
        reason: apt.reason || apt.appointmentType || 'General',
        type: apt.appointmentType || apt.reason || 'General',
        status: apt.status || 'Scheduled',
      }));
      
      dispatch(setAppointments(appointments));
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // ===== filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) =>
        q
          ? r.patient.toLowerCase().includes(q) ||
          r.apptId.toLowerCase().includes(q)
          : true
      )
      .filter((r) => (fDate ? r.date === fDate : true))
      .filter((r) => (fStatus ? r.status === fStatus : true));
  }, [rows, search, fDate, fStatus]);

  // ===== sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      if (sortKey === "date") {
        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir ||
          a.time.localeCompare(b.time) * dir
        );
      }
      return a[sortKey].toString().localeCompare(b[sortKey].toString()) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // ===== pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const current = sorted.slice(start, start + pageSize);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="appts-page">
        <div className="appts-container">
          <h1 className="page-title">Appointments</h1>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="appts-page">
        <div className="appts-container">
          <h1 className="page-title">Appointments</h1>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'red' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchAppointments}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appts-page">
      <div className="appts-container">
        <h1 className="page-title">Appointments</h1>

        {/* Filters */}
        <div className="filters">
          <div className="input">
            <span>🔎</span>
            <input
              placeholder="Search by Patient or ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="input">
            <span>📅</span>
            <input
              type="date"
              value={fDate}
              onChange={(e) => { setFDate(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="select"
            value={fStatus}
            onChange={(e) => { setFStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="row-end gap">
            <button
              onClick={() => { setSearch(''); setFDate(''); setFStatus(''); setPage(1); }}
              style={{
                background: "transparent",
                border: "1px solid #e43737ff",
                color: "#820d0dff",
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                margin:"10px"
              }}
            >
              Reset
            </button>

            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              + Add New Appointment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <Stat title="Total Appointments" value={stats.total} />
          <Stat title="Scheduled" value={stats.scheduled} color="blue" />
          <Stat title="Completed" value={stats.completed} color="green" />
          <Stat title="Cancelled" value={stats.cancelled} color="red" />
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="appts-table">
            <thead>
              <tr>
                <th>APPT ID</th>
                <ThSort label="DATE & TIME" active={sortKey === "date"} dir={sortDir} onClick={() => toggleSort("date")} />
                <ThSort label="PATIENT" active={sortKey === "patient"} dir={sortDir} onClick={() => toggleSort("patient")} />
                <th>TYPE OF VISIT</th>
                <ThSort label="STATUS" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {current.map((r) => (
                <tr key={r.id} onDoubleClick={() => setActiveRow(r)}>
                  <td className="muted">{r.apptId}</td>
                  <td>
                    <div className="dt">
                      {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}
                      <div className="muted">{r.time}</div>
                    </div>
                  </td>
                  <td>{r.patient}</td>
                  <td>{r.type || r.reason}</td>
                  <td><Badge status={r.status} /></td>
                  <td className="actions">
                    <button title="View / Edit" onClick={() => setActiveRow({ ...r, _edit: true })}>✎</button>
                    <button title="View Card" onClick={() => setActiveRow(r)}>👁️</button>
                  </td>
                </tr>
              ))}
              {current.length === 0 && (
                <tr><td colSpan={6} className="empty">No appointments found. Click "Add New Appointment" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pager">
          <div className="muted">Page {pageSafe} of {totalPages}</div>
          <div className="row-end gap">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
            <button className="btn" disabled={pageSafe <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <button className="btn" disabled={pageSafe >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>

      {/* ===== Hybrid Card Modal (view/edit) ===== */}
      {activeRow && (
        <div className="modal-backdrop" onClick={() => setActiveRow(null)}>
          <div className="modal card-modal" onClick={(e) => e.stopPropagation()}>
            {!activeRow._edit ? (
              <AppointmentCard row={activeRow} onClose={() => setActiveRow(null)} />
            ) : (
              <EditForm
                row={activeRow}
                onCancel={() => setActiveRow(null)}
                onSave={(changes) => {
                  dispatch(updateAppointment({ id: activeRow.id, changes }));
                  setActiveRow(null);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ===== Add Modal ===== */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Appointment</h3>
            <AddForm
              onCancel={() => setShowAdd(false)}
              onCreate={(data) => {
                dispatch(addAppointment(data));
                setShowAdd(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ===== Confirm Delete ===== */}
      {confirmId && (
        <div className="modal-backdrop" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this appointment?</h3>
            <p className="muted">This action cannot be undone.</p>
            <div className="row-end gap">
              <button className="btn" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => {
                dispatch(deleteAppointment(confirmId));
                setConfirmId(null);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ---------- UI components (unchanged) ---------- */

function ThSort({ label, active, dir, onClick }) {
  return (
    <th className={active ? "th-sort active" : "th-sort"} onClick={onClick}>
      {label} <span className="chev">{active ? (dir === "asc" ? "▴" : "▾") : "↕"}</span>
    </th>
  );
}

function Badge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}

function Stat({ title, value, color }) {
  return (
    <div className={`stat ${color || ""}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function AppointmentCard({ row, onClose }) {
  return (
    <div className="appt-card">
      <div className="head">
        <div className="id">{row.apptId}</div>
        <Badge status={row.status} />
      </div>
      <div className="grid-2 gap mt">
        <Field label="Date">{row.date}</Field>
        <Field label="Time">{row.time}</Field>
        <Field label="Patient">{row.patient}</Field>
        <Field label="Type of Visit" full>{row.type || row.reason}</Field>
      </div>
      <div className="row-end gap mt">
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={`kv ${full ? "full" : ""}`}>
      <span className="k">{label}</span>
      <span className="v">{children}</span>
    </div>
  );
}

function EditForm({ row, onCancel, onSave }) {
  const [form, setForm] = useState({
    date: row.date,
    time: row.time,
    type: row.type || row.reason || "Diagnosis",
    status: row.status,
  });
  return (
    <>
      <h3>Edit Appointment</h3>
      <div className="grid-2 gap">
        <label className="field">
          <span>Date</span>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
        <label className="field">
          <span>Time</span>
          <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </label>
        <label className="field full">
          <span>Type of Visit</span>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="row-end gap mt">
        <button
  onClick={onCancel}
  style={{
    background: "transparent",
    border: "1px solid #ccc",
    color: "#992525ff",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    margin:"10px"
  }}
>
  Cancel
</button>

        
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save</button>
      </div>
    </>
  );
}

function AddForm({ onCancel, onCreate }) {
  const [form, setForm] = useState({
    date: "", time: "", patient: "", type: "Diagnosis", status: "Scheduled",
  });
  const valid = form.date && form.time && form.patient && form.type;

  return (
    <>
      <div className="grid-2 gap">
        <label className="field">
          <span>Date</span>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
        <label className="field">
          <span>Time</span>
          <input type="text" placeholder="e.g., 10:30 AM" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </label>
        <label className="field">
          <span>Patient</span>
          <input type="text" placeholder="Patient Name or ID" value={form.patient}
            onChange={(e) => setForm({ ...form, patient: e.target.value })} />
        </label>
        <label className="field full">
          <span>Type of Visit</span>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="row-end gap mt">
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={!valid} onClick={() => onCreate(form)}>Create</button>
      </div>
    </>
  );
}
