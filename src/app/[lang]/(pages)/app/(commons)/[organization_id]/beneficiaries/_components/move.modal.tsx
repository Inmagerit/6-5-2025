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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { allocateBeneficiary, reallocateBeneficiary } from "@/repository/beneficiary.repository";
import { getSpacesByHousingId } from "@/repository/housing.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { HousingSchema } from "@/types/housing.types";
import { SpaceSchema } from "@/types/space.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshList?: () => void;
    moveDialogOpenState: boolean;
    setMoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const MoveModal = ({
    beneficiary,
    refreshList,
    moveDialogOpenState,
    setMoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();
    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");

    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [selectedHousing, setSelectedHousing] = useState("");
    const [spaces, setSpaces] = useState<SpaceSchema[] | []>([]);
    const [exitReason, setExitReason] = useState("");
    const [selectedSpace, setSelectedSpace] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");
                if (currentUser && currentUser.organization_id) {
                    const { data: housingResponse } = await findHousingsByOrganizationId(
                        currentUser.organization_id,
                        0,
                        9999,
                        ""
                    );
                    setHousings(housingResponse.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const getSpaces = async (housingId: string) => {
        setSpaces([]);
        setSelectedHousing(housingId);

        try {
            const { data: spaceResponse } = await getSpacesByHousingId(housingId, 0, 9999);
            setSpaces(spaceResponse.data);
        } catch {
            setError(true);
        }
    };

    const handleMove = async (): Promise<void> => {
        try {
            if (beneficiary.current_housing_id) {
                await reallocateBeneficiary(
                    beneficiary.id,
                    selectedHousing,
                    selectedSpace,
                    exitReason
                );
            } else {
                await allocateBeneficiary(beneficiary.id, selectedHousing, selectedSpace);
            }

            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            setMoveDialogOpenState(false);
            toast({
                title: dict.commons.beneficiaries.moveModal.toastSuccessTitle,
                description: dict.commons.beneficiaries.moveModal.toastSuccessDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.beneficiaries.moveModal.toastErrorTitle,
                description: dict.commons.beneficiaries.moveModal.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm text-start">
                {dict.commons.beneficiaries.moveModal.loading}
            </h2>
        );

    if (error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4 text-start">
                <MdError />
                {dict.commons.beneficiaries.moveModal.error}
            </span>
        );

    return (
        <Dialog open={moveDialogOpenState} onOpenChange={setMoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.beneficiaries.moveModal.confirmMoveTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.commons.beneficiaries.moveModal.confirmMoveDescription}
                    </DialogDescription>

                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold text-start">
                            {beneficiary.full_name}
                        </span>
                        <span className="text-xs text-slate-500 text-start">
                            <strong>Current:</strong>{" "}
                            {!beneficiary.current_housing_id
                                ? dict.commons.beneficiaries.moveModal.unallocated
                                : `${beneficiary.current_housing.name} (housed on ${beneficiary.current_room.name})`}
                        </span>
                    </div>

                    {housings.length === 0 && (
                        <span className="text-sm text-red-500 font-medium pt-4 text-start">
                            {dict.commons.beneficiaries.moveModal.noHousingsFound}
                        </span>
                    )}

                    {housings.length > 0 && (
                        <div className="pt-4 flex flex-col gap-2 items-start">
                            <span className="text-xs text-slate-500 font-bold text-start">
                                {dict.commons.beneficiaries.moveModal.to}:
                            </span>
                            <Select onValueChange={getSpaces} required>
                                <SelectTrigger className="w-full" id="housing">
                                    <SelectValue
                                        placeholder={
                                            dict.commons.beneficiaries.moveModal
                                                .selectHousingPlaceholder
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {housings.map(housing => (
                                        <SelectItem value={housing.id}>{housing.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedSpace} required>
                                <SelectTrigger className="w-full" id="space">
                                    <SelectValue
                                        placeholder={
                                            dict.commons.beneficiaries.moveModal
                                                .selectSpacePlaceholder
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {spaces?.map(space => (
                                        <SelectItem value={space.id}>
                                            {space.name} [
                                            {space.total_vacancies - space.occupied_vacancies} of{" "}
                                            {space.total_vacancies}{" "}
                                            {dict.commons.beneficiaries.moveModal.available}]
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {beneficiary.current_housing_id && (
                                <div className="flex flex-col gap-3 w-full pt-5 text-start">
                                    <Label htmlFor="react-reason">
                                        {dict.commons.beneficiaries.moveModal.exitReason} *
                                    </Label>
                                    <textarea
                                        className="flex min-h-20 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        id="exitReason"
                                        name="exitReason"
                                        value={exitReason}
                                        onChange={e => setExitReason(e.target.value)}
                                        maxLength={250}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setMoveDialogOpenState(false)}>
                            {dict.commons.beneficiaries.moveModal.cancel}
                        </Button>
                        <Button onClick={handleMove} disabled={housings.length === 0}>
                            {dict.commons.beneficiaries.moveModal.move}
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { MoveModal };
