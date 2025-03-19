import { getMe } from "@/api/auth-api";
import { getPosts, PostResponseDto } from "@/api/posts-api";
import { useEffect, useState } from "react";

export default function usePosts() {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostResponseDto>();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await getPosts();

        setPosts(response);
      } catch {
        console.error("An error occurred during fetching posts.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getPosts();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getPosts();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getMe(9);
    })();
  }, []);

  return {
    isLoading,
    posts,
  };
}
