"use client";

import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page({
    params,
}: {
    params: {
        product_id: string;
    };
}): ReactNode {
    return <Form productId={params.product_id} />;
}
