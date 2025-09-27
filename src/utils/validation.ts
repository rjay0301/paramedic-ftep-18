import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(128, { message: "Password must be less than 128 characters" });

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Registration form validation schema
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-'\.]+$/, { message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods" }),
  role: z.enum(['student', 'coordinator', 'admin'], {
    errorMap: () => ({ message: "Please select a valid role" })
  }),
});

// Text input validation with HTML sanitization
export const sanitizeTextInput = (input: string, maxLength = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and limit length
  const sanitized = input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]*;/g, '') // Remove HTML entities
    .trim()
    .slice(0, maxLength);
    
  return sanitized;
};

// Validate and sanitize form data
export const validateAndSanitizeForm = <T extends Record<string, any>>(
  data: T,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    // First sanitize string fields
    const sanitizedData = { ...data };
    for (const key in sanitizedData) {
      const value = sanitizedData[key];
      if (typeof value === 'string') {
        (sanitizedData as any)[key] = sanitizeTextInput(value);
      }
    }

    // Then validate with schema
    const validatedData = schema.parse(sanitizedData);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Phone number validation (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" })
  .optional();

// Assignment text validation
export const assignmentTextSchema = z
  .string()
  .trim()
  .min(10, { message: "Assignment response must be at least 10 characters" })
  .max(5000, { message: "Assignment response must be less than 5000 characters" });

// CFS number validation (Canadian Fire Service format)
export const cfsNumberSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{4}-[0-9]{6}$/, { message: "CFS number must be in format YYYY-XXXXXX" });

// Phase accessibility helpers
export const isPhaseAccessible = (phase: string, completedPhases: string[] = []): boolean => {
  // Always accessible phases
  if (['assignments', 'rural-ambulance'].includes(phase)) return true;
  
  // Phase 1 completion required for instructional phases
  if (['instructional', 'instructional-evaluation', 'instructional-summaries'].includes(phase)) {
    return completedPhases.includes('observation');
  }
  
  // Phase 2 completion required for independent phases
  if (['independent', 'independent-evaluation', 'independent-summaries'].includes(phase)) {
    return completedPhases.includes('instructional') && 
           completedPhases.includes('instructional-evaluation') && 
           completedPhases.includes('instructional-summaries');
  }
  
  // Phase 3 completion required for final phases
  if (['reflective', 'final-evaluation', 'evaluation-forms'].includes(phase)) {
    return completedPhases.includes('independent') && 
           completedPhases.includes('independent-evaluation') && 
           completedPhases.includes('independent-summaries');
  }
  
  return false;
};

export const isAddendumPhase = (phaseId: string): boolean => phaseId === 'addendum';

export const phaseGroups = {
  alwaysAccessible: ['assignments', 'rural-ambulance'],
  phase1: ['observation'],
  phase2: ['instructional', 'instructional-evaluation', 'instructional-summaries'],
  phase3: ['independent', 'independent-evaluation', 'independent-summaries'],
  phase4: ['reflective', 'final-evaluation', 'evaluation-forms']
};