// utils/getStoreName.ts
export function getStoreNameFromHost(host?: string): string | null {
  if (!host && typeof window !== "undefined") {
    host = window.location.host; // e.g., "nuvance.localhost:3000"
  }

  if (!host) return null;

  // Remove port if present
  const withoutPort = host.split(":")[0]; // "nuvance.localhost"

  // Split into parts
  const parts = withoutPort.split("."); // ["nuvance", "localhost"]

  if (parts.length === 1) {
    // e.g., "localhost" → no subdomain
    return null;
  }

  let firstPart = parts[0].toLowerCase();

  // Skip "www"
  if (firstPart === "www") {
    if (parts.length > 1) {
      firstPart = parts[1].toLowerCase();
    } else {
      return null; // no usable subdomain
    }
  }

  return firstPart;
}
