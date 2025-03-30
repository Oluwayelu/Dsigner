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
import { useRouter } from "next/navigation";
import { ITeam } from "@/models/Team";

const formSchema = z.object({
  identifier: z.string().min(2, {
    message: "Field must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const router = useRouter();
  const { mutate, isPending } = useReactMutation("/auth/login", "post");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values, {
      onSuccess: ({ data }) => {
        console.log(data);
        const defaultTeam = data.data.teams.filter(
          (team: ITeam) => team.type === "default"
        );
        console.log(defaultTeam[0]);

        const redirect = data.data.isOnboarded
          ? `/teams/${defaultTeam[0]._id}`
          : "/onboarding";

        toast.success(data.message || "Login successfull");
        router.push(redirect);
      },
      onError: (error) => {
        console.log(error.response?.data.message);
        toast.error(error.response?.data.message || error.message);
      },
    });
  }

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-1/3 p-5 md:p-10 flex flex-col space-y-5">
        <h1 className="text-3xl font-mono font-semibold">Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email/Username"
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

            <Button
              icon
              type="submit"
              loading={isPending}
              disabled={isPending}
              className="w-full bg-primary-green font-semibold"
            >
              Login
            </Button>
            <p className="text-sm">
              Don&apos;t have an account,{" "}
              <Link href="/auth/register" className="text-primary-green">
                Register
              </Link>
            </p>
          </form>
        </Form>
      </div>

      <div className="w-2/3 h-full bg-primary-green"></div>
    </div>
  );
};

export default LoginPage;
