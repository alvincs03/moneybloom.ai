# moneybloom

Scholarship discovery for first-generation, low-income students.

## Project Structure

```
app/
├── page.tsx                    # Marketing homepage
├── about/page.tsx             # About page
├── faq/page.tsx               # FAQ page
├── dashboard/
│   ├── page.tsx               # Dashboard home (matched scholarships)
│   ├── scholarships/page.tsx   # Scholarships search & browse
│   ├── applications/page.tsx   # Track applications by status
│   ├── deadlines/page.tsx      # Calendar view of deadlines
│   └── profile/page.tsx        # User profile & questionnaire
├── layout.tsx                 # Root layout with fonts
└── globals.css                # Brand colors and styles

components/
├── Sidebar.tsx                # Navigation sidebar
└── DashboardLayout.tsx        # Dashboard wrapper with sidebar
```

## Brand Identity

- **Colors**: Cream (#f5f0e8), Terracotta (#c46039), Teal (#5b9e9a), Dark (#3c3c3c)
- **Fonts**: EB Garamond (headings), DM Sans (body/UI)
- **Style**: Clean, accessible, grain texture (via Figma)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features Built

- ✅ Marketing homepage with hero, problem/solution sections
- ✅ Dashboard with 5 tabs:
  - Dashboard (matched scholarships overview)
  - Scholarships (search & filter)
  - Applications (status tracking)
  - Deadlines (calendar view)
  - Profile (user info & completion)
- ✅ About page
- ✅ FAQ page (collapsible)

## Next Steps (Deferred)

- Profile questionnaire form (25 questions)
- Scholarship database integration
- Application tracking
- User authentication
- Email notifications for deadlines

## Notes

Currently using placeholder data. Database schema and API routes will be added when scholarship data source is ready.
