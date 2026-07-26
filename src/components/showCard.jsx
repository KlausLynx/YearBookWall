import { University, BookOpen, GraduationCap, Tag, User, Cake, MapPin, Heart } from 'lucide-react'
import { getFields, UNIVERSITY_NAME, CLASS_YEAR } from '../data/inputFields'
import { useCallback, useEffect, useRef, useState } from 'react';
import { departmentBgColors } from '../data/departmentColors';
import CardActions from "./cardactions";
import logo from "../assets/logo.png"

/**
 * Photo + name/nickname/DOB/state/relationship block.
 * Used by both the visible front face and the hidden export snapshot —
 * only the photo size and whether crossOrigin is needed differ between them.
 */
const ProfileDetails = ({ entry, photoUrl, photoClassName, crossOrigin, leftLabelColor, leftTextValueColor }) => (
    <figure className="w-fit flex flex-col justify-center items-center">
        <img
            src={photoUrl || undefined}
            crossOrigin={crossOrigin}
            alt="The picture of the graduate"
            className={photoClassName}
        />
        <figcaption className='text-amber-100'>
            <p className="flex items-center gap-1 sm:gap-2 pb-2.5 sm:pb-3 text-[10px] sm:text-sm md:text-base">
                <User size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> 
                <span className={leftLabelColor}>NAME: 
                    <span className={`text-[10px] sm:text-sm md:text-base ${leftTextValueColor}`}>{entry?.name ?? 'N/A'} </span>
                </span>
            </p>
            <p className="flex items-center gap-1 sm:gap-2 pb-2.5 sm:pb-3 text-[10px] sm:text-sm md:text-base">
                <Tag size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> 
                <span className={leftLabelColor}>NICKNAME: 
                    <span className={`text-[10px] sm:text-sm md:text-base ${leftTextValueColor}`}>{entry?.nickname ?? 'No nickname provided'}</span>
                </span>
            </p>
            <p className="flex items-center gap-1 sm:gap-2 pb-2.5 sm:pb-3 text-[10px] sm:text-sm md:text-base">
                <Cake size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> 
                <span className={leftLabelColor}>DOB: 
                    <span className={`text-[10px] sm:text-sm md:text-base ${leftTextValueColor}`}>{entry?.birthday ?? 'No DOB provided'}</span>
                </span>
            </p>
            <p className="flex items-center gap-1 sm:gap-2 pb-2.5 sm:pb-3 text-[10px] sm:text-sm md:text-base">
                <MapPin size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> 
                <span className={leftLabelColor}>STATE OF ORIGIN: 
                    <span className={`text-[10px] sm:text-sm md:text-base ${leftTextValueColor}`}>{entry?.state ?? 'N/A'}</span>
                </span>
            </p>
            <p className="flex items-center gap-1 sm:gap-2 pb-2.5 sm:pb-3 text-[10px] sm:text-sm md:text-base">
                <Heart size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> 
                <span className={leftLabelColor}>RELATIONSHIP STATUS: 
                    <span className={`text-[10px] sm:text-sm md:text-base ${leftTextValueColor}`}>{entry?.relationship_status ?? 'No relatinship status update'} 
                    </span>
                </span>
            </p>
        </figcaption>
    </figure>
);

/**
 * "THE GRADUATING CLASS OF ..." heading + the list of detail fields + the
 * optional "Parting Words" advice quote. Also shared between the visible
 * card and the hidden export snapshot — only text sizing differs.
 */
