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
                {dict.commons.volunteers.volunteerId.edit.relationship.label}
            </Label>
            <Select name="emergencyRelationship" value={option} onValueChange={setOption}>
                <SelectTrigger className="w-full" id="emergencyRelationship">
                    <SelectValue
                        placeholder={
                            dict.commons.volunteers.volunteerId.edit.relationship.placeholder
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="parent">
                        {dict.commons.volunteers.volunteerId.edit.relationship.parent}
                    </SelectItem>
                    <SelectItem value="child">
                        {dict.commons.volunteers.volunteerId.edit.relationship.child}
                    </SelectItem>
                    <SelectItem value="sibling">
                        {dict.commons.volunteers.volunteerId.edit.relationship.sibling}
                    </SelectItem>
                    <SelectItem value="spouse">
                        {dict.commons.volunteers.volunteerId.edit.relationship.spouse}
                    </SelectItem>
                    <SelectItem value="grandparent">
                        {dict.commons.volunteers.volunteerId.edit.relationship.grandparent}
                    </SelectItem>
                    <SelectItem value="grandchild">
                        {dict.commons.volunteers.volunteerId.edit.relationship.grandchild}
                    </SelectItem>
                    <SelectItem value="aunt-uncle">
                        {dict.commons.volunteers.volunteerId.edit.relationship.auntUncle}
                    </SelectItem>
                    <SelectItem value="niece-nephew">
                        {dict.commons.volunteers.volunteerId.edit.relationship.nieceNephew}
                    </SelectItem>
                    <SelectItem value="cousin">
                        {dict.commons.volunteers.volunteerId.edit.relationship.cousin}
                    </SelectItem>
                    <SelectItem value="guardian">
                        {dict.commons.volunteers.volunteerId.edit.relationship.guardian}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.volunteers.volunteerId.edit.relationship.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEmergencyRelationship"
                    type="text"
                    placeholder={
                        dict.commons.volunteers.volunteerId.edit.relationship.otherPlaceholder
                    }
                />
            )}
        </div>
    );
};

export { RelationshipDegree };
