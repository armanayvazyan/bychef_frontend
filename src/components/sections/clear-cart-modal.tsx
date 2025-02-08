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

interface IClearCartModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  acceptAction: () => void;
  declineAction: () => void;
}

const ClearCartModal = ({ open, setOpen, acceptAction, declineAction }: IClearCartModal) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will clear your current cart
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full sm:justify-between mt-6">
          <AlertDialogCancel className="flex-1" onClick={declineAction}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="flex-1" onClick={acceptAction}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearCartModal;