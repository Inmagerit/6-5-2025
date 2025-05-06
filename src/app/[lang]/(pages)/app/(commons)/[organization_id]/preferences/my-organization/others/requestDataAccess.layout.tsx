"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { FaDatabase } from "react-icons/fa";

import { RequestDataAccessDialog } from "./requestDataAccessDialog.layout";

const RequestDataAccess = (): ReactNode => {
    const dict = useDictionary();

    const [requestDialogOpenState, setRequestDialogOpenState] = useState(false);

    return (
        <div>
            <Button
                className="flex items-center gap-2"
                variant="default"
                onClick={() => setRequestDialogOpenState(true)}
            >
                <FaDatabase />
                {dict.commons.preferences.myOrganization.others.dataAccess.card.requestDataAccess}
            </Button>

            <RequestDataAccessDialog
                requestDialogOpenState={requestDialogOpenState}
                setRequestDialogOpenState={setRequestDialogOpenState}
            />
        </div>
    );
};

export default RequestDataAccess;
