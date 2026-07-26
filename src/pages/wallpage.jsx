import {Hero} from '../components/hero'
import {RegNoModal} from '../components/regNo'
import UploadForm from '../components/UploadForm'
import {Wall} from '../components/wall'
import {useEffect, useState, useCallback} from "react"
import * as Sentry from "@sentry/react";
import { listEntries, getCourseByRegNo } from '../lib/api'

export const Wallpage = () => {
    const [view, setView] = useState({
        checkRegNo: false,
        wall: true,
        form: false,
    })
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [activeRoster, setActiveRoster] = useState(null);
    const [activeEntry, setActiveEntry] = useState(null);
    const [activeRegNo, setActiveRegNo] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("CCU_REG_NO") || "[]");
            return Array.isArray(saved) && saved.length > 0 ? saved[saved.length - 1] : "";
        } catch {
            return "";
        }
    });

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            setEntries(await listEntries());
        } catch (err) {
            Sentry.captureException(err);
            setLoadError("Couldn't load the wall right now.");
        } finally {
            setLoading(false);
        }
    }, []);
    
    /*  eslint-disable */
    useEffect(() => {
        loadEntries().then(data => console.log(data));
    }, [loadEntries]);
    /* eslint-enable */

    const handleApproved = async (roster, existingEntry) => {
        setActiveRoster(roster);
        setActiveEntry(existingEntry);
        setActiveRegNo(roster.reg_no);
        let existingRegList = [];
        try {
            existingRegList = JSON.parse(localStorage.getItem("CCU_REG_NO") || "[]");
            if (!Array.isArray(existingRegList)) existingRegList = [];
        } catch {
            existingRegList = [];
        }
        if (!existingRegList.includes(roster.reg_no)) {
            existingRegList.push(roster.reg_no);
        }
        localStorage.setItem("CCU_REG_NO", JSON.stringify(existingRegList))
        console.log(existingEntry);  
        console.log(roster.reg_no);   
        const course = await getCourseByRegNo(roster.reg_no); 
        console.log(course);
        setView(prev => ({...prev, form: true, checkRegNo: false}));
    };


    const handleSaved = () => {
        setView(prev => ({...prev, form: false, wall: true}) );
        loadEntries();
    };

    const wallEntries = activeRegNo ? entries.filter((ent) => ent.reg_no === activeRegNo) : []

    return (
        <div className='m-4'>
            <Hero checkRegNo={view} activeReg={activeRegNo} handlePermission={() => setView(prev => ({ ...prev, checkRegNo: true, wall: false }))} />

            {view.wall === true && <Wall entries={wallEntries}  roster={activeRoster} loading={loading} loadError={loadError} onRetry={loadEntries} />}

            {view.checkRegNo === true && <RegNoModal onApproved={handleApproved} onClose={() => setView(prev => ({ ...prev, checkRegNo: false, wall: true }))}/>}

            {view.form === true && activeRoster && (
                <UploadForm
                regNo={activeRegNo}
                roster={activeRoster}
                existingEntry={activeEntry}
                onClose={() => setView(prev => ({...prev, checkRegNo: false}))}
                onSaved={handleSaved}
                onClose={() => setView(prev => ({ ...prev, checkRegNo: false, wall: true }))}
                />
            )}
        </div>
    )
}