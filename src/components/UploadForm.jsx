import { useState } from "react";
import {X, Loader2} from 'lucide-react'
import { Button } from "../utils/button";
import { PhotoPicker } from "../utils/photoPicker";
import { FIELDS } from "../data/inputFields";
import { uploadPhoto, saveEntry } from "../lib/api";
import { resizeImageFile } from "../utils/image";

export default function UploadForm({ regNo, roster, onClose, onSaved, existingEntry }) {
    const editableFields = FIELDS.filter((f) => !f.fromRoster);
    const [values, setValues] = useState(() =>
        editableFields.reduce((acc, f) => ({ ...acc, [f.key]: existingEntry?.[f.key] || "" }), {})
    );
    const [firstFile, setFirstFile] = useState(null);
    const [finalFile, setFinalFile] = useState(null);
    const [firstPreview, setFirstPreview] = useState(existingEntry?.first_photo_url || "");
    const [finalPreview, setFinalPreview] = useState(existingEntry?.final_photo_url || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

    const handleFirstFile = (file) => {
        if (!file) return;
        setFirstFile(file);
        setFirstPreview(URL.createObjectURL(file));
    };

    const handleFinalFile = (file) => {
        if (!file) return;
        setFinalFile(file);
        setFinalPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        setError("");
        if (!values.name.trim()) {
            setError("Your name is required.");
            return;
        }
        if (!firstPreview || !finalPreview) {
            setError("Both photos are required — first year and final year.");
            return;
        }
            setSubmitting(true);
        try {
            let firstUrl = existingEntry?.first_photo_url || "";
            let finalUrl = existingEntry?.final_photo_url || "";

            if (firstFile) {
                const resized = await resizeImageFile(firstFile);
                firstUrl = await uploadPhoto(resized, regNo, "first");
            }
        if (finalFile) {
            const resized = await resizeImageFile(finalFile);
            finalUrl = await uploadPhoto(resized, regNo, "final");
        }
        const entry = {
            reg_no: regNo,
            faculty: roster.faculty,
            department: roster.department,
            first_photo_url: firstUrl,
            final_photo_url: finalUrl,
            ...values,
        };
        const saved = await saveEntry(entry);
        onSaved(saved || entry);
        } catch {
        setError("Couldn't save your entry. Please try again.");
        } finally {
        setSubmitting(false);
        }
    };
    return (
        <div>
            <div>
                <div>
                    {existingEntry ? "Edit your card" : "New entry"} · {regNo}
                </div>
                <h2 className="">
                    {roster.faculty || "—"} · {roster.department || "—"}
                </h2>
                <Button>
                    <X size={18} />
                </Button>
                <div>
                    <div>
                        <PhotoPicker label="First year photo" previewUrl={firstPreview} onFile={handleFirstFile} stamp="FRESHER"/>
                        <PhotoPicker label="Final year photo" previewUrl={finalPreview} onFile={handleFinalFile} stamp="FINAL YEAR"/>
                    </div>
                    <div className="">
                        {editableFields.map((f) => (
                        <label key={f.key} className="">
                            <span className="">
                                {f.label}
                                {f.required && <span className=""> *</span>}
                            </span>
                            <input
                            className=""
                            type="text"
                            placeholder={f.placeholder}
                            value={values[f.key]}
                            onChange={(e) => setField(f.key, e.target.value)}
                            maxLength={120}
                            />
                        </label>
                        ))}
                    </div>
                    {error && <div className="">{error}</div>}
                    <div className="">
                        <button type="button" className="" onClick={onClose} disabled={submitting}>
                        Cancel
                        </button>
                        <button type="button" className="" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? (
                            <>
                            <Loader2 size={16} className="animate-spin" /> Saving
                            </>
                        ) : existingEntry ? (
                            "Save changes"
                        ) : (
                            "Pin to the wall"
                        )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}