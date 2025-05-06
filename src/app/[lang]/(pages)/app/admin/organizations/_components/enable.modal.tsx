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
import { reactivateOrganization } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    organization: OrganizationSchema;
    refreshList?: () => void;
    enableDialogOpenState: boolean;
    setEnableDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const EnableModal = ({
    organization,
    refreshList,
    enableDialogOpenState,
    setEnableDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDisable = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await reactivateOrganization(organization.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/organizations");
            }

            toast({
                title: dict.admin.organizations.list.enable.accessEnabled,
                description: dict.admin.organizations.list.enable.accessEnabledDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.admin.organizations.list.enable.enableAccessFailed,
                description: dict.admin.organizations.list.enable.enableAccessFailedDescription,
                variant: "destructive",
            });
        }
    };

    if (organization && organization.address) {
        return (
            <Dialog open={enableDialogOpenState} onOpenChange={setEnableDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3">
                            {dict.admin.organizations.list.enable.enableAccessQuestion}
                        </DialogTitle>
                        <DialogDescription>
                            {dict.admin.organizations.list.enable.enableAccessDescription}
                        </DialogDescription>
                        <div className="flex flex-col pt-4">
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
                                onClick={() => setEnableDialogOpenState(false)}
                            >
                                {dict.admin.organizations.list.enable.cancel}
                            </Button>
                            <Button onClick={handleDisable}>
                                {!isLoading
                                    ? dict.admin.organizations.list.enable.disableAccess
                                    : dict.admin.organizations.list.enable.loading}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return <div />;
};

export { EnableModal };
