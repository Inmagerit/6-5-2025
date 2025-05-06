import { ReactNode } from "react";

import { Content } from "./content";

export default function Page({
    params,
}: {
    params: {
        housing_id: string;
    };
}): ReactNode {
    return <Content housingId={params.housing_id} />;
}
