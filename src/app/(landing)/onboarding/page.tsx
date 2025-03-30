"use client";

// import Link from "next/link";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReactMutation, useReactQuery } from "@/hooks/useReactQueryFn";

const formSchema = z.object({
  fullName: z.string(),
  bio: z.string().min(20, {
    message: "Bio must be at least 20 characters.",
  }),
  avatar: z.string().optional(),
  email: z.boolean(),
  inApp: z.boolean(),
});

const OnboardingPage = () => {
  const router = useRouter();
  const { isLoading, data } = useReactQuery("profile", "/user/profile");
  const { mutate, isPending } = useReactMutation("/user/onboarding", "post");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      avatar: "",
      fullName: "",
      email: false,
      inApp: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: ({ data }) => {
        console.log(data);

        toast.success(data.message || "User onboarded successfully!");
        router.push(`/teams/${data.data.teams[0]}`);
      },
      onError: (error) => {
        console.log(error.response?.data.message);
        toast.error(error.response?.data.message || error.message);
      },
    });
  }

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-1/2 h-full p-5 md:p-10 flex flex-col justify-start space-y-5">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-mono font-semibold">
                Welcome {data?.data?.data.username},
              </h1>
              <p>Put in your details to get started</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fullname</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Jane Doe"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your bio"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex justify-end">
                  <Button
                    icon
                    type="submit"
                    loading={isPending}
                    disabled={isPending}
                    className="w-fit bg-primary-green font-semibold"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>

      <div className="w-1/2 h-full bg-gradient-to-br from-primary-green to-primary-violet"></div>
    </div>
  );
};

export default OnboardingPage;
