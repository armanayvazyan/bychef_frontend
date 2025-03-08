import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const useServerError = () => {
  const { toast } = useToast();
  const { t: tError } = useTranslation("translation", { keyPrefix: "server-errors" });

  const handleServerError = useCallback((errorKey: string) => {
    toast({
      title: tError(errorKey),
      variant: "destructive",
    });
  }, [tError, toast]);

  return { handleServerError };
};

export default useServerError;