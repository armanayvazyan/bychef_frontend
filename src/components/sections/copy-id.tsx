import { Copy } from "lucide-react";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const CopyId = ({ id }: { id?: string }) => {
  const { toast } = useToast();

  const handleCopyId = useCallback(async () => {
    if (id) {
      await navigator.clipboard.writeText(id);

      toast({
        title: "Order id copied to clipboard!",
      });
    }
  }, [id, toast]);

  return (
    <div className="flex gap-2 items-center cursor-pointer" onClick={handleCopyId}>
      <p className="text-primary font-bold">#{id}</p>
      <Copy size={16}/>
    </div>
  );
};

export default CopyId;