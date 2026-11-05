# Testimonials: setup (one-time, ~10 minutes)

How it works

1. A visitor fills in "Leave a testimonial". The site posts it to **your Google Form**.
2. The answer lands in the form's **Google Sheet**, tagged *not approved*. Nothing appears on the site.
3. You tick **Approved** on the rows you like.
4. A second tab, **Published**, lists only approved rows. That tab (and only that tab) is
   published to the web as CSV, and the site reads it.

Anyone can technically post to a Google Form, so the real protection is step 3: **nothing is shown
until you tick the box.**

## 1. Create the form

Create a Google Form with exactly these four questions, **in this order**, all "Short answer"
except the fourth, which is "Paragraph":

| # | Question title | Type       | Notes |
|---|----------------|------------|-------|
| 1 | Name           | Short answer | Required |
| 2 | Role           | Short answer | Optional |
| 3 | Company        | Short answer | Optional |
| 4 | Testimonial    | Paragraph  | Required. Add *Response validation → Maximum character count → 600* |

Add the same validation to Name, Role and Company (max 60 each) if you like; the site already enforces
these, but Google would enforce them for direct posts too.

**Form settings that must stay OFF** (they force a Google sign-in, which makes the site's
anonymous post fail silently): *Collect email addresses*, *Limit to 1 response*, *Restrict to
users in your organisation*, and any *File upload* question. Don't add a fifth question either:
the site only knows these four.

Under **Responses → Link to Sheets**, create the linked Sheet.

## 2. Get the form id and the four `entry.` ids

1. Form menu (⋮) → **Get pre-filled link**. Type `A`, `B`, `C`, `D` into the four questions (Name, Role, Company, Testimonial) → **Get link** → copy it.
2. It looks like  
   `https://docs.google.com/forms/d/e/1FAIpQLSc…/viewform?usp=pp_url&entry.111=A&entry.222=B&entry.333=C&entry.444=D`
3. In `src/config.ts`:
   - `TESTIMONIAL_FORM.formId` = the `1FAIpQLSc…` part
   - `fields.name` = `entry.111`, `fields.role` = `entry.222`, `fields.company` = `entry.333`, `fields.quote` = `entry.444`  
     (match them by the letters you typed: A = name, B = role, C = company, D = testimonial)

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

Commit the two values in `src/config.ts` and push to `main`. They are public by nature (the
form id only allows posting; the CSV only contains approved rows).

## Day to day

- Open the Sheet, read new rows, tick **Approved** on good ones. Untick to take one down.
- Google refreshes the published CSV every few minutes, so a ticked row can take ~5 minutes to
  show on the site.
- Delete a row in the form tab to remove it permanently.
- Optional: in the form, **Responses → ⋮ → Get email notifications for new responses**.
