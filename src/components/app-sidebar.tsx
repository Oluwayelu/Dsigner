"use client";

import * as React from "react";
import {
	AudioWaveform,
	// BookOpen,
	// Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	// Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

// import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	// DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useReactQuery } from "@/hooks/useReactQueryFn";
import { DialogTitle } from "@radix-ui/react-dialog";

// This is sample data.
const data = {
	user: {
		name: "Ifeoluwa Oluwayelu",
		email: "oluwayeluifeoluwa@gmail.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Free",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "History",
					url: "#",
				},
				{
					title: "Starred",
					url: "#",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Organization",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Recent",
			url: "/dashboard/recents",
			icon: Frame,
		},
		{
			name: "Drafts",
			url: "#",
			icon: PieChart,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [open, setOpen] = React.useState(false);
	const { data: queryData } = useReactQuery("profile", "/user/profile");

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher setOpen={setOpen} teams={queryData?.data.data.teams} />
			</SidebarHeader>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create team</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Input type="search" placeholder="Searching..." />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<NavProjects projects={data.projects} />
				{/* <NavMain items={data.navMain} /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={queryData?.data.data} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
