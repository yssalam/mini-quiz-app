export const getRemainingSeconds = (expiresAt) => {
  if (!expiresAt) return 0;

  const now = Date.now();
  const expireTime = new Date(expiresAt).getTime();
  const diff = Math.floor((expireTime - now) / 1000);

  return diff > 0 ? diff : 0;
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