const DetailFieldsList = ({ detailFields, entry, deptKey, leftLabelColor, partingWordsColor, sizeVariant }) => {
    const isCompact = sizeVariant === "compact";

    return (
        <>
            <div className={isCompact ? 'mt-4 sm:mt-6 md:mt-8 mb-3 sm:mb-4 md:mb-6' : 'mb-3 text-center'}>
                <p className={isCompact ? "text-[10px] sm:text-sm md:text-base" : "text-sm"}>
                    THE{" "}
                    <span className="relative">
                        <span className="relative inline-block">
                            G
                            <GraduationCap
                                size={isCompact ? 16 : 18}
                                className={isCompact
                                    ? "text-brand pb-1 sm:pb-2 md:pb-3 absolute -top-3 sm:-top-4 md:-top-6 left-1/2 -translate-x-1/2 sm:w-6 sm:h-6 md:w-10 md:h-10"
                                    : "text-brand absolute -top-4 left-1/2 -translate-x-1/2"}
                            />
                        </span>
                        RADUATING
                    </span>{" "}
                    CLASS OF {CLASS_YEAR}
                </p>
            </div>

            <div className={isCompact ? "text-accent space-y-2 sm:space-y-4 md:space-y-6" : "text-accent space-y-3 w-full"}>
                {detailFields
                    .filter((f) => f.key !== "advice")
                    .map((f) =>
                        entry[f.key] ? (
                            <div key={f.key}>
                                <p className={isCompact ? "flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2" : "flex items-center gap-2 pb-1"}>
                                    {f.icon && (
                                        <f.icon
                                            size={isCompact ? 12 : 16}
                                            className={isCompact
                                                ? "sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                                                : (deptKey === "sciences" ? "text-black" : "")}
                                        />
                                    )}
                                    <span className={isCompact
                                        ? "flex self-center gap-1 sm:gap-2 bg-brand text-white font-bold uppercase text-[10px] sm:text-sm md:text-base px-1.5 sm:px-2 rounded-full w-fit"
                                        : "flex gap-2 bg-brand text-white font-bold uppercase text-sm px-2 rounded-full w-fit"}>
                                        {f.label}
                                    </span>
                                </p>
                                <div className={isCompact
                                    ? "ps-4 sm:ps-6 md:ps-10 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base font-extrabold leading-relaxed"
                                    : `ps-6 mt-1 text-sm font-extrabold leading-relaxed ${deptKey === "sciences" ? "text-black" : ""}`}>
                                    {entry[f.key]}
                                </div>
                            </div>
                        ) : null
                    )}

                {entry.advice && (
                    <div className={isCompact ? "flex flex-col items-center text-center mt-4 sm:mt-6 md:mt-8" : "flex flex-col items-center text-center mt-6"}>
                        <p
                            className={isCompact ? "text-brand text-sm sm:text-lg md:text-2xl mb-1 sm:mb-2 md:mb-3" : `${leftLabelColor} text-lg mb-2`}
                            style={{ fontFamily: "'Dancing Script', cursive", whiteSpace: "nowrap" }}
                        >
                            Parting Words
                        </p>
                        {/* Hard spacer, independent of line-height/font metrics, so a
                            fallback font rendering "Parting Words" taller than expected
                            (e.g. during export, before/if the cursive webfont is ready)
                            can never push the quote below into overlapping it. */}
                        <div aria-hidden="true" style={{ height: isCompact ? 6 : 10 }} />
                        <p className={isCompact
                            ? `italic text-[10px] sm:text-sm md:text-lg font-semibold max-w-[160px] sm:max-w-[240px] md:max-w-xs break-words leading-relaxed ${deptKey === "educationfoundation" ? "text-amber-100" : ""}`
                            : `italic text-sm font-semibold max-w-[260px] break-words leading-relaxed ${deptKey === "educationfoundation" ? "text-amber-100" : ""}`}>
                            <span className={isCompact ? "text-lg sm:text-xl md:text-3xl text-brand align-top leading-none" : `text-xl align-top leading-none`}>"</span>
                            <span className={`${partingWordsColor}`}>{entry.advice}</span> 
                            <span className={isCompact ? "text-lg sm:text-xl md:text-3xl text-brand align-top leading-none" : `text-xl align-top leading-none`}>"</span>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export const ShowCard = ({ entry, roster, onToggle, flipped }) => {
    // eslint-disable-next-line
    const [frontHeight, setFrontHeight] = useState(null);

    const FIELDS = getFields(roster?.course)
    const detailFields = FIELDS.filter((f) => !f.fromRoster && f.key !== "name" && f.key !== "birthday" && f.key !==
    "relationship_status" && f.key !== "phone" && f.key !== "email");

    // Used only for measuring the visible flip card's height (unchanged behavior)
    const flipCardRef = useRef(null);
    // Used only for image export — a hidden, non-flipping snapshot of front + datafields
    const exportRef = useRef(null);

    // The export snapshot's photo previously pointed straight at
    // entry.final_photo_url and relied on the browser finishing that
    // network fetch + decode by the time the user clicked download/share.
    // On a fresh page load (especially on slower mobile connections) that
    // fetch sometimes hadn't finished yet, so the first export came out
    // with the photo missing — it only worked on a second try because the
    // browser had it cached by then. Preloading it into a local blob URL as
    // soon as the card mounts removes that race: by the time the user can
    // even click download, the image data is already sitting in memory.
    const [exportPhotoUrl, setExportPhotoUrl] = useState(null);

    useEffect(() => {
        let objectUrl;
        let cancelled = false;

        setExportPhotoUrl(null);

        (async () => {
            if (!entry?.final_photo_url) return;
            try {
                const res = await fetch(entry.final_photo_url, { mode: "cors" });
                const blob = await res.blob();
                if (cancelled) return;
                objectUrl = URL.createObjectURL(blob);
                setExportPhotoUrl(objectUrl);
            } catch {
                // Preloading failed (e.g. CORS/network issue) — fall back to
                // the original remote URL so export still has a chance to work.
                if (!cancelled) setExportPhotoUrl(entry.final_photo_url);
            }
        })();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [entry?.final_photo_url]);

    useEffect(() => {
        if (flipCardRef.current) {
            const height = flipCardRef.current.offsetHeight;
            setFrontHeight(height);
            console.log(height);
        }
    }, [flipped]);

    const normalise = useCallback((str) => {
        return str.toLowerCase().replace(/\s+/, "").replace(/&/g, 'and')
    }, [])

    const deptKey = normalise(entry.department);
    console.log(deptKey)
    const bg = departmentBgColors[deptKey];
    const leftLabelColor = deptKey === "educationfoundation" ? "text-black" : deptKey ==="sciences" ? "text-white" : "text-brand";
    const partingWordsColor = deptKey === "educationfoundation" ? "text-white" : deptKey ==="sciences" ? "text-white" : "text-brand";
    const leftTextValueColor = deptKey === "sciences" ? "text-black" : "text-white";

    // Option B: back-of-card images stretch to fill the full card height
    const backImageClassName = "h-full w-20 sm:w-24 md:w-32 lg:w-40 object-cover rounded-md";

    // Gold for science, white for arts & social sciences and education foundation
    const backNameColor = deptKey === "sciences" ? "text-brand" : "text-white";

    return (
        <div style={{ background: bg }} className='pt-3 px-3 rounded-2xl mt-2 sm:pt-5 sm:px-5 md:pt-7 md:px-7 md:mt-4'>
            <div className='flex justify-end items-center'>
                <div className='p-1.5 sm:p-2 flex bg-accent-white w-3/5 sm:w-2/5 rounded-xl sm:rounded-2xl shadow-[4px_4px_6px_rgba(0,0,0,0.2)] sm:shadow-[6px_6px_9px_rgba(0,0,0,0.2)]'>
                    <div className='flex w-3/6 items-center gap-1 sm:gap-2 md:gap-4'>
                        <BookOpen size={24} className="sm:w-9 sm:h-9 md:w-[50px] md:h-[50px]" />
                        <img src={logo} alt="" className="w-9 h-9 sm:w-12 sm:h-9 md:w-[65px] md:h-[50px]" />
                        <University size={24} className='text-brand sm:w-9 sm:h-9 md:w-[50px] md:h-[50px]' />
                    </div>
                    <div>
                        <h2 className="text-xs sm:text-base md:text-xl">Faculty of {entry.faculty}</h2>
                        <p className="text-[10px] sm:text-sm md:text-base">{UNIVERSITY_NAME}</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center mt-3 sm:mt-4 md:mt-6 w-full gap-4 sm:gap-6 md:gap-8'>
                <div className='w-1/2 flex flex-col items-center self-start'>
                    <div className='font-extrabold text-center'>
                        <p className='text-brand text-xs sm:text-sm md:text-base'><strong><em>FINALIST</em></strong></p>
                        <p className="text-[10px] sm:text-xs md:text-sm">OF THE DAY</p>
                    </div>

                    <div className="[perspective:1000px]" ref={flipCardRef}>
                        <div
                            className={`relative [transform-style:preserve-3d] transition-transform duration-500 ${
                                flipped ? "[transform:rotateY(180deg)]" : ""
                            }`}
                        >
                            {/* FRONT FACE */}
                            <figure
                                onClick={onToggle}
                                className="[backface-visibility:hidden] border-2 border-brand cursor-pointer p-1.5 sm:p-2 md:p-3 rounded-xl sm:rounded-2xl w-fit shadow-[4px_4px_8px_rgba(0,0,0,0.9)] sm:shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center"
                            >
                                <ProfileDetails
                                    entry={entry}
                                    photoUrl={entry.final_photo_url}
                                    photoClassName="w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 object-cover rounded-full"
                                    leftLabelColor={leftLabelColor}
                                    leftTextValueColor={leftTextValueColor}
                                />
                                <div className="text-[10px] sm:text-xs md:text-sm">Tap to flip</div>
                            </figure>

                            {/* BACK FACE */}
                            <div
                                onClick={onToggle}
                                className="absolute flex items-center flex-col justify-around inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-brand rounded-xl sm:rounded-2xl cursor-pointer pb-3"
                            >
                                <div className='flex items-center justify-center gap-2 sm:gap-3 p-1 sm:p-2 flex-1 min-h-0 w-full'>
                                    <div className="h-full">
                                        <figure className='relative cursor-pointer h-full w-fit shadow-[4px_4px_8px_rgba(0,0,0,0.9)] sm:shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center'>
                                            <img src={entry.first_photo_url || undefined}
                                                alt="Throwback of the graduate"
                                                className={backImageClassName} />
                                            <figcaption className='bg-brand rounded-sm px-1 py-[1px] sm:py-0 absolute top-1 sm:top-4 -right-1 sm:-right-4 rotate-38 font-bold text-[6px] sm:text-sm leading-tight'>First year</figcaption>
                                        </figure>
                                    </div>
                                    <div className="h-full">
                                        <figure className='relative cursor-pointer h-full w-fit shadow-[4px_4px_8px_rgba(0,0,0,0.9)] sm:shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center'>
                                            <img
                                                src={entry.final_photo_url || undefined}
                                                alt="The picture of the graduate"
                                                className={backImageClassName}
                                            />
                                            <figcaption className='bg-brand rounded-sm px-1 py-[1px] sm:py-0 absolute top-1 sm:top-4 -right-1 sm:-right-4 rotate-38 font-bold text-[6px] sm:text-sm leading-tight'>
                                                Final year
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={`${backNameColor} text-[10px] sm:text-sm md:text-base`}>{entry.name || "Unnamed"}</div>
                                    <div className="text-amber-100 text-[8px] sm:text-xs md:text-sm">The legacy continues</div>
                                </div>
                                <div className="text-[10px] sm:text-xs md:text-sm">Tap to flip Back</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-1/2 mb-3 sm:mb-4 md:mb-6'>
                    <DetailFieldsList
                        detailFields={detailFields}
                        entry={entry}
                        deptKey={deptKey}
                        leftLabelColor={leftLabelColor}
                        partingWordsColor={partingWordsColor}
                        sizeVariant="compact"
                    />
                </div>
            </div>

            {/*
                EXPORT-ONLY SNAPSHOT
                This is a hidden, non-flipping copy of the front photo + both
                datafield columns. It's what CardActions actually exports —
                html-to-image never has to deal with the 3D flip transform or
                the back face this way.

                IMPORTANT — two ways this has broken before, do not reintroduce either:
                1) No opacity: 0, visibility: hidden, or display: none on the
                   inner (ref) node. html-to-image copies real computed styles,
                   so visually hiding it also blanks the exported PNG.
                2) Do NOT push it far off-screen with something like
                   `left: -9999px`. Some browser engines (notably mobile
                   WebKit) skip painting elements positioned very far outside
                   the viewport — the node still measures correctly, but
                   nothing actually gets drawn, so the export is blank anyway.
                   Instead, keep it at the top-left corner (fully "in view")
                   and clip it to invisible with a 0×0 overflow:hidden wrapper.
            */}
            <div style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div
                    ref={exportRef}
                    style={{ background: bg }}
                    className="p-4 sm:p-6 flex flex-col items-center w-[680px]"
                >
                    <div className='flex justify-end items-center w-full mb-4'>
                        <div className='p-2 flex bg-accent-white rounded-2xl shadow-[6px_6px_9px_rgba(0,0,0,0.2)]'>
                            <div className='flex items-center gap-2 md:gap-4'>
                                <BookOpen size={32} />
                                <img src={logo} alt="" className="w-[50px] h-[38px]" />
                                <University size={32} className='text-brand' />
                            </div>
                            <div>
                                <h2 className="text-lg px-2">Faculty of {entry.faculty}</h2>
                                <p className="text-sm px-2">{UNIVERSITY_NAME}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-stretch gap-4 w-full">
                        <div className="w-1/2 flex flex-col items-center">
                            <div className="border-2 border-brand p-2 sm:p-3 rounded-2xl w-fit flex flex-col justify-center items-center">
                                <ProfileDetails
                                    entry={entry}
                                    photoUrl={exportPhotoUrl || entry.final_photo_url}
                                    photoClassName="w-56 h-56 object-cover rounded-full"
                                    crossOrigin="anonymous"
                                    leftLabelColor={leftLabelColor}
                                    leftTextValueColor={leftTextValueColor}
                                />
                            </div>
                        </div>

                        <div className="w-1/2 h-full flex flex-col justify-center">
                            <DetailFieldsList
                                detailFields={detailFields}
                                entry={entry}
                                deptKey={deptKey}
                                leftLabelColor={leftLabelColor}
                                partingWordsColor={partingWordsColor}
                                sizeVariant="export"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CardActions
                nodeRef={exportRef}
                filename={`${(entry.name || entry.reg_no || "card").replace(/\s+/g, "-")}-card.png`}
                caption={`${entry.name || ""} · Class of ${CLASS_YEAR} · The Legacy Continues`}
            />
        </div>
    )
}