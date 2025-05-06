const flattenObject = (obj: any, parentKey: string = "", res: any = {}) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parentKey ? `${parentKey}_${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
                flattenObject(obj[key], newKey, res);
            } else {
                res[newKey] = obj[key];
            }
        }
    }
    return res;
};

export { flattenObject };
