import { Loader2, GraduationCap } from "lucide-react";
import { useState } from "react";
import {ShowCard} from "../components/showCard"
export const Wall =({entries, roster, loading, loadError, onRetry}) => {
    const [flippedMap, setFlippedMap] = useState({});
    const toggleFlip = (regNo) => setFlippedMap((m) => ({ ...m, [regNo]: !m[regNo] }));
    if (loading) {
        return (
        <div className="flex items-center gap-2 justify-center mt-5">
            <Loader2 size={22} className="animate-spin text-brand" />
            Loading the wall…
        </div>
        );
    }

    if(loadError) {
        return (
            <div className="flex items-center gap-2 justify-center mt-5">
                <p>{loadError}</p>
                <button className='text-accent-white text-accent bg-accent-error flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105' onClick={onRetry}>Try  Again</button>
            </div>
            
        )
    }

    if (entries.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center mt-10">
            <GraduationCap size={50} className="text-brand" />
            <div className="yb-empty-title">The wall is empty</div>
            <div>Be the first to pin your first-year-to-final-year story.</div>
        </div>
        );
    }
    return(
        <div>
            { entries.map((entry) => (
                <ShowCard key={entry.reg_no} roster={roster} entry={entry} flipped={!!flippedMap[entry.reg_no]}
                onToggle={() => toggleFlip(entry.reg_no)} />
            ))}
        </div>
    
    )
}