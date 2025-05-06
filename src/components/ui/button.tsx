import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
    {
        variants: {
            variant: {
                default: "bg-relif-orange-200 text-white hover:bg-relif-orange-300",
                destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
                outline:
                    "border border-relif-orange-200 bg-white text-relif-orange-200 hover:border-relif-orange-400 hover:text-relif-orange-400",
                icon: "border border-slate-300 bg-white text-slate-600 hover:border-relif-orange-200 hover:text-relif-orange-200",
                secondary:
                    "bg-relif-orange-200/10 text-relif-orange-200 hover:bg-relif-orange-200/30 hover:text-relif-orange-300",
                ghost: "text-relif-orange-200 hover:bg-relif-orange-200/10 hover:text-relif-orange-300",
                link: "w-max text-relif-orange-200 underline-offset-4 underline hover:text-relif-orange-300",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
