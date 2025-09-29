import { URL } from "url";

const TRUSTED_DOMAINS = new Set(["localhost", "127.0.0.1"]);

// List of suspicious TLDs that often host malicious content
const SUSPICIOUS_TLDS = new Set([
  "tk",
  "ml",
  "ga",
  "cf",
  "click",
  "download",
  "zip",
  "review",
  "date",
  "loan",
]);

// Common phishing keywords
const PHISHING_KEYWORDS = [
  "login",
  "signin",
  "verify",
  "account",
  "secure",
  "update",
  "suspended",
  "bank",
  "paypal",
  "amazon",
  "google",
  "microsoft",
  "apple",
  "facebook",
];

export interface UrlValidationResult {
  isValid: boolean;
  isTrusted: boolean;
  warnings: string[];
  riskLevel: "low" | "medium" | "high";
}

export function validateRedirectUrl(url: string): UrlValidationResult {
  const result: UrlValidationResult = {
    isValid: true,
    isTrusted: false,
    warnings: [],
    riskLevel: "low",
  };

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const path = parsedUrl.pathname.toLowerCase();

    // Check if protocol is safe
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      result.isValid = false;
      result.warnings.push(
        "Invalid protocol. Only HTTP and HTTPS are allowed.",
      );
      result.riskLevel = "high";
      return result;
    }

    // Check if domain is trusted
    if (TRUSTED_DOMAINS.has(hostname)) {
      result.isTrusted = true;
      return result;
    }

    // Check for suspicious TLD
    const tld = hostname.split(".").pop() || "";
    if (SUSPICIOUS_TLDS.has(tld)) {
      result.warnings.push(`Suspicious top-level domain: .${tld}`);
      result.riskLevel = "medium";
    }

    // Check for phishing keywords in hostname or path
    const fullUrl = (hostname + path).toLowerCase();
    const foundKeywords = PHISHING_KEYWORDS.filter((keyword) =>
      fullUrl.includes(keyword),
    );

    if (foundKeywords.length > 0) {
      result.warnings.push(
        `Potential phishing indicators found: ${foundKeywords.join(", ")}`,
      );
      result.riskLevel = "medium";
    }

    // Check for IP addresses instead of domains
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      if (!["127.0.0.1", "localhost"].includes(hostname)) {
        result.warnings.push("Direct IP address access detected");
        result.riskLevel = "medium";
      }
    }

    // Check for suspicious URL patterns
    if (
      parsedUrl.pathname.includes("..") ||
      parsedUrl.pathname.includes("//")
    ) {
      result.warnings.push("Suspicious path traversal patterns detected");
      result.riskLevel = "high";
    }

    // Check for extremely long URLs (potential for hiding malicious content)
    if (url.length > 2000) {
      result.warnings.push("Unusually long URL detected");
      result.riskLevel = "medium";
    }

    return result;
  } catch (error) {
    result.isValid = false;
    result.warnings.push("Invalid URL format");
    result.riskLevel = "high";
    return result;
  }
}

export function addTrustedDomain(domain: string): void {
  TRUSTED_DOMAINS.add(domain.toLowerCase());
}

export function removeTrustedDomain(domain: string): void {
  TRUSTED_DOMAINS.delete(domain.toLowerCase());
}

export function getTrustedDomains(): string[] {
  return Array.from(TRUSTED_DOMAINS);
}
