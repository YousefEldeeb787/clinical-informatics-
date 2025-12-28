import "./dashboard.css";

export default function DashBoard() {
  return (
    <div className="clinic-dashboard">      

      {/* ===== Main Dashboard ===== */}
      <main className="main-content">
        <header>
          <h1>Clinic Dashboard</h1>
          <p>Overview of today’s clinical operations</p>
        </header>

        {/* ===== Stats Cards ===== */}
        <div className="stats-grid">
          <StatCard title="Today's Appointments" value="42" icon="📅" />
          <StatCard title="Today's Surgeries" value="8" icon="✂️" />
          <StatCard title="Total Patients" value="440" icon="🧍" />
          <StatCard title="Total Doctors" value="1" icon="👨‍⚕️" />
        </div>

        {/* ===== Content Section ===== */}
        <div className="grid-layout">
          {/* Left side */}
          <div className="left-panel">
            <h3>Today's Appointments</h3>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Smith</td>
                  <td>Dr. Mahmoud Badran</td>
                  <td>09:30 AM</td>
                  <td>Annual Check-up</td>
                  <td><span className="status confirmed">Confirmed</span></td>
                </tr>
                <tr>
                  <td>Maria Garcia</td>
                  <td>Dr. Mahmoud Badran</td>
                  <td>10:00 AM</td>
                  <td>Follow-up</td>
                  <td><span className="status completed">Completed</span></td>
                </tr>
                <tr>
                  <td>David Lee</td>
                  <td>Dr. Mahmoud Badran</td>
                  <td>11:15 AM</td>
                  <td>Consultation</td>
                  <td><span className="status cancelled">Cancelled</span></td>
                </tr>
                <tr>
                  <td>Sarah Chen</td>
                  <td>Dr. Mahmoud Badran</td>
                  <td>12:00 PM</td>
                  <td>Vaccination</td>
                  <td><span className="status confirmed">Confirmed</span></td>
                </tr>
              </tbody>
            </table>

            <h3>Patient Appointments (Last 7 Days)</h3>
            <div className="chart">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={d} className="bar">
                  <div
                    className="bar-fill"
                    style={{ height: `${[45, 70, 60, 90, 80, 40, 35][i]}px` }}
                  ></div>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="right-panel">
            <div className="card">
              <h3>Scheduled Surgeries</h3>
              <ul>
                <li>
                  <b>Coronary Bypass</b>
                  <p>Patient: Michael Malak — 10:30 AM</p>
                  <small className="room">Room 3</small>
                </li>
                <li>
                  <b>Appendectomy</b>
                  <p>Patient: Ahmed Hassan — 11:00 AM</p>
                  <small className="room">Room 1</small>
                </li>
                <li>
                  <b>Knee Replacement</b>
                  <p>Patient: George Daniel — 1:45 PM</p>
                  <small className="inprogress">In Progress</small>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Recent Patients</h3>
              <ul className="recent-list">
                <li>
                  <b>Nour Ali</b>
                  <p>(+20) 123-4567</p>
                  <small>Today</small>
                </li>
                <li>
                  <b>Youssef Ehab</b>
                  <p>(+20) 234-5678</p>
                  <small>Yesterday</small>
                </li>
                <li>
                  <b>Noah Ramy</b>
                  <p>(+20) 345-6789</p>
                  <small>2 days ago</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}
