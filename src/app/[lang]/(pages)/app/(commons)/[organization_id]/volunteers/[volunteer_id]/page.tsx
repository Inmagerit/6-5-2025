import { ReactNode } from "react";

import { Content } from "./content";

export default function Page({
    params,
}: {
    params: {
        volunteer_id: string;
    };
}): ReactNode {
    return <Content volunteerId={params.volunteer_id} />;
}
