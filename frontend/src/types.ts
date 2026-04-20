// === CASE SERVICE ===
export const CaseStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  CLOSED: "CLOSED",
  ARCHIVED: "ARCHIVED",
} as const;
export type CaseStatus = (typeof CaseStatus)[keyof typeof CaseStatus];

export const CasePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type CasePriority = (typeof CasePriority)[keyof typeof CasePriority];

export interface CaseRequest {
  title: string;
  description?: string;
  priority: CasePriority;
}

export interface CaseUpdateRequest {
  title?: string;
  description?: string;
  status?: CaseStatus;
  priority?: CasePriority;
}

export interface CaseResponse {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// === PEOPLE SERVICE ===
export const PersonRole = {
  VICTIM: "VICTIM",
  SUSPECT: "SUSPECT",
  WITNESS: "WITNESS",
  DETECTIVE: "DETECTIVE",
  ANALYST: "ANALYST",
} as const;
export type PersonRole = (typeof PersonRole)[keyof typeof PersonRole];

export interface PersonRequest {
  firstName: string;
  lastName: string;
  role: PersonRole;
  notes?: string;
  caseId: string;
}

export interface PersonUpdateRequest {
  firstName?: string;
  lastName?: string;
  role?: PersonRole;
  notes?: string;
}

export interface PersonResponse {
  id: string;
  firstName: string;
  lastName: string;
  role: PersonRole;
  notes: string;
  caseId: string;
  createdAt: string;
  updatedAt: string;
}

// === EVIDENCE SERVICE ===
export const EvidenceType = {
  PHYSICAL: "PHYSICAL",
  DIGITAL: "DIGITAL",
  TESTIMONIAL: "TESTIMONIAL",
  DOCUMENTARY: "DOCUMENTARY",
  FORENSIC: "FORENSIC",
} as const;
export type EvidenceType = (typeof EvidenceType)[keyof typeof EvidenceType];

export const EvidenceStatus = {
  COLLECTED: "COLLECTED",
  IN_ANALYSIS: "IN_ANALYSIS",
  ANALYZED: "ANALYZED",
  STORED: "STORED",
  DISPOSED: "DISPOSED",
} as const;
export type EvidenceStatus = (typeof EvidenceStatus)[keyof typeof EvidenceStatus];

export interface EvidenceRequest {
  name: string;
  description?: string;
  type: EvidenceType;
  caseId: string;
}

export interface EvidenceUpdateRequest {
  name?: string;
  description?: string;
  type?: EvidenceType;
  status?: EvidenceStatus;
}

export interface EvidenceResponse {
  id: string;
  name: string;
  description: string;
  type: EvidenceType;
  status: EvidenceStatus;
  caseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustodyRecordRequest {
  action: string;
  performedBy: string;
  notes?: string;
}

export interface CustodyRecordResponse {
  id: string;
  evidenceId: string;
  action: string;
  performedBy: string;
  notes: string;
  performedAt: string;
}

// === TASK SERVICE ===
export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface TaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  caseId: string;
  assignedPersonId?: string;
  evidenceId?: string;
  dueDate?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedPersonId?: string;
  evidenceId?: string;
  dueDate?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  caseId: string;
  assignedPersonId: string;
  evidenceId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// === KAFKA LINK RESPONSES ===
export interface TaskAssignmentResponse {
  id: string;
  taskId: string;
  personId: string;
  caseId: string;
  taskTitle: string;
  taskStatus: string;
  taskPriority: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskEvidenceLinkResponse {
  id: string;
  taskId: string;
  evidenceId: string;
  caseId: string;
  taskTitle: string;
  taskStatus: string;
  createdAt: string;
  updatedAt: string;
}
