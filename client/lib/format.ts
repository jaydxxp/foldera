export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  const value = bytes / 1024 ** i;

  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
};

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
