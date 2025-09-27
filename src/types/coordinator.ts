
export interface Student {
  id: string;
  profile_id: string;  // Added profile_id property
  name: string;
  email: string;
  phone?: string;
  progress: number; // Progress percentage (0-100)
  phase: string; // Current training phase
  hub: string; // Hub name
  alphaUnit: string; // Alpha unit designation
  ftpName: string; // Field Training Paramedic name
  ftpContact: string; // Field Training Paramedic contact
  lastUpdated: string; // Date of last update
  forms?: StudentForm[]; // List of completed forms
}

export interface StudentForm {
  id: string;
  name: string;
  completedDate: string;
  type: string;
}

export interface Phase {
  id: string;
  phase: string; // Name of the phase
  count: number; // Total items in phase
  completed: number; // Completed items in phase
}

export interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
  color: string; // For UI color coding
}

export interface FormData {
  hub: string;
  alphaUnit: string;
  ftpName: string;
  ftpContact: string;
}
