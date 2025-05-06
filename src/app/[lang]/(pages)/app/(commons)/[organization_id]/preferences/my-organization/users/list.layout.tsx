"use client";

import { AddUser } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/users/add.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { findUsersByOrganizationId } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdAdd, MdError } from "react-icons/md";

import { UserCard } from "./card.layout";

const UserList = (): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [currentUserId, setCurrentUserId] = useState("");
    const [data, setData] = useState<{ data: UserSchema[]; count: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getUserList = async () => {
        try {
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (currentUser.organization_id) {
                const OFFSET = 0;
                const LIMIT = 9999;
                const response = await findUsersByOrganizationId(
                    currentUser.organization_id,
                    OFFSET,
                    LIMIT
                );
                setData(response.data);
                setCurrentUserId(currentUser.id);
            } else {
                throw new Error();
            }
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        (async () => getUserList())();
    }, []);

    return (
        <>
            <div className="w-full h-max pt-2 px-3 gap-4 flex items-center justify-between lg:justify-end lg:gap-0 lg:p-0 lg:pt-3">
                <div className="h-10 lg:hidden" />
                {platformRole === "ORG_ADMIN" && (
                    <AddUser>
                        <Button className="flex items-center gap-2">
                            <MdAdd size={16} />
                            {dict.commons.preferences.myOrganization.users.page.addUser}
                        </Button>
                    </AddUser>
                )}
            </div>
            <ul className="w-full h-[calc(100vh-316px)] border-[1px] border-slate-200 rounded-md p-2 mt-4 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
                {isLoading && (
                    <h2 className="p-2 text-relif-orange-400 font-medium text-sm">
                        {dict.commons.preferences.myOrganization.users.list.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <MdError />
                        {dict.commons.preferences.myOrganization.users.list.error}
                    </span>
                )}

                {!isLoading && !error && !data && (
                    <span className="text-sm text-slate-900 font-medium">
                        {dict.commons.preferences.myOrganization.users.list.noUsersFound}
                    </span>
                )}

                {!isLoading &&
                    !error &&
                    data &&
                    data.data?.map(user => (
                        <UserCard
                            {...user}
                            currentUserId={currentUserId}
                            refreshList={getUserList}
                        />
                    ))}
            </ul>
        </>
    );
};

export { UserList };
