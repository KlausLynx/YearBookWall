import { useState, useRef, useEffect } from "react"
import {FACULTY_CLASS_YEAR} from "../data/inputFields"
import { MenuSquare, SearchIcon, ChevronDown } from "lucide-react"
import { formatDpt } from "../utils/formatdepartment"

const ALL_FACULTIES = 'All Faculties'

export const Heropanel = ({department, searchTerm, onSearchChange, slideSideBar, activeFaculty, faculties = [], onFacultyChange}) => {
    const [isFacultyOpen, setIsFacultyOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsFacultyOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelectFaculty = (fac) => {
        onFacultyChange?.(fac)
        setIsFacultyOpen(false)
    }

    const isAllFaculties = activeFaculty === ALL_FACULTIES
    const dropdownOptions = [ALL_FACULTIES, ...faculties]

    return (
        <div>
            <div className="my-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                    <button onClick={slideSideBar} data-sidebar-toggle className="cursor-pointer p-2 flex text-accent-white mb-5 justify-center items-center bg-accent-facSideBtn gap-2 rounded-md">
                        <MenuSquare /> 
                        <span className="text-accent">
                            Departments
                        </span>
                    </button>

                    <span className="flex flex-wrap items-center gap-2">
                        <h1 className="font-heading-fac font-extrabold">CLASS of {FACULTY_CLASS_YEAR}</h1>
                        <div className="relative inline-block" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsFacultyOpen((prev) => !prev)}
                                className="flex items-center gap-1 cursor-pointer text-accent hover:opacity-80"
                                aria-haspopup="listbox"
                                aria-expanded={isFacultyOpen}
                            >
                                <span>{isAllFaculties ? "All Students" : `Faculty of ${formatDpt(activeFaculty)}`}</span>
                                <ChevronDown size={16} className={`transition-transform ${isFacultyOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isFacultyOpen && (
                                <ul
                                    role="listbox"
                                    className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto"
                                >
                                    {dropdownOptions.map((fac) => {
                                        const isAllOption = fac === ALL_FACULTIES
                                        return (
                                            <li key={fac}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectFaculty(fac)}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                                                        fac === activeFaculty ? "font-semibold text-brand" : "text-gray-700"
                                                    }`}
                                                >
                                                    {isAllOption ? "All Students" : `Faculty of ${formatDpt(fac)}`}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </span>
                    <p className="text-accent text-gray-600">{formatDpt(department)}</p>
                </div>
                <div className="flex items-center sm:self-end gap-2 border border-gray-300 bg-accent-white rounded-md h-10 w-full sm:w-72 md:w-100 px-2 py-2">
                    <SearchIcon size={14} />
                    <input
                        className="text-accent flex-1 outline-none"
                        type="search"
                        placeholder="Search by name or ID"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-6 border-t-2 border-brand rounded-t-md"></div>
        </div>
    )
}