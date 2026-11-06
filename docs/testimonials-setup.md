# Testimonials: setup (one-time, ~10 minutes)

How it works

1. A visitor clicks **Leave a testimonial** on the site. It opens **your Google Form** in a new tab and
   they fill it in there, on Google's own page.
2. The answer lands in the form's **Google Sheet**, tagged *not approved*. Nothing appears on the site.
3. You tick **Approved** on the rows you like.
4. A second tab, **Published**, lists only approved rows. That tab (and only that tab) is
   published to the web as CSV, and the site reads it.

Because visitors submit on Google's page, the browser, Google and the visitor all see the real result
(Google shows its own "Your response has been recorded" page, or an error). Nothing on our side can
silently drop a submission. Nothing is shown on the site until you tick the box.

## 1. Create the form

Create a Google Form with these four questions, **in this order**, all "Short answer" except the
fourth, which is "Paragraph":

| # | Question title | Type         | Notes |
|---|----------------|--------------|-------|
| 1 | Name           | Short answer | Required |
| 2 | Role           | Short answer | Optional |
| 3 | Company        | Short answer | Optional |
| 4 | Testimonial    | Paragraph    | Required. Add *Response validation → Maximum character count → 600* |

The site reads the Sheet by **column position**, so keep the order. Don't add a fifth question.

Because people fill it in without signing in, keep these settings **OFF**: *Collect email addresses*,
*Limit to 1 response*, *Restrict to users in your organisation*, and any *File upload* question.

Make the form feel like the site: Form → **Customize theme** (colour, font, header image). Add a
description such as "Thanks for the kind words. Puru reads every one before it appears on his site."

Under **Responses → Link to Sheets**, create the linked Sheet.

## 2. Point the site at the form

Open the form → **Send** (top right) → the link icon → copy the link (it looks like
`https://docs.google.com/forms/d/e/1FAIpQLSc…/viewform`) and paste it into `TESTIMONIAL_FORM_URL`
in `src/config.ts`.

## 3. Add the approval checkbox

In the linked Sheet, the form tab ("Form Responses 1") has columns
**A** Timestamp, **B** Name, **C** Role, **D** Company, **E** Testimonial.

- Click the header cell of **F**, type `Approved`.
- Select `F2:F1000` → **Insert → Checkbox**.

## 4. Create the Published tab

1. Add a new tab called `Published`.
2. In cell `A1`, paste:

   ```
   =QUERY('Form Responses 1'!A:F, "select A, B, C, D, E where F = TRUE order by A desc", 1)
   ```

   If your first tab has a different name, change it inside the quotes.
   The tab now mirrors only the rows you have ticked.

## 5. Publish only that tab

**File → Share → Publish to web** → choose the **Published** tab (not "Entire document") →
format **Comma-separated values (.csv)** → **Publish**. Copy the link and paste it into
`APPROVED_TESTIMONIALS_CSV_URL` in `src/config.ts`.

> Do not publish the entire document: that would expose the pending rows too.

## 6. Deploy

Commit the two values in `src/config.ts` and push to `main`. They are public by nature (the form link
only allows posting; the CSV only contains approved rows).

## Day to day

- Open the Sheet, read new rows, tick **Approved** on good ones. Untick to take one down.
- Google refreshes the published CSV every few minutes, so a ticked row can take ~5 minutes to
  show on the site.
- Delete a row in the form tab to remove it permanently.
- Recommended: in the form, **Responses → ⋮ → Get email notifications for new responses**. You get an
  email for every submission, a second record in case a row is ever missing from the Sheet.

## If a submission seems to be missing

1. The form's own **Responses → Individual** tab shows every submission, even if the Sheet is filtered
   or unlinked.
2. In the Sheet, look for another tab ("Form Responses 2" appears if the form was re-linked), an active
   filter, or a sort hiding rows. The Timestamp column uses the Sheet's timezone (File → Settings).
3. Check the form is still **accepting responses** (Responses tab toggle) and has no response limit.
4. Check your email notifications.
