"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getBeneficiaryById } from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCity, FaMapMarkerAlt } from "react-icons/fa";
import { FaBriefcaseMedical, FaHouseChimneyUser } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdContactEmergency, MdError, MdMail, MdPhone, MdNoteAlt } from "react-icons/md";

import { Toolbar } from "./toolbar.layout";

const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        // eslint-disable-next-line no-plusplus
        age--;
    }

    return age > 0 ? age : 0;
};

const RELATIONSHIPS_MAPPING = {
    parent: "Parent",
    child: "Child",
    sibling: "Sibling",
    spouse: "Spouse",
    grandparent: "Grandparent",
    grandchild: "Grandchild",
    "aunt-uncle": "Aunt/Uncle",
    "niece-nephew": "Niece/Nephew",
    cousin: "Cousin",
    guardian: "Guardian",
    other: "Other (specify)",
};

const CIVIL_STATUS_MAPPING = {
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    widowed: "Widowed",
    separated: "Separated",
    "common-law-marriage": "Common-Law Marriage",
    "in-a-relationship": "In a Relationship",
};

const EDUCATION_MAPPING = {
    "incomplete-elementary-education": "Incomplete Elementary Education",
    "complete-elementary-education": "Complete Elementary Education",
    "incomplete-high-school": "Incomplete High School",
    "complete-high-school": "Complete High School",
    "vocational-education": "Vocational Education",
    "incomplete-higher-education": "Incomplete Higher Education",
    "complete-higher-education": "Complete Higher Education",
    postgraduate: "Postgraduate",
    "masters-degree": "Master's Degree",
    doctorate: "Doctorate",
    postdoctorate: "Postdoctorate",
};

const GENDER_MAPPING = {
    male: "Male",
    female: "Female",
    "non-binary": "Non-Binary",
    "prefer-not-to-say": "Prefer Not to Say",
    transgender: "Transgender",
    "gender-fluid": "Gender Fluid",
    agender: "Agender",
    other: "Other",
};

