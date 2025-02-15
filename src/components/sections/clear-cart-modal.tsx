import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface IClearCartModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  acceptAction: () => void;
  declineAction: () => void;
}

const ClearCartModal = ({ open, setOpen, acceptAction, declineAction }: IClearCartModal) => {
  const { t } = useTranslation("translation");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle className="mb-4">{t("generic.clearCartTitle")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("generic.clearCartDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full gap-2 sm:justify-between mt-6">
          <Button className="flex-1" variant="outline" onClick={declineAction}>{t("generic.keepCart")}</Button>
          <Button className="flex-1" onClick={acceptAction}>{t("generic.clearCart")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearCartModal;