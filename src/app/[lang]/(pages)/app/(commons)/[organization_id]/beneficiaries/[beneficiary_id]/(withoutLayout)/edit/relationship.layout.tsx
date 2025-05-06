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
    "parent",
    "child",
    "sibling",
    "spouse",
    "grandparent",
    "grandchild",
    "aunt-uncle",
    "niece-nephew",
    "cousin",
    "guardian",
];

const RelationshipDegree = ({ defaultValue }: Props): ReactNode => {
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
            <Label htmlFor="emergencyRelationship">
                {dict.commons.beneficiaries.edit.relationship.label}
            </Label>
            <Select name="emergencyRelationship" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="emergencyRelationship">
                    <SelectValue
                        placeholder={dict.commons.beneficiaries.edit.relationship.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="parent">
                        {dict.commons.beneficiaries.edit.relationship.parent}
                    </SelectItem>
                    <SelectItem value="child">
                        {dict.commons.beneficiaries.edit.relationship.child}
                    </SelectItem>
                    <SelectItem value="sibling">
                        {dict.commons.beneficiaries.edit.relationship.sibling}
                    </SelectItem>
                    <SelectItem value="spouse">
                        {dict.commons.beneficiaries.edit.relationship.spouse}
                    </SelectItem>
                    <SelectItem value="grandparent">
                        {dict.commons.beneficiaries.edit.relationship.grandparent}
                    </SelectItem>
                    <SelectItem value="grandchild">
                        {dict.commons.beneficiaries.edit.relationship.grandchild}
                    </SelectItem>
                    <SelectItem value="aunt-uncle">
                        {dict.commons.beneficiaries.edit.relationship.auntUncle}
                    </SelectItem>
                    <SelectItem value="niece-nephew">
                        {dict.commons.beneficiaries.edit.relationship.nieceNephew}
                    </SelectItem>
                    <SelectItem value="cousin">
                        {dict.commons.beneficiaries.edit.relationship.cousin}
                    </SelectItem>
                    <SelectItem value="guardian">
                        {dict.commons.beneficiaries.edit.relationship.guardian}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.beneficiaries.edit.relationship.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEmergencyRelationship"
                    type="text"
                    placeholder={dict.commons.beneficiaries.edit.relationship.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { RelationshipDegree };
