/**
 * Phone Number Utilities
 * 
 * Normalize and validate phone numbers.
 * Primary identity for users and leads.
 */

import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

const DEFAULT_COUNTRY: CountryCode = 'AU';

/**
 * Normalize phone number to E.164 format
 * E.164 format: +61412345678 (no spaces, includes country code)
 */
export function normalizePhone(phone: string, defaultCountry: CountryCode = DEFAULT_COUNTRY): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Handle Australian mobile numbers starting with 04
  if (cleaned.startsWith('04') && defaultCountry === 'AU') {
    cleaned = '+61' + cleaned.substring(1);
  }
  
  // Handle numbers starting with 0 (local format)
  if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    // Assume it's a local number, prepend country code
    const countryCode = getCountryDialCode(defaultCountry);
    cleaned = '+' + countryCode + cleaned.substring(1);
  }
  
  // Handle numbers without country code
  if (!cleaned.startsWith('+')) {
    const countryCode = getCountryDialCode(defaultCountry);
    cleaned = '+' + countryCode + cleaned;
  }
  
  try {
    const parsed = parsePhoneNumber(cleaned);
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164');
    }
  } catch {
    // Fall through to return cleaned version
  }
  
  return cleaned;
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string, defaultCountry: CountryCode = DEFAULT_COUNTRY): boolean {
  if (!phone) return false;
  
  try {
    const normalized = normalizePhone(phone, defaultCountry);
    return isValidPhoneNumber(normalized);
  } catch {
    return false;
  }
}

/**
 * Format phone number for display
 */
export function formatPhoneDisplay(phone: string, defaultCountry: CountryCode = DEFAULT_COUNTRY): string {
  if (!phone) return '';
  
  try {
    const normalized = normalizePhone(phone, defaultCountry);
    const parsed = parsePhoneNumber(normalized);
    
    if (parsed) {
      // Use national format for same-country numbers
      if (parsed.country === defaultCountry) {
        return parsed.formatNational();
      }
      // Use international format for other countries
      return parsed.formatInternational();
    }
  } catch {
    // Fall through
  }
  
  return phone;
}

/**
 * Get country dial code
 */
function getCountryDialCode(country: CountryCode): string {
  const codes: Record<string, string> = {
    AU: '61',
    NZ: '64',
    US: '1',
    GB: '44',
  };
  return codes[country] || '61';
}

/**
 * Extract country from phone number
 */
export function getPhoneCountry(phone: string): CountryCode | undefined {
  try {
    const normalized = normalizePhone(phone);
    const parsed = parsePhoneNumber(normalized);
    return parsed?.country;
  } catch {
    return undefined;
  }
}

/**
 * Create a dedup key from phone number
 * Used for lead deduplication
 */
export function phoneDedupeKey(phone: string): string {
  const normalized = normalizePhone(phone);
  // Remove the + for consistent dedup key
  return `phone:${normalized.replace('+', '')}`;
}
