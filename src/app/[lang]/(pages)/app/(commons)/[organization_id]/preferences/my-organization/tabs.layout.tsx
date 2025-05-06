"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const TabsLayout = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const pathname = usePathname();
    const platformRole = usePlatformRole();
    const dict = useDictionary();

    const activeOption = pathname.split("/")[6] ?? "platform";
    const urlPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <Tabs defaultValue={activeOption} className="w-full">
            <TabsList>
                <TabsTrigger value="overview" asChild>
                    <Link href={`${urlPath}/overview`}>
                        {dict.commons.preferences.myOrganization.overview.tab}
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="users" asChild>
                    <Link href={`${urlPath}/users`}>
                        {dict.commons.preferences.myOrganization.users.tab}
                    </Link>
                </TabsTrigger>
                {platformRole === "ORG_ADMIN" && (
                    <>
                        <TabsTrigger value="invites" asChild>
                            <Link href={`${urlPath}/invites`}>
                                {dict.commons.preferences.myOrganization.invites.tab}
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="others" asChild>
                            <Link href={`${urlPath}/others`}>
                                {dict.commons.preferences.myOrganization.others.tab}
                            </Link>
                        </TabsTrigger>
                    </>
                )}
            </TabsList>
            {children}
        </Tabs>
    );
};

export { TabsLayout };
