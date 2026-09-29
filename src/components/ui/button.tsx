import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The button system. See /brain/DESIGN_SYSTEM.md.
 *
 * Architectural, not SaaS: 2px radius, generous horizontal padding, meta type
 * with its full tracking, a hairline rather than a shadow. Nothing here uses
 * `rounded-md`, a drop shadow or a gradient — those were the shadcn defaults
 * and they read as a component library rather than as this studio.
 *
 * Shared behaviour lives in the base: an `[data-arrow]` child displaces on
 * hover, and the whole control compresses very slightly on press, so every
 * variant feels like the same physical object.
 */
const buttonVariants = cva(
  [
    "group/btn relative inline-flex cursor-pointer items-center justify-center gap-3 whitespace-nowrap",
    "type-meta rounded-[2px] select-none",
    "transition-[background-color,color,border-color,transform] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:scale-[0.985]",
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "[&_[data-arrow]]:transition-transform [&_[data-arrow]]:duration-[320ms] [&_[data-arrow]]:ease-[cubic-bezier(0.16,1,0.3,1)]",
    "hover:[&_[data-arrow]]:translate-x-[3px] hover:[&_[data-arrow]]:-translate-y-[3px]",
  ],
  {
    variants: {
      variant: {
        /** The page's primary action: the anchor, inverting to lime on hover. */
        default: "bg-ink text-ink-foreground hover:bg-acid hover:text-acid-foreground",
        /** For use on an ink field, where the inversion runs the other way. */
        inverse: "bg-bone text-ink hover:bg-acid hover:text-acid-foreground",
        /** The lime field itself — already the accent, so it settles to ink. */
        accent: "bg-acid text-acid-foreground hover:bg-ink hover:text-ink-foreground",
        /** A hairline control that fills on hover. */
        outline:
          "border border-border-strong bg-transparent text-foreground hover:border-transparent hover:bg-ink hover:text-ink-foreground",
        ghost: "bg-transparent text-foreground hover:bg-foreground/[0.06]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /** Kept for the shadcn surface area the form primitives rely on. */
        secondary: "bg-secondary text-secondary-foreground hover:bg-foreground/[0.08]",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5",
        lg: "h-14 px-9",
        /** A square micro-container for an isolated arrow. */
        icon: "size-12 px-0",
        iconSm: "size-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
