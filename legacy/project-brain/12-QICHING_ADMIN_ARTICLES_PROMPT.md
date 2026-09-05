# QIChing Admin — Article & SEO Content Management

---

# 0. Current Repository Reality — Read This First

**This section was added after inspecting the actual QIChing.org repository (2026-09-05). Read it
before Section 51/52 "Engineering Rules" / "Repository Analysis" — it answers most of what Step 1
asks you to go discover, and it exists so no coding agent re-derives (or worse, assumes past) the
following facts.**

QIChing.org today is a **fully static site**, not a dynamic web app with a server:

- **Framework:** Vite 8 + React 19 + `react-router` 8, client-rendered SPA. No Next.js, Remix,
  Express, NestJS, or any server framework. No SSR-at-request-time.
- **Hosting:** Cloudflare **Pages** (static assets only), two projects — `qiching-uat` (UAT) and
  `qiching` (production) — deployed via `wrangler pages deploy dist`. There is currently no
  Cloudflare Pages **Functions**/Workers backend in use.
- **Database:** none. No ORM, no SQL, no Prisma, nothing. Zero.
- **Persistence:** the only "saved" user data is `localStorage` in the visitor's own browser
  (saved hexagram readings, `/que-da-luu`) — it never reaches a server, because there is no server.
- **Authentication:** none exists anywhere in the app. No login, no sessions, no roles, no
  `/admin` route of any kind today.
- **Content model today:** long-form pages are **hand-written React components** under
  `src/pages/*.tsx`, wired into routing in `src/App.tsx`, and listed in `DUONG_DAN_TINH` inside
  `src/ui/duongDan.ts` — the single source of truth for "every valid route" consumed by both the
  prerender script and the sitemap generator. There is no runtime "Article" entity and nothing is
  editable without changing source code.
- **Static generation pipeline:** `scripts/prerender.mjs` runs after `vite build`. For every route
  in `DANH_SACH_DUONG_DAN` it calls `renderToString`, extracts the `<title>`/`<meta>`/canonical
  `<link>` tags rendered by a shared `MetaTrang` React component, re-injects them into `<head>`,
  and writes one **flat `.html` file per route** into `dist/`. It also generates `dist/sitemap.xml`
  and appends redirect rules to `dist/_redirects`. A route only exists on the live site if it was
  in that list **at build time** — there is no dynamic routing fallback for unknown content.
- **noindex mechanism today:** a `khongIndex` prop on `<MetaTrang>` (renders
  `<meta name="robots" content="noindex,...">`) plus a matching `DUONG_DAN_KHONG_INDEX` Set inside
  `prerender.mjs` that excludes the route from `sitemap.xml`. The two must currently be kept in
  sync by hand.
- **Closest existing analog to this spec's "Article":** a guide-article series under
  `/huong-dan/*`. Each guide starts as a Markdown+frontmatter draft in
  `legacy/project-brain/drafts-huong-dan/*.md` (frontmatter records the target route, a
  `trang_thai` field that acts as an informal "has this passed domain/editorial review yet"
  status, and authorship), gets manually reviewed, is then **hand-transcribed into a React
  component** (`src/pages/HuongDan*.tsx`), wired into `src/App.tsx` and `DUONG_DAN_TINH`, and
  shipped `noindex` to UAT first for human review before being made indexable. "Publish" today
  literally means: git commit → `npm run build` → `wrangler pages deploy`. This existing workflow
  already has a richer editorial lifecycle (drafted → reviewed → live-but-noindex → indexable)
  than this spec's plain `DRAFT`/`PUBLISHED` — worth knowing about, not necessarily worth copying.
- **Testing:** Vitest, ~110 tests, all exercising pure business logic (Lục Hào calculations, slug
  generation, routing helpers) — there is no backend integration test harness, because there is no
  backend.

## Decision required before Section 52 Step 3/Step 4 ("Database" / "Backend")

Implementing this spec as literally written (Prisma model, `/api/admin/*`, DB-backed
DRAFT/PUBLISHED, session-based auth with `ADMIN`/`EDITOR` roles) means **adding a server, a
database, and an authentication system to a project that currently has none of the three** — a
foundational, non-trivial, and not-easily-reversed change to hosting model and ongoing operational
cost/maintenance, not merely "add a CMS module" to something that already runs one. A coding agent
must **stop and get explicit human confirmation on which path below to take** before writing any
schema, API route, or auth code — do not infer this choice from the spec's Prisma examples alone,
those are illustrative, not evidence the stack exists.

- **Option A — Real dynamic CMS.** Add actual backend infrastructure: e.g. Cloudflare Pages
  Functions (or Workers) + a database (Cloudflare D1, or an external one) + an auth mechanism
  (e.g. Cloudflare Access in front of `/admin/*`, or a small first-party session/password gate
  implemented in Functions). This makes the rest of this spec applicable close to as-written, but
  is a genuine platform decision: it turns a $0-infra static site into one with a live backend to
  operate, secure, and pay for.
