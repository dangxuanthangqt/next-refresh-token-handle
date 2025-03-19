import PrivateHttpClient from "./http-client/private-http-client";

const privateHttpClient = new PrivateHttpClient("/posts");

export type PostResponseDto = {
  posts: {
    id: number;
    title: string;
    content: string;
  }[];
};

export async function getPosts() {
  const response = await privateHttpClient.get<PostResponseDto>({});

  return response.data;
}
