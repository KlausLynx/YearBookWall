import { useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { downloadCardAsImage, shareCardImage } from "../utils/exportCard";

export default function CardActions({ nodeRef, filename, caption }) {
    const [busy, setBusy] = useState("");
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setBusy("download");
        setError("");
        try {
        await downloadCardAsImage(nodeRef.current, filename);
        } catch {
        setError("Couldn't save the image.");
        } finally {
        setBusy("");
        }
    };

    const handleShare = async () => {
        setBusy("share");
        setError("");
        try {
        await shareCardImage(nodeRef.current, filename, caption);
        } catch {
        setError("Couldn't share the image.");
        } finally {
        setBusy("");
        }
    };

    return (
        <div className="flex justify-between items-center">
        <button type="button" className="text-brand" onClick={handleDownload} disabled={!!busy}>
            {busy === "download" ? <Loader2 size={14} className="yb-spin" /> : <Download size={14} />} Save
        </button>
        <button type="button" className="text-brand" onClick={handleShare} disabled={!!busy}>
            {busy === "share" ? <Loader2 size={14} className="yb-spin" /> : <Share2 size={14} />} Share
        </button>
        {error && <div className="yb-field-error">{error}</div>}
        </div>
    );
}
