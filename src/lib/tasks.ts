import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  date_text: string;
  time_text: string;
  original_query: string;
  completed: boolean;
  created_at: string;
}

/** All tasks for the signed-in user, newest first (RLS scopes the rows). */
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function insertTask(input: {
  user_id: string;
  title: string;
  date_text: string;
  time_text: string;
  original_query: string;
}): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function setTaskCompleted(id: string, completed: boolean) {
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
