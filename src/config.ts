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
export const TESTIMONIAL_FORM = {
  /** The long id in https://docs.google.com/forms/d/e/<formId>/viewform */
  formId: '1FAIpQLSfcFVyEiMC6wJl5fY4wXF-3wZzgKGLyQFoe9prR1QagfdCYew',
  /** "entry.123456789" ids of the four form questions (see the setup doc). */
  fields: {
    name: 'entry.1901955409',
    role: 'entry.717920984',
    company: 'entry.1358702822',
    quote: 'entry.893332778',
  },
};

/** "Publish to web" CSV link of the Sheet tab that contains ONLY approved rows. */
export const APPROVED_TESTIMONIALS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQlFhHQGwMccm-EHj5VIhhII1wrS8iQmZW88LRmX4GQx-fI9Tcj4hAGD_qtb6uCNtW7aS5WGedDImU/pub?gid=1729495775&single=true&output=csv';