- **Option B — Content-as-code admin tooling.** Keep the current static architecture. Build local
  authoring tooling (could be as simple as a well-structured folder convention + a small CLI/local
  script, or a dev-only local admin UI) that helps a human draft long-form content as structured
  Markdown+frontmatter files — the same shape already used for `drafts-huong-dan/*.md` — with a
  build step that generates/updates the corresponding `src/pages/*.tsx` route and registers it in
  `DUONG_DAN_TINH`. "Draft" = file not yet wired into routes (or wired but `khongIndex`).
  "Publish" = the commit that wires it in (or flips `khongIndex` off) and gets built + deployed.
  No live database and no runtime auth are needed, because the repository + deploy pipeline is
  already the access-control boundary today. Sections that assume a live server
  (5, 11 autosave-to-server, 12 uniqueness-checked-by-query, 14 `publishedAt` set by a live
  request, 24, 26, 27, 38 sitemap, 44) need reinterpreting as build-time/file-based equivalents
  under this option — call this out explicitly when proposing the architecture in Step 2, rather
  than silently reimplementing them as live endpoints.

If the human has not stated a preference, ask before proceeding — do not default silently to
either option, since Option A carries cost/ops implications the project has not signed up for yet,
and Option B does not satisfy the spec's literal wording (e.g. instant publish without a rebuild,
runtime `/admin` behind login) if that turns out to be a hard requirement.

---

## 1. Role

You are a Senior Full-stack Engineer, Product Engineer, and UX-minded Software Architect.

Your task is to design and implement an **Admin Content Management module for QIChing.org**.

The primary purpose of this admin project is to allow the QIChing team to create, edit, preview, publish, and manage long-form content related to:

- Kinh Dịch / I Ching
- 64 quẻ
- Hào từ
- Thoán từ
- Tượng từ
- Âm Dương
- Ngũ Hành
- Bát Quái
- Tiên Thiên / Hậu Thiên Bát Quái
- Hà Đồ / Lạc Thư
- Mai Hoa Dịch Số
- Phong Thủy
- Tử Vi
- Tứ Trụ / Bát Tự
- Triết học phương Đông
- Các nghiên cứu và ghi chú học thuật
- Các bài hướng dẫn sử dụng QIChing.org
- SEO articles / supporting content for QIChing.org

The system should prioritize:

1. Simple editorial workflow
2. Excellent writing experience
3. SEO readiness
4. Structured data
5. Maintainability
6. Fast content publishing
7. Future extensibility

Do not over-engineer the first version.

---

# 2. Product Context

QIChing.org is a platform focused on Kinh Dịch and related Eastern philosophy / metaphysical knowledge.

We want to gradually build a structured knowledge base rather than publishing disconnected blog posts.

The Admin CMS should therefore support both:

### A. Editorial / Research content

Examples:

- Quẻ Càn là gì?
- Ý nghĩa quẻ Khôn
- Cách hiểu hào động
- Quan hệ giữa Tiên Thiên và Hậu Thiên Bát Quái
- Hà Đồ và Lạc Thư khác nhau thế nào?
- Cách đọc một quẻ Kinh Dịch
- Khổng Tử và Thập Dực
- Kinh Dịch dưới góc nhìn triết học

### B. SEO supporting content

Examples:

- Kinh Dịch là gì?
- Gieo quẻ Kinh Dịch online
- Cách gieo quẻ bằng 3 đồng xu
- 64 quẻ Kinh Dịch
- Quẻ Thiên Hỏa Đồng Nhân
- Ý nghĩa hào 1 quẻ Càn
- Kinh Dịch trong tình yêu
- Kinh Dịch trong công việc

### C. Product guides

Some guide content already exists.

Examples:

- Hướng dẫn gieo quẻ
- Hướng dẫn đọc kết quả
- Hướng dẫn sử dụng lịch sử gieo quẻ
- Hướng dẫn đăng nhập
- Hướng dẫn sử dụng một chức năng cụ thể

The CMS should allow these content types to coexist under one article system.

---

# 3. Core User

Primary user:

**QIChing.org administrator / content editor**

The admin should be able to:

- create an article
- write content
- save a draft
- preview exactly how the article will look
- publish the article
- update a published article
- manage SEO metadata
- find existing articles
- manage URLs / slugs
- avoid accidentally losing written content

The admin interface is an internal tool.

Prioritize efficiency and clarity over decorative UI.

---

# 4. Main User Flow

The main editorial flow should be:

```text
Create Article
    ↓
Draft
    ↓
Edit
    ↓
Preview
    ↓
Publish
    ↓
Published
    ↓
Edit / Update if required
```

Article states:

```text
DRAFT
PUBLISHED
```

`Preview` should initially be treated as an **action / presentation mode**, not necessarily a persisted workflow status.

In the UI, the experience may appear as:

```text
Draft → Preview → Published
```

But unless the current architecture requires otherwise, only persist:

```ts
type ArticleStatus = "DRAFT" | "PUBLISHED";
```

This keeps the state model simple.

If there is a strong technical reason to support a persisted preview state, explain the trade-off before implementing it.

---

# 5. Article List Page

Create an admin page similar to:

```text
/admin/articles
```

It should show all articles.

Recommended columns:

