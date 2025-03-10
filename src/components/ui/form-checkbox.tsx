import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface IFormCheckboxProps {
  name: string;
  title: string;
}

const FormCheckbox = ({ name, title }: IFormCheckboxProps) => {
  const form = useFormContext();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="!m-0">
            {title}
          </FormLabel>
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;