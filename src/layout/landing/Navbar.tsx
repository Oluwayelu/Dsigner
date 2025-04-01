"use client";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import Link from "next/link";

const Navbar = () => {
	const pathname = usePathname();
	return (
		<div
			className={`${
				pathname == "/auth/register"
					? "border-b-primary-violet"
					: "border-b-primary-green"
			} w-full h-[10dvh] px-5 border-b`}
		>
			<div className="w-full h-full max-w-screen-xl mx-auto flex items-center justify-between">
				<Link href="/">
					<Logo />
				</Link>

				<div>
					<Link href="/auth/login">
						<Button
							className={`${
								pathname == "/auth/register"
									? "bg-primary-violet"
									: "bg-primary-green"
							} rounded-full font-semibold`}
						>
							Get started
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