| Column | Description |
|---|---|
| Title | Article title |
| Status | Draft / Published |
| Type | Research / SEO / Guide / Other |
| Updated | Last updated time |
| Created | Creation date |
| Published | Published date |
| Actions | Edit / Preview |

Example:

```text
Articles

[ + New Article ]

Search articles...

----------------------------------------------------------------
Title                    Status       Updated           Actions
----------------------------------------------------------------
Kinh Dịch là gì?         Published    05/09/2026        Edit
Quẻ Càn                  Draft        04/09/2026        Edit
64 quẻ Kinh Dịch         Published    01/09/2026        Edit
Hướng dẫn gieo quẻ       Published    25/08/2026        Edit
```

Required functionality:

- Search by title
- Filter by status
- Filter by article type
- Sort by updated date
- Pagination if needed
- New Article button
- Edit article
- Preview article
- Clearly distinguish Draft vs Published

Nice-to-have:

- Filter by author
- Filter by category
- Filter by tag
- Recently edited
- SEO completeness indicator

Do not build unnecessary advanced filters in V1 unless they are easy to support.

---

# 6. Create / Edit Article Page

Suggested routes:

```text
/admin/articles/new
/admin/articles/:id
```

The main editor should prioritize writing.

Suggested layout:

```text
-----------------------------------------------------
< Back to Articles

Article Title

[ Title input ]

[ Slug ]

-----------------------------------------------------

Content Editor

# Heading

Paragraph...

## Section

...

-----------------------------------------------------

SEO Settings

Meta title
Meta description
Canonical URL
OG image

-----------------------------------------------------

Status: Draft

[ Preview ] [ Save Draft ] [ Publish ]
-----------------------------------------------------
```

Desktop UX may use:

```text
Main content column    | Settings sidebar
```

Example:

```text
|--------------------------------|----------------|
|                                | Status         |
| Title                          | Draft          |
|                                |                |
| Editor                         | Category       |
|                                | Tags           |
|                                |                |
|                                | SEO            |
|                                |                |
|                                | Publish        |
|--------------------------------|----------------|
```

Do not force a sidebar on small screens.

---

# 7. Article Fields

Minimum article model:

```ts
Article {
  id
  title
  slug
  excerpt
  content

  status
  type

  metaTitle
  metaDescription
  canonicalUrl

  featuredImage

  createdAt
  updatedAt
  publishedAt
}
```

Recommended extended model:

```ts
Article {
  id: string

  title: string
  slug: string

  excerpt?: string
  content: string

  status: ArticleStatus
  type: ArticleType

  categoryId?: string
  tags?: Tag[]

  featuredImage?: string

  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string

  ogTitle?: string
  ogDescription?: string
  ogImage?: string

  createdAt: Date
  updatedAt: Date
  publishedAt?: Date

  authorId?: string
}
```

Suggested enums:

```ts
enum ArticleStatus {
  DRAFT
  PUBLISHED
}
```

```ts
enum ArticleType {
  RESEARCH
  SEO
  GUIDE
  OTHER
}
```

Do not encode Chinese metaphysical concepts directly into `ArticleType`.

For example, do NOT create:

```text
HEXAGRAM
FENG_SHUI
BAZI
TAOISM
```

as article types.

These belong to taxonomy such as categories/tags.

---

# 8. Categories

The system should be designed to eventually support categories such as:

```text
Kinh Dịch
64 Quẻ
Bát Quái
Hào
Âm Dương
Ngũ Hành
Hà Đồ - Lạc Thư
Mai Hoa Dịch Số
Phong Thủy
Tứ Trụ
Tử Vi
Triết học
Nghiên cứu
Hướng dẫn
```

A simple initial Category model:

```ts
Category {
  id
  name
  slug
}
```

An article may have one primary category.

Do not hard-code the category list inside UI components if the existing backend architecture can support category data.

---

# 9. Tags

Support tags if the current architecture makes it inexpensive.

Example tags:

```text
quẻ-càn
quẻ-khôn
hào-động
bát-quái
khổng-tử
lão-tử
thập-dực
seo
nhập-môn
```

Suggested model:

```ts
Tag {
  id
  name
  slug
}
```

Article ↔ Tag should be many-to-many.

Tags are optional for V1 if implementing them would significantly delay the core article workflow.

---

# 10. Editor

The content editor is a critical part of the product.

Prefer an editor capable of producing structured, semantic content.

Possible implementations:

- Markdown
- MDX
- TipTap
- Lexical
- Editor.js

Choose based on the current repository architecture.

If the existing QIChing.org project already has a content rendering system, reuse the same format.

Do not introduce a new editor ecosystem unnecessarily.

Minimum formatting features:

- H2
- H3
- H4
- Paragraph
- Bold
- Italic
- Ordered list
- Unordered list
- Quote
- Link
- Image
- Horizontal rule
- Code / preformatted text if easy

Highly useful for QIChing content:

- Tables
- Block quotes
- Chinese characters
- Vietnamese diacritics
- Unicode symbols
- ☰ / ☱ / ☲ / ☳ / ☴ / ☵ / ☶ / ☷
- ☯

