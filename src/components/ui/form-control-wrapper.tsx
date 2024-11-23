import { cloneElement, ReactElement } from "react";
import { FormControl, useFormField } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface IFormControlItemProps {
  className?: string;
  children: ReactElement;
  valuePropName?: string;
  field: ControllerRenderProps;
  customFields?: { key: string; value: string }[];
}

const FormControlWrapper = ({
  field,
  children,
  customFields,
  valuePropName
}: IFormControlItemProps) => {
  const { error } = useFormField();
  const propNameValue = valuePropName ?? "value";

  const customFieldProps = customFields?.reduce(
    (acc: any, current: { key: string; value: string | number; }) => ({
      ...acc,
      // @ts-expect-error temp solution
      [current.key]: field[current.value]
    }),
    {}
  );

  return (
    <FormControl>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
      {cloneElement(children, {
        ...children.props,
        hasError: Boolean(error),
        [propNameValue]: field.value,
        ...customFieldProps,
        ...field
      })}
    </FormControl>
  );
};

export default FormControlWrapper;
