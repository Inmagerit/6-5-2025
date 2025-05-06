"use client";

import { ReactNode } from "react";

import { HousingList } from "./_components/list.layout";

export default function Page(): ReactNode {
    return (
        <div className="p-4 flex flex-col gap-4">
            <HousingList />
        </div>
    );
}