The editor must preserve Unicode correctly.

Example content:

```markdown
## Quẻ Càn 乾

Quẻ Càn gồm sáu hào dương:

☰

> Thiên hành kiện, quân tử dĩ tự cường bất tức.

### Quái tượng

- Thượng quái: Càn ☰
- Hạ quái: Càn ☰
```

---

# 11. Autosave

Content loss is one of the highest risks for an article editor.

Implement autosave if reasonable.

Suggested behavior:

```text
User edits article
↓
wait ~1–3 seconds after typing stops
↓
save Draft automatically
```

UI feedback:

```text
Saving...
```

then:

```text
Saved
```

or:

```text
Saved at 10:35
```

If autosave introduces excessive complexity in the current stack, implement a reliable manual Save Draft first.

Never silently discard unsaved changes.

Add a dirty-state warning before navigating away when content has not been saved.

---

# 12. Slug

Each published article must have a stable URL slug.

Examples:

```text
kinh-dich-la-gi
que-can
64-que-kinh-dich
cach-gieo-que-kinh-dich
```

Requirements:

- auto-generate slug from title
- allow manual editing
- lowercase
- remove unsafe URL characters
- transliterate Vietnamese
- ensure uniqueness

Example:

```text
"Kinh Dịch là gì?"
```

becomes:

```text
kinh-dich-la-gi
```

Slug should not automatically change after publication simply because the title changes.

Changing a published slug can damage SEO.

If the admin edits a published slug, show a warning such as:

```text
Changing this URL may affect SEO and existing links.
```

If the current architecture supports redirects, consider creating a redirect from the old slug to the new slug.

---

# 13. Preview

Admin must be able to preview an article before publication.

Preview should render using the same or nearly identical frontend article renderer used by the public site.

Suggested behavior:

```text
Preview
```

opens:

```text
/admin/articles/:id/preview
```

or a secure public preview route.

Preview should display:

- title
- excerpt
- article content
- featured image
- headings
- tables
- quotes
- internal links

Preview must work for Draft articles.

A draft preview URL must not become publicly indexable.

Recommended:

```html
<meta name="robots" content="noindex,nofollow">
```

for draft previews.

---

# 14. Publish

Publishing behavior:

When admin clicks:

```text
Publish
```

validate required fields.

Minimum requirements:

```text
title exists
slug exists
content exists
```

Then set:

```ts
status = "PUBLISHED"
publishedAt = current timestamp
```

Important:

If an already published article is edited and published again, keep the original `publishedAt`.

Use:

```text
createdAt
publishedAt
updatedAt
```

to represent article lifecycle accurately.

Example:

```text
Created:
2026-09-01 10:30

Published:
2026-09-03 14:20

Last Updated:
2026-09-05 09:45
```

---

# 15. Unpublish

Support:

```text
Unpublish
```

for published articles.

Behavior:

```ts
status = "DRAFT"
```

Keep `publishedAt` unless the domain model has a reason to clear it.

Document whichever behavior is selected.

Unpublishing should require confirmation.

---

# 16. SEO

SEO is a first-class requirement.

Each article should support:

```text
Meta Title
Meta Description
Canonical URL
Open Graph title
Open Graph description
Open Graph image
```

At minimum V1 must provide:

```text
metaTitle
metaDescription
canonicalUrl
```

Fallback behavior:

```text
metaTitle ?? title
```

```text
metaDescription ?? excerpt
```

---

# 17. SEO Editor UX

SEO settings should display:

```text
SEO Title
[________________________________]

Recommended: approximately 50–60 characters
```

```text
Meta Description
[________________________________]

Recommended: approximately 140–160 characters
```

Do not block publishing merely because text exceeds these SEO guidelines.

Show them as guidance, not rigid truth.

Display character count.

Example:

```text
SEO title
53 / 60

Meta description
148 / 160
```

---

# 18. Search Preview

Nice-to-have:

Show a Google-style SERP preview:

```text
Kinh Dịch là gì? Ý nghĩa và cách tiếp cận Kinh Dịch
https://qiching.org/blog/kinh-dich-la-gi

Tìm hiểu Kinh Dịch là gì, cấu trúc 64 quẻ và cách tiếp cận...
```

This is only a visual approximation.

Do not claim it represents exactly how Google will display the page.

---

# 19. SEO Content Checklist

The editor may provide a lightweight checklist.

Example:

```text
SEO Checklist

✓ Has title
✓ Has URL slug
✓ Has meta title
✓ Has meta description
✓ Has H2 headings
✓ Contains internal link
○ Featured image missing
```

Do NOT attempt to build an overly complex SEO scoring algorithm in V1.

Avoid fake scores such as:

```text
SEO score: 93/100
```

unless the scoring methodology is explicitly designed and documented.

A transparent checklist is preferred.

---

# 20. Internal Linking

Internal linking is important for QIChing.org.

When inserting a link, ideally allow the editor to search existing articles.

Example:

```text
Insert internal link

Search:
[ Quẻ Càn ]

Results:

Quẻ Càn là gì?
/que-can

64 quẻ Kinh Dịch
/64-que-kinh-dich
```

