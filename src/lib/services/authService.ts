// ==============================================================================
// Edvora School Management — Authentication & Authorization Boundary
// ==============================================================================

import { config } from '../config';
import { store } from '../db/store';
import { StaffRole } from '../types/backend';

export function verifyAutomationRequest(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return false;
  }
  const token = parts[1];
  return token === config.automationServiceKey;
}

export function canPublishResults(role: StaffRole): boolean {
  // Bursars are strictly forbidden from publishing or withdrawing results
  return role === 'admin';
}

export function canEditScores(role: StaffRole, classId: string, assignedClassIds: string[]): boolean {
  if (role === 'admin') return true;
  if (role === 'teacher') {
    return assignedClassIds.includes(classId);
  }
  return false;
}

export function canManageFees(role: StaffRole): boolean {
  return role === 'admin' || role === 'bursar';
}

export function isAuthorizedChild(guardianId: string, pupilId: string): boolean {
  const pupil = store.pupils.find((p) => p.id === pupilId);
  if (!pupil) return false;
  return pupil.guardianId === guardianId;
}

