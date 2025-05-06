"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const activeOption = pathname.split("/")[6] ?? "overview";
    const urlPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <Tabs defaultValue={activeOption} className="w-full">
            <TabsList>
                <TabsTrigger value="overview" asChild>
                    <Link href={`${urlPath}`}>
                        {dict.commons.beneficiaries.beneficiaryId.tabsLayout.overview}
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="assistance" asChild>
                    <Link href={`${urlPath}/assistance`}>
                        {dict.commons.beneficiaries.beneficiaryId.tabsLayout.assistance}
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="movements" asChild>
                    <Link href={`${urlPath}/movements`}>
                        {dict.commons.beneficiaries.beneficiaryId.tabsLayout.movements}
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export { TabsLayout };
