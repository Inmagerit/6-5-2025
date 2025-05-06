import { ReactNode } from "react";

import { CreateOrganization } from "../createOrganization.layout.";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-[calc(100vh-83px)] flex items-center justify-center">
            <CreateOrganization />
        </div>
    );
}
