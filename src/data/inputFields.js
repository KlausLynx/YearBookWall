export const UNIVERSITY_NAME = "Coal City University";
export const CLASS_YEAR = "2026";
export const TAGLINE = "The Legacy Continues";
import { Activity, Lightbulb, BookOpen, FileX, Tag, Search, MapPin, Trophy, Frown, GraduationCap, Cake, Heart, User } from "lucide-react";

const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const getFields = (course) => [
    { key: "name", label: "Name", placeholder: "Ada Okafor", required: true, icon: User },
    { key: "nickname", label: "Nickname", placeholder: 'Bangz', icon: Tag},
    { key: "faculty", label: "Faculty", fromRoster: true },
    { key: "department", label: "Department", fromRoster: true },
    { key: "birthday", label: "Birthday", placeholder: "14th of March", icon: Cake },
    { key: "state", label: "State of Origin", placeholder: "Aba", icon: MapPin },
    { key: "relationship_status", label: "Relationship status", placeholder: "It's complicated", icon: Heart },
    { key: "hobbies", label: "Hobbies", placeholder: "Football, sleeping in lectures", icon: Activity },
    { key: "favorite_course", label: "Favorite course", placeholder: "EDU 301", icon: BookOpen },
    {
        key: "course",
        label: course ? `If not ${capitalize(course)}, what else` : "If not current course, what else",
        placeholder: "",
        icon: Lightbulb
    },
    { key: "trauma_course", label: "Course that traumatized me", placeholder: "STA 201", icon: FileX },
    { key: "best_level", label: "Best level", placeholder: "300L", icon: Trophy },
    { key: "worst_level", label: "Worst level", placeholder: "200L", icon: Frown },
    { key: "favorite_lecturer", label: "Favorite lecturer", placeholder: "Dr. Adeyemi", icon: Search },
    { key: "next_step", label: "After school, what's next", placeholder: "Masters, then NYSC", icon: GraduationCap },
    { key: "advice", label: "Word of advice to younger levels", placeholder: "Attend classes o", icon: Lightbulb },
];