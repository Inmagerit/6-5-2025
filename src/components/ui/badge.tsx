import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ReactNode } from "react";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-relif-orange-200 text-white hover:bg-relif-orange-300",
                secondary: "border-transparent bg-slate-900 text-white hover:bg-slate-600",
                outline: "border-relif-orange-200 text-relif-orange-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface IBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: IBadgeProps): ReactNode {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
