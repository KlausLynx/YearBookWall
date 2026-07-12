import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminGate({ onUnlocked, onCancel }) {
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (passcode === import.meta.env.VITE_ADMIN_PASSCODE) {
        onUnlocked();
        } else {
        setError("Wrong passcode.");
        }
    };

    return (
        <div className="yb-modal-scrim" role="dialog" aria-modal="true" aria-label="Admin access">
        <div className="yb-modal yb-modal-narrow">
            <Lock size={20} />
            <h2 className="yb-modal-title" style={{ marginTop: "0.5rem" }}>
            Admin access
            </h2>
            <input
            className="yb-input"
            type="password"
            value={passcode}
            onChange={(e) => {
                setPasscode(e.target.value);
                setError("");
            }}
            placeholder="Passcode"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            />
            {error && <div className="yb-field-error">{error}</div>}
            <div className="yb-form-actions">
            <button type="button" className="yb-btn yb-btn-ghost" onClick={onCancel}>
                Back to wall
            </button>
            <button type="button" className="yb-btn yb-btn-primary" onClick={handleSubmit}>
                Unlock
            </button>
            </div>
        </div>
        </div>
    );
}
