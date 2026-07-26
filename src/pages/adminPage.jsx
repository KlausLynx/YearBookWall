import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminGate from "../components/adminGate";
import AdminPanel from "../components/adminPanel";

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
