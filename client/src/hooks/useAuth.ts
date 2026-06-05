import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isReady, setIsReady] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().refreshOnStartup().finally(() => {
      setIsReady(true);
    });
  }, []);

  return {
    ...authStore,
    isReady,
  };
};
