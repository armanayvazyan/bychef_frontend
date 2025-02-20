import { ReactElement, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import FormControlWrapper from "@/components/ui/form-control-wrapper";
import FormItemErrorMessage from "@/components/ui/form-error-message";
import { FormItem, FormLabel, FormField, FormDescription } from "@/components/ui/form";

interface IFormItemWrapperProps {
  children: ReactElement;
  name: string;
  label?: ReactNode;
  className?: string;
  description?: string;
  valuePropName?: string;
  requiredAsterisk?: boolean;
  customFields?: { key: string; value: string }[];
}

const FormItemWrapper = ({
  name,
  label,
  children,
  className,
  description,
  customFields,
  valuePropName,
  requiredAsterisk = false,
}: IFormItemWrapperProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-primary font-semibold text-sm leading-tight flex gap-1">
              {label}
              {requiredAsterisk && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControlWrapper
            field={field}
            customFields={customFields}
            valuePropName={valuePropName}>
            {children}
          </FormControlWrapper>
          {description && <FormDescription>{description}</FormDescription>}
          <FormItemErrorMessage className="text-sm" />
        </FormItem>
      )}
    />
  );
};

export default FormItemWrapper;
