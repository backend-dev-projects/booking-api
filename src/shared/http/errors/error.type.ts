export interface ConstraintError {
  status: number;
  issue: IssueError;
}

interface IssueError {
  path: string[];
  code: string;
  message: string;
}
