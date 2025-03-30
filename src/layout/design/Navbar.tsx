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
import { ActiveElement } from "@/types/type";
import ShapesMenu from "@/components/ShapesMenu";
// import { NewThread } from "./comments/NewThread";

const Navbar = () => {
  // const isActive = (value: string | Array<ActiveElement>) =>
  //   (activeElement && activeElement.value === value) ||
  //   (Array.isArray(value) &&
  //     value.some((val) => val?.value === activeElement?.value));

  return (
    <div className="w-full h-[10dvh] bg-primary-black px-5 text-white">
      <div className="w-full h-full max-w-screen-xl mx-auto flex select-none items-center justify-between gap-4">
        <Link href="/">
          <Logo />
        </Link>

        <ul className="flex flex-row">
          {navElements.map((item: ActiveElement | any) => (
            <li key={item.name}>
              {Array.isArray(item.value) ? (
                <ShapesMenu item={item} />
              ) : item?.value === "comments" ? (
                <div></div>
              ) : (
                <button></button>
              )}
            </li>
          ))}
        </ul>

        <ActiveUsers />
      </div>
    </div>
  );
};

// export default memo(
//   Navbar,
//   (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
// );

export default Navbar;
