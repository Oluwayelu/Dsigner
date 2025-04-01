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

import { NavMain } from "@/components/nav-main";
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
import { Input } from "./ui/input";
import { useReactQuery } from "@/hooks/useReactQueryFn";

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
	const { isLoading, data: queryData } = useReactQuery(
		"profile",
		"/user/profile"
	);

	console.log(isLoading, !isLoading && queryData?.data.data);
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={queryData?.data.data.teams} />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Input type="search" placeholder="Searching..." />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<NavProjects projects={data.projects} />
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={queryData?.data.data} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
