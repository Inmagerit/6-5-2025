"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";

const OrganizationToken = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [token, setToken] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            const currentUser: UserSchema = getFromLocalStorage("r_ud");
            setToken(currentUser.organization_id as string);
        } catch {
            setError(true);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token).then(
            () => {
                toast({
                    title: dict.commons.preferences.myOrganization.others.coordination.token
                        .success,
                    description:
                        dict.commons.preferences.myOrganization.others.coordination.token
                            .successDescription,
                    variant: "success",
                });
            },
            () => {
                toast({
                    title: dict.commons.preferences.myOrganization.others.coordination.token.error,
                    description:
                        dict.commons.preferences.myOrganization.others.coordination.token
                            .errorDescription,
                    variant: "destructive",
                });
            }
        );
    };

    if (error) return <div>Error loading token.</div>;

    return (
        <div>
            <Button onClick={copyToClipboard} className="flex items-center gap-2" variant="outline">
                <FaCopy />
                {dict.commons.preferences.myOrganization.others.coordination.token.copyToken}
            </Button>
        </div>
    );
};

export default OrganizationToken;
