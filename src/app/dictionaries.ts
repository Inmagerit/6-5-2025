import { Locale } from "@/app/i18n-config";
import "server-only";

const dictionaries = {
    en: () => import("./_dictionaries/en.json").then(module => module.default),
    es: () => import("./_dictionaries/es.json").then(module => module.default),
    pt: () => import("./_dictionaries/pt.json").then(module => module.default),
};

export const getDictionary = async (locale: Locale): Promise<any> =>
    // @ts-ignore
    dictionaries[locale]?.() ?? dictionaries.en();
