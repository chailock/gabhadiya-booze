import { useState } from 'react';
import './AgeGate.css'; // We'll create this CSS file next

export default function AgeGate({ onVerified }) {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const verifySAID = (id) => {
    if (id.length !== 13) return false;
    const year = parseInt(id.substring(0, 2));
    const birthYear = year > 30 ? 1900 + year : 2000 + year;
    const age = new Date().getFullYear() - birthYear;
    return age >= 18;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifySAID(id)) {
      localStorage.setItem('ageVerified', 'true');
      onVerified();
    } else {
      setError('You must be 18+ to enter Gabhadiya Booze!');
    }
  };

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-box">
        <h1 className="age-gate-title">GABHADIYA BOOZE</h1>
        <p className="age-gate-text">You must be 18+ to enter</p>
        
        <form onSubmit={handleSubmit} className="age-gate-form">
          <input
            type="text"
            placeholder="Enter 13-digit SA ID number"
            value={id}
            onChange={(e) => setId(e.target.value.replace(/\D/g, '').slice(0, 13))}
            className="age-gate-input"
            required
          />
          
          {error && <p className="age-gate-error">{error}</p>}
          
          <button type="submit" className="age-gate-button">
            ENTER STORE
          </button>
        </form>

        <p className="age-gate-footer">
          License pending • Trade responsibly • Drink Responsibly
        </p>
      </div>
    </div>
  );
}