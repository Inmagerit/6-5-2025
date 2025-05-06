"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";

const Medical = (): ReactNode => {
    const dict = useDictionary();

    const [allergies, setAllergies] = useState<string[]>([]);
    const [currentMedications, setCurrentMedications] = useState<string[]>([]);
    const [chronicMedicalConditions, setChronicMedicalConditions] = useState<string[]>([]);
    const [healthInsurance, setHealthInsurance] = useState<string[]>([]);
    const [vaccinations, setVaccinations] = useState<string[]>([]);
    const [mentalHealth, setMentalHealth] = useState<string[]>([]);
    const [addictions, setAddictions] = useState<string[]>([]);
    const [disabilities, setDisabilities] = useState<string[]>([]);
    const [prosthesisOrMedicalDevices, setProsthesisOrMedicalDevices] = useState<string[]>([]);

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    return (
        <>
            <div className="w-full h-max flex flex-col gap-6 p-4 border border-slate-200 rounded-lg">
                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <MdHealthAndSafety /> {dict.commons.volunteers.create.medical.title}
                </h2>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="allergies">
                        {dict.commons.volunteers.create.medical.allergies}
                    </Label>
                    <Input
                        id="allergies"
                        name="allergies"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setAllergies)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {allergies?.map((allergy, index) => (
                            <Badge variant="outline" key={index}>
                                {allergy}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="currentMedications">
                        {dict.commons.volunteers.create.medical.currentMedications}
                    </Label>
                    <Input
                        id="currentMedications"
                        name="currentMedications"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setCurrentMedications)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {currentMedications?.map((medication, index) => (
                            <Badge variant="outline" key={index}>
                                {medication}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="chronicMedicalConditions">
                        {dict.commons.volunteers.create.medical.chronicMedicalConditions}
                    </Label>
                    <Input
                        id="chronicMedicalConditions"
                        name="chronicMedicalConditions"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setChronicMedicalConditions)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {chronicMedicalConditions?.map((condition, index) => (
                            <Badge variant="outline" key={index}>
                                {condition}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="healthInsurance">
                        {dict.commons.volunteers.create.medical.healthInsurance}
                    </Label>
                    <Input
                        id="healthInsurance"
                        name="healthInsurance"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setHealthInsurance)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {healthInsurance?.map((insurance, index) => (
                            <Badge variant="outline" key={index}>
                                {insurance}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="bloodType">
                        {dict.commons.volunteers.create.medical.bloodType}
                    </Label>
                    <Select name="bloodType">
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    dict.commons.volunteers.create.medical.bloodTypePlaceholder
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A-positive">A+</SelectItem>
                            <SelectItem value="A-negative">A-</SelectItem>
                            <SelectItem value="B-positive">B+</SelectItem>
                            <SelectItem value="B-negative">B-</SelectItem>
                            <SelectItem value="AB-positive">AB+</SelectItem>
                            <SelectItem value="AB-negative">AB-</SelectItem>
                            <SelectItem value="O-positive">O+</SelectItem>
                            <SelectItem value="O-negative">O-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="vaccinations">
                        {dict.commons.volunteers.create.medical.vaccinations}
                    </Label>
                    <Input
                        id="vaccinations"
                        name="vaccinations"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setVaccinations)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {vaccinations?.map((vaccination, index) => (
                            <Badge variant="outline" key={index}>
                                {vaccination}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="mentalHealth">
                        {dict.commons.volunteers.create.medical.mentalHealth}
                    </Label>
                    <Input
                        id="mentalHealth"
                        name="mentalHealth"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setMentalHealth)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {mentalHealth?.map((mental, index) => (
                            <Badge variant="outline" key={index}>
                                {mental}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="height">{dict.commons.volunteers.create.medical.height}</Label>
                    <Input id="height" name="height" type="number" placeholder="e.g. 170cm" />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="weight">{dict.commons.volunteers.create.medical.weight}</Label>
                    <Input id="weight" name="weight" type="number" placeholder="e.g. 80kg" />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="addictions">
                        {dict.commons.volunteers.create.medical.addictions}
                    </Label>
                    <Input
                        id="addictions"
                        name="addictions"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setAddictions)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {addictions?.map((addiction, index) => (
                            <Badge variant="outline" key={index}>
                                {addiction}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="disabilities">
                        {dict.commons.volunteers.create.medical.disabilities}
                    </Label>
                    <Input
                        id="disabilities"
                        name="disabilities"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setDisabilities)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {disabilities?.map((disability, index) => (
                            <Badge variant="outline" key={index}>
                                {disability}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="prothesisOrMedicalDevices">
                        {dict.commons.volunteers.create.medical.prothesisOrMedicalDevices}
                    </Label>
                    <Input
                        id="prothesisOrMedicalDevices"
                        name="prothesisOrMedicalDevices"
                        type="text"
                        placeholder={dict.commons.volunteers.create.medical.writeAsMuch}
                        onChange={handleInputChange(setProsthesisOrMedicalDevices)}
                    />
                    <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                        {prosthesisOrMedicalDevices?.map((device, index) => (
                            <Badge variant="outline" key={index}>
                                {device}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export { Medical };
