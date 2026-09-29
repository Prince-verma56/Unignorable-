import { forwardRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { Magnetic } from "../Magnetic";
import { cn } from "@/lib/utils";

/**
 * The isolated arrow. A square micro-container separated from the label by the
 * button's own gap, so the control reads as `[ LABEL    ↗ ]` rather than as a
 * label with a glyph stuck to it.
 *
 * It inherits colour, and the base button styles drive its displacement, so it
 * needs no state of its own.
 */
export function ArrowTag({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ml-1 grid size-6 place-items-center border border-current/35 transition-colors duration-[320ms]",
        className,
      )}
    >
      <ArrowUpRight data-arrow className="size-3" />
    </span>
  );
}

export interface ActionProps extends ButtonProps {
  children: ReactNode;
  /** Renders the arrow micro-container. On by default. */
  arrow?: boolean;
  /**
   * Pointer attraction, desktop only. Capped low on purpose — a control that
   * chases the cursor reads as a toy.
   */
  magnetic?: boolean;
  wrapperClassName?: string;
}

/**
 * The primary action. `asChild` composes it onto a router `Link` or an anchor:
 *
 *     <Action asChild><Link to="/contact">Start a project</Link></Action>
 *
 * When `asChild` is used the arrow has to be placed by the caller inside the
 * child, since the child owns the element.
 */
export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  ({ children, arrow = true, magnetic = true, className, wrapperClassName, ...props }, ref) => {
    /*
     * Radix `Slot` requires exactly one element child, and it counts a `null`
     * as a second one. So when `asChild` is set the caller owns the element and
     * places `<ArrowTag />` inside it themselves; nothing is appended here.
     */
    const withArrow = arrow && !props.asChild;
    const button = (
      <Button ref={ref} className={className} {...props}>
        {withArrow ? (
          <>
            {children}
            <ArrowTag />
          </>
        ) : (
          children
        )}
      </Button>
    );

    if (!magnetic) return button;
    return (
      <Magnetic strength={0.12} max={7} className={wrapperClassName}>
        {button}
      </Magnetic>
    );
  },
);
Action.displayName = "Action";

/**
 * The secondary action — deliberately not a second filled button, so the
 * hierarchy between the two CTAs is unmistakable at a glance.
 *
 * A rule sits under the label and grows from 2.5rem to full width on hover
 * while the label shifts a few pixels and the arrow leaves with it.
 */
export function ActionLink({
  children,
  className,
  asChild: _asChild,
  ...props
}: {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("group/link inline-flex flex-col items-start gap-2", className)}
      {...props}
    >
      <span className="type-meta inline-flex items-center gap-2.5 transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-[3px]">
        {children}
        <ArrowUpRight
          data-arrow
          aria-hidden="true"
          className="size-3.5 transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-[3px] group-hover/link:-translate-y-[3px]"
        />
      </span>
      <span
        aria-hidden="true"
        className="h-px w-10 bg-current/45 transition-[width,background-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:w-full group-hover/link:bg-current"
      />
    </span>
  );
}
