/**
 * src/pages/PatientsPage.jsx — Patient Management Page
 *
 * PURPOSE:
 *   Displays all patients and allows adding new ones.
 *   All requests are sent to the API Gateway (/api/patients),
 *   which validates the JWT first, then forwards to Patient Service (port 3002).
 *
 * REQUEST FLOW:
 *   React → axios (with JWT header) → Gateway /api/patients
 *   → [JWT check] → Patient Service (port 3002) → patient-db
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * fetchPatients — called on component mount
   * GET /api/patients → returns array of patient objects from patient-db
   */
  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setMessage('❌ Failed to load patients. Is the Patient Service running?');
    }
  };

  // useEffect with [] dependency = runs once when the component mounts (page loads)
  useEffect(() => {
    fetchPatients();
  }, []);

  /**
   * handleAddPatient — submit handler for the add patient form
   * POST /api/patients → { name, age, condition }
   */
  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosInstance.post('/patients', {
        name,
        age: Number(age), // Mongoose schema expects a number
        condition,
      });
      setMessage('✅ Patient added!');
      setName('');
      setAge('');
      setCondition('');
      fetchPatients(); // refresh the list
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add patient.';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>🏥 Patients</h2>

      {/* Add Patient Form */}
      <div className="card">
        <h3>Add New Patient</h3>
        <form onSubmit={handleAddPatient} className="form form-inline">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
          <input
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Condition"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Patient List */}
      <div className="list">
        {patients.length === 0 ? (
          <p className="empty">No patients found. Add one above!</p>
        ) : (
          patients.map((p) => (
            <div key={p._id} className="list-item">
              <span className="list-item-name">👤 {p.name}</span>
              <span className="list-item-meta">Age: {p.age}</span>
              <span className="list-item-meta badge">{p.condition}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
