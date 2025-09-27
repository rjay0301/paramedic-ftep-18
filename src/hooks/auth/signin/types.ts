
export interface SignInError {
  message: string;
  code?: string;
}

export interface SignInResult {
  error: SignInError | null;
  success: boolean;
  timeout?: boolean;
}
