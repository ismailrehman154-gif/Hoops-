# Hoops!

**Live site:** https://hoops-ismail.onrender.com

Find a run before you leave the house. Hoops! shows anonymous park
traffic for NYC outdoor courts, so players can pick where to play
instead of showing up to an empty court or a packed one.

Privacy-first by design: the phone sends only the court ID. No GPS, no
identity, nothing stored that can single out a person. Traffic shows as
fuzzy levels (Slow, Moderate, High), never headcounts.

## Run it

1. `npm install`
2. `npm start`
3. Open http://localhost:3000

No database needed for the draft. Traffic runs on an in-memory demo
store with the same 30-minute decay and fuzzy levels as the real
backend. The Mongo backend in `hoops-mongo` replaces
`routes/traffic.js` when it is ready; the frontend does not change.

## Project structure

```
server.js          Express scaffold, serves public/, wires routes
routes/
  auth.js          Auth stubs (501s until accounts land)
  parks.js         Park directory from courts.json
  traffic.js       Demo traffic + /api/ping (in-memory)
courts.json        558 real NYC outdoor courts from NYC Open Data (id, name, borough, cross streets, coords)
public/
  login.html       Player name, play style, level picker
  index.html       Home: search, park cards, traffic badges, Go Now
  courts.html      Full directory + "I am at this court" ping
  profile.html     Saved profile from localStorage
  settings.html     Location toggle, clear data
  css/style.css    Basketball theme, mobile-first
  js/              Vanilla JS, one file per page + common.js
```

## Frontend-only for now

- Login keeps the profile in `localStorage`. No accounts, no sessions.
- Traffic badges are demo data until the backend plugs in.
- Distances come from the browser geolocation API when allowed.

## When auth lands

These are the packages to reach for, all standard Express auth pieces:

- `express-session` - session storage for logged-in players
- `passport` + `passport-local` - username and password login
- `bcryptjs` - password hashing

Location needs no package: the browser `navigator.geolocation`
API already does it. Data layer stays the `mongodb` driver, same as
the existing backend.
