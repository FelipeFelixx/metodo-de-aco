export type View = "dashboard" | "lessons" | "challenges" | "timer" | "planner" | "prompts" | "progress" | "admin";

export type UserRole = "student" | "admin";

export type AccessStatus = "active" | "refunded" | "revoked" | "pending";

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  content: string[];
}

export interface Prompt {
  id: number;
  title: string;
  text: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  status: AccessStatus;
  purchasedAt: string;
  lastAccess: string;
}