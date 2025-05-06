"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { updateSpace } from "@/repository/spaces.repository";
import { SpaceSchema } from "@/types/space.types";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaSave } from "react-icons/fa";

type Props = {
    space: SpaceSchema;
    refreshList: () => void;
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const EditSpace = ({ space, refreshList, sheetOpenState, setSheetOpenState }: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                name: string;
                beds: number;
            } = Object.fromEntries(formData);

            await updateSpace(space.id, {
                name: data.name,
                status: space.status,
                total_vacancies: Number(data.beds),
            });
            refreshList();

            toast({
                title: dict.housingOverview.editSpaceDrawer.toastSuccessTitle,
                description: dict.housingOverview.editSpaceDrawer.toastSuccessDescription,
                variant: "success",
            });
            setIsLoading(false);
        } catch {
            setIsLoading(false);
            toast({
                title: dict.housingOverview.editSpaceDrawer.toastErrorTitle,
                description: dict.housingOverview.editSpaceDrawer.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="lg:w-full">
                <SheetHeader>
                    <SheetTitle>{dict.housingOverview.editSpaceDrawer.title}</SheetTitle>
                </SheetHeader>
                <form className="flex flex-col pt-9" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">
                                {dict.housingOverview.editSpaceDrawer.name} *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                defaultValue={space.name}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="beds">
                                {dict.housingOverview.editSpaceDrawer.beds} *
                            </Label>
                            <Input
                                id="beds"
                                name="beds"
                                type="number"
                                min={1}
                                max={9999}
                                defaultValue={space.total_vacancies}
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <Button
                            type="submit"
                            variant="default"
                            className="mt-[43px] w-full flex items-center gap-1"
                        >
                            <FaSave />
                            {!isLoading
                                ? dict.housingOverview.editSpaceDrawer.btnSave
                                : dict.housingOverview.editSpaceDrawer.loading}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export { EditSpace };
