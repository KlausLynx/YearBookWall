import {Hero} from '../components/hero'
import {RegNoModal} from '../components/regNo'
import UploadForm from '../components/UploadForm'
import {Wall} from '../components/wall'
import {useEffect, useState, useCallback} from "react"
import { listEntries } from '../lib/api'

export const Wallpage = () => {
    const [view, setView] = useState({
        checkRegNo: false,
        wall: false,
        form: false,
    })
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [activeRoster, setActiveRoster] = useState(null);
    const [activeEntry, setActiveEntry] = useState(null);
    const [activeRegNo, setActiveRegNo] = useState("");

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
        setEntries(await listEntries());
        } catch {
        setLoadError("Couldn't load the wall right now.");
        } finally {
        setLoading(false);
        }
    }, []);
    
    /*  eslint-disable */
    useEffect(() => {
        loadEntries();
    }, [loadEntries]);
    /* eslint-enable */
    const handleApproved = (roster, existingEntry) => {
        setActiveRoster(roster);
        setActiveEntry(existingEntry);
        setActiveRegNo(roster.reg_no);
        setView(prev => ({...prev, form: true, checkRegNo: false}));
    };

    const handleSaved = () => {
        setView(prev => ({...prev, checkRegNo: false, form: false}) );
        loadEntries();
    };
    return (
        <>
            <Hero handlePermission={() => setView(prev => ({ ...prev, checkRegNo: true }))} />

            <Wall entries={entries} loading={loading} loadError={loadError} onRetry={loadEntries} />

            {view.checkRegNo === true && <RegNoModal onApproved={handleApproved}/>}

            {view.form === true && activeRoster && (
                <UploadForm
                regNo={activeRegNo}
                roster={activeRoster}
                existingEntry={activeEntry}
                onClose={() => setView(prev => ({...prev, checkRegNo: false}))}
                onSaved={handleSaved}
                />
            )}
        </>
    )
}