export type UserRole = 'admin' | 'staff' | 'teacher'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
}

export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'admitted' | 'lost'
export type LeadSource = 'website' | 'walk_in' | 'referral' | 'phone' | 'social_media' | 'other'

export interface LeadNote {
  id: number
  note: string
  created_at: string
}

export interface Lead {
  id: number
  student_name: string
  parent_name?: string
  phone?: string
  email?: string
  interested_class?: string
  source: LeadSource
  status: LeadStatus
  assigned_to_id?: number
  created_at: string
  updated_at: string
  notes: LeadNote[]
}

export type StudentStatus = 'active' | 'inactive' | 'alumni'

export interface Student {
  id: number
  admission_no: string
  name: string
  dob?: string
  gender?: string
  class_id?: number
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  address?: string
  admission_date?: string
  status: StudentStatus
  created_at: string
}

export interface Teacher {
  id: number
  name: string
  email?: string
  phone?: string
  subject?: string
  qualification?: string
  joining_date?: string
  created_at: string
}

export interface SchoolClass {
  id: number
  name: string
  section?: string
  academic_year: string
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late'

export interface AttendanceRecord {
  id: number
  student_id: number
  date: string
  status: AttendanceStatus
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'online'

export interface FeeStructure {
  id: number
  class_id: number
  term: string
  amount: number
  due_date?: string
}

export interface FeePayment {
  id: number
  student_id: number
  fee_structure_id?: number
  amount: number
  status: PaymentStatus
  method?: PaymentMethod
  payment_date?: string
  created_at: string
}

export interface DashboardStats {
  total_students: number
  total_teachers: number
  total_classes: number
  new_leads: number
  admitted_leads: number
  pending_fee_amount: number
  collected_fee_amount: number
  attendance_today_present: number
  attendance_today_absent: number
}
