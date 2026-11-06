/**
 * Finds a company's logo from the name typed in the testimonial form.
 *
 * The name is turned into a short list of candidate domains (known companies first, then a guess made
 * from the name itself), and each is looked up as a favicon at Google's public icon service. For a domain
 * it has no icon for, the service answers 404 *with* a 16x16 placeholder picture, and a page cannot read
 * that status. Real logos come back at the requested 128px, so a picture is accepted only when it is
 * wider than MIN_LOGO_PX (see below). The caller tries the candidates in order and falls back to a generic
 * building icon, so a wrong guess costs nothing but a missed logo (and companies that only publish a tiny
 * 16px favicon get the building icon rather than a blurry logo).
 *
 * To correct or add a company, add it to KNOWN below (key: the name in lowercase letters and digits only).
 */
const KNOWN: Record<string, string> = {
  google: 'google.com',
  alphabet: 'abc.xyz',
  microsoft: 'microsoft.com',
  amazon: 'amazon.com',
  aws: 'aws.amazon.com',
  apple: 'apple.com',
  meta: 'meta.com',
  facebook: 'facebook.com',
  netflix: 'netflix.com',
  adobe: 'adobe.com',
  figma: 'figma.com',
  airbnb: 'airbnb.com',
  uber: 'uber.com',
  spotify: 'spotify.com',
  linkedin: 'linkedin.com',
  stripe: 'stripe.com',
  notion: 'notion.so',
  atlassian: 'atlassian.com',
  salesforce: 'salesforce.com',
  oracle: 'oracle.com',
  ibm: 'ibm.com',
  intel: 'intel.com',
  nvidia: 'nvidia.com',
  samsung: 'samsung.com',
  sony: 'sony.com',
  flipkart: 'flipkart.com',
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  razorpay: 'razorpay.com',
  paytm: 'paytm.com',
  phonepe: 'phonepe.com',
  cred: 'cred.club',
  infosys: 'infosys.com',
  tcs: 'tcs.com',
  tataconsultancyservices: 'tcs.com',
  wipro: 'wipro.com',
  accenture: 'accenture.com',
  deloitte: 'deloitte.com',
};

/**
 * Some icon files carry built-in padding, so the mark looks small next to logos that fill their file.
 * These get scaled up (visually only; layout is unchanged) to match.
 */
const PADDED: Record<string, number> = {
  'google.com': 1.45,
};
export const logoScale = (domain: string) => PADDED[domain] ?? 1;

/** The service's "not found" placeholder (and tiny favicons) are 16px; anything wider is a usable logo. */
export const MIN_LOGO_PX = 16;

/** Words that are not part of a company's domain. */
const FILLER = new Set(['inc', 'ltd', 'llc', 'llp', 'pvt', 'private', 'limited', 'corp', 'corporation', 'co', 'company', 'the']);

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Candidate domains for a company name, best guess first. */
export function companyDomains(name: string): string[] {
  const k = key(name);
  if (!k) return [];
  if (KNOWN[k]) return [KNOWN[k]];

  const words = name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !FILLER.has(w));
  const out: string[] = [];
  if (words.length && words.length <= 3) out.push(`${words.join('')}.com`);
  // "Ge3s Sustainability" -> ge3s.com (only for a distinctive first word)
  if (words.length > 1 && words[0].length >= 4) out.push(`${words[0]}.com`);
  return [...new Set(out)];
}

/** Favicon URL for a domain; 404 when the service has no icon for it. */
export const faviconUrl = (domain: string, size = 128) =>
  `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=${size}`;
