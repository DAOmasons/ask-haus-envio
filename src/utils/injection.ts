export const injectLocalLink = ({
  to,
  label,
}: {
  to: string;
  label: string;
}) => {
  return `##LOCAL_LINK##${label}##${to}##`;
};
