"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getDataAccessGrants } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";

const OrgSelector = (): ReactNode => {
    const pathname = usePathname();
    const router = useRouter();
    const dict = useDictionary();

    const [orgs, setOrgs] = useState<{ count: number; data: any[] } | null>(null);
    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const organizationId = pathname.split("/")[3];

    useEffect(() => {
        (async () => {
            try {
                const user: UserSchema = await getFromLocalStorage("r_ud");
                if (user && user.organization_id) {
                    const OFFSET = 0;
                    const LIMIT = 9999;
                    const { data: organizations } = await getDataAccessGrants(
                        user.organization_id,
                        OFFSET,
                        LIMIT
                    );
                    setCurrentUser(user);
                    setOrgs(organizations);
                } else {
                    throw new Error();
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const handleSetOrganization = (newOrgId: string) => {
        router.push(pathname.split("/").slice(0, 3).join("/").concat(`/${newOrgId}`));
    };

    if (currentUser && currentUser.organization_id && orgs && orgs.count > 0) {
        return (
            <div className="flex flex-col gap-2">
                <div className="w-full h-max pt-4">
                    <div className="flex flex-col">
                        <span className="text-slate-500 font-bold text-sm pl-2">
                            {dict.sidebar.currentOrganization}
                        </span>
                    </div>
                </div>
                <Select defaultValue={organizationId} onValueChange={handleSetOrganization}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={dict.sidebar.orgPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={currentUser?.organization_id as string}>
                            <span className="flex items-center gap-2">
                                {currentUser?.organization.name}
                            </span>
                        </SelectItem>
                        {orgs?.data.map(org => (
                            <SelectItem value={org.target_organization_id}>
                                <span className="flex items-center gap-2">
                                    {org.target_organization.name}
                                    {currentUser?.organization_id === org.id ? (
                                        <FaCircle size={5} className="text-relif-orange-200" />
                                    ) : undefined}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    return <div />;
};

export { OrgSelector };
