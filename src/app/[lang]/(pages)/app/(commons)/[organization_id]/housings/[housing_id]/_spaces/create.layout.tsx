"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { createSpace } from "@/repository/housing.repository";
import { Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

type Props = {
    housingId: string;
    refreshList: () => void;
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

type SpaceInputProps = {
    id: number;
    removeInput: (id: number) => void;
};

const SpaceInput = ({ id, removeInput }: SpaceInputProps): ReactNode => {
    const dict = useDictionary();

    return (
        <li className="flex border border-slate-200 rounded-md items-end gap-2 p-2" key={id}>
            <div className="w-full flex flex-col gap-3">
                <Label htmlFor={`name_${id}`}>
                    {dict.housingOverview.createSpaceDrawer.name} *
                </Label>
                <Input
                    id={`name_${id}`}
                    name={`name_${id}`}
                    type="text"
                    defaultValue=""
                    className="w-full"
                />
            </div>
            <div className="w-[80px] flex flex-col gap-3">
                <Label htmlFor={`beds_${id}`}>
                    {dict.housingOverview.createSpaceDrawer.beds} *
                </Label>
                <Input
                    id={`beds_${id}`}
                    name={`beds_${id}`}
                    type="number"
                    min={1}
                    max={9999}
                    defaultValue={1}
                    className="w-[80px]"
                />
            </div>
            <Button variant="ghost" type="button" onClick={() => removeInput(id)}>
                {dict.housingOverview.createSpaceDrawer.btnRemove}
            </Button>
        </li>
    );
};

const CreateSheet = ({
    housingId,
    refreshList,
    sheetOpenState,
    setSheetOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const [inputs, setInputs] = useState<number[]>([]);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const spaces = inputs.map(id => ({
            name: formData.get(`name_${id}`) as string,
            total_vacancies: Number(formData.get(`beds_${id}`)),
        }));

        try {
            await createSpace(housingId, spaces);
            refreshList();

            toast({
                title: dict.housingOverview.createSpaceDrawer.toastSuccessTitle,
                description: dict.housingOverview.createSpaceDrawer.toastSuccessDescription,
                variant: "success",
            });
            setSheetOpenState(false);
        } catch (error) {
            toast({
                title: dict.housingOverview.createSpaceDrawer.toastErrorTitle,
                description: dict.housingOverview.createSpaceDrawer.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    const addNewSpace = () => {
        setInputs(prevInputs => [...prevInputs, prevInputs.length + 1]);
    };

    const removeInput = (id: number) => {
        setInputs(prevInputs => prevInputs.filter(inputId => inputId !== id));
    };

    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="py-4 px-4 lg:w-full">
                <SheetHeader>
                    <SheetTitle>{dict.housingOverview.createSpaceDrawer.title}</SheetTitle>
                </SheetHeader>
                <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addNewSpace}
                        className="mt-5 mb-5 flex items-center gap-2"
                    >
                        <MdAdd size={16} />
                        {dict.housingOverview.createSpaceDrawer.btnAdd}
                    </Button>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <ul className="flex flex-col h-[calc(100vh-205px)] gap-2 overflow-x-hidden overflow-y-scroll p-2">
                            {inputs?.map(id => (
                                <SpaceInput key={id} id={id} removeInput={removeInput} />
                            ))}
                        </ul>
                    </div>
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-5 w-full flex items-center gap-1"
                    >
                        <FaSave />
                        {dict.housingOverview.createSpaceDrawer.btnSave}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

const CreateSpace = ({
    housingId,
    refreshList,
}: {
    housingId: string;
    refreshList: () => void;
}): ReactNode => {
    const dict = useDictionary();
    const [sheetOpenState, setSheetOpenState] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setSheetOpenState(true)}
            >
                <MdAdd size={16} /> {dict.housingOverview.createSpaceDrawer.btnNew}
            </Button>

            <CreateSheet
                housingId={housingId}
                refreshList={refreshList}
                sheetOpenState={sheetOpenState}
                setSheetOpenState={setSheetOpenState}
            />
        </>
    );
};

export { CreateSpace };
