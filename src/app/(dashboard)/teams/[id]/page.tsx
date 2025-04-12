/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import moment from "moment";
import Link from "next/link";
import { User, Users2Icon, FilePlus2 } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useReactMutation, useReactQuery } from "@/hooks/useReactQueryFn";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { IDesign } from "@/models/Design";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

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

	console.log("dashbdata: ", data);
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
						<Skeleton className="w-3/4 h-20 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10" />
					</div>

					<div className="sticky top-0 inset-x-0 flex-1 md:min-h-min space-y-3 overflow-hidden">
						<div className="w-full flex items-center justify-between">
							<Skeleton className="w-40 h-3" />
						</div>
						<div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
							{[1, 2, 3].map((_, key) => (
								<Skeleton key={key} />
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="w-full h-40 flex flex-col p-3 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10 gap-2">
							<div className="h-12 w-12 flex justify-center items-center bg-primary-violet rounded-xl">
								<User className="w-6 h-6" />
							</div>

							<p className="text-lg font-normal">Personal designs</p>

							<div className="w-full flex justify-end">
								<h1 className="text-4xl font-semibold">
									{data?.data.data.personalDesigns || 0}
								</h1>
							</div>
						</div>
						<div className="w-full h-40 flex flex-col p-3 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10 gap-2">
							<div className="h-12 w-12 flex justify-center items-center bg-primary-green rounded-xl">
								<Users2Icon className="w-6 h-6" />
							</div>

							<p className="text-lg font-normal">Team designs</p>

							<div className="w-full flex justify-end">
								<h1 className="text-4xl font-semibold">
									{data?.data.data.teamDesigns || 0}
								</h1>
							</div>
						</div>
						<div
							onClick={createDesign}
							className="w-3/4 h-fit flex flex-col p-3 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-violet/10 gap-2 cursor-pointer"
						>
							<div className="h-12 w-12 flex justify-center items-center bg-gradient-to-br from-primary-green to-primary-violet rounded-xl">
								<FilePlus2 className="w-6 h-6" />
							</div>

							<p className="text-lg font-normal">
								{isPending ? "Creating..." : "Create Design"}
							</p>
						</div>
						<Dialog open={isPending}>
							<DialogContent className="w-4/5 md:w-1/2 xl:w-1/3 bg-gradient-to-br from-primary-green/10 to-primary-violet/10">
								<DialogHeader>
									<DialogTitle>Creating design...</DialogTitle>
									<DialogDescription>
										Please wait a little bit while we create your design
										interface
									</DialogDescription>
								</DialogHeader>
								<div className="w-full hit">
									<Loading size="lg" />
								</div>
							</DialogContent>
						</Dialog>
						{/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
					</div>

					<div className="sticky top-0 inset-x-0 flex-1 md:min-h-min space-y-3 overflow-hidden">
						<div className="w-full flex items-center justify-between">
							<h1 className="text-sm font-medium">Recent Designs</h1>
						</div>
						<div className="grid auto-rows-min gap-6 md:grid-cols-2 xl:grid-cols-3 ">
							{data?.data &&
								data.data.data.designs.map((design: IDesign) => (
									<Link
										key={design._id as string}
										href={`/design/${design._id}`}
									>
										<div className="w-full border border-primary-violet bg-gradient-to-br from-primary-green/10 to-primary-violet/10 rounded-xl overflow-hidden">
											<div className="w-full h-40 bg-slate-400 relative">
												<Image
													src={`/previews/${design._id}.jpg`}
													alt={design.title}
													fill
													className="object-cover object-center"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
													onError={(e) => {
														// Hide the image on error
														const target = e.target as HTMLImageElement;
														target.style.display = "none";
													}}
												/>
											</div>
											<div className="p-2">
												<p className="text-sm text-gray-400">
													{design.title}
													{design.isDraft ? " (draft)" : ""}
												</p>

												<div className="w-full flex justify-end text-gray-500">
													<p className="text-xs">
														last edited:{" "}
														{moment(new Date(design.lastEdited)).fromNow()}
													</p>
												</div>
											</div>
										</div>
									</Link>
								))}
						</div>
					</div>
				</div>
			)}
		</SidebarInset>
	);
}
