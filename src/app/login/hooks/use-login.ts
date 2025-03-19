import { login } from "@/api/auth-api";
import { saveTokensForInternalServer } from "@/api/internal-auth-token-api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await login({ email, password });

      // Save tokens for internal server => set into cookies
      await saveTokensForInternalServer(response);

      router.push("/posts");
    } catch {
      setLoginError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError,
    handleSubmit,
  };
}
