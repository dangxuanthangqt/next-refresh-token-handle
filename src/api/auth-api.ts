import PrivateHttpClient from "./http-client/private-http-client";
import PublicHttpClient from "./http-client/public-http-client";

const publicHttpClient = new PublicHttpClient("/auth");
const privateHttpClient = new PrivateHttpClient("/auth");

export async function login(data: { email: string; password: string }) {
  const response = await publicHttpClient.post<{
    accessToken: string;
    refreshToken: string;
  }>({
    data,
    url: "/login",
  });

  return response.data;
}

export async function getMe(id: number) {
  const response = await privateHttpClient.get({
    url: "/me/" + id,
  });

  return response.data;
}
