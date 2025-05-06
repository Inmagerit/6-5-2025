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
import { MedicalInformationSchema } from "@/types/commons.types";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { MdHealthAndSafety } from "react-icons/md";

type Props = {
    defaultValue: MedicalInformationSchema;
};

const Medical = ({ defaultValue }: Props): ReactNode => {
    const dict = useDictionary();

    const [allergies, setAllergies] = useState<string[]>(defaultValue.allergies);
    const [currentMedications, setCurrentMedications] = useState<string[]>(
        defaultValue.current_medications
    );
    const [chronicMedicalConditions, setChronicMedicalConditions] = useState<string[]>(
        defaultValue.recurrent_medical_conditions
    );
    const [healthInsurance, setHealthInsurance] = useState<string[]>(
        defaultValue.health_insurance_plans
    );
    const [vaccinations, setVaccinations] = useState<string[]>(defaultValue.taken_vaccines);
    const [mentalHealth, setMentalHealth] = useState<string[]>(defaultValue.mental_health_history);
    const [addictions, setAddictions] = useState<string[]>(defaultValue.addictions);
    const [disabilities, setDisabilities] = useState<string[]>(defaultValue.disabilities);
    const [prosthesisOrMedicalDevices, setProsthesisOrMedicalDevices] = useState<string[]>(
        defaultValue.prothesis_or_medical_devices
    );

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    return (
        <>
            <div className="w-full h-max flex flex-col gap-6 p-4 border border-slate-200 rounded-lg">
                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <MdHealthAndSafety /> {dict.commons.volunteers.volunteerId.edit.medical.title}
                </h2>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="allergies">
                        {dict.commons.volunteers.volunteerId.edit.medical.allergies}
                    </Label>
                    <Input
                        id="allergies"
                        name="allergies"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setAllergies)}
                        defaultValue={defaultValue.allergies.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.currentMedications}
                    </Label>
                    <Input
                        id="currentMedications"
                        name="currentMedications"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setCurrentMedications)}
                        defaultValue={defaultValue.current_medications.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.chronicMedicalConditions}
                    </Label>
                    <Input
                        id="chronicMedicalConditions"
                        name="chronicMedicalConditions"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setChronicMedicalConditions)}
                        defaultValue={defaultValue.recurrent_medical_conditions.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.healthInsurance}
                    </Label>
                    <Input
                        id="healthInsurance"
                        name="healthInsurance"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setHealthInsurance)}
                        defaultValue={defaultValue.health_insurance_plans.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.bloodType}
                    </Label>
                    <Select name="bloodType" defaultValue={defaultValue.blood_type}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select blood type..." />
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
                        {dict.commons.volunteers.volunteerId.edit.medical.vaccinations}
                    </Label>
                    <Input
                        id="vaccinations"
                        name="vaccinations"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setVaccinations)}
                        defaultValue={defaultValue.taken_vaccines.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.mentalHealth}
                    </Label>
                    <Input
                        id="mentalHealth"
                        name="mentalHealth"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setMentalHealth)}
                        defaultValue={defaultValue.mental_health_history.join(",")}
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
                    <Label htmlFor="height">
                        {dict.commons.volunteers.volunteerId.edit.medical.height}
                    </Label>
                    <Input
                        id="height"
                        name="height"
                        type="number"
                        placeholder="e.g. 170cm"
                        defaultValue={defaultValue.height}
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="weight">
                        {dict.commons.volunteers.volunteerId.edit.medical.weight}
                    </Label>
                    <Input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="e.g. 80kg"
                        defaultValue={defaultValue.weight}
                    />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="addictions">
                        {dict.commons.volunteers.volunteerId.edit.medical.addictions}
                    </Label>
                    <Input
                        id="addictions"
                        name="addictions"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setAddictions)}
                        defaultValue={defaultValue.addictions.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.disabilities}
                    </Label>
                    <Input
                        id="disabilities"
                        name="disabilities"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setDisabilities)}
                        defaultValue={defaultValue.disabilities.join(",")}
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
                        {dict.commons.volunteers.volunteerId.edit.medical.prothesisOrMedicalDevices}
                    </Label>
                    <Input
                        id="prothesisOrMedicalDevices"
                        name="prothesisOrMedicalDevices"
                        type="text"
                        placeholder={dict.commons.volunteers.volunteerId.edit.medical.writeAsMuch}
                        onChange={handleInputChange(setProsthesisOrMedicalDevices)}
                        defaultValue={defaultValue.prothesis_or_medical_devices.join(",")}
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
