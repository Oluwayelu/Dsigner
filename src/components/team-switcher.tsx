"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Users, User } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { ITeam } from "@/models/Team";
import { Skeleton } from "./ui/skeleton";
import { DialogTitle } from "@radix-ui/react-dialog";

export function TeamSwitcher({
	teams,
	setOpen,
}: {
	teams: ITeam[];
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { isMobile } = useSidebar();
	const [activeTeam, setActiveTeam] = React.useState<ITeam | null>(null);

	React.useEffect(() => {
		setActiveTeam(teams ? teams[0] : null);
	}, [teams]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						{teams ? (
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div
									className={`${
										activeTeam?.type === "default"
											? "bg-primary-violet"
											: "bg-primary-green"
									} flex aspect-square size-8 items-center justify-center rounded-lg text-black`}
								>
									{activeTeam?.type === "default" ? (
										<User className="size-4" />
									) : (
										<Users className="size-4" />
									)}
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{activeTeam && activeTeam.name}
									</span>
									<span className="truncate text-xs">
										{activeTeam && activeTeam.plan}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						) : (
							<Skeleton />
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Teams
						</DropdownMenuLabel>
						{teams ? (
							teams.map((team) => (
								<DropdownMenuItem
									key={team.name}
									onClick={() => setActiveTeam(team)}
									className="gap-2 p-2 focus:bg-primary-green/50 focus:text-black"
								>
									<div className="flex size-6 items-center justify-center rounded-sm border border-black/70">
										{team?.type === "default" ? (
											<User className="size-4" />
										) : (
											<Users className="size-4" />
										)}
									</div>
									{team.name}
								</DropdownMenuItem>
							))
						) : (
							<DropdownMenuItem className="gap-2 p-2 focus:bg-primary-green/50 focus:text-black">
								<Skeleton className="flex size-6 items-center justify-center rounded-sm border" />
								<Skeleton className="flex size-6 items-center justify-center rounded-sm border" />
							</DropdownMenuItem>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setOpen((prev) => !prev)}
							className="gap-2 p-2 focus:bg-primary-green/50 focus:text-black"
						>
							<div className="flex size-6 items-center justify-center rounded-md border border-black">
								<Plus className="size-4" />
							</div>
							<div className="font-medium text-muted-foreground">
								Create new team
							</div>
						</DropdownMenuItem>
						{/* <Dialog>
							<DialogTrigger asChild>
							
							</DialogTrigger>

							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create a new team</DialogTitle>
									<DialogDescription>create a new team</DialogDescription>
								</DialogHeader>

								<div></div>
							</DialogContent>
						</Dialog> */}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
