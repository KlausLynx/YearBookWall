import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminGate from "../components/adminGate";
import AdminPanel from "../components/AdminPanel";

// AdminGate and AdminPanel already render as full-screen overlays with their
// own "Back to wall" buttons wired to navigate("/") below, so this page is
// intentionally just a thin wrapper around them.
export default function AdminPage() {
    const [unlocked, setUnlocked] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="yb-root">
        {!unlocked ? (
            <AdminGate onUnlocked={() => setUnlocked(true)} onCancel={() => navigate("/")} />
        ) : (
            <AdminPanel onBack={() => navigate("/")} />
        )}
        </div>
    );
}
