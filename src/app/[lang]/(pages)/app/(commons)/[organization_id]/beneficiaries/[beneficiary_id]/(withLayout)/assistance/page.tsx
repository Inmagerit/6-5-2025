import { ReactNode } from "react";

import { Content } from "./content";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return <Content beneficiaryId={params.beneficiary_id} />;
}
