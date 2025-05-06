import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page(): ReactNode {
    return (
        <div className="flex flex-col">
            <Form />
        </div>
    );
}
