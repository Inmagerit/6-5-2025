import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page({
    params,
}: {
    params: {
        volunteer_id: string;
    };
}): ReactNode {
    return <Form volunteerId={params.volunteer_id} />;
}
