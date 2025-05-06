import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    userActivitiesSheetOpenState: boolean;
    setUserActivitiesSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserActivities = ({
    userActivitiesSheetOpenState,
    setUserActivitiesSheetOpenState,
}: Props): ReactNode => (
    <Sheet open={userActivitiesSheetOpenState} onOpenChange={setUserActivitiesSheetOpenState}>
        <SheetContent className="w-[1000px]">
            <SheetHeader>
                <SheetTitle>Anthony's activities</SheetTitle>
                <SheetDescription>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry's standard dummy text ever since the 1500s.
                </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col mt-5 pt-4 border-t-[1px] border-slate-200"></div>
        </SheetContent>
    </Sheet>
);

export { UserActivities };
