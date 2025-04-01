/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import moment from "moment";
import { User, Users2Icon } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useReactMutation, useReactQuery } from "@/hooks/useReactQueryFn";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IDesign } from "@/models/Design";

export default function DashboardPage() {
	const router = useRouter();
	const { id } = useParams<{ id: string }>();
	// const [designs, setDesigns] = useState<any[]>([]);
	const { data, isLoading } = useReactQuery("dashboard", "/dashboard");
	const { mutate, isPending } = useReactMutation(
		"/user/teams/design/create",
		"post"
	);

	function createDesign() {
		mutate(
			{ team: id },
			{
				onSuccess: ({ data }) => {
					console.log(data);

					router.push(`/design/${data.data._id}`);
				},
				onError: (error) => {
					console.log(error);
					toast.error(error.response?.data.message || error.message);
				},
			}
		);
	}

	return (
		<SidebarInset>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">
									Building Your Application
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			{isLoading ? (
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<Skeleton className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10" />
						<Skeleton className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10" />
					</div>

					<div className="p-5 bg-slate-100/30 flex-1 rounded-xl md:min-h-min space-y-5 overflow-hidden">
						<div className="w-full flex items-center justify-between">
							<h1 className="text-xl font-semibold">Recent Designs</h1>

							<Button
								onClick={createDesign}
								className="bg-gradient-to-tr from-primary-green to-primary-violet hover:opacity-90 hover:scale-95 hover:transition-all hover:duration-500 hover:ease-in-out "
							>
								Create Design
							</Button>
						</div>
						<div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
							{[1, 2, 3].map((_, key) => (
								<Skeleton key={key} />
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="w-full h-40 flex flex-col p-3 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10 gap-2">
							<div className="h-12 w-12 flex justify-center items-center bg-primary-violet rounded-xl">
								<User className="w-6 h-6" />
							</div>

							<p className="text-lg font-normal">Personal designs</p>

							<div className="w-full flex justify-end">
								<h1 className="text-4xl font-semibold">10</h1>
							</div>
						</div>
						<div className="w-full h-40 flex flex-col p-3 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10 gap-2">
							<div className="h-12 w-12 flex justify-center items-center bg-primary-green rounded-xl">
								<Users2Icon className="w-6 h-6" />
							</div>

							<p className="text-lg font-normal">Team designs</p>

							<div className="w-full flex justify-end">
								<h1 className="text-4xl font-semibold">27</h1>
							</div>
						</div>
						{/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
					</div>
					<div className="p-5 h-[300vh] bg-slate-100/50 flex-1 rounded-xl md:min-h-min space-y-5 overflow-hidden">
						<div className="w-full flex items-center justify-between">
							<h1 className="text-xl font-semibold">Recent Designs</h1>

							<Button
								onClick={createDesign}
								className="bg-gradient-to-tr from-primary-green to-primary-violet hover:opacity-90 hover:scale-95 hover:transition-all hover:duration-500 hover:ease-in-out "
							>
								{isPending ? "Creating..." : "Create Design"}
							</Button>
							{/* <Dialog>
              <DialogContent></DialogContent>
            </Dialog> */}
						</div>
						<div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
							{data?.data &&
								data.data.data.designs.map((design: IDesign) => (
									<div
										key={design._id as string}
										className="w-full bg-white rounded-xl overflow-hidden"
									>
										<div className="w-full h-40 bg-gray-400"></div>
										<div className="p-2">
											<p className="text-sm text-gray-400">{design.title}</p>

											<div className="w-full flex justify-end text-gray-500">
												<p className="text-xs">
													last edited:{" "}
													{moment(new Date(design.lastEdited)).fromNow()}
												</p>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</SidebarInset>
	);
}
