import { formatDpt } from "../utils/formatdepartment";
import { useRef, useEffect } from "react";

const ALL_FACULTIES = 'All Faculties'

export const Sidebar = ({list, activeFaculty, width, handleDepartment, activeDepartment, isOpen, onClose}) => {
    const showAllDepartment = 'All Departments'
    const sidebarRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (sidebarRef.current && sidebarRef.current.contains(event.target)) return
            if (event.target.closest('[data-sidebar-toggle]')) return
            onClose()
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    // "All Faculties" means show every department across every faculty;
    // otherwise scope departments to just the selected faculty
    const facultyList = activeFaculty === ALL_FACULTIES
        ? list
        : list.filter(student => student.faculty === activeFaculty)
    const departmentsInFaculty = facultyList.map(student => student.department)

    const counts = departmentsInFaculty.reduce((acc, dpt) => {
        acc[dpt] = (acc[dpt] || 0) + 1;
        return acc;
    }, {});
    counts['All'] = departmentsInFaculty.length

    const uniqueDepartments = ['All', ...new Set(departmentsInFaculty)];
    return (
        <div ref={sidebarRef} className={`${isOpen ? 'block' : 'hidden'} bg-accent-facSide p-2 sm:p-6`}
        style={{ width: `${width * 100}%` }}>
            <p className="text-black mb-6 text-accent sm:text-facSide">Faculty View . Registrar</p>
            <div className="flex flex-col gap-6">
                {uniqueDepartments.map((dpt, index) => {
                const isAll = dpt === 'All'
                const isActive = isAll ? activeDepartment === showAllDepartment : activeDepartment === dpt
                return (
                    <div
                        onClick={() => handleDepartment(isAll ? showAllDepartment : dpt)}
                        key={index}
                        className={`cursor-pointer flex flex-row justify-between items-center p-2 rounded-md text-accent sm:text-facSide text-accent-white overflow-hidden ${
                            isActive ? "bg-brand" : "bg-accent-facSideBtn"
                        }`}
                    >
                        <button className="truncate min-w-0 cursor-pointer">{formatDpt(dpt)}</button>
                        <small className="border-2 border-dark px-1 shrink-0 cursor-pointer">{counts[dpt]}</small>
                    </div>
                )
            }
            )}
            </div>
        </div>
    )
}