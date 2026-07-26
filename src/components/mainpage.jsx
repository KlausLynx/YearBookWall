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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-6">
                {students.map((prsn, index) => (
                    <Cards key={index} facultyStudents={prsn} />
                ))}
            </div>
        </div>
    )
}