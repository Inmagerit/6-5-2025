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
    "male",
    "female",
    "non-binary",
    "prefer-not-to-say",
    "transgender",
    "gender-fluid",
    "agender",
    "other",
];

const Gender = ({ defaultValue }: Props): ReactNode => {
    const [option, setOption] = useState<string>(defaultValue);
    const dict = useDictionary();

    useEffect(() => {
        if (OPTIONS.includes(defaultValue)) {
            setOption(defaultValue);
        } else {
            setOption("other");
        }
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="gender">{dict.commons.volunteers.volunteerId.edit.gender.label}</Label>
            <Select name="gender" value={option} onValueChange={opt => setOption(opt)}>
                <SelectTrigger className="w-full" id="gender">
                    <SelectValue
                        placeholder={dict.commons.volunteers.volunteerId.edit.gender.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="male">
                        {dict.commons.volunteers.volunteerId.edit.gender.male}
                    </SelectItem>
                    <SelectItem value="female">
                        {dict.commons.volunteers.volunteerId.edit.gender.female}
                    </SelectItem>
                    <SelectItem value="non-binary">
                        {dict.commons.volunteers.volunteerId.edit.gender.nonBinary}
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say">
                        {dict.commons.volunteers.volunteerId.edit.gender.preferNotToSay}
                    </SelectItem>
                    <SelectItem value="transgender">
                        {dict.commons.volunteers.volunteerId.edit.gender.transgender}
                    </SelectItem>
                    <SelectItem value="gender-fluid">
                        {dict.commons.volunteers.volunteerId.edit.gender.genderFluid}
                    </SelectItem>
                    <SelectItem value="agender">
                        {dict.commons.volunteers.volunteerId.edit.gender.agender}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.volunteers.volunteerId.edit.gender.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherGender"
                    type="text"
                    placeholder={dict.commons.volunteers.volunteerId.edit.gender.otherPlaceholder}
                    required
                />
            )}
        </div>
    );
};

export { Gender };
