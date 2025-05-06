"use client";

import { SpaceSchema } from "@/types/space.types";
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

type MyDocumentProps = {
    title: string;
    spaces: SpaceSchema[];
};

const PDFDocument = ({ title, spaces }: MyDocumentProps): ReactNode => {
    const date = new Date();
    const datetime = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>{title}</Text>
                <View>
                    {spaces?.map(space => (
                        <View style={styles.listItem} key={space.id}>
                            <Text style={styles.itemHeader}>{space.name}</Text>
                            <Text style={styles.itemText}>
                                Total vacancies: {space.total_vacancies}
                            </Text>
                            <Text style={styles.itemText}>
                                Occupied vacancies : {space.occupied_vacancies}
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
