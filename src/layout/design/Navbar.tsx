/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Image from "next/image";
// import { memo } from "react";

// import { navElements } from "@/constants";
// import { ActiveElement, NavbarProps } from "@/types/type";

// import { Button } from "./ui/button";
// import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "@/components/users/ActiveUsers";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import ShapesMenu from "@/components/ShapesMenu";
import { NewThread } from "@/components/comments/NewThread";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { memo } from "react";
// import { NewThread } from "./comments/NewThread";

const Navbar = ({
	activeElement,
	imageInputRef,
	handleImageUpload,
	handleActiveElement,
}: NavbarProps) => {
	const isActive = (value: string | Array<ActiveElement>) =>
		(activeElement && activeElement.value === value) ||
		(Array.isArray(value) &&
			value.some((val) => val?.value === activeElement?.value));

	return (
		<div className="w-full h-[10dvh] bg-primary-black px-5 text-white">
			<div className="w-full h-full flex select-none items-center justify-between gap-4">
				<Link href="/">
					<Logo />
				</Link>

				<ul className="flex flex-row">
					{navElements.map((item: ActiveElement | any) => (
						<li
							key={item.name}
							onClick={() => {
								if (Array.isArray(item.value)) return;
								handleActiveElement(item);
							}}
							className={`group px-2.5 py-5 flex justify-center items-center
            ${
							isActive(item.value)
								? "bg-primary-green"
								: "hover:bg-primary-grey-200"
						}
            `}
						>
							{Array.isArray(item.value) ? (
								<ShapesMenu
									item={item}
									activeElement={activeElement}
									imageInputRef={imageInputRef}
									handleActiveElement={handleActiveElement}
									handleImageUpload={handleImageUpload}
								/>
							) : item?.value === "comments" ? (
								<NewThread>
									<Button className="relative w-5 h-5 object-contain">
										<Image
											src={item.icon}
											alt={item.name}
											fill
											className={isActive(item.value) ? "invert" : ""}
										/>
									</Button>
								</NewThread>
							) : (
								<Button className="relative w-5 h-5 object-contain">
									<Image
										src={item.icon}
										alt={item.name}
										fill
										className={isActive(item.value) ? "invert" : ""}
									/>
								</Button>
							)}
						</li>
					))}
				</ul>

				<ActiveUsers />
			</div>
		</div>
	);
};

export default memo(
	Navbar,
	(prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);

// export default Navbar;
