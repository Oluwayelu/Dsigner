import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const logoVariants = cva("font-semibold font-mono cursor-pointer", {
  variants: {
    size: {
      default: "text-xl",
      sm: "text-sm",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
}

const Logo = ({ size, className }: LogoProps) => {
  return (
    <p className={cn(logoVariants({ size, className }))}>
      D<span className="text-primary-green">si</span>
      <span className="text-primary-violet">gn</span>er
    </p>
  );
};

export default Logo;
