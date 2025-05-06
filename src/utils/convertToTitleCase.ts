const convertToTitleCase = (value: string): string =>
    value
        ?.toLowerCase()
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export { convertToTitleCase };
