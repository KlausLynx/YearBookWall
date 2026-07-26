import { useState } from "react";
import * as Sentry from "@sentry/react";
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [photoErrors, setPhotoErrors] = useState({ first: "", final: "" });

    const setField = (key, val) => {
        setValues((v) => ({ ...v, [key]: val }));
        // clear that field's error as soon as the person starts fixing it
        setFieldErrors((fe) => (fe[key] ? { ...fe, [key]: "" } : fe));
    };

    const handleFirstFile = (file) => {
        if (!file) return;
        setFirstFile(file);
        setFirstPreview(URL.createObjectURL(file));
        setPhotoErrors((pe) => ({ ...pe, first: "" }));
    };

    const handleFinalFile = (file) => {
        if (!file) return;
        setFinalFile(file);
        setFinalPreview(URL.createObjectURL(file));
        setPhotoErrors((pe) => ({ ...pe, final: "" }));
    };

    const validate = () => {
        const newFieldErrors = {};
        const cleanValues = {};

        editableFields.forEach((f) => {
            const raw = values[f.key] ?? "";
            const trimmed = raw.trim();
            cleanValues[f.key] = trimmed;
            if (!trimmed) {
                newFieldErrors[f.key] = `${f.label} is required.`;
            }
        });

        const newPhotoErrors = { first: "", final: "" };
        if (!firstPreview) newPhotoErrors.first = "First year photo is required.";
        if (!finalPreview) newPhotoErrors.final = "Final year photo is required.";

        const isValid =
            Object.keys(newFieldErrors).length === 0 &&
            !newPhotoErrors.first &&
            !newPhotoErrors.final;

        return { isValid, newFieldErrors, newPhotoErrors, cleanValues };
    };

    const handleSubmit = async () => {
        setError("");

        const { isValid, newFieldErrors, newPhotoErrors, cleanValues } = validate();
        setFieldErrors(newFieldErrors);
        setPhotoErrors(newPhotoErrors);

        if (!isValid) {
            setError("Please fill in all fields correctly before submitting.");
            return;
        }

        // keep the trimmed values in the form too, so what's shown matches what's sent
        setValues(cleanValues);

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
                course: roster.course, 
                department: roster.department,
                first_photo_url: firstUrl,
                final_photo_url: finalUrl,
                ...cleanValues,
            };
        const saved = await saveEntry(entry);
        onSaved(saved || entry);
        } catch (err) {
        Sentry.captureException(err);
        setError("Couldn't save your entry. Please try again.");
        } finally {
        setSubmitting(false);
        }
    };
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col px-3 sm:px-5 items-start mt-4">
                <div className="flex w-full justify-between items-start gap-2">
                    <h2 className="text-base sm:text-lg wrap-break-word">{existingEntry ? "Edit your card" : "New entry"} · {regNo}</h2>
                    
                    <div className="flex justify-end shrink-0" onClick={onClose}>
                        <Button>
                            <X size={18} />
                        </Button>
                    </div>
                </div>
                <h3 className="text-sm sm:text-base">
                    Faculty of {roster.faculty || "—"} · {roster.department || "—"}
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 my-6 w-full items-center md:items-start justify-center">
                    <div className="flex flex-row md:flex-col gap-4 justify-center flex-wrap">
                        <div className="flex flex-col gap-1">
                            <PhotoPicker label="First year photo" previewUrl={firstPreview} onFile={handleFirstFile} stamp="FRESHER"/>
                            {photoErrors.first && (
                                <span className="text-xs text-red-500">{photoErrors.first}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <PhotoPicker label="Final year photo" previewUrl={finalPreview} onFile={handleFinalFile} stamp="FINAL YEAR"/>
                            {photoErrors.final && (
                                <span className="text-xs text-red-500">{photoErrors.final}</span>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <div className="w-full md:max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 border-2 border-brand rounded-2xl">
                            {editableFields.map((f) => (
                            <label key={f.key} className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                    {f.label}
                                    <span className="text-red-500"> *</span>
                                </span>
                                <input
                                    className={`text-accent border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand autofill:text-accent ${
                                        fieldErrors[f.key] ? "border-red-500" : "border-gray-300"
                                    }`}
                                    type={f.type || "text"}
                                    autoComplete="off"
                                    placeholder={f.placeholder}
                                    value={values[f.key]}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    onBlur={() => {
                                        if (!values[f.key]?.trim()) {
                                            setFieldErrors((fe) => ({ ...fe, [f.key]: `${f.label} is required.` }));
                                        }
                                    }}
                                    maxLength={120}
                                    aria-invalid={!!fieldErrors[f.key]}
                                    />
                                {fieldErrors[f.key] && (
                                    <span className="text-xs text-red-500">{fieldErrors[f.key]}</span>
                                )}
                            </label>
                            ))}
                        </div>
                        {error && <div className="text-accent text-red-500">{error}</div>}
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 mt-4 sm:justify-between text-accent">
                            <button type="button" className='text-accent-white text-accent bg-red-600 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105' onClick={onClose} disabled={submitting}>
                            Cancel
                            </button>
                            <button type="button" className='text-accent-white text-accent bg-brand flex items-center justify-center gap-2 rounded-2xl p-2 cursor-pointer transition hover:scale-105' onClick={handleSubmit} disabled={submitting}>
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