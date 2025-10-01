
// This file is a barrel export file that consolidates all form-related services

// Re-export all functions from individual service files
export * from './formCrud';
export * from './formStudentOperations';
export * from './formDrafts';
export * from './form/submission/formSubmissionProcessor';
export * from './hubService';
export * from './phaseService';
export * from './addendumService';

// Re-export types
export type { ValidTableName, FormData, HubData, FormDataValue } from '@/types/forms';
