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
import { ReactNode, useState } from "react";

const Education = (): ReactNode => {
    const [option, setOption] = useState("");
    const dict = useDictionary();

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="education">{dict.commons.beneficiaries.create.education.label} *</Label>
            <Select name="education" onValueChange={opt => setOption(opt)}>
                <SelectTrigger className="w-full" id="education">
                    <SelectValue
                        placeholder={dict.commons.beneficiaries.create.education.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="incomplete-elementary-education">
                        {dict.commons.beneficiaries.create.education.incompleteElementaryEducation}
                    </SelectItem>
                    <SelectItem value="complete-elementary-education">
                        {dict.commons.beneficiaries.create.education.completeElementaryEducation}
                    </SelectItem>
                    <SelectItem value="incomplete-high-school">
                        {dict.commons.beneficiaries.create.education.incompleteHighSchool}
                    </SelectItem>
                    <SelectItem value="complete-high-school">
                        {dict.commons.beneficiaries.create.education.completeHighSchool}
                    </SelectItem>
                    <SelectItem value="vocational-education">
                        {dict.commons.beneficiaries.create.education.vocationalEducation}
                    </SelectItem>
                    <SelectItem value="incomplete-higher-education">
                        {dict.commons.beneficiaries.create.education.incompleteHigherEducation}
                    </SelectItem>
                    <SelectItem value="complete-higher-education">
                        {dict.commons.beneficiaries.create.education.completeHigherEducation}
                    </SelectItem>
                    <SelectItem value="postgraduate">
                        {dict.commons.beneficiaries.create.education.postgraduate}
                    </SelectItem>
                    <SelectItem value="masters-degree">
                        {dict.commons.beneficiaries.create.education.mastersDegree}
                    </SelectItem>
                    <SelectItem value="doctorate">
                        {dict.commons.beneficiaries.create.education.doctorate}
                    </SelectItem>
                    <SelectItem value="postdoctorate">
                        {dict.commons.beneficiaries.create.education.postdoctorate}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.beneficiaries.create.education.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEducation"
                    type="text"
                    placeholder={dict.commons.beneficiaries.create.education.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { Education };
