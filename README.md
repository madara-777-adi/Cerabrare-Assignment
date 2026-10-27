# Photo Gallery

A small React app that fetches 30 photos from the Picsum API, shows them in a responsive grid, lets you search by author, and lets you mark favourites that survive a page refresh.

Built for the Celebrare frontend internship pre-screening.

## Stack

- React + Vite (plain JavaScript, functional components only)
- Tailwind CSS (no component or icon libraries)

## Run it

```bash
npm install
npm run dev
```

## What it does

- Fetches `https://picsum.photos/v2/list?limit=30` once on load, with a spinner while loading and an error message if the request fails.
- Grid with 1 column on mobile, 2 on tablet (768px+) and 4 on desktop (1024px+).
- Each card shows the photo, the author name and a heart button.
- Search box filters the already fetched photos by author name, case-insensitive, with no extra API call.
- Favourites are managed with `useReducer` and saved in `localStorage`.

## Structure

```
src/
  main.jsx               entry point
  App.jsx                renders Gallery
  Gallery.jsx            UI: spinner, error, search, grid, hearts
  useFetchPhotos.js      custom hook, returns { photos, loading, error }
  favouritesReducer.js   reducer (TOGGLE) + loadFavourites()
```

## Choices I made

- **Fetch logic lives in a custom hook.** `Gallery` only reads `photos`, `loading` and `error`, so UI and data code stay separate.
- **`res.ok` is checked manually.** `fetch` only rejects on network failure, not on a 404 or 500, so I throw on a bad status to reach the same error state.
- **Favourites store photo ids, not authors.** One author has many photos, so storing the author would heart all of them. Ids are strings in this API, so they stay strings.
- **The reducer is pure.** It has no side effects. Saving to `localStorage` happens in a `useEffect` in `Gallery`.
- **Lazy initial state.** `loadFavourites` runs only on the first render, so `localStorage` is not read on every render. It falls back to an empty list if the saved data is missing or broken.
- **All hooks sit above the early returns** (`loading` / `error`), so hook order is the same on every render.

## Trade-offs and known risks

**localStorage for favourites**
- Favourites live only in one browser on one device. There is no sync, and no login.
- Clearing site data, using private mode, or switching browsers loses them. In some private modes `localStorage` can throw, so a failed save is possible (reading is guarded with `try/catch`, writing is not).
- Two open tabs do not update each other. The last tab to write wins.
- Any script running on the same origin can read it. I only store photo ids, so nothing sensitive is exposed, but it is not a place for private data.
- Only ids are saved, so if a saved id is not in the fetched list anymore, it stays in storage but is never shown.

**Data fetching**
- One request on mount, no retry button, no caching and no request cancellation. If a user leaves the page mid-request, state may still be set. It is harmless here because `Gallery` is always mounted, but it would need an `AbortController` in a bigger app.
- The error message is the same for every failure, so a user cannot tell a network problem from a server problem.
- Only the first 30 photos are loaded, with no pagination.
- The app depends fully on a free third-party API being available.
- In development, React StrictMode runs the effect twice, so two requests appear in the network tab. Production builds send one.

**Performance hooks**
- `useCallback` on the search handler and `useMemo` on the filtered list were required by the assignment. With 30 items the speed difference is practically zero, and the app would behave the same without them. They matter more with large lists or memoized child components.
- Using `useReducer` for a single `TOGGLE` action is more structure than strictly needed. `useState` would also work, but a reducer keeps the toggle logic in one place and is easy to extend.

**UI**
- When a search matches nothing, the grid is simply empty. I did not add a "no results" message to stay within the assignment scope.
- Images are always requested at 400x300, with no responsive `srcset`, so small screens download the same size as large ones.
- There are no automated tests. I checked the loading, error (by blocking the request in DevTools), responsive, search and persistence behaviour by hand.