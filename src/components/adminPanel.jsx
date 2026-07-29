import { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";
import { listRoster, addRosterEntry, editRosterEntry, deleteRosterEntry } from "../lib/api";

export default function AdminPanel({ onBack }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regNo, setRegNo] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingRegNo, setEditingRegNo] = useState(null)

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRoster(await listRoster());
    } catch (err) {
      Sentry.captureException(err);
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
    } catch (err) {
      Sentry.captureException(err);
      setError("Could not add that reg number (it may already exist).");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rn) => {
    try {
      await deleteRosterEntry(rn);
      await load();
    } catch (err) {
      Sentry.captureException(err);
      setError("Could not remove that entry.");
    }
  };

  const handleUpdate = (r) => {
    setError('');
    setEditingRegNo(r.reg_no)
    setRegNo(r.reg_no);
    setFaculty(r.faculty);
    setDepartment(r.department);
    setCourse(r.course);
    console.log(r)
  }

    const handleEdit = async () => {
    setError("");
    if (!regNo.trim()) {
      setError("Reg number is required.");
      return;
    }
    setSaving(true);
    try {
      await editRosterEntry({ originalRegNo: editingRegNo, reg_no: regNo.toLowerCase().trim(), faculty: faculty.toLowerCase().trim(), department: department.toLowerCase().trim(), course: course.toLowerCase().trim() });
      setRegNo("");
      setFaculty("");
      setDepartment("");
      setCourse("")
      setEditingRegNo(null);
      await load();
    } catch (err) {
      Sentry.captureException(err);
      setError("Could not edit that reg number (it may already exist).");
    } finally {
      setSaving(false);
    }
  };

    return (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Admin panel"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
        >
        <div className="flex h-full w-full max-w-3xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
            <h2 className="text-base font-semibold text-neutral-100">Admin — approved reg numbers</h2>
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
            >
                Back to wall
            </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/40"
              placeholder="Reg number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
            />
            <input
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/40"
              placeholder="Faculty"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            />
            <input
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/40"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <input
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/40"
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
            />
            </div>

            <div className="mt-3 flex justify-end">
            {editingRegNo ? (
              <button
                type="button"
                onClick={handleEdit}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-60"
              >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Edit Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add
              </button>
            )}
            </div>

            {error && <div className="mt-3 text-sm text-red-400">{error}</div>}

            {loading ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-400">
                <Loader2 size={20} className="animate-spin" /> Loading roster…
            </div>
            ) : roster.length === 0 ? (
            <div className="mt-8 text-center text-sm text-neutral-500">
                No reg numbers added yet.
            </div>
            ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-800/60 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                    <th className="px-4 py-2.5 font-medium">Reg No</th>
                    <th className="px-4 py-2.5 font-medium">Faculty</th>
                    <th className="px-4 py-2.5 font-medium">Department</th>
                    <th className="px-4 py-2.5 font-medium">Course</th>
                    <th className="px-4 py-2.5"></th>
                    <th className="px-4 py-2.5"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                {roster.map((r) => (
                    <tr key={r.reg_no} className="text-neutral-200">
                    <td className="px-4 py-2.5">{r.reg_no}</td>
                    <td className="px-4 py-2.5">{r.faculty}</td>
                    <td className="px-4 py-2.5">{r.department}</td>
                    <td className="px-4 py-2.5">{r.course}</td>
                    <td className="px-4 py-2.5 text-right">
                        <button
                        type="button"
                        onClick={() => handleDelete(r.reg_no)}
                        aria-label={`Remove ${r.reg_no}`}
                        className="rounded-md p-1.5 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                        <Trash2 size={14} />
                        </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleUpdate(r)}
                        aria-label={`Edit ${r.reg_no}`}
                        className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-700 hover:text-neutral-100"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            )}
            </div>
        </div>
        </div>
    );
}