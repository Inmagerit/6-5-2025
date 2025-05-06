"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { ReactNode } from "react";
import { MdError } from "react-icons/md";

const Error = (): ReactNode => {
    const dict = useDictionary();

    return (
        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
            <MdError />
            {dict.admin.organizations.organizationId.error.message}
        </span>
    );
};

export default Error;
