import { Form } from "@/components/ui/form";
import { HTMLAttributes, ReactNode } from "react";
import { SubmitHandler } from "react-hook-form";

export interface IFormProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: any;
  onSubmit: SubmitHandler<FormData>;
  children: ReactNode | ReactNode[];
}

const FormWrapper = ({ form, onSubmit, children, ...props }: IFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </Form>
  );
};

export default FormWrapper;
