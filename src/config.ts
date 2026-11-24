/**
 * Draft switches: set a flag to true to show a section on the site again.
 * A hidden section is removed from the page AND from the side navigation.
 */
export const SHOW_WORKING_WITH_ME = false;

/**
 * Testimonials: visitors submit through a Google Form, you approve rows in the
 * linked Google Sheet, and only approved rows are published back to the site.
 * Full setup steps: docs/testimonials-setup.md
 *
 * Leave these empty until the Form/Sheet exist; the form then shows a
 * "not connected yet" message instead of pretending to publish.
 */
export const TESTIMONIAL_FORM_URL = 'https://forms.gle/B9CtHHCWardJTLPd6';

/**
 * Order of testimonials on the page, by first name (case doesn't matter).
 * Anyone not listed here follows after, in the order they appear in the Sheet.
 */
export const TESTIMONIAL_ORDER = ['Jribh', 'Satvik', 'Kunal'];

/**
 * The short phrase shown big on the front card of each testimonial, by first name.
 * Wrap the words to colour in [[ ]]; the same words are also marked inside the full quote.
 * Anyone not listed here gets the first sentence of their testimonial instead.
 */
export const TESTIMONIAL_HIGHLIGHTS: Record<string, string> = {
  Jribh: 'Soon [[owning problems end to end]] with little hand-holding.',
  Satvik: 'Someone I’d [[put my money on!]] and quite literally have.',
  Kunal: 'One of the founding members who [[helped shape AkaiSpace’s identity.]]',
};

/** "Publish to web" CSV link of the Sheet tab that contains ONLY approved rows. */
export const APPROVED_TESTIMONIALS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQlFhHQGwMccm-EHj5VIhhII1wrS8iQmZW88LRmX4GQx-fI9Tcj4hAGD_qtb6uCNtW7aS5WGedDImU/pub?gid=1729495775&single=true&output=csv';
