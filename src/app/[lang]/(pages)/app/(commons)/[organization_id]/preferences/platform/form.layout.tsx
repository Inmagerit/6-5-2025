"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage, updateLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

const Form = (): ReactNode => {
    const dict = useDictionary();
    const pathname = usePathname();
    const router = useRouter();

    const [userData, setUserData] = useState<UserSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        try {
            const ud: UserSchema = getFromLocalStorage("r_ud");
            setUserData(ud);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLanguage = async (newLanguage: string): Promise<void> => {
        if (userData) {
            await updateUser(userData.id, {
                ...userData,
                preferences: { language: newLanguage, timezone: userData.preferences.timezone },
            });

            updateLocalStorage("r_ud", {
                ...userData,
                preferences: { language: newLanguage, timezone: userData.preferences.timezone },
            });

            const LANGUAGES = {
                portuguese: "pt",
                english: "en",
                spanish: "es",
            };

            router.replace(
                pathname.replace(
                    /\/[a-z]{2}\//,
                    `/${LANGUAGES[newLanguage as keyof typeof LANGUAGES]}/`
                )
            );
        }
    };

    // const handleTimezone = async (newTimezone: string): Promise<void> => {
    //     if (userData) {
    //         await updateUser(userData.id, {
    //             ...userData,
    //             preferences: { language: userData.preferences.language, timezone: newTimezone },
    //         });
    //
    //         updateLocalStorage("r_ud", {
    //             ...userData,
    //             preferences: { language: userData.preferences.language, timezone: newTimezone },
    //         });
    //     }
    // };

    if (isLoading)
        return (
            <h2 className="p-2 text-relif-orange-400 text-sm font-medium">
                {dict.commons.preferences.platform.loading}
            </h2>
        );

    if (error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                <MdError />
                {dict.commons.preferences.platform.error}
            </span>
        );

    return (
        <>
            <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4">
                <span className="text-sm text-slate-900 font-semibold">
                    {dict.commons.preferences.platform.language}
                </span>
                <Select
                    defaultValue={userData?.preferences.language}
                    onValueChange={handleLanguage}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={dict.commons.preferences.platform.select} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="portuguese">
                            {dict.commons.preferences.platform.portuguese}
                        </SelectItem>
                        <SelectItem value="english">
                            {dict.commons.preferences.platform.english}
                        </SelectItem>
                        <SelectItem value="spanish">
                            {dict.commons.preferences.platform.spanish}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4"> */}
            {/*    <span className="text-sm text-slate-900 font-semibold"> */}
            {/*        {dict.commons.preferences.platform.timezone} */}
            {/*    </span> */}
            {/*    <Select */}
            {/*        defaultValue={userData?.preferences.timezone} */}
            {/*        onValueChange={handleTimezone} */}
            {/*    > */}
            {/*        <SelectTrigger className="w-full"> */}
            {/*            <SelectValue placeholder={dict.commons.preferences.platform.select} /> */}
            {/*        </SelectTrigger> */}
            {/*        <SelectContent> */}
            {/*            {TIMEZONES.map(tz => ( */}
            {/*                <SelectItem */}
            {/*                    key={tz.timezone} */}
            {/*                    value={tz.timezone} */}
            {/*                >{`${tz.timezone} | ${tz.name}`}</SelectItem> */}
            {/*            ))} */}
            {/*        </SelectContent> */}
            {/*    </Select> */}
            {/* </div> */}
        </>
    );
};

export { Form };
