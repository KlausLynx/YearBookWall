import {Hero} from '../components/hero'
import {RegNoModal} from '../components/regNo'
import {useEffect, useState} from "react"

export const Wallpage = () => {
    const [view, setView] = useState({
        checkRegNo: false,
        wall: false,
        form: false,
    })
    useEffect(()=> {
        console.log(view)
    }, [view])
    return (
        <>
            <Hero handlePermission={() => setView(prev => ({ ...prev, checkRegNo: true }))} />
            
            {view.checkRegNo === true && <RegNoModal/>}
        </>
    )
}