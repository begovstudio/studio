import { useForm } from "react-hook-form";
import { useForm as useFormSpree } from "@formspree/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TSubscribeNewsletterSchema,
  subscribeNewsletterSchema,
} from "@/lib/types";

type SubscribeProps = {
  formClassName?: string;
  formFieldsClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export default function NewsletterSignUp({
  formClassName,
  formFieldsClassName,
  inputClassName,
  buttonClassName,
}: SubscribeProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TSubscribeNewsletterSchema>({
    resolver: zodResolver(subscribeNewsletterSchema),
  });

 const [state, submitSpree] = useFormSpree<TSubscribeNewsletterSchema>(
    "mzzveraz"
  );

    const onSubmit = async (data: TSubscribeNewsletterSchema) => {
    await submitSpree({ email: data.email });

    if (state.succeeded) {
      reset();
    } else if (state.errors) {
      const emailErrors = state.errors.getFieldErrors("email");
      if (emailErrors.length > 0) {
        setError("email", { type: "server", message: emailErrors[0].message });
      }
    }
   
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${formClassName}`}>
      <div className={`${formFieldsClassName}`}>
        <Input
          {...register("email")}
          className={`mb-2 ${inputClassName}`}
          type="text"
          placeholder="Email"
          name="email"
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className={`disabled:cursor-none ${buttonClassName}`}
        >
          Оставить!
        </Button>
      </div>
      {state.succeeded && (
        <p className="text-green-700 bg-green-100 mb-2">Заявка отправлена!</p>
      )}
      {errors.email && (
        <p className="text-red-500 mb-2">{`${errors.email.message}`}</p>
      )}
    </form>
  );
}
