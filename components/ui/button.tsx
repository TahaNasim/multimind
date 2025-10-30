"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "ghost" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-blue-600 hover:bg-blue-700 text-white",
          variant === "ghost" && "bg-transparent hover:bg-gray-800 text-white",
          variant === "outline" && "border border-gray-600 hover:bg-gray-700",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