const Content = ({ beneficiaryId }: { beneficiaryId: string }): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const housingPath = pathname.split("/").slice(0, 4).join("/");
    const locale = pathname.split("/")[1] as "en" | "es" | "pt";

    const [data, setData] = useState<BeneficiarySchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (beneficiaryId) {
                    const response = await getBeneficiaryById(beneficiaryId);
                    setData(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.commons.beneficiaries.beneficiaryId.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.beneficiaries.beneficiaryId.error.message}
            </span>
        );

    if (data) {
        return (
            <div className="w-full h-max flex flex-col gap-2">
                <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                    <Toolbar beneficiary={data as BeneficiarySchema} />
                    <div className="flex flex-col items-center">
                        {data.image_url && (
                            <img
                                src={data.image_url}
                                alt={data.full_name}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        )}
                        <h2 className="text-xl font-semibold text-slate-900 mt-4">
                            {convertToTitleCase(data.full_name)}
                        </h2>
                        <span className="text-sm text-slate-500 flex flex-wrap items-center gap-4">
                            {dict.commons.beneficiaries.beneficiaryId.registeredIn}{" "}
                            {formatDate(data.created_at, locale || "en")}
                        </span>
                    </div>
                </div>
                <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500 flex justify-between">
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-base pb-2 flex flex-wrap items-center gap-2">
                            {" "}
                            <FaHouseChimneyUser size={15} />
                            {dict.commons.beneficiaries.beneficiaryId.currentHousing}
                        </h3>
                        <span className="text-xs text-slate-50 flex flex-wrap items-center gap-1">
                            <FaMapMarkerAlt />
                            {data.current_room_id ? (
                                <>
                                    {dict.commons.beneficiaries.beneficiaryId.currentlyInSpace}{" "}
                                    <strong>{data.current_room.name}</strong>.
                                </>
                            ) : (
                                dict.commons.beneficiaries.beneficiaryId.unallocated
                            )}
                        </span>
                    </div>

                    {data.current_housing_id && (
                        <Button
                            variant="outline"
                            className="bg-transparent border-white text-white hover:border-relif-orange-200 hover:text-relif-orange-200"
                            asChild
                        >
                            <Link href={`${housingPath}/housings/${data.current_housing_id}`}>
                                {dict.commons.beneficiaries.beneficiaryId.viewHousing}
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
                    <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                        <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                            <IoPerson />
                            {dict.commons.beneficiaries.beneficiaryId.personalData}
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.fullName}:
                                </strong>{" "}
                                {convertToTitleCase(data.full_name)}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap items-center gap-2">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.birthdate}:
                                </strong>{" "}
                                {formatDate(data.birthdate, locale || "en")} (
                                {calculateAge(data.birthdate)} years old)
                                {calculateAge(data.birthdate) < 18 && (
                                    <span>
                                        <Badge className="bg-yellow-300 text-slate-900">
                                            {dict.commons.beneficiaries.beneficiaryId.underage}
                                        </Badge>
                                    </span>
                                )}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>{dict.commons.beneficiaries.beneficiaryId.email}:</strong>{" "}
                                {data.email}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>{dict.commons.beneficiaries.beneficiaryId.gender}:</strong>{" "}
                                {GENDER_MAPPING[data.gender as keyof typeof GENDER_MAPPING] ||
                                    data.gender}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap gap-2">
                                <strong>{dict.commons.beneficiaries.beneficiaryId.phones}:</strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.phones[0] && data.phones[0].split("_").join(" ")}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            {dict.commons.beneficiaries.beneficiaryId.phones}
                                        </h3>
                                        <ul>
                                            {data.phones.map(phone => (
                                                <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                    <MdPhone /> {phone.split("_").join(" ")}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.civilStatus}:
                                </strong>{" "}
                                {CIVIL_STATUS_MAPPING[
                                    data.civil_status as keyof typeof CIVIL_STATUS_MAPPING
                                ] || data.civil_status}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2 flex-wrap">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.languagesSpoken}:
                                </strong>{" "}
                                {data.spoken_languages?.map(language => (
                                    <Badge className="bg-relif-orange-500">
                                        {convertToTitleCase(language)}
                                    </Badge>
                                ))}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.education}:
                                </strong>{" "}
                                {EDUCATION_MAPPING[
                                    data.education as keyof typeof EDUCATION_MAPPING
                                ] || data.education}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.occupation}:
                                </strong>{" "}
                                {convertToTitleCase(data.occupation)}
                            </li>
                        </ul>
                    </div>
                    <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                        <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                            <FaCity />
                            {dict.commons.beneficiaries.beneficiaryId.address}
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>{dict.commons.beneficiaries.beneficiaryId.address}:</strong>{" "}
                                {convertToTitleCase(data.address.address_line_1)} -{" "}
                                {convertToTitleCase(data.address.address_line_2)}
                            </li>
                            <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100 lg:flex-col lg:gap-0">
                                <li className="p-2 text-sm text-slate-900 lg:w-full lg:text-start">
                                    <strong>
                                        {dict.commons.beneficiaries.beneficiaryId.city}:
                                    </strong>{" "}
                                    {convertToTitleCase(data.address.city)}
                                </li>
                                <li className="p-2 text-sm text-slate-900 lg:border-t-[1px] lg:border-slate-100 lg:w-full lg:text-start">
                                    <strong>
                                        {dict.commons.beneficiaries.beneficiaryId.state}:
                                    </strong>{" "}
                                    {convertToTitleCase(data.address.district)}
                                </li>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100 lg:flex-col lg:gap-0">
                                <li className="p-2 text-sm text-slate-900 lg:w-full lg:text-start">
                                    <strong>
                                        {dict.commons.beneficiaries.beneficiaryId.zipCode}:
                                    </strong>{" "}
                                    {convertToTitleCase(data.address.zip_code)}
                                </li>
                                <li className="p-2 text-sm text-slate-900 lg:border-t-[1px] lg:border-slate-100 lg:w-full lg:text-start">
                                    <strong>
                                        {dict.commons.beneficiaries.beneficiaryId.country}:
                                    </strong>{" "}
                                    {convertToTitleCase(data.address.country)}
                                </li>
                            </div>
                        </ul>
                        <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4 flex flex-wrap items-center gap-2">
                            <MdContactEmergency />
                            {dict.commons.beneficiaries.beneficiaryId.emergencyContacts}
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.emergencyName}:
                                </strong>{" "}
                                {convertToTitleCase(data.emergency_contacts[0].full_name)}
                            </li>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.emergencyRelationship}
                                    :
                                </strong>{" "}
                                {RELATIONSHIPS_MAPPING[
                                    data.emergency_contacts[0]
                                        .relationship as keyof typeof RELATIONSHIPS_MAPPING
                                ] || data.emergency_contacts[0].relationship}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap items-center gap-2">
                                <strong>
                                    {dict.commons.beneficiaries.beneficiaryId.emergencyEmail}:
                                </strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.emergency_contacts[0].emails[0] &&
                                                data.emergency_contacts[0].emails[0]}
                                            {data.emergency_contacts[0].emails.length >= 2 && (
                                                <Badge variant="outline">
                                                    +{data.emergency_contacts[0].emails.length - 1}
                                                </Badge>
                                            )}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            E-mails
                                        </h3>
                                        <ul>
                                            {data.emergency_contacts[0].emails.map(email => (
                                                <li className="text-slate-500 w-full text-xs flex flex-wrap items-center gap-2">
                                                    <MdMail /> {email}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap items-center gap-2">
                                <strong>{dict.commons.beneficiaries.beneficiaryId.phone}:</strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.emergency_contacts[0].phones[0] &&
                                                data.phones[0].split("_").join(" ")}
                                            {data.emergency_contacts[0].phones.length >= 2 && (
                                                <Badge variant="outline">
                                                    +{data.emergency_contacts[0].phones.length - 1}
                                                </Badge>
                                            )}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            {dict.commons.beneficiaries.beneficiaryId.phones}
                                        </h3>
                                        <ul>
                                            {data.emergency_contacts[0].phones.map(phone => (
                                                <li className="text-slate-500 w-full text-xs flex flex-wrap items-center gap-2">
                                                    <MdPhone /> {phone.split("_").join(" ")}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col">
                    <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                        <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex flex-wrap items-center gap-2">
                            <FaBriefcaseMedical />
                            {dict.commons.beneficiaries.create.medical.title}
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.allergies}:
                                </strong>{" "}
                                {data.medical_information.allergies.join(", ") || dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.currentMedications}:
                                </strong>{" "}
                                {data.medical_information.current_medications.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {
                                        dict.commons.beneficiaries.create.medical
                                            .chronicMedicalConditions
                                    }
                                    :
                                </strong>{" "}
                                {data.medical_information.recurrent_medical_conditions.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.healthInsurance}:
                                </strong>{" "}
                                {data.medical_information.health_insurance_plans.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.bloodType}:
                                </strong>{" "}
                                {data.medical_information.blood_type || "Não informado"}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.vaccinations}:
                                </strong>{" "}
                                {data.medical_information.taken_vaccines.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.mentalHealth}:
                                </strong>{" "}
                                {data.medical_information.mental_health_history.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>{dict.commons.beneficiaries.create.medical.height}:</strong>{" "}
                                {data.medical_information.height > 0
                                    ? `${data.medical_information.height}cm`
                                    : dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>{dict.commons.beneficiaries.create.medical.weight}:</strong>{" "}
                                {data.medical_information.weight > 0
                                    ? `${data.medical_information.weight}kg`
                                    : dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.addictions}:
                                </strong>{" "}
                                {data.medical_information.addictions.join(", ") || dict.notInformed}{" "}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {dict.commons.beneficiaries.create.medical.disabilities}:
                                </strong>{" "}
                                {data.medical_information.disabilities.join(", ") ||
                                    dict.notInformed}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>
                                    {
                                        dict.commons.beneficiaries.create.medical
                                            .prothesisOrMedicalDevices
                                    }
                                    :
                                </strong>{" "}
                                {data.medical_information.prothesis_or_medical_devices.join(", ") ||
                                    dict.notInformed}
                            </li>
                        </ul>
                    </div>
                    <div className="w-full grow border-[1px] border-relif-orange-200 rounded-lg overflow-hidden">
                        <h3 className="pt-4 pl-4 pr-4 text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                            <MdNoteAlt />
                            Notes
                        </h3>
                        <div className="w-full h-[calc(100%-53px)] p-4">
                            <textarea
                                className="flex h-full resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white focus:outline-none"
                                readOnly
                            >
                                {data.notes}
                            </textarea>
                        </div>

                        {/*  <ul className="h-[480px] overflow-y-scroll overflow-x-hidden pt-2 pb-4 pl-4 pr-4 flex flex-col gap-2"> */}
                        {/*      <Link href="#"> */}
                        {/*          <li className="w-full rounded-md bg-relif-orange-200/10 flex gap-4 p-4 hover:bg-relif-orange-200/20 cursor-pointer"> */}
                        {/*              <div className="w-[80px] h-[80px] rounded-full overflow-hidden"> */}
                        {/*                  <Image */}
                        {/*                      src="https://github.com/anthonyvii27.png" */}
                        {/*                      alt="Family image" */}
                        {/*                      width={80} */}
                        {/*                      height={80} */}
                        {/*                      className="p-[1px] border-2 rounded-full border-relif-orange-200" */}
                        {/*                  /> */}
                        {/*              </div> */}
                        {/*              <div className="h-max w-[calc(100%-80px)] flex flex-col"> */}
                        {/*                  <span className="w-full text-sm text-slate-900 font-bold"> */}
                        {/*                      Samanta Marks Oliver */}
                        {/*                  </span> */}
                        {/*                  <span className="w-full text-sm text-slate-500 mt-2 flex items-center gap-1"> */}
                        {/*                      <FaBirthdayCake /> March 24, 1987 */}
                        {/*                  </span> */}
                        {/*                  <div className="mt-3 flex gap-2"> */}
                        {/*                      <span> */}
                        {/*                          <Badge className="flex">Wife</Badge> */}
                        {/*                      </span> */}
                        {/*                      <span> */}
                        {/*                          <Badge className="bg-relif-orange-400 flex items-center gap-1"> */}
                        {/*                              <MdSpaceDashboard /> */}
                        {/*                              In the same space */}
                        {/*                          </Badge> */}
                        {/*                      </span> */}
                        {/*                      <span> */}
                        {/*                          <Badge className="bg-relif-orange-400 flex items-center gap-1"> */}
                        {/*                              <MdSpaceDashboard /> */}
                        {/*                              In another space */}
                        {/*                          </Badge> */}
                        {/*                      </span> */}
                        {/*                  </div> */}
                        {/*              </div> */}
                        {/*          </li> */}
                        {/*      </Link> */}
                        {/*  </ul> */}
                    </div>
                </div>
            </div>
        );
    }

    return <div />;
};

export { Content };
