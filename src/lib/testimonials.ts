import { APPROVED_TESTIMONIALS_CSV_URL, TESTIMONIAL_FORM } from '../config';
import { parseCsv } from './csv';

export const LIMITS = { name: 60, role: 60, company: 60, quote: 600 } as const;

export interface ApprovedTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface TestimonialSubmission {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export function isSubmissionConfigured(): boolean {
  const { formId, fields } = TESTIMONIAL_FORM;
  return Boolean(formId && fields.name && fields.role && fields.company && fields.quote);
}

/**
 * Sends a submission to the Google Form. Google doesn't allow reading the
 * response cross-origin, so `no-cors` gives an opaque result: we can only tell
 * that the request left the browser, not that Google accepted it.
 */
export async function submitTestimonial(t: TestimonialSubmission): Promise<void> {
  if (!isSubmissionConfigured()) throw new Error('not-configured');
  const { formId, fields } = TESTIMONIAL_FORM;
  const body = new URLSearchParams({
    [fields.name]: t.name.slice(0, LIMITS.name),
    [fields.role]: t.role.slice(0, LIMITS.role),
    [fields.company]: t.company.slice(0, LIMITS.company),
    [fields.quote]: t.quote.slice(0, LIMITS.quote),
  });
  await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
    method: 'POST',
    mode: 'no-cors',
    body,
  });
}

/**
 * Reads the published CSV of approved rows. Expected columns, in order:
 * Timestamp, Name, Role, Company, Testimonial. First row is the header.
 * Never throws: on any failure the page just shows no community testimonials.
 */
export async function fetchApprovedTestimonials(signal?: AbortSignal): Promise<ApprovedTestimonial[]> {
  if (!APPROVED_TESTIMONIALS_CSV_URL) return [];
  try {
    const res = await fetch(APPROVED_TESTIMONIALS_CSV_URL, { signal });
    if (!res.ok) return [];
    const rows = parseCsv(await res.text()).slice(1);
    const out: ApprovedTestimonial[] = [];
    rows.forEach((r, i) => {
      const [timestamp = '', name = '', role = '', company = '', quote = ''] = r.map((c) => c.trim());
      if (!name || !quote) return;
      out.push({
        id: `approved-${i}-${timestamp}`,
        name: name.slice(0, LIMITS.name),
        role: role.slice(0, LIMITS.role),
        company: company.slice(0, LIMITS.company),
        quote: quote.slice(0, LIMITS.quote),
      });
    });
    return out;
  } catch {
    return [];
  }
}
