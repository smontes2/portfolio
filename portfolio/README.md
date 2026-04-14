# Portfolio (React + Vite)

This portfolio now supports a lightweight built-in CMS at `/admin` so you can update:

- Languages
- Experiences
- Projects

The public site uses Firebase Firestore data when available, and automatically falls back to local JSON files in `src/data` if Firebase is not configured.

## Local development

```bash
npm install
npm run dev
```

## Firebase CMS setup

1. Create a Firebase project.
2. Enable **Authentication > Email/Password**.
3. Enable **Firestore Database**.
4. Enable **Firebase Storage**.
5. Copy env values:

```bash
cp .env.example .env
```

6. Fill in your Firebase web app keys in `.env`.
7. Add Firestore rules (public read, authenticated write):

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/content {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

8. Add Storage rules (public read, authenticated upload):

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

9. In Firebase Auth, create your admin user.
10. Open `http://localhost:5173/admin`, sign in, upload project/experience images, then click **Save changes**.

## Troubleshooting

If you see `Missing or insufficient permissions` while saving:

1. Confirm Firestore rules are **published** (not just edited).
2. Confirm the signed-in account exists in Firebase Auth.
3. Confirm your rules include write access for authenticated users at `/portfolio/content`.
4. Remove extra quotes/trailing spaces in `.env` values and restart `npm run dev`.
5. Verify all `.env` values belong to the same Firebase project (`authDomain` and `projectId` should match).
6. If image uploads fail, confirm Firebase Storage rules were published and `VITE_FIREBASE_STORAGE_BUCKET` is set.

## Content model

The Firestore document path is:

- Collection: `portfolio`
- Document: `content`

Document shape:

- `skills`: `[{ title, imageSrc }]`
- `history`: `[{ role, organization, startDate, endDate, imageSrc, experiences[] }]`
- `projects`: `[{ title, imageSrc, description, skills[], demo, source }]`

`imageSrc` supports either local asset paths (for example `projects/portfolio.png`) or full URLs.
