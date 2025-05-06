"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { findUsersByOrganizationId } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { UserCard } from "./card.layout";

type Props = {
    organizationId: string;
};

const UserList = ({ organizationId }: Props): ReactNode => {
    const dict = useDictionary();

    const [data, setData] = useState<{ data: UserSchema[]; count: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const OFFSET = 0;
                const LIMIT = 9999;
                const response = await findUsersByOrganizationId(organizationId, OFFSET, LIMIT);
                setData(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="w-full h-[calc(100vh-347px)] border border-slate-200 rounded-md overflow-hidden">
            {isLoading && (
                <h2 className="text-relif-orange-400 font-medium text-sm p-2">
                    {dict.admin.organizations.organizationId.users.list.loading}
                </h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-2">
                    <MdError />
                    {dict.admin.organizations.organizationId.users.list.error}
                </span>
            )}

            {!isLoading && !error && data && data.count <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-2">
                    {dict.admin.organizations.organizationId.users.list.noUsersFound}
                </span>
            )}

            {!isLoading && !error && data && data.count > 0 && (
                <ul className="w-full h-full overflow-x-hidden overflow-y-scroll p-2">
                    {data.data?.map(user => <UserCard {...user} />)}
                </ul>
            )}
        </div>
    );
};

export { UserList };
