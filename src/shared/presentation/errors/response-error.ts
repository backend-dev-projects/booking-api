export interface ApplicationIssue {
  message: string;
  path?: (string | number)[];
}

export interface ErrorResponse {
  status: number;
  issues: ApplicationIssue[];
}
