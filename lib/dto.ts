import { LoginResponse } from "./my-pertamina/schema";

export function loginResponseToAccessToken(res: LoginResponse) {
  return res.data.accessToken;
}
