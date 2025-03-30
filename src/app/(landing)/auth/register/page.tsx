"use client";
import Link from "next/link";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReactMutation } from "@/hooks/useReactQueryFn";
import { toast } from "sonner";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters",
    }),
    email: z.string().email("Email is not valid"),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

const RegisterPage = () => {
  const { mutate, isPending } = useReactMutation("/auth/register", "post");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values, {
      onSuccess: ({ data }) => {
        console.log(data);
        toast.success(data.message || "Registration successfull");
      },
      onError: (error) => {
        console.log(error.response?.data.message);
        toast.error(error.response?.data.message || error.message);
      },
    });
  }

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-2/3 h-full bg-primary-violet"></div>

      <div className="w-1/3 p-5 md:p-10 flex flex-col space-y-5">
        <h1 className="text-3xl font-mono font-semibold">Register</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm password"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              icon
              type="submit"
              loading={isPending}
              disabled={isPending}
              className="w-full bg-primary-violet font-semibold"
            >
              Register
            </Button>
            <p className="text-sm">
              Already have an account,{" "}
              <Link href="/auth/login" className="text-primary-violet">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
