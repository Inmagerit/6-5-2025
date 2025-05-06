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
    "incomplete-elementary-education",
    "complete-elementary-education",
    "incomplete-high-school",
    "complete-high-school",
    "vocational-education",
    "incomplete-higher-education",
    "complete-higher-education",
    "postgraduate",
    "masters-degree",
    "doctorate",
    "postdoctorate",
];

const Education = ({ defaultValue }: Props): ReactNode => {
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
            <Label htmlFor="education">{dict.commons.beneficiaries.edit.education.label}</Label>
            <Select name="education" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="education">
                    <SelectValue
                        placeholder={dict.commons.beneficiaries.edit.education.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="incomplete-elementary-education">
                        {dict.commons.beneficiaries.edit.education.incompleteElementaryEducation}
                    </SelectItem>
                    <SelectItem value="complete-elementary-education">
                        {dict.commons.beneficiaries.edit.education.completeElementaryEducation}
                    </SelectItem>
                    <SelectItem value="incomplete-high-school">
                        {dict.commons.beneficiaries.edit.education.incompleteHighSchool}
                    </SelectItem>
                    <SelectItem value="complete-high-school">
                        {dict.commons.beneficiaries.edit.education.completeHighSchool}
                    </SelectItem>
                    <SelectItem value="vocational-education">
                        {dict.commons.beneficiaries.edit.education.vocationalEducation}
                    </SelectItem>
                    <SelectItem value="incomplete-higher-education">
                        {dict.commons.beneficiaries.edit.education.incompleteHigherEducation}
                    </SelectItem>
                    <SelectItem value="complete-higher-education">
                        {dict.commons.beneficiaries.edit.education.completeHigherEducation}
                    </SelectItem>
                    <SelectItem value="postgraduate">
                        {dict.commons.beneficiaries.edit.education.postgraduate}
                    </SelectItem>
                    <SelectItem value="masters-degree">
                        {dict.commons.beneficiaries.edit.education.mastersDegree}
                    </SelectItem>
                    <SelectItem value="doctorate">
                        {dict.commons.beneficiaries.edit.education.doctorate}
                    </SelectItem>
                    <SelectItem value="postdoctorate">
                        {dict.commons.beneficiaries.edit.education.postdoctorate}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.beneficiaries.edit.education.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEducation"
                    type="text"
                    placeholder={dict.commons.beneficiaries.edit.education.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { Education };