This can be a later enhancement if the core editor does not easily support it.

The underlying content format must support normal hyperlinks from V1.

---

# 21. Public Article URL

Follow the current routing architecture of QIChing.org.

Possible routes:

```text
/articles/:slug
```

or:

```text
/blog/:slug
```

or:

```text
/:slug
```

Do not arbitrarily introduce `/blog` if QIChing.org already has a preferred content URL structure.

Inspect the existing project before deciding.

> **Already inspected (see Section 0):** current convention is flat or feature-prefixed paths
> directly under the site root (`/huong-dan/nap-giap`, `/64-que/:slug`, `/gioi-thieu`, ...), all
> declared through `DUONG_DAN_TINH`/`duongDanQue` in `src/ui/duongDan.ts`. There is no existing
> `/blog` or `/articles` prefix precedent — pick one deliberately rather than assuming either.

SEO URL stability is important.

---

# 22. Existing Guides

The project already contains some guide content.

> **Already inspected (see Section 0):** guides live as Markdown+frontmatter drafts in
> `legacy/project-brain/drafts-huong-dan/*.md`, hand-transcribed into React components at
> `src/pages/HuongDan*.tsx`, routed in `src/App.tsx`, and listed in `DUONG_DAN_TINH`
> (`src/ui/duongDan.ts`). There is no database row for a "guide" — migrating them into a DB-backed
> `Article` (Option A in Section 0) means writing a one-off script that reads those files/components
> and inserts rows; under Option B there may be nothing to "migrate" beyond adopting the same
> frontmatter shape as the CMS's file format.

Before creating a new guide system:

1. inspect the current repository
2. identify how existing guides are stored
3. identify how they are rendered
4. determine whether guides can be migrated into Article
5. avoid creating duplicate content systems

Preferred architecture:

```text
Article
 ├── Research
 ├── SEO
 ├── Guide
 └── Other
```

rather than:

```text
Blog System
Guide System
Research System
SEO System
```

unless the existing product architecture gives a strong reason to separate them.

---

# 23. Data Migration

If existing guide content is already stored in the database or source files, create a migration plan.

Do NOT automatically destroy or rewrite existing content.

Possible migration:

```text
Existing Guide
↓
Article
type = GUIDE
status = PUBLISHED
```

Preserve if possible:

- existing URL
- title
- content
- creation date
- publication date
- SEO metadata

SEO URLs must not break during migration.

---

# 24. Date & Time

Every article must track:

```text
createdAt
updatedAt
publishedAt
```

Database timestamps should preferably be stored in UTC.

Display dates in the Admin using the project's configured locale/timezone.

QIChing primarily serves Vietnamese users, so a likely UI display is:

```text
05/09/2026 10:30
```

Do not hard-code a timezone deep inside business logic if the application already has timezone configuration.

---

# 25. Delete

Avoid hard deletion as the default action.

Preferred V1 options:

```text
Archive
```

or require explicit confirmation before permanent deletion.

If implementing Delete:

```text
Delete Article?
This action cannot be undone.

[Cancel] [Delete]
```

Never put destructive action next to Publish without visual distinction.

---

# 26. Authentication & Authorization

Admin routes must require authenticated users.

At minimum:

```text
unauthenticated user
→ cannot access /admin/*
```

If the project already has roles, use them.

Example:

```ts
ADMIN
EDITOR
```

Possible permissions:

```text
EDITOR
- create
- edit
- preview

ADMIN
- create
- edit
- publish
- unpublish
- delete
```

Do not build a new authorization framework if the project already has one.

---

# 27. API

Follow the architecture already used in the project.

Potential API design:

```http
GET    /api/admin/articles
POST   /api/admin/articles

GET    /api/admin/articles/:id
PATCH  /api/admin/articles/:id
DELETE /api/admin/articles/:id

POST   /api/admin/articles/:id/publish
POST   /api/admin/articles/:id/unpublish
```

Or use server actions / RPC if already established.

Do not introduce REST solely because this specification shows REST examples.

Follow existing conventions.

---

# 28. Example Create Payload

```json
{
  "title": "Kinh Dịch là gì?",
  "slug": "kinh-dich-la-gi",
  "excerpt": "Giới thiệu nền tảng về Kinh Dịch...",
  "content": "...",
  "status": "DRAFT",
  "type": "SEO",
  "metaTitle": "Kinh Dịch là gì? Ý nghĩa và cách tiếp cận",
  "metaDescription": "Tìm hiểu Kinh Dịch, cấu trúc 64 quẻ và các tư tưởng nền tảng..."
}
```

---

# 29. Validation

Validate both client-side and server-side.

Examples:

```text
Title:
required

Slug:
required
unique

Content:
required before publishing

Meta title:
optional

Meta description:
optional
```

A Draft may be incomplete.

Therefore:

```text
SAVE DRAFT
```

should allow incomplete content.

But:

```text
PUBLISH
```

should perform stricter validation.

---

# 30. Draft Validation Example

Draft can contain only:

```text
Title = "Ghi chú về quẻ Càn"
Content = ""
```

This is valid.

---

