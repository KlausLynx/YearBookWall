import { Sidebar } from "../components/sidebar"
import { MainPage } from "../components/mainpage"
import { listDepartment } from "../lib/api"
import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";
import { Loader2 } from "lucide-react";

const ALL_FACULTIES = 'All Faculties'

export const FacultyPage = () => {
    const showAllDepartment = 'All Departments'
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState("")
    const [sideBarWidth, setSideBarWidth] = useState(0.25)
    const [clickedDepartment, setClickedDepartment] = useState(showAllDepartment)
    const [clickedFaculty, setClickedFaculty] = useState(ALL_FACULTIES)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const loadDepartments = useCallback(async () => {
        setLoading(true)
        setLoadError("")
        try {
            setList(await listDepartment())
        } catch (err) {
            Sentry.captureException(err);
            setLoadError("Couldn't load faculty data right now.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadDepartments()
    }, [loadDepartments])

    useEffect(() => {
        const updateWidth = () => {
            if (window.innerWidth < 640) {
                setSideBarWidth(0.4)
            } else {
                setSideBarWidth(0.25)
            }
        }
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const departments = list.map(({ department }) => department);
    const faculties = [...new Set(list.map(({ faculty }) => faculty).filter(Boolean))];

    const getClickedDepartment = (dpt) => setClickedDepartment(dpt)
    const getClickedFaculty = (fac) => {
        setClickedFaculty(fac)
        setClickedDepartment(showAllDepartment)
    }

    const byFaculty = clickedFaculty === ALL_FACULTIES
        ? list
        : list.filter(student => student.faculty === clickedFaculty)

    const byDepartment = clickedDepartment === showAllDepartment
        ? byFaculty
        : byFaculty.filter(student => student.department === clickedDepartment)

    const query = searchTerm.trim().toLowerCase()
    const filteredStudents = query === ''
        ? byDepartment
        : byDepartment.filter(student =>
            student.name?.toLowerCase().includes(query) ||
            String(student.reg_no ?? '').toLowerCase().includes(query)
        )

    if (loading) {
        return (
            <div className="flex items-center gap-2 justify-center mt-5 min-h-screen">
                <Loader2 size={22} className="animate-spin text-brand" />
                Loading faculty data…
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 gap-3 min-h-screen">
                <p>{loadError}</p>
                <button
                    onClick={loadDepartments}
                    className="yb-btn yb-btn-primary"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="font-body flex flex-row min-h-screen">
                <Sidebar
                    list={list}
                    activeFaculty={clickedFaculty}
                    width={sideBarWidth}
                    handleDepartment={getClickedDepartment}
                    activeDepartment={clickedDepartment}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <MainPage
                    department={departments}
                    width={1 - sideBarWidth}
                    activeDepartment={clickedDepartment}
                    students={filteredStudents}
                    slideSideBar={() => setIsSidebarOpen(prev => !prev)}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    activeFaculty={clickedFaculty}
                    faculties={faculties}
                    onFacultyChange={getClickedFaculty}
                />
            </div>
        </div>
    )
}