import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page({
    params,
}: {
    params: {
        housing_id: string;
    };
}): ReactNode {
    return (
        <div className="w-full h-max p-4 grid grid-cols-2 gap-4 lg:flex">
            <Form housingId={params.housing_id} />
        </div>
    );
}