# 31. Publish Validation Example

Publishing requires at least:

```text
title
slug
content
```

If invalid:

```text
Cannot publish article

• Content is required
• URL slug is required
```

Do not lose unsaved content when validation fails.

---

# 32. Publication UX

Recommended actions:

For new Draft:

```text
[Preview] [Save Draft] [Publish]
```

For existing Draft:

```text
[Preview] [Save] [Publish]
```

For Published article:

```text
[Preview] [Save Changes] [Unpublish]
```

Avoid ambiguous labels such as:

```text
Submit
```

Use verbs that describe the actual state transition.

---

# 33. Confirmation Rules

Do NOT require confirmation for normal saves.

Require confirmation for potentially dangerous actions:

- delete
- unpublish
- changing published URL slug

Publishing does not necessarily need confirmation if the button and state are clear.

---

# 34. Error Handling

Never silently fail.

Examples:

```text
Failed to save article.
Please try again.
```

```text
This slug is already being used by another article.
```

```text
Unable to publish because the article has no content.
```

For autosave failures, preserve the user's local editor content.

---

# 35. Loading States

Buttons must show state.

Example:

```text
Save Draft
```

becomes:

```text
Saving...
```

Publish:

```text
Publishing...
```

Prevent duplicate requests while an action is running.

---

# 36. SEO-Friendly HTML

Public article renderer should output semantic HTML.

Preferred:

```html
<article>
  <header>
    <h1>...</h1>
  </header>

  <section>
    <h2>...</h2>
    <p>...</p>
  </section>
</article>
```

Do not render the entire article as unstructured `<div>` elements.

Heading hierarchy matters.

Normally:

```text
H1 = article title

H2 = main sections

H3 = subsections

H4 = deeper subsections
```

The editor should ideally not insert another H1 inside article body.

---

# 37. Structured Data

If the public frontend currently supports JSON-LD, generate appropriate Article structured data.

Possible schema:

```text
Article
```

or:

```text
BlogPosting
```

Include when available:

- headline
- description
- datePublished
- dateModified
- author
- image
- url

Do not invent author or publication data.

---

# 38. Sitemap

Published articles should be discoverable by the site's sitemap.

Draft articles must not appear.

Pseudo logic:

```ts
articles.where({
  status: "PUBLISHED"
})
```

Include:

```text
URL
lastmod = updatedAt
```

where compatible with the existing sitemap implementation.

> **Already inspected (see Section 0):** the sitemap is generated today by
> `scripts/prerender.mjs` at build time, from `DANH_SACH_DUONG_DAN` minus a hardcoded
> `DUONG_DAN_KHONG_INDEX` Set — there is no runtime sitemap endpoint. Under Option B this stays
> effectively the same mechanism (published articles just need to enter that same list). Under
> Option A, a live query replaces the hardcoded list, but the output file/shape should stay
> compatible with what `prerender.mjs` already produces.

---

# 39. robots / Indexing

Draft:

```text
NO INDEX
```

Published:

```text
indexable
```

unless explicitly configured otherwise.

Admin pages:

```text
noindex
```

Admin pages should not be exposed to search engines.

---

# 40. Canonical URL

When `canonicalUrl` is empty:

derive canonical from the public article URL.

Example:

```text
https://qiching.org/<article-route>/<slug>
```

Do not allow admin preview URLs to become canonical URLs.

---

# 41. Images

Article should support:

```text
featuredImage
```

If the project already has media storage, reuse it.

Potential future support:

```text
alt text
caption
image credit
```

Image alt text is particularly useful for SEO and accessibility.

Do not implement an entirely new media library unless required.

---

# 42. Content Safety / Philosophy

QIChing.org publishes material related to traditional Eastern knowledge systems.

The CMS itself should remain neutral and should not encode unsupported metaphysical claims into application logic.

Content may discuss:

- traditional interpretations
- historical sources
- symbolic interpretations
- philosophical perspectives
- modern research

Where editorial tools later provide AI assistance, they should distinguish between:

```text
Traditional doctrine
Symbolic interpretation
Historical evidence
Modern empirical evidence
Author interpretation
```

Do not treat divination claims as experimentally established facts.

---

# 43. Future Knowledge Architecture

Do not implement this entire architecture now, but keep the Article model extensible for future links to structured QIChing entities.

Potential future relations:

```text
Article → Hexagram
Article → Trigram
Article → Line
Article → Element
Article → Concept
Article → HistoricalPerson
Article → ClassicalText
```

Examples:

```text
Article:
"Ý nghĩa quẻ Càn"

Related Hexagram:
1 - 乾 - Càn
```

or:

```text
Article:
"Khổng Tử và Kinh Dịch"

Related Person:
Khổng Tử

Related Classical Text:
Thập Dực
```

Do not prematurely build a full knowledge graph.

Simply avoid architectural choices that make future linking difficult.

---

# 44. Suggested Database Model

Adapt this to the existing ORM.

Example Prisma-style model:

