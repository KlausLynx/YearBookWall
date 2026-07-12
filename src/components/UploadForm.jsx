import { useState } from "react";
import {X, Loader2} from 'lucide-react'
import { Button } from "../utils/button";
import { PhotoPicker } from "../utils/photoPicker";
import { getFields } from "../data/inputFields";
import { uploadPhoto, saveEntry } from "../lib/api";
import { resizeImageFile } from "../utils/image";

export default function UploadForm({ regNo, roster, onClose, onSaved, existingEntry }) {
    const FIELDS = getFields(roster?.course);
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
            <div className="flex flex-col px-5 items-start mt-4">
                <div className="flex w-full justify-between">
                    <h2>{existingEntry ? "Edit your card" : "New entry"} · {regNo}</h2>
                    
                    <div className="flex justify-end">
                        <Button>
                            <X size={18} />
                        </Button>
                    </div>
                </div>
                <h3 className="">
                    Faculty of {roster.faculty || "—"} · {roster.department || "—"}
                </h3>
                
                <div className="flex gap-4 my-6 self-center justify-center">
                    <div>
                        <PhotoPicker label="First year photo" previewUrl={firstPreview} onFile={handleFirstFile} stamp="FRESHER"/>
                        <PhotoPicker label="Final year photo" previewUrl={finalPreview} onFile={handleFinalFile} stamp="FINAL YEAR"/>
                    </div>
                    <div>
                        <div className="max-w-2xl grid grid-cols-2 gap-4 p-2 border-2 border-brand rounded-2xl">
                            {editableFields.map((f) => (
                            <label key={f.key} className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                    {f.label}
                                    {f.required && <span className="text-red-500"> *</span>}
                                </span>
                                <input
                                className="text-accent border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
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
                        <div className="flex items-center mt-4 justify-between text-accent">
                            <button type="button" className='text-accent-white text-accent bg-red-600 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105' onClick={onClose} disabled={submitting}>
                            Cancel
                            </button>
                            <button type="button" className='text-accent-white text-accent bg-brand flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105' onClick={handleSubmit} disabled={submitting}>
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
        </div>
    )
}