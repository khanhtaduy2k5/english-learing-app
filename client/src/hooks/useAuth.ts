import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isReady, setIsReady] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    // Check if auth was persisted from localStorage
    setIsReady(true);
  }, []);

  return {
    ...authStore,
    isReady,
  };
};