```prisma
model Article {
  id              String        @id @default(cuid())

  title           String
  slug            String        @unique

  excerpt         String?
  content         String

  status          ArticleStatus @default(DRAFT)
  type            ArticleType   @default(OTHER)

  featuredImage   String?

  metaTitle       String?
  metaDescription String?
  canonicalUrl    String?

  ogTitle         String?
  ogDescription   String?
  ogImage         String?

  categoryId      String?
  category        Category?     @relation(fields: [categoryId], references: [id])

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?
}
```

Example enums:

```prisma
enum ArticleStatus {
  DRAFT
  PUBLISHED
}

enum ArticleType {
  RESEARCH
  SEO
  GUIDE
  OTHER
}
```

Example category:

```prisma
model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  articles Article[]
}
```

Modify these examples to match the actual repository.

Do not blindly paste these models without checking the existing schema.

---

# 45. Suggested Admin Navigation

Add:

```text
Admin
├── Dashboard
├── Articles
│   ├── All Articles
│   └── New Article
└── ...
```

If the Admin already has navigation, integrate into it rather than creating a separate shell.

---

# 46. Article Dashboard Metrics

Not necessary for the first implementation, but structure may later show:

```text
Total articles
Drafts
Published
Updated this month
```

Do not implement page-view analytics unless the project already collects reliable analytics.

---

# 47. V1 Scope

V1 MUST include:

```text
Article list
Create article
Edit article
Save Draft
Article status
Preview
Publish
Unpublish
Created date
Updated date
Published date
Slug
Basic SEO metadata
Authentication protection
Public rendering of Published article
Draft excluded from public pages
```

V1 SHOULD include:

```text
Search articles
Article type
Category
Autosave
Featured image
SEO character counters
```

V1 MAY include:

```text
Tags
SERP preview
Internal-link search
Revision history
Scheduled publishing
Advanced SEO analysis
AI writing assistant
```

Do not let MAY features delay MUST features.

---

# 48. Out of Scope for V1

Do not implement unless the repository already has infrastructure for them:

- complex workflow approvals
- multi-stage editorial review
- real-time collaborative editing
- Google Docs-style comments
- complex permission matrix
- AI-generated articles
- automatic divination interpretation
- full media asset manager
- revision diff UI
- content localization workflow
- advanced SEO scoring engine
- knowledge graph
- Elasticsearch

---

# 49. Acceptance Criteria

## AC01 — Create Draft

Given an authenticated Admin

When the user clicks:

```text
New Article
```

and enters a title

and clicks:

```text
Save Draft
```

Then:

- a new Article is stored
- status is `DRAFT`
- `createdAt` is recorded
- `updatedAt` is recorded
- the article appears in Article List

---

## AC02 — Edit Draft

Given an existing Draft article

When the Admin edits its content

and saves

Then:

- article content is updated
- `updatedAt` changes
- `createdAt` does not change
- status remains `DRAFT`

---

## AC03 — Preview Draft

Given a Draft article

When the Admin clicks Preview

Then:

- the article renders using the public article layout
- the article does not need to be Published
- preview is inaccessible through normal public article discovery
- preview must not be indexed by search engines

---

## AC04 — Publish

Given a Draft with:

```text
title
slug
content
```

When Admin clicks Publish

Then:

```text
status = PUBLISHED
publishedAt = current timestamp
```

and the article becomes available via its public URL.

---

## AC05 — Publish Invalid Draft

Given an article without required publish fields

When Admin clicks Publish

Then:

- article is not published
- clear validation errors are shown
- current editor content remains intact

---

## AC06 — Update Published Article

Given a Published article

When Admin modifies its content and saves

Then:

- article remains Published
- `updatedAt` changes
- original `publishedAt` remains unchanged

---

## AC07 — Unpublish

Given a Published article

When Admin selects Unpublish

and confirms

Then:

```text
status = DRAFT
```

and the public article URL no longer serves the content as a published article.

---

## AC08 — Unique Slug

Given an existing article:

```text
/kinh-dich-la-gi
```

When another article attempts to use:

```text
kinh-dich-la-gi
```

Then:

- the save or publish operation fails validation
- the Admin sees a clear message

---

## AC09 — Public Query

Any public article query must return only:

```text
status = PUBLISHED
```

unless explicitly executed as an authenticated preview request.

---

## AC10 — SEO

Given a Published article

When the public page is rendered

Then it outputs:

- page title
- meta description
- canonical URL
- appropriate Open Graph metadata where supported

using explicit SEO values where provided and documented fallback values otherwise.

---

# 50. Testing

Add tests appropriate to the existing project.

At minimum cover:

```text
Create Draft
Update Draft
Publish Article
Cannot publish invalid article
Unique slug
Published article publicly accessible
Draft article not publicly accessible
Unpublish article
publishedAt lifecycle behavior
SEO metadata fallback
```

Prefer testing business-critical behavior rather than implementation details.

---

# 51. Engineering Rules

Before coding:

1. inspect the repository
2. identify the framework
3. identify database / ORM
4. inspect authentication
5. inspect admin architecture
6. inspect existing Guide implementation
7. inspect public page routing
8. inspect styling / design system
9. inspect SEO helpers
10. inspect existing test setup

Then create an implementation plan.

