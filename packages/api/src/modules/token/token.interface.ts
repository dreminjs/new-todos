export interface IAuthTokenPayload {
  userId: string;
  email: string;
}

export interface IEmailConfirmationTokenPayload {
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
