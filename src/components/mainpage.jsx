import { Heropanel } from "./facultyhero"
import Cards from './cards'
export const MainPage = ({ activeDepartment, students, slideSideBar, searchTerm, onSearchChange, activeFaculty, faculties, onFacultyChange }) => {

    return (
        <div className="mx-4 sm:mx-10 lg:mx-20 flex-1 min-w-0">
            <Heropanel
                department={activeDepartment}
                slideSideBar={slideSideBar}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                activeFaculty={activeFaculty}
                faculties={faculties}
                onFacultyChange={onFacultyChange}
            />
            <div
                className="grid gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-6"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
            >
                {students.map((prsn, index) => (
                    <Cards key={index} facultyStudents={prsn} />
                ))}
            </div>
        </div>
    )
}