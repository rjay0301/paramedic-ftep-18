
export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  hub?: string;
  unit?: string;
  corp_id?: string;
  role: string;
  updated_at: string;
  created_at: string;
  join_date?: string;
  ftp_name?: string;
  emergency_contact?: string;
}

export type ProfileInputData = Pick<
  ProfileData,
  'full_name' | 'phone' | 'department' | 'hub' | 'unit' | 'ftp_name' | 'emergency_contact'
>;