Do not replace existing architecture unnecessarily.

Follow:

```text
existing pattern > new abstraction
simple solution > clever solution
reusable domain model > duplicated content systems
```

---

# 52. Implementation Process

Execute in this order.

## Step 1 — Repository Analysis

Report:

```text
Framework:
Database:
ORM:
Authentication:
Admin structure:
Current Guide implementation:
Current public routing:
Current editor/content format:
SEO architecture:
Testing:
```

Identify files that will probably change.

---

## Step 2 — Proposed Architecture

Before large implementation changes, summarize:

```text
Article domain model
Routes
Database changes
Admin pages
Editor choice
Preview mechanism
Publishing mechanism
SEO mechanism
Guide migration approach
```

If existing code makes any requirement inappropriate, explain why and propose the smallest compatible alternative.

---

## Step 3 — Database

Implement required data model and migration.

Do not delete existing Guide data.

---

## Step 4 — Backend

Implement:

```text
list
get
create
update
publish
unpublish
```

with validation and authentication.

---

## Step 5 — Admin Article List

Implement:

```text
/admin/articles
```

with:

```text
New Article
Search
Status
Type
Created
Updated
Actions
```

---

## Step 6 — Article Editor

Implement create/edit experience.

Prioritize:

```text
Title
Slug
Content
Save
Preview
Publish
```

before secondary SEO enhancements.

---

## Step 7 — Preview

Implement secure Draft preview using the same rendering system as published articles.

---

## Step 8 — Public Article Rendering

Ensure:

```text
Published = accessible
Draft = inaccessible
```

---

## Step 9 — SEO

Implement:

```text
meta title
meta description
canonical
Open Graph
sitemap integration
```

where appropriate to the current stack.

---

## Step 10 — Tests

Implement automated tests for critical editorial lifecycle.

---

# 53. UX Principles

The Admin should feel like a writing tool, not an ERP dashboard.

Prefer:

- generous content width
- readable typography
- minimal visual noise
- clear primary action
- fast keyboard-driven writing
- obvious save state
- obvious publication state

Avoid:

- excessive cards
- unnecessary gradients
- dashboards inside dashboards
- too many status colors
- tiny editor viewport
- excessive modal dialogs

---

# 54. Visual Status

Recommended status UI:

```text
Draft
```

neutral / gray / amber tone.

```text
Published
```

green or primary positive tone.

Do not communicate status using color alone.

Always include textual label.

---

# 55. Article List Priority

The most useful information in the list is:

```text
Title
Status
Last Updated
```

Do not overload rows with SEO metadata.

SEO details belong in the editor.

---

# 56. Product Metrics

The initial product does not need analytics instrumentation beyond what already exists.

Long-term useful operational metrics may include:

```text
Number of published articles
Number of drafts
Articles published per month
Average time from draft to publish
Articles missing meta descriptions
Broken internal links
Organic landing pages
Organic clicks / impressions
```

Traffic metrics should come from reliable analytics / Search Console integrations rather than being guessed by the CMS.

---

# 57. Future Features

The architecture should allow future additions such as:

```text
Scheduled publishing
Revision history
Multiple authors
SEO content clusters
Related articles
AI writing assistant
Internal link recommendations
Source / bibliography management
Chinese classical text references
Hexagram relations
Glossary
Article series
Search Console integration
Content performance dashboard
```

Do not build these now unless explicitly requested.

---

# 58. Special Future Requirement: Sources

Research articles about Kinh Dịch may eventually need academic / textual references.

Potential future data:

```ts
ArticleSource {
  id
  articleId

  title
  author
  publication
  year

  url?
  note?
}
```

or simple content-level references.

The V1 Article architecture should not prevent this future extension.

Do not implement it unless simple and clearly useful.

---

# 59. Definition of Done

The feature is Done when an authenticated QIChing administrator can:

```text
1. Open Admin → Articles
2. See existing articles
3. Create a new article
4. Write article content
5. Save it as Draft
6. Return later and continue editing
7. Preview the Draft
8. Configure title / slug / SEO
9. Publish the article
10. Visit the public article URL
11. Update the article later
12. See correct created / updated / published timestamps
13. Unpublish it if necessary
```

And:

```text
Draft articles are not publicly accessible.
Draft previews are not indexable.
Published articles have stable SEO-friendly URLs.
Published articles output appropriate SEO metadata.
Existing guide content is not broken.
```

---

# 60. Final Instruction to Coding Agent

Start by **examining the existing repository**.

Do not immediately generate an isolated new application unless this repository does not contain an Admin architecture.

Use the project's existing:

- framework
- folder conventions
- components
- authentication
- ORM
- database
- API conventions
- typography
- design system
- routing
- validation library
- test framework

Reuse existing components whenever practical.

After repository analysis:

1. describe the current architecture
2. identify relevant files
3. propose the smallest coherent implementation
4. implement the V1 requirements incrementally
5. run lint / typecheck / tests
6. fix issues caused by the implementation
7. summarize changed files and remaining optional enhancements

Do not stop at mock UI.

The goal is a **working end-to-end Article publishing workflow** integrated into the existing QIChing.org project.