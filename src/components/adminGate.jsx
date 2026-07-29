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
        <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin access"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-200">
                    <Lock size={18} />
                </div>
                <h2 className="mt-3 text-base font-semibold text-neutral-100">
                    Admin access
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                    Enter the passcode to continue.
                </p>
                </div>

                <input
                className="mt-5 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-500/40"
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

                {error && (
                <div className="mt-2 text-sm text-red-400">{error}</div>
                )}

                <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                >
                    Back to wall
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white"
                >
                    Unlock
                </button>
                </div>
            </div>
        </div>
    );
}