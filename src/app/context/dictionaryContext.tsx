"use client";

import { createContext, ReactNode, useContext } from "react";

export const DictionaryContext = createContext<any>(null);

export const useDictionary = (): any => useContext(DictionaryContext);

export const DictionaryProvider = ({
    children,
    dict,
}: {
    children: ReactNode;
    dict: any;
}): ReactNode => {
    return <DictionaryContext.Provider value={dict}>{children}</DictionaryContext.Provider>;
};
