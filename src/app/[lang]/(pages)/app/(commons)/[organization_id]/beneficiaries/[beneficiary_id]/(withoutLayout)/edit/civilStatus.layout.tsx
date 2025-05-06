"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReactNode, useEffect, useState } from "react";

type Props = {
    defaultValue: string;
};

const OPTIONS = [
    "single",
    "married",
    "divorced",
    "widowed",
    "separated",
    "common-law-marriage",
    "in-a-relationship",
];

const CivilStatus = ({ defaultValue }: Props): ReactNode => {
    const dict = useDictionary();
    const [option, setOption] = useState<string>(defaultValue);

    useEffect(() => {
        if (OPTIONS.includes(defaultValue)) {
            setOption(defaultValue);
        } else {
            setOption("other");
        }
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="civilStatus">
                {dict.commons.beneficiaries.create.civilStatus.label} *
            </Label>
            <Select
                name="civilStatus"
                onValueChange={opt => setOption(opt)}
                defaultValue={defaultValue}
            >
                <SelectTrigger className="w-full" id="civilStatus">
                    <SelectValue
                        placeholder={dict.commons.beneficiaries.create.civilStatus.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="single">
                        {dict.commons.beneficiaries.create.civilStatus.single}
                    </SelectItem>
                    <SelectItem value="married">
                        {dict.commons.beneficiaries.create.civilStatus.married}
                    </SelectItem>
                    <SelectItem value="divorced">
                        {dict.commons.beneficiaries.create.civilStatus.divorced}
                    </SelectItem>
                    <SelectItem value="widowed">
                        {dict.commons.beneficiaries.create.civilStatus.widowed}
                    </SelectItem>
                    <SelectItem value="separated">
                        {dict.commons.beneficiaries.create.civilStatus.separated}
                    </SelectItem>
                    <SelectItem value="common-law-marriage">
                        {dict.commons.beneficiaries.create.civilStatus.commonLawMarriage}
                    </SelectItem>
                    <SelectItem value="in-a-relationship">
                        {dict.commons.beneficiaries.create.civilStatus.inARelationship}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.beneficiaries.create.civilStatus.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherCivilStatus"
                    type="text"
                    placeholder={dict.commons.beneficiaries.create.civilStatus.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { CivilStatus };
