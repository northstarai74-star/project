// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import type { Student, StudentInput } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CERTIFICATES_BUCKET = 'student-certificates';

/**
 * Client for the admin panel and the public certificate lookup.
 */
export class AdminClient {
  // ============ AUTHENTICATION ============

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /** True if the currently signed-in user is a member of admin_users. */
  async isCurrentUserAdmin(): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  /** Grants the signed-in user admin access if `code` matches the server-side invite code. */
  async redeemAdminCode(code: string): Promise<void> {
    const { error } = await supabase.functions.invoke('redeem-admin-code', {
      body: { code },
    });
    if (error) throw error;
  }

  // ============ PUBLIC LOOKUP ============

  /** Public certificate verification by reference number. No auth required. */
  async getStudentByReference(referenceNumber: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('reference_number', referenceNumber.trim())
      .maybeSingle();

    if (error) throw error;
    return (data as Student) ?? null;
  }

  // ============ ADMIN: STUDENT MANAGEMENT ============

  async listStudents(search?: string): Promise<Student[]> {
    let query = supabase.from('students').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.or(`name.ilike.%${search}%,reference_number.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Student[];
  }

  async getStudent(id: string): Promise<Student> {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Student;
  }

  async createStudent(input: StudentInput): Promise<Student> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    const { data, error } = await supabase
      .from('students')
      .insert({ ...input, created_by: admin?.id ?? null })
      .select()
      .single();

    if (error) throw error;
    return data as Student;
  }

  async updateStudent(
    id: string,
    updates: Partial<StudentInput> & Partial<Pick<Student, 'photo_url' | 'certificate_image_url'>>
  ): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Student;
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.getStudent(id);
    const filesToRemove = [student.photo_url, student.certificate_image_url]
      .filter((url): url is string => !!url)
      .map((url) => url.split(`${CERTIFICATES_BUCKET}/`).pop())
      .filter((path): path is string => !!path);

    if (filesToRemove.length > 0) {
      await supabase.storage.from(CERTIFICATES_BUCKET).remove(filesToRemove);
    }

    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  }

  async uploadStudentFile(studentId: string, file: File, kind: 'photo' | 'certificate'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${studentId}/${kind}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(CERTIFICATES_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(CERTIFICATES_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }
}

export const adminClient = new AdminClient();
