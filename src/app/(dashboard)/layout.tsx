import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dsigner",
	description: "Generated by create next app",
};

export default function LandingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
