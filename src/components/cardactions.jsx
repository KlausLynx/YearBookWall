import { useState } from "react";
import * as Sentry from "@sentry/react";
import { Download, Share2, Loader2 } from "lucide-react";
import { downloadCardAsImage, shareCardImage } from "../utils/exportCard";

function describeError(err) {
    if (err instanceof Error) return `${err.name}: ${err.message}`;
    if (typeof err === "string") return err;
    try {
        const json = JSON.stringify(err);
        if (json && json !== "{}") return json;
    } catch {
        // fall through
    }
    return String(err);
}

export default function CardActions({ nodeRef, filename, caption }) {
    const [busy, setBusy] = useState("");
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setBusy("download");
        setError("");
        try {
        await downloadCardAsImage(nodeRef.current, filename);
        } catch (err) {
        Sentry.captureException(err);
        console.error("Download failed:", err);
        setError(`Couldn't save the image. (${describeError(err)})`);
        } finally {
        setBusy("");
        }
    };

    const handleShare = async () => {
        setBusy("share");
        setError("");
        try {
        await shareCardImage(nodeRef.current, filename, caption);
        } catch (err) {
        Sentry.captureException(err);
        console.error("Share failed:", err);
        setError(`Couldn't share the image. (${describeError(err)})`);
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
        {error && <div className="text-accent-error text-accent">{error}</div>}
        </div>
    );
}