"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";

const Form = (): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [userData, setUserData] = useState<UserSchema | null>(null);
    const [language, setLanguage] = useState("english");
    // const [timezone, setTimezone] = useState("UTC+00");

    useEffect(() => {
        const ud: UserSchema = getFromLocalStorage("r_ud");
        setUserData(ud);
        setLanguage(ud.preferences.language);
        // setTimezone(ud.preferences.timezone);
    }, []);

    const handleLanguage = async (newLanguage: string): Promise<void> => {
        setLanguage(newLanguage);

        if (userData) {
            await updateUser(userData.id, {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
                platform_role: "RELIF_MEMBER",
                phones: userData.phones,
                preferences: { language: newLanguage, timezone: userData.preferences.timezone },
            });
        }
    };

    // const handleTimezone = async (newTimezone: string): Promise<void> => {
    //     setTimezone(newTimezone);
    //
    //     if (userData) {
    //         await updateUser(userData.id, {
    //             first_name: userData.first_name,
    //             last_name: userData.last_name,
    //             email: userData.email,
    //             role: userData.role,
    //             platform_role: "RELIF_MEMBER",
    //             phones: userData.phones,
    //             preferences: { language: userData.preferences.language, timezone: newTimezone },
    //         });
    //     }
    // };

    if (platformRole !== "RELIF_MEMBER") {
        return <div />;
    }

    return (
        <>
            <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4">
                <span className="text-sm text-slate-900 font-semibold">
                    {dict.admin.preferences.platform.language}
                </span>
                <Select defaultValue={language} onValueChange={handleLanguage}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="portuguese">
                            {dict.admin.preferences.platform.portuguese}
                        </SelectItem>
                        <SelectItem value="english">
                            {dict.admin.preferences.platform.english}
                        </SelectItem>
                        <SelectItem value="spanish">
                            {dict.admin.preferences.platform.spanish}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* <div className="w-full h-max grid grid-cols-2 items-center border-b-[1px] border-slate-200 p-4"> */}
            {/*    <span className="text-sm text-slate-900 font-semibold"> */}
            {/*        {dict.admin.preferences.platform.timezone} */}
            {/*    </span> */}
            {/*    <Select defaultValue={timezone} onValueChange={handleTimezone}> */}
            {/*        <SelectTrigger className="w-full"> */}
            {/*            <SelectValue placeholder={dict.admin.preferences.platform.select} /> */}
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
