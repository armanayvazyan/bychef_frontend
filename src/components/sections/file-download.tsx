import { memo, useState } from "react";
import { LOCALES } from "@/types";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import useServerError from "@/hooks/useServerError";
import { fetchOrderReceipt } from "@/server-actions";
import { useQueryClient } from "@tanstack/react-query";
import { logOrderReceiptDownloadedEvent } from "@/analytics/Events";

interface IFileDownloadProps {
  id?: number;
  token?: string | null;
  orderNumber?: string;
}

const FileDownload = ({ id, token, orderNumber }: IFileDownloadProps) => {
  const queryClient = useQueryClient();
  const { handleServerError } = useServerError();
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation("translation", { keyPrefix: "tracking" });

  const handleDownloadFile = async () => {
    try {
      setIsLoading(true);

      const fileResponse = await queryClient.fetchQuery({
        queryKey: ["order-receipt", id, token],
        queryFn: () => {
          if (id && token) return fetchOrderReceipt(id, token, i18n.language.split("-")[0] as LOCALES, handleServerError);
        },
      });

      if (fileResponse) {
        const blob = await fileResponse.blob(); // Convert response to a Blob
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob

        // Create a download link
        const a = document.createElement("a");
        a.href = url;
        a.download = `order-${orderNumber}.pdf`; // Default filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Cleanup

        // Revoke the URL to free up memory
        window.URL.revokeObjectURL(url);

        toast({
          title: t("fileDownloaded"),
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: t("fileDownloadFailed"),
      });
    } finally {
      setIsLoading(false);
      if(orderNumber) {
        logOrderReceiptDownloadedEvent(orderNumber);
      }
    }
  };

  return (
    <Button variant="secondary" className="max-w-max" onClick={handleDownloadFile} disabled={isLoading || !id || !orderNumber || !token}>
      <Download />
      {t("download")}
    </Button>
  );
};

export default memo(FileDownload);