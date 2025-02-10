import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>{t("generic.clearCartTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t("generic.clearCartDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full sm:justify-between mt-6">
          <AlertDialogCancel className="flex-1" onClick={declineAction}>{t("generic.keepCart")}</AlertDialogCancel>
          <AlertDialogAction className="flex-1" onClick={acceptAction}>{t("generic.clearCart")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearCartModal;