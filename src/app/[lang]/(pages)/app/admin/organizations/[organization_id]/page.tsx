import { ReactNode } from "react";

import { Content } from "./content";

export default function Page({
    params,
}: {
    params: {
        organization_id: string;
    };
}): ReactNode {
    return <Content organizationId={params.organization_id} />;
}
