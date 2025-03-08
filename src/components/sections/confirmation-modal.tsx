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
  contentKeys: {
    title: string;
    description: string;
    positiveButtonText: string;
    negativeButtonText: string;
  }
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  positiveAction: () => void;
  negativeAction: () => void;
}

const ConfirmationModal = ({
  contentKeys,
  open,
  setOpen,
  positiveAction,
  negativeAction
}: IClearCartModal) => {
  const { t } = useTranslation("translation");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle className="mb-4">{t(contentKeys.title)}</DialogTitle>
          <DialogDescription className="text-center">
            {t(contentKeys.description)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-wrap w-full gap-2 sm:justify-between mt-6">
          <Button className="flex-1 !mx-0" variant="outline" onClick={negativeAction}>{t(contentKeys.negativeButtonText)}</Button>
          <Button className="flex-1 !mx-0" onClick={positiveAction}>{t(contentKeys.positiveButtonText)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;