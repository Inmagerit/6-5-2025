"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { allocateBeneficiary } from "@/repository/beneficiary.repository";
import { getSpacesByHousingId } from "@/repository/housing.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { SpaceSchema } from "@/types/space.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { IoMdAlert } from "react-icons/io";
import { MdError } from "react-icons/md";

type Props = {
    beneficiaryId: string;
};

const Content = ({ beneficiaryId }: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const dict = useDictionary();

    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [selectedHousing, setSelectedHousing] = useState("");
    const [spaces, setSpaces] = useState<SpaceSchema[] | []>([]);
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
            await allocateBeneficiary(beneficiaryId, selectedHousing, selectedSpace);

            toast({
                title: dict.commons.beneficiaries.create.allocate.toastSuccessTitle,
                description: dict.commons.beneficiaries.create.allocate.toastSuccessDescription,
                variant: "success",
            });

            router.push(backToListPath);
        } catch {
            toast({
                title: dict.commons.beneficiaries.create.allocate.toastErrorTitle,
                description: dict.commons.beneficiaries.create.allocate.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (error) {
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.beneficiaries.create.allocate.errorText}
            </span>
        );
    }

    return (
        <div>
            <h1 className="text-relif-orange-200 text-xl font-bold flex items-center gap-2 p-4">
                <FaHouseChimneyUser />
                {dict.commons.beneficiaries.create.allocate.title}
            </h1>

            {housings.length === 0 && (
                <div className="p-4">
                    <Alert>
                        <IoMdAlert className="h-4 w-4" />
                        <AlertTitle>
                            {dict.commons.beneficiaries.create.allocate.noHousingAlertTitle}
                        </AlertTitle>
                        <AlertDescription className="text-slate-500">
                            {dict.commons.beneficiaries.create.allocate.noHousingAlertDescription}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {housings.length !== 0 && (
                <div className="p-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="housing">
                            {dict.commons.beneficiaries.create.allocate.housingLabel}
                        </Label>
                        <Select onValueChange={getSpaces} required>
                            <SelectTrigger className="w-full" id="housing">
                                <SelectValue
                                    placeholder={
                                        !isLoading
                                            ? dict.commons.beneficiaries.create.allocate
                                                  .selectHousingPlaceholder
                                            : dict.commons.beneficiaries.create.allocate
                                                  .loadingPlaceholder
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {housings.map(housing => (
                                    <SelectItem value={housing.id}>{housing.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="space">
                            {dict.commons.beneficiaries.create.allocate.spaceLabel}
                        </Label>
                        <Select onValueChange={setSelectedSpace} required>
                            <SelectTrigger className="w-full" id="space">
                                <SelectValue
                                    placeholder={
                                        dict.commons.beneficiaries.create.allocate
                                            .selectSpacePlaceholder
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {spaces?.map(space => (
                                    <SelectItem value={space.id}>
                                        {space.name} [
                                        {space.total_vacancies - space.occupied_vacancies} of{" "}
                                        {space.total_vacancies} available]
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {housings.length !== 0 ? (
                <div className="flex gap-4 p-4">
                    <Button variant="outline" onClick={() => router.push(backToListPath)}>
                        {dict.commons.beneficiaries.create.allocate.doThisLaterButton}
                    </Button>
                    <Button onClick={handleMove}>
                        {dict.commons.beneficiaries.create.allocate.allocateButton}
                    </Button>
                </div>
            ) : (
                <div className="flex gap-4 p-4">
                    <Button variant="outline" asChild>
                        <Link href={backToListPath}>
                            {dict.commons.beneficiaries.create.allocate.backToListButton}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export { Content };
