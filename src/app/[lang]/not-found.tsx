import { ReactNode } from "react";

export default function NotFound(): ReactNode {
    return (
        <div className="flex flex-col gap-3 items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-center">Not Found</h1>
        </div>
    );
}
