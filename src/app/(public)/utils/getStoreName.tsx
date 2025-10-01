// // utils/getStoreName.ts
// export function getStoreNameFromHost(host?: string): string | null {
//   if (!host && typeof window !== "undefined") {
//     host = window.location.host; // e.g., "nuvance.localhost:3000"
//   }

//   if (!host) return null;

//   // Remove port if present
//   const withoutPort = host.split(":")[0]; // "nuvance.localhost"

//   // Split into parts
//   const parts = withoutPort.split("."); // ["nuvance", "localhost"]

//   if (parts.length === 1) {
//     // e.g., "localhost" → no subdomain
//     return null;
//   }

//   let firstPart = parts[0].toLowerCase();

//   // Skip "www"
//   if (firstPart === "www") {
//     if (parts.length > 1) {
//       firstPart = parts[1].toLowerCase();
//     } else {
//       return null; // no usable subdomain
//     }
//   }

//   return firstPart;
// }




// src/utils/getStoreName.ts
export function getStoreNameFromHost(host?: string): string | null {
  if (!host && typeof window !== "undefined") {
    host = window.location.host;
  }

  if (!host) return null;

  // Remove port if present
  const withoutPort = host.split(":")[0];

  // Split into parts
  const parts = withoutPort.split(".");

  if (parts.length === 1) {
    // Single part means no subdomain (e.g., "localhost")
    return null;
  }

  let subdomain = parts[0].toLowerCase();

  // Skip "www" prefix
  if (subdomain === "www" && parts.length > 2) {
    subdomain = parts[1].toLowerCase();
  } else if (subdomain === "www") {
    // Only "www.domain.com" format, no usable subdomain
    return null;
  }

  // Validate subdomain format (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return null;
  }

  return subdomain;
}