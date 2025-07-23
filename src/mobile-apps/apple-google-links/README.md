# Apple and Google links

## Feature description and requirements

Display a section at the end of the page `/profile` (before the footer) with links to this mobile app in the stores (Apple and Google) and some more content according to the design in figma.

Display only for web, do not display for mobile apps.

Reminder: Platform can be web | android | ios, see `src/mobile-apps/common/detectPlatform.ts`

The actual urls are stored in `src/mobile-apps/common/configAndConstants.ts`

ℹ️ This is the only feature in `src/mobile-apps` only for web, the rest are only for mobile apps.