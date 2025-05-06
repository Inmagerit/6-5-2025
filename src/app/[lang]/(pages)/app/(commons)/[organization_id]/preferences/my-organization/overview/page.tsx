import { ReactNode } from "react";

import { Form } from "./form.layout";

export default function Page(): ReactNode {
    return (
        <div className="w-full h-[calc(100vh-260px)] p-4 border-[1px] border-slate-200 rounded-md overflow-x-hidden overflow-y-scroll mt-4">
            <Form />
        </div>
    );
}
