/**
 * Enterprise TypeScript Patterns for Production Applications
 * Used across modern React 18/19 SPAs, Next.js 15, and Mendix REST integrations.
 */

// ============================================================================
// 1. Discriminated Unions (Tagged Unions) for Predictable UI State
// ============================================================================

export type AsyncState<TData, TError = string> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: TData; error: null }
  | { status: 'error'; data: null; error: TError };

export function renderAsyncState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Waiting to initialize...';
    case 'loading':
      return 'Loading data from Mendix REST API...';
    case 'success':
      return `Loaded successfully: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Failed to fetch: ${state.error}`;
  }
}

// ============================================================================
// 2. Generic API Response Wrapper for Mendix REST / Microservices
// ============================================================================

export interface ApiResponse<TPayload> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TPayload;
  timestamp: string;
  metadata?: {
    totalRecords: number;
    page: number;
    pageSize: number;
  };
}

export interface TaskRecord {
  taskId: string;
  title: string;
  assignedTo: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  slaHoursRemaining: number;
}

// Concrete strongly-typed response
export type TaskListResponse = ApiResponse<TaskRecord[]>;

// ============================================================================
// 3. Advanced Utility Types in Practice
// ============================================================================

// Form state where all fields are initially optional during drafting
export type TaskDraft = Partial<TaskRecord>;

// Reading an immutable audit record from the database
export type ImmutableTask = Readonly<TaskRecord>;

// Selecting specific fields for a compact card presentation
export type TaskCardPreview = Pick<TaskRecord, 'taskId' | 'title' | 'priority' | 'status'>;

// Omitting sensitive internal IDs before client display
export type SanitizedTask = Omit<TaskRecord, 'taskId'>;

// ============================================================================
// 4. Strongly-Typed React Component Props Pattern
// ============================================================================

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Polymorphic Button: Can render as <button> or <a> with full type safety
export type ButtonProps<TAs extends 'button' | 'a' = 'button'> = BaseButtonProps & {
  as?: TAs;
} & (TAs extends 'a'
  ? React.AnchorHTMLAttributes<HTMLAnchorElement>
  : React.ButtonHTMLAttributes<HTMLButtonElement>);
