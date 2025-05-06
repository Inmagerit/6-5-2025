import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): ReactNode {
    return <Form beneficiaryId={params.beneficiary_id} />;
}
