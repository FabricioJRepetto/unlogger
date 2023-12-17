export const curlType = (value: string) => {
  const method = value.match(/curl -X \w{3,6}/g);
  if (method) {
    return method[0].slice(8);
  }
  return "UNKNOWN";
};
