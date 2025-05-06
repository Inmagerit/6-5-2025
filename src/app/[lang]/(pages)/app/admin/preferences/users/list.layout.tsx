"use client";

import { AddUser } from "@/app/[lang]/(pages)/app/admin/preferences/users/add.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { getRelifUsers } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdAdd, MdError } from "react-icons/md";

import { UserCard } from "./card.layout";

const UserList = (): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [data, setData] = useState<{ data: UserSchema[]; count: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getUserList = async () => {
        try {
            const OFFSET = 0;
            const LIMIT = 9999;
            const response = await getRelifUsers(OFFSET, LIMIT);
            setData(response.data);

            const currUser: UserSchema = await getFromLocalStorage("r_ud");
            setCurrentUser(currUser);
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

    if (platformRole !== "RELIF_MEMBER") return <div />;

    return (
        <>
            <div className="w-full h-max pt-2 pr-3 flex justify-end">
                <AddUser>
                    <Button className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.admin.preferences.users.page.addUser}
                    </Button>
                </AddUser>
            </div>
            <ul className="w-full h-[calc(100vh-268px)] border-[1px] border-slate-200 rounded-md p-2 mt-4 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
                {isLoading && (
                    <h2 className="p-2 text-relif-orange-400 font-medium text-sm">
                        {dict.admin.preferences.users.list.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <MdError />
                        {dict.admin.preferences.users.list.error}
                    </span>
                )}

                {!isLoading && !error && !data && (
                    <span className="text-sm text-slate-900 font-medium">
                        {dict.admin.preferences.users.list.noUsers}
                    </span>
                )}

                {!isLoading &&
                    !error &&
                    data &&
                    data.data?.map(user => (
                        <UserCard
                            {...user}
                            currentUserId={currentUser?.id as string}
                            refreshList={getUserList}
                        />
                    ))}
            </ul>
        </>
    );
};

export { UserList };
