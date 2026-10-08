export function getAllowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS;
  if (!raw) {
    return ["http://localhost:5173"];
  }
  return raw.split(",").map((origin) => origin.trim());
}
