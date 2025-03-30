/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
// import { memo } from "react";

// import { navElements } from "@/constants";
// import { ActiveElement, NavbarProps } from "@/types/type";

// import { Button } from "./ui/button";
// import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";
// import { NewThread } from "./comments/NewThread";

const Navbar = () => {
  // const isActive = (value: string | Array<ActiveElement>) =>
  //   (activeElement && activeElement.value === value) ||
  //   (Array.isArray(value) &&
  //     value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="w-full flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
      <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20} />

      <ActiveUsers />
    </nav>
  );
};

// export default memo(
//   Navbar,
//   (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
// );

export default Navbar;

