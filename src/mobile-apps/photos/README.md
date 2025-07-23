# Photos Proof of Concept Page

## Feature description and requirements

Create a page to showcase the use of the camera, the photo gallery and the GPS sensor using capacitor.

Only for mobile apps (iOS and Android), not for web.

Aimed at developers, for reference, for future developments and features.

This page is not accessible from any menu, it can be accessed as an 'easter egg' by typing the value of `TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE` (stored in `src/mobile-apps/common/configAndConstants.ts`) in the input field (add CUPS) of the `/suppliesVinculation` page.

## Code affected

In addition to the route `src/common/RouterConfig.ts`, the only point of the existing code that is modified is the `SuppliesVinculation.tsx` page, to be able to trigger the easter egg.

Three lines of code added:
1. Import the custom hook created for this purpose `useEasterEggPhotosPocPage`
2. Call the hook `useEasterEggPhotosPocPage`
3. Use it inside `onChange` of the input field

```typescript
...
import { useEasterEggPhotosPocPage } from '../../../../mobile-apps/photos/useEasterEggPhotosPocPage'
...
const{ shouldTriggerEasterEgg, redirectToPhotosPocPage } = useEasterEggPhotosPocPage()
...
if (shouldTriggerEasterEgg(target.value)) redirectToPhotosPocPage()
...
```

## Code structure

To abstract away the interaction with the libraries, `photosFunctionality.ts` is created. This follows the `facade` / `adapter` software design pattern.

It is consumed by this 'Photos Proof of Concept Page' and could be consumed by other pages in the future.
