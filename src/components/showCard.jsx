import { University, BookOpen, GraduationCap, Tag, User, Cake, MapPin, Heart } from 'lucide-react'
import { getFields, UNIVERSITY_NAME, CLASS_YEAR } from '../data/inputFields'
import { useCallback, useEffect, useRef, useState } from 'react';
import CardActions from "./cardactions";
import logo from "../assets/logo.png"

const departmentBgColors = {
    "educationfoundation": "linear-gradient(135deg, #C8A2C8, #000000)",
    "science": "linear-gradient(135deg, #FFFFFF, #000000)",
    "artsandsocialsciences": "linear-gradient(60deg, #000000, #4169E1)",
};

export const ShowCard = ({ entry, roster, onToggle, flipped }) => {
    const [frontHeight, setFrontHeight] = useState(null);
    const FIELDS = getFields(roster?.course)
    const detailFields = FIELDS.filter((f) => !f.fromRoster && f.key !== "name" && f.key !== "birthday" && f.key !==
        "relationship_status");

    // Used only for measuring the visible flip card's height (unchanged behavior)
    const flipCardRef = useRef(null);
    // Used only for image export — a hidden, non-flipping snapshot of front + datafields
    const exportRef = useRef(null);

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
    const bg = departmentBgColors[deptKey];
    const leftLabelColor = deptKey === "educationfoundation" ? "text-black" : "text-brand";
    const leftTextValueColor = deptKey === "sciences" ? "text-black" : "text-amber-100";

    return (
        <div style={{ background: bg }} className='pt-3 px-3 mt-2 sm:pt-5 sm:px-5 md:pt-7 md:px-7 md:mt-4'>
            <div className='flex justify-end items-center'>
                <div className='p-1.5 sm:p-2 flex bg-accent-white w-3/5 sm:w-2/5 rounded-xl sm:rounded-2xl shadow-[4px_4px_6px_rgba(0,0,0,0.2)] sm:shadow-[6px_6px_9px_rgba(0,0,0,0.2)]'>
                    <div className='flex w-3/6 items-center gap-1 sm:gap-2 md:gap-4'>
                        <BookOpen size={24} className="sm:w-9 sm:h-9 md:w-[50px] md:h-[50px]" />
                        <img src={logo} alt="" className="w-8 h-6 sm:w-12 sm:h-9 md:w-[65px] md:h-[50px]" />
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
                                <img
                                    src={entry.final_photo_url || undefined}
                                    alt="The picture of the graduate"
                                    className="w-24 h-24 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 object-cover rounded-full"
                                />
                                <figcaption className='text-amber-100'>
                                    <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base">
                                        <User size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>NAME: <span className={`text-accent ${leftTextValueColor}`}>{entry?.name ?? 'N/A'} </span></span>
                                    </p>
                                    <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Tag size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>NICKNAME: <span className={`text-accent ${leftTextValueColor}`}>{entry?.nickname ?? 'No nickname provided'}</span></span></p>
                                    <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Cake size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>DOB: <span className={`text-accent ${leftTextValueColor}`}>{entry?.birthday ?? 'No DOB provided'}</span></span></p>
                                    <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><MapPin size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>STATE OF ORIGIN: <span className={`text-accent ${leftTextValueColor}`}>{entry?.state ?? 'N/A'}</span></span></p>
                                    <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Heart size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>RELATIONSHIP STATUS: <span className={`text-accent ${leftTextValueColor}`}>{entry?.relationship_status ?? 'No relatinship status update'} </span></span></p>
                                </figcaption>
                                <div className="text-accent text-[10px] sm:text-xs md:text-sm">Tap to flip</div>
                            </figure>

                            {/* BACK FACE */}
                            <div
                                onClick={onToggle}
                                className="absolute flex items-center flex-col justify-around inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-brand rounded-xl sm:rounded-2xl cursor-pointer"
                            >
                                <div className='flex items-center justify-center p-1 sm:p-2'>
                                    <div>
                                        <figure className='relative cursor-pointer w-fit shadow-[4px_4px_8px_rgba(0,0,0,0.9)] sm:shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center'>
                                            <img src={entry.first_photo_url || undefined}
                                                alt="Throwback of the graduate"
                                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-full md:h-full object-contain rounded-md" />
                                            <figcaption className='bg-brand rounded-sm px-1 absolute top-2 sm:top-4 -right-2 sm:-right-4 rotate-38 text-accent font-bold text-[8px] sm:text-sm'>First year</figcaption>
                                        </figure>
                                    </div>
                                    <div className="text-accent px-1">
                                        <small className='text-brand text-[10px] sm:text-sm'>THEN</small>
                                        <small className="text-amber-100 text-[10px] sm:text-sm">&#8596;</small>
                                        <small className='text-brand text-[10px] sm:text-sm'>NOW</small>
                                    </div>
                                    <div>
                                        <figure className='relative cursor-pointer w-fit shadow-[4px_4px_8px_rgba(0,0,0,0.9)] sm:shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center'>
                                            <img
                                                src={entry.final_photo_url || undefined}
                                                alt="The picture of the graduate"
                                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-full md:h-full rounded-md object-contain"
                                            />
                                            <figcaption className='bg-brand rounded-sm px-1 absolute top-2 sm:top-4 -right-2 sm:-right-4 rotate-38 text-accent font-bold text-[8px] sm:text-sm'>
                                                Final year
                                            </figcaption>
                                        </figure>
                                    </div>
                                </div>
                                <div className="text-accent text-center">
                                    <div className="text-amber-100 text-[10px] sm:text-sm md:text-base">{entry.name || "Unnamed"}</div>
                                    <div className="text-amber-100 text-[8px] sm:text-xs md:text-sm">The legacy continues</div>
                                </div>
                                <div className="text-accent text-[10px] sm:text-xs md:text-sm">Tap to flip Back</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-1/2 mb-3 sm:mb-4 md:mb-6'>
                    <div className='mt-4 sm:mt-6 md:mt-8 mb-3 sm:mb-4 md:mb-6'>
                        <p className="text-[10px] sm:text-sm md:text-base">
                            THE{" "}
                            <span className="relative">
                                <span className="relative inline-block">
                                    G
                                    <GraduationCap
                                        size={16}
                                        className="text-brand pb-1 sm:pb-2 md:pb-3 absolute -top-3 sm:-top-4 md:-top-6 left-1/2 -translate-x-1/2 sm:w-6 sm:h-6 md:w-10 md:h-10"
                                    />
                                </span>
                                RADUATING
                            </span>{" "}
                            CLASS OF {CLASS_YEAR}
                        </p>
                    </div>

                    <div className="text-accent space-y-2 sm:space-y-4 md:space-y-6">
                        {detailFields
                            .filter((f) => f.key !== "advice")
                            .map((f) =>
                                entry[f.key] ? (
                                    <div className="" key={f.key}>
                                        <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2">
                                            {f.icon && <f.icon size={12} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />}
                                            <span className="flex self-center gap-1 sm:gap-2 bg-brand text-white font-bold uppercase text-[10px] sm:text-sm md:text-base px-1.5 sm:px-2 rounded-full w-fit">
                                                {f.label}
                                            </span>
                                        </p>
                                        <div className="ps-4 sm:ps-6 md:ps-10 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base font-extrabold leading-relaxed">
                                            {entry[f.key]}
                                        </div>
                                    </div>
                                ) : null
                            )}

                        {entry.advice && (
                            <div className="flex flex-col items-center text-center mt-4 sm:mt-6 md:mt-8">
                                <p
                                    className="text-brand text-sm sm:text-lg md:text-2xl mb-1 sm:mb-2 md:mb-3"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    Parting Words
                                </p>
                                <p className={`italic text-[10px] sm:text-sm md:text-lg font-semibold max-w-xs leading-relaxed ${deptKey === "educationfoundation" ? "text-amber-100" : ""}`}>
                                    <span className="text-lg sm:text-xl md:text-3xl text-brand align-top leading-none">"</span>
                                    {entry.advice}
                                    <span className="text-lg sm:text-xl md:text-3xl text-brand align-top leading-none">"</span>
                                </p>
                            </div>
                        )}
                    </div>
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

                <div className="flex flex-row items-start gap-4 w-full">
                <div className="w-1/2 flex flex-col items-center">
                    <figure className="border-2 border-brand p-2 sm:p-3 rounded-2xl w-fit shadow-[7px_7px_15px_rgba(0,0,0,0.9)] flex flex-col justify-center items-center">
                        <img
                            src={entry.final_photo_url || undefined}
                            crossOrigin="anonymous"
                            alt="The picture of the graduate"
                            className="w-56 h-56 object-cover rounded-full"
                        />
                        <figcaption className='text-amber-100'>
                            <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base">
                                <User size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>NAME: <span className={`text-accent ${leftTextValueColor}`}>{entry?.name ?? 'N/A'} </span></span>
                            </p>
                            <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Tag size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>NICKNAME: <span className={`text-accent ${leftTextValueColor}`}>{entry?.nickname ?? 'No nickname provided'}</span></span></p>
                            <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Cake size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>DOB: <span className={`text-accent ${leftTextValueColor}`}>{entry?.birthday ?? 'No DOB provided'}</span></span></p>
                            <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><MapPin size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>STATE OF ORIGIN: <span className={`text-accent ${leftTextValueColor}`}>{entry?.state ?? 'N/A'}</span></span></p>
                            <p className="flex items-center gap-1 sm:gap-2 pb-1 sm:pb-2 text-[10px] sm:text-sm md:text-base"><Heart size={12} className={`${leftTextValueColor} sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]`} /> <span className={leftLabelColor}>RELATIONSHIP STATUS: <span className={`text-accent ${leftTextValueColor}`}>{entry?.relationship_status ?? 'No relatinship status update'} </span></span></p>
                        </figcaption>
                    </figure>
                </div>

                <div className="w-1/2">
                    <div className='mb-3 text-center'>
                        <p className="text-sm">
                            THE{" "}
                            <span className="relative">
                                <span className="relative inline-block">
                                    G
                                    <GraduationCap size={18} className="text-brand absolute -top-4 left-1/2 -translate-x-1/2" />
                                </span>
                                RADUATING
                            </span>{" "}
                            CLASS OF {CLASS_YEAR}
                        </p>
                    </div>

                    <div className="text-accent space-y-3 w-full">
                        {detailFields
                            .filter((f) => f.key !== "advice")
                            .map((f) =>
                                entry[f.key] ? (
                                    <div key={f.key}>
                                        <p className="flex items-center gap-2 pb-1">
                                            {f.icon && <f.icon size={16} className={deptKey === "science" ? "text-black" : ""} />}
                                            <span className="flex gap-2 bg-brand text-white font-bold uppercase text-sm px-2 rounded-full w-fit">
                                                {f.label}
                                            </span>
                                        </p>
                                        <div className={`ps-6 mt-1 text-sm font-extrabold leading-relaxed ${deptKey === "science" ? "text-black" : ""}`}>
                                            {entry[f.key]}
                                        </div>
                                    </div>
                                ) : null
                            )}

                        {entry.advice && (
                            <div className="flex flex-col items-center text-center mt-6">
                                <p
                                    className={`${leftLabelColor} text-lg mb-2`}
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    Parting Words
                                </p>
                                <p className={`italic text-sm font-semibold max-w-xs leading-relaxed ${deptKey === "educationfoundation" ? "text-amber-100" : ""}`}>
                                    <span className={`text-xl ${leftLabelColor} align-top leading-none`}>"</span>
                                    {entry.advice}
                                    <span className={`text-xl ${leftLabelColor} align-top leading-none`}>"</span>
                                </p>
                            </div>
                        )}
                    </div>
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