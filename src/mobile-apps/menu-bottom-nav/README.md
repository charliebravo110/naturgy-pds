# menu bottom nav

## Feature description and requirements

A bottom navigation menu bar with 4 tabs (check the component for the links and icons).

Display it allways on top on the bottom of the screen.

Show it only when all the following conditions are met:
 1. Someone is logged in
 2. Platform is mobile app (not web)
 3. Current view is mobile (this excludes tablets)

If the feature is under development, don't apply the second condition (`BOTTOM_NAV_UNDER_DEV` in `src\mobile-apps\common\configAndConstants.ts`)

Extra requirement asked from the designer, already fullfilled:

Display a red badge on the third tab with the number of unread requests.

If there are no unread requests, don't display the badge.

Modification: (already applied): hide the hamburquer menu for domestic users and show the bottom nav. Reverse for the rest of the user types.
