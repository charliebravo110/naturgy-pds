# 📁 common
Trying to replicate the file structure of the existing web app within `mobile-apps`, this folder contains common code used by the mobile-apps features, and some can be used as well by the rest of the web app.

e.g. :
## configAndConstants.ts
Exports constants and config

(feature toggles, flags, colors, hardcoded values stored in a single place, etc.)

## detectPlatform.ts
Functions to identify the platform (web | ios | android)

Useful to display different content depending on the platform.

## useCommonStuff.ts
custom hook for common stuff (someoneIsLoggedIn, mobileRes, etc.)

...