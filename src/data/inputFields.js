export const UNIVERSITY_NAME = "Coal City University";
export const CLASS_YEAR = "2026";
export const TAGLINE = "The Legacy Continues";

// fromRoster fields are set by the admin (via the roster) and are NOT
// editable by the student in the upload form — they're just displayed.
export const FIELDS = [
    { key: "name", label: "Name", placeholder: "Ada Okafor", required: true },
    { key: "faculty", label: "Faculty", fromRoster: true },
    { key: "department", label: "Department", fromRoster: true },
    { key: "birthday", label: "Birthday", placeholder: "14th of March" },
    { key: "relationship_status", label: "Relationship status", placeholder: "It's complicated" },
    { key: "hobbies", label: "Hobbies", placeholder: "Football, sleeping in lectures" },
    { key: "favorite_course", label: "Favorite course", placeholder: "EDU 301" },
    { key: "trauma_course", label: "Course that traumatized me", placeholder: "STA 201" },
    { key: "best_level", label: "Best level", placeholder: "300L" },
    { key: "worst_level", label: "Worst level", placeholder: "200L" },
    { key: "favorite_lecturer", label: "Favorite lecturer", placeholder: "Dr. Adeyemi" },
    { key: "next_step", label: "After school, what's next", placeholder: "Masters, then NYSC" },
    { key: "advice", label: "Word of advice to younger levels", placeholder: "Attend classes o" },
];
