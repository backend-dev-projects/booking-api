export interface ApiIssue {
  message: string;
  path?: (string | number)[];
}

export interface ErrorResponse {
  status: number;
  issues: ApiIssue[];
}
