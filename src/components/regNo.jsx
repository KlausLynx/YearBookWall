import { useEffect, useRef, useState } from "react";
import { checkRegNo, getEntryByRegNo } from "../lib/api";
import { ShieldAlert, Loader2, X } from "lucide-react";
import { SubmitButton, Button } from "../utils/button";

export const RegNoModal = ({onApproved, onClose}) => {
    const [regNo, setRegNo] = useState("");
    const [status, setStatus] = useState("idle"); // idle | checking | denied | error
    const [error, setError] = useState(null);

    const inputRef = useRef(null)

    const changeStatus = () => {
        setStatus('idle')
        inputRef.current.focus()
    }

useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError("")
            inputRef.current.focus()
        }, 2000)  

        return () => clearTimeout(timer)  
    }
}, [error])

    const handleChange = async (e) => {
        e.preventDefault()

        const trimmed = regNo.toLowerCase().trim(); 
        if (!trimmed) {
            setError("Please enter your registration number.");
            return;
        }
        setStatus('checking')
        try {
            const roster = await checkRegNo(trimmed)
                if(!roster) {
                    setStatus("denied");
                    setRegNo('')
                    return;
                }
            const existing = await getEntryByRegNo(trimmed);
            onApproved(roster, existing);
        } catch {
            setStatus("error");
            setError("Could not check that reg number right now. Please try again.");
        }
        setError("");   
    }
    return (
        <div className=" flex flex-col p-4 items-center justify-center mt-6 mb-3 mx-auto max-w-2xl border-3 rounded-md border-brand">
            <div className="flex w-full items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                    Your Reg No is needed
                </h2>
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="py-5">
                <form onSubmit={handleChange}>
                    <input ref={inputRef} className="ps-3" type="text" value={regNo} placeholder="e.g. CCU/2022/0142" onChange={(e)=> setRegNo(e.target.value)} autoFocus/>
                    <p className="text-accent-error text-accent mt-3">{error}</p>
                    <div className="mt-8">
                        <SubmitButton disabled={status === "denied"}>
                            {status === "checking" ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Checking
                                </>
                            ) : (
                                "Continue"
                            )}
                        </SubmitButton>
                    </div>
                </form>
                {status === "denied" && (
                    <div className="">
                        <ShieldAlert size={24} className="text-accent-error mt-3" />
                        Not approved by admin. Ask your faculty admin to add your reg number, then try again.
                        <div className="flex items-end justify-end">
                            <Button onChangeStatus={()=> changeStatus()}>
                                Go Back
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}