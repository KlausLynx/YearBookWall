import { supabase } from "./superbaseClient";

// ---- Roster (admin-approved reg numbers) ----

export async function checkRegNo(regNo) {
    const { data, error } = await supabase
        .from("roster")
        .select("*")
        .eq("reg_no", regNo)
        .maybeSingle();
    if (error) throw error;
    return data; 
}

export async function listRoster() {
  const { data, error } = await supabase
    .from("roster")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addRosterEntry({ regNo, faculty, department, course }) {
  const { data, error } = await supabase
    .from("roster")
    .insert({ reg_no: regNo, faculty, department, course })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteRosterEntry(regNo) {
  const { error } = await supabase.from("roster").delete().eq("reg_no", regNo);
  if (error) throw error;
}

// ---- Entries (the actual cards) ----

export async function getEntryByRegNo(regNo) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("reg_no", regNo)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listEntries() {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveEntry(entry) {
  const { data, error } = await supabase
    .from("entries")
    .upsert({ ...entry, updated_at: new Date().toISOString() }, { onConflict: "reg_no" })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ---- Photos ----

export async function uploadPhoto(file, regNo, label) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${regNo}/${label}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("photos")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function getCourseByRegNo(regNo) {
  const { data, error } = await supabase
    .from("roster")
    .select("course")     // only pull the course column
    .eq("reg_no", regNo)  // WHERE reg_no = regNo
    .single();            // expect exactly one row back

  if (error) throw error;
  return data.course;
}