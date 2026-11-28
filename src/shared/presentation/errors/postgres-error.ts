export interface PostgreIssue {
  message: string;
  path?: (string | number)[];
}

export interface PostgreError {
  status: number;
  issues: PostgreIssue[];
}
