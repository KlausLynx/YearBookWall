import {Hero} from '../components/hero'
import {RegNoModal} from '../components/regNo'
import UploadForm from '../components/UploadForm'
import {Wall} from '../components/wall'
import {useEffect, useState, useCallback} from "react"
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
        loadEntries().then(data => console.log(data));
    }, [loadEntries]);
    /* eslint-enable */
const handleApproved = async (roster, existingEntry) => {
    setActiveRoster(roster);
    setActiveEntry(existingEntry);
    setActiveRegNo(roster.reg_no);

    console.log(existingEntry);  
    console.log(roster.reg_no);   
      const course = await getCourseByRegNo(roster.reg_no); // call it here
    console.log(course);
    setView(prev => ({...prev, form: true, checkRegNo: false}));
};

    const handleSaved = () => {
        setView(prev => ({...prev, form: false, wall: true}) );
        loadEntries();
    };

    const checkUserDetails = useCallback(async() => {
        setView(prev => ({ ...prev, wall: false, form: true  }))
    }, [])

    return (
        <>
            <Hero checkRegNo={view} activeReg={activeRegNo} checkWallUser={checkUserDetails} handlePermission={() => setView(prev => ({ ...prev, checkRegNo: true, wall: false }))} />

            {view.wall === true && <Wall entries={entries} roster={activeRoster} loading={loading} loadError={loadError} onRetry={loadEntries} />}

            {view.checkRegNo === true && <RegNoModal onApproved={handleApproved} onClose={() => setView(prev => ({ ...prev, checkRegNo: false }))}/>}

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