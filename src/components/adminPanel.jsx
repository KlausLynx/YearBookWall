import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { listRoster, addRosterEntry, deleteRosterEntry } from "../lib/api";

export default function AdminPanel({ onBack }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regNo, setRegNo] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRoster(await listRoster());
    } catch {
      setError("Could not load the roster.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    setError("");
    if (!regNo.trim()) {
      setError("Reg number is required.");
      return;
    }
    setSaving(true);
    try {
      await addRosterEntry({ regNo: regNo.toLowerCase().trim(), faculty: faculty.toLowerCase().trim(), department: department.toLowerCase().trim(), course: course.toLowerCase().trim() });
      setRegNo("");
      setFaculty("");
      setDepartment("");
      setCourse("")
      await load();
    } catch {
      setError("Could not add that reg number (it may already exist).");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rn) => {
    try {
      await deleteRosterEntry(rn);
      await load();
    } catch {
      setError("Could not remove that entry.");
    }
  };

    return (
        <div className="yb-modal-scrim" role="dialog" aria-modal="true" aria-label="Admin panel">
        <div className="yb-modal yb-modal-wide">
            <div className="yb-modal-head">
            <h2 className="yb-modal-title">Admin — approved reg numbers</h2>
            <button type="button" className="yb-btn yb-btn-ghost" onClick={onBack}>
                Back to wall
            </button>
            </div>

            <div className="yb-admin-form">
            <input className="yb-input" placeholder="Reg number" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
            <input className="yb-input" placeholder="Faculty" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
            <input className="yb-input" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)}/>
            <input
                className="yb-input"
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
            />
            <button type="button" className="yb-btn yb-btn-primary" onClick={handleAdd} disabled={saving}>
                {saving ? <Loader2 size={16} className="yb-spin" /> : <Plus size={16} />} Add
            </button>
            </div>
            {error && <div className="yb-form-error">{error}</div>}

            {loading ? (
            <div className="yb-loading">
                <Loader2 size={20} className="yb-spin" /> Loading roster…
            </div>
            ) : roster.length === 0 ? (
            <div className="yb-empty" style={{ margin: "2rem 0" }}>
                No reg numbers added yet.
            </div>
            ) : (
            <table className="yb-admin-table">
                <thead>
                <tr>
                    <th>Reg No</th>
                    <th>Faculty</th>
                    <th>Department</th>
                    <th>Course</th>
                </tr>
                </thead>
                <tbody>
                {roster.map((r) => (
                    <tr key={r.reg_no}>
                    <td>{r.reg_no}</td>
                    <td>{r.faculty}</td>
                    <td>{r.department}</td>
                    <td>{r.course}</td>
                    <td>
                        <button
                        type="button"
                        className="yb-iconbtn"
                        onClick={() => handleDelete(r.reg_no)}
                        aria-label={`Remove ${r.reg_no}`}
                        >
                        <Trash2 size={14} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </div>
    );
}
