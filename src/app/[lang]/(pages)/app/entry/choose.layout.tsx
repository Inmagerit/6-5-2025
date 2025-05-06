"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createJoinOrganizationRequest } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";

const Choose = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserSchema | null>(null);

    useEffect(() => {
        try {
            const currentUser = getFromLocalStorage("r_ud");
            if (currentUser) {
                setUser(currentUser);
            } else {
                throw new Error();
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleJoinAnOrganization = async () => {
        try {
            await createJoinOrganizationRequest(token);
            toast({
                title: dict.entryChoose.joinOrganizationToastSuccessTitle,
                description: dict.entryChoose.joinOrganizationToastSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.entryChoose.joinOrganizationToastErrorTitle,
                description: dict.entryChoose.joinOrganizationToastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-[700px] h-max border border-slate-200 rounded-lg">
            <h1 className="text-slate-900 font-bold text-xl flex items-center justify-center w-full border-b-[1px] border-slate-200 p-6">
                {dict.entryChoose.welcome}, {user?.first_name}!
            </h1>
            <div className="bg-slate-200 overflow-hidden grid grid-cols-2 gap-[1px] lg:flex lg:flex-col">
                <div className="w-full h-full bg-white p-6 flex flex-col gap-3">
                    <h2 className="text-slate-900 text-base font-semibold flex items-center gap-2">
                        <MdAdd size={20} /> {dict.entryChoose.createAnOrganization}
                    </h2>
                    <Button asChild>
                        <Link href="/app/entry/create">{dict.entryChoose.btnCreate}</Link>
                    </Button>
                </div>
                <div className="w-full h-full bg-white p-6 flex flex-col gap-3">
                    <h2 className="text-slate-900 text-base font-semibold">
                        {dict.entryChoose.joinAnOrganization}
                    </h2>
                    <div className="flex items-end gap-2">
                        <div className="w-full flex flex-col gap-3">
                            <Input
                                placeholder="Enter the organization token"
                                value={token}
                                onChange={e => setToken(e.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading} onClick={handleJoinAnOrganization}>
                            {dict.entryChoose.btnJoin}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Choose };
