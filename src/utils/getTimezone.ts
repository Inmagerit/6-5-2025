export const getTimezone = (): string => {
    const date = new Date();
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetInHours = offsetInMinutes / 60;

    return offsetInHours > 0 ? `UTC-${Math.abs(offsetInHours)}` : `UTC+${Math.abs(offsetInHours)}`;
};
