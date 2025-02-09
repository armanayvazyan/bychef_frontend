import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

const FormItemErrorMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { t } = useTranslation("translation");
    const { error, formMessageId } = useFormField();
    const errorMsg = error ? error.message : children;

    if (!errorMsg) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("typo-caption text-red-700", className)}
        {...props}>
        {/* eslint-disable-next-line @typescript-eslint/no-base-to-string */}
        {t(`errors.${errorMsg}`)}
      </p>
    );
  }
);

FormItemErrorMessage.displayName = "FormItemErrorMessage";

export default FormItemErrorMessage;
