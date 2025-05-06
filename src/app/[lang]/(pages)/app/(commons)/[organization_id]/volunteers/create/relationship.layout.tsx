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

const RelationshipDegree = (): ReactNode => {
    const [option, setOption] = useState("");
    const dict = useDictionary();

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="emergencyRelationship">
                {dict.commons.volunteers.create.relationshipDegree.label} *
            </Label>
            <Select name="emergencyRelationship" onValueChange={setOption}>
                <SelectTrigger className="w-full" id="emergencyRelationship">
                    <SelectValue
                        placeholder={dict.commons.volunteers.create.relationshipDegree.placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="parent">
                        {dict.commons.volunteers.create.relationshipDegree.parent}
                    </SelectItem>
                    <SelectItem value="child">
                        {dict.commons.volunteers.create.relationshipDegree.child}
                    </SelectItem>
                    <SelectItem value="sibling">
                        {dict.commons.volunteers.create.relationshipDegree.sibling}
                    </SelectItem>
                    <SelectItem value="spouse">
                        {dict.commons.volunteers.create.relationshipDegree.spouse}
                    </SelectItem>
                    <SelectItem value="grandparent">
                        {dict.commons.volunteers.create.relationshipDegree.grandparent}
                    </SelectItem>
                    <SelectItem value="grandchild">
                        {dict.commons.volunteers.create.relationshipDegree.grandchild}
                    </SelectItem>
                    <SelectItem value="aunt-uncle">
                        {dict.commons.volunteers.create.relationshipDegree.auntUncle}
                    </SelectItem>
                    <SelectItem value="niece-nephew">
                        {dict.commons.volunteers.create.relationshipDegree.nieceNephew}
                    </SelectItem>
                    <SelectItem value="cousin">
                        {dict.commons.volunteers.create.relationshipDegree.cousin}
                    </SelectItem>
                    <SelectItem value="guardian">
                        {dict.commons.volunteers.create.relationshipDegree.guardian}
                    </SelectItem>
                    <SelectItem value="other">
                        {dict.commons.volunteers.create.relationshipDegree.other}
                    </SelectItem>
                </SelectContent>
            </Select>
            {option === "other" && (
                <Input
                    name="otherEmergencyRelationship"
                    type="text"
                    placeholder={dict.commons.volunteers.create.relationshipDegree.otherPlaceholder}
                />
            )}
        </div>
    );
};

export { RelationshipDegree };
