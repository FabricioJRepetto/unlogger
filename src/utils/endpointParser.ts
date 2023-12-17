export const endpointParser = (value: string): string => {
    // eslint-disable-next-line
    const url = value.match(/"https:[\w\d\/\-\.]*"/g);
    if (url) {
        return "/v1/bfft" + url[0].split("/v1/bfft")[1].slice(0, -1);
    }
    return "";
};
