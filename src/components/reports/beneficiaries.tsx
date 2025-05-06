"use client";

import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ReactNode } from "react";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: "#FFF",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    listItem: {
        marginBottom: 10,
        padding: 10,
        borderBottom: "1px solid #e0e0e0",
    },
    itemHeader: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#222",
    },
    itemText: {
        fontSize: 10,
        color: "#444",
        marginBottom: 2,
    },
    footer: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 12,
        color: "#777",
    },
});

const CIVIL_STATUS_MAPPING = {
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    widowed: "Widowed",
    separated: "Separated",
    "common-law-marriage": "Common-Law Marriage",
    "in-a-relationship": "In a Relationship",
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

type MyDocumentProps = {
    title: string;
    beneficiaries: BeneficiarySchema[];
};

const PDFDocument = ({ title, beneficiaries }: MyDocumentProps): ReactNode => {
    const date = new Date();
    const datetime = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>{title}</Text>
                <View>
                    {beneficiaries?.map(beneficiary => (
                        <View style={styles.listItem} key={beneficiary.id}>
                            <Text style={styles.itemHeader}>
                                Name: {convertToTitleCase(beneficiary.full_name)}
                            </Text>
                            <Text style={styles.itemText}>E-mail: {beneficiary.email}</Text>
                            <Text style={styles.itemText}>Birthdate: {beneficiary.birthdate}</Text>
                            <Text style={styles.itemText}>
                                Civil Status:{" "}
                                {
                                    CIVIL_STATUS_MAPPING[
                                        beneficiary.civil_status as keyof typeof CIVIL_STATUS_MAPPING
                                    ]
                                }
                            </Text>
                            <Text style={styles.itemText}>
                                Gender:{" "}
                                {GENDER_MAPPING[beneficiary.gender as keyof typeof GENDER_MAPPING]}
                            </Text>
                            <Text style={styles.itemText}>
                                Occupation: {beneficiary.occupation}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.footer}>Generated at: {datetime}</Text>
            </Page>
        </Document>
    );
};

export { PDFDocument };
