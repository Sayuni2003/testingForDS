/**
 * src/pages/AppointmentsPage.jsx — Appointment Management Page
 *
 * PURPOSE:
 *   Displays all appointments and allows scheduling new ones.
 *   Requests go to API Gateway (/api/appointments) → Appointment Service (port 3003)
 *
 * NOTE:
 *   patientId is stored as a plain string. In this simple system,
 *   copy a patient's MongoDB _id from the Patients page and paste it here.
 *   (In production, you'd have a patient selector dropdown.)
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * fetchAppointments — called on mount
   * GET /api/appointments → returns array of appointment objects from appointment-db
   */
  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setMessage('❌ Failed to load appointments. Is the Appointment Service running?');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /**
   * handleAddAppointment — submit handler
   * POST /api/appointments → { patientId, date }
   */
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosInstance.post('/appointments', { patientId, date });
      setMessage('✅ Appointment scheduled!');
      setPatientId('');
      setDate('');
      fetchAppointments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to schedule appointment.';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>📅 Appointments</h2>

      {/* Schedule Appointment Form */}
      <div className="card">
        <h3>Schedule New Appointment</h3>
        <p className="info-text">
          💡 Copy a patient ID from the Patients page and paste it below.
        </p>
        <form onSubmit={handleAddAppointment} className="form form-inline">
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Patient ID (MongoDB _id)"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Appointment List */}
      <div className="list">
        {appointments.length === 0 ? (
          <p className="empty">No appointments found. Schedule one above!</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id} className="list-item">
              <span className="list-item-name">🗓️ {a.date}</span>
              <span className="list-item-meta">Patient ID: {a.patientId}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
