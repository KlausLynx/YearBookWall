import { Upload } from "lucide-react"
import { useRef } from "react"

export const PhotoPicker = ({label, previewUrl, stamp, onFile}) => {
    const inputRef = useRef(null);
    return(
        <div>
            <div className="text-accent">{label}</div>
            <button
                type="button"
                onClick={() => inputRef.current && inputRef.current.click()}
                style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}
                className={`flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105 overflow-hidden bg-cover bg-center bg-no-repeat ${
                    previewUrl ? "" : "bg-brand text-accent-white"
                } w-32 h-32`}
            >
                {!previewUrl && (
                    <span className="yb-photopick-empty">
                        <Upload size={18} strokeWidth={1.6} />
                        Choose photo
                    </span>
                )}
            </button>
            <span className="text-accent">{stamp}</span>
            <input type="file" ref={inputRef} accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files && e.target.files[0])}/>
        </div>
    )
}