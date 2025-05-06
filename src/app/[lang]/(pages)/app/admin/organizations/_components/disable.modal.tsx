"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { desativateOrganization } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    organization: OrganizationSchema;
    refreshList?: () => void;
    disableDialogOpenState: boolean;
    setDisableDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const DisableModal = ({
    organization,
    refreshList,
    disableDialogOpenState,
    setDisableDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDisable = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await desativateOrganization(organization.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/organizations");
            }

            toast({
                title: dict.admin.organizations.list.disable.accessDisabled,
                description: dict.admin.organizations.list.disable.accessDisabledDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.admin.organizations.list.disable.disableAccessFailed,
                description: dict.admin.organizations.list.disable.disableAccessFailedDescription,
                variant: "destructive",
            });
        }
    };

    if (organization && organization.address) {
        return (
            <Dialog open={disableDialogOpenState} onOpenChange={setDisableDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3">
                            {dict.admin.organizations.list.disable.disableAccessQuestion}
                        </DialogTitle>
                        <DialogDescription>
                            {dict.admin.organizations.list.disable.disableAccessDescription}
                        </DialogDescription>
                        <div className="flex flex-col pt-4 text-start">
                            <span className="text-sm text-slate-900 font-bold">
                                {organization?.name}
                            </span>
                            <span className="text-xs text-slate-500">
                                {`${organization?.address.address_line_1}, ${organization?.address.address_line_2} - ${organization?.address.city}, ${organization?.address.district} | ${organization?.address.zip_code} - ${organization?.address.country}`}
                            </span>
                        </div>

                        <div className="flex gap-4 pt-5">
                            <Button
                                variant="outline"
                                onClick={() => setDisableDialogOpenState(false)}
                            >
                                {dict.admin.organizations.list.disable.cancel}
                            </Button>
                            <Button onClick={handleDisable}>
                                {!isLoading
                                    ? dict.admin.organizations.list.disable.disableAccess
                                    : dict.admin.organizations.list.disable.loading}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return <div />;
};

export { DisableModal };
