import {Plus} from 'lucide-react'
import { useEffect } from 'react'
export const Hero = ({checkRegNo, activeReg, handlePermission, checkWallUser}) => {
const buttonDisplay = checkRegNo.wall === true && activeReg === true
useEffect(() => {
    console.log(buttonDisplay)
    console.log(checkRegNo)
}, [buttonDisplay, checkRegNo])

    return (
        <>
            <h1 className="text-brand font-heading text-4xl font-extrabold text-center pt-4 mb-6">
                Coal City University
            </h1>

            <div className="flex flex-col items-center">
                <div className='mb-3'>
                    <span>First Year. </span>
                    <span className="text-brand italic text-3xl font-bold">Final Year. </span>
                </div>
                <small className="text-center">The Legacy Continues — two photos, one story.<br/> Add your fresher-year throwback and your final-year glow-up, then pin your card to the wall.</small>
                <br />
                <strong><em>4 years no be beans</em>😌</strong>
                
                {<div style={{display: buttonDisplay  ? 'none' : 'block'}}  className='mt-3'>
                    <button onClick={handlePermission} className='text-accent-white text-accent bg-brand flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105'>
                        <Plus></Plus>
                        <span className='ps-2'>add your story</span> 
                    </button>
                </div>}   

                {buttonDisplay ? (
                    <div className='mt-3'>
                        <button onClick={()=> checkWallUser()} className='text-accent-white text-accent bg-brand flex items-center justify-center rounded-2xl p-2 cursor-pointer transition hover:scale-105'>
                            <Plus></Plus>
                            <span className='ps-2'>Edit your story</span> 
                        </button>
                    </div>
                ) : null}
            </div>            
        </>
    )
}