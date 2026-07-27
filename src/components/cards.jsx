import { FaWhatsapp } from 'react-icons/fa';
import { formatDpt } from "../utils/formatdepartment"

// Converts a local Nigerian number (e.g. 07067179435) into
// the international format wa.me needs (e.g. 2347067179435)
const toWhatsAppNumber = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");// strip spaces, dashes, +, etc.
    if (digits.startsWith("0")) return `234${digits.slice(1)}`;
    if (digits.startsWith("234")) return digits;
    return digits;
};

export default function Cards({src, intitials, facultyStudents}) {
    src = facultyStudents.final_photo_url
    const phone = facultyStudents.phone; // adjust key name if different
    const whatsappNumber = toWhatsAppNumber(phone);

    return(
        <CardBody>
            <CardHead>
                <div className="flex items-center gap-2 sm:gap-3">
                    {src ? (
                        <img className="rounded-full size-24 sm:size-26 md:size-28 lg:size-30 shrink-0 object-cover" src={src} alt="" />
                    ):  <div className="rounded-full size-24 sm:size-26 md:size-28 lg:size-30 shrink-0 bg-gray-300 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {intitials}
                        </div>}
                    <div className="min-w-0">
                        <p className="text-facSide font-bold text-sm sm:text-base md:text-lg wrap-break-word">{facultyStudents.name}</p>
                        <p className="text-accent text-xs sm:text-sm wrap-break-word">{facultyStudents.reg_no}</p>
                    </div>
                </div>
            </CardHead>
            <CardDivider>
                <div className="border border-dashed border-brand mx-2 opacity-20"></div>
            </CardDivider>
            <CardBottom>
                <div className="min-w-0">
                    <span className="py-1 px-2 rounded-2xl text-accent bg-brand inline-block origin-left -rotate-6 text-xs sm:text-sm">
                        {formatDpt(facultyStudents.course)}
                    </span>
                    <div className="text-accent text-xs sm:text-sm space-y-1 mt-2">
                        <p className="break-words">Phone No: <span>{phone ?? 'N/A'}</span></p>
                        <p className="break-words">Email: <span>{facultyStudents.email ?? 'N/A'}  </span></p>
                        <p className="break-words">Career Path: <span>{facultyStudents.career_path ?? 'N/A'}</span></p>
                        <p className="break-words">Best in: <span>{facultyStudents.best_at ?? 'N/A'}</span></p>
                    </div>
                </div>
                {whatsappNumber && (
                    <a href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Message ${facultyStudents.name} on WhatsApp`}
                        className="self-end shrink-0"
                    >
                        <FaWhatsapp size={24} className="text-emerald-500 hover:scale-110 transition" />
                    </a>
                )}
            </CardBottom>
        </CardBody>
    )
}

const CardBody = ({children}) => {
    return (
        <div className="p-3 sm:p-4 md:p-5 relative bg-white border border-brand rounded-2xl before:content-[''] before:absolute before:bg-accent-white before:w-14 sm:before:w-16 md:before:w-20 before:h-5 before:left-1/2 before:-translate-x-1/2 before:rounded-bl-md before:rounded-br-md before:-top-1">
        {children}
    </div>
    )
}

const CardHead = ({children}) => {
    return(
        <div className="mb-4 sm:mb-5 md:mb-6">
            {children}
        </div>
    )
}
const CardDivider = ({children}) => {
    return(
        <div className="mb-4 sm:mb-5 md:mb-6">
            {children}
        </div>
    )
}
const CardBottom = ({children}) => {
    return(
        <div className="flex items-end justify-between gap-2">
            {children}
        </div>
    )
}