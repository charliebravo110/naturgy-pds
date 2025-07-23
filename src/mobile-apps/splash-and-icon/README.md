# Splash screen and app icon

The splash screen (AKA "Launch Image" or "App Loading Screen") is shown only for mobile apps.

It is a full-screen image that is shown while the app is loading.

Used `capacitor-assets` (formerly `cordova-res`) to generate all the splash screen and icon images via CLI.
https://github.com/ionic-team/capacitor-assets

`resources` contains the source images for the splash screen and icon.

The default location for `resources` folder is the root of the project. However, in this project it has been moved to `src/mobile-apps/splash-and-icon/resources` to keep the root folder clean.

Therefore, this was the command used for android:
```bash
npx capacitor-assets generate --android --iconBackgroundColor '#004571' --iconBackgroundColorDark '#004571' --splashBackgroundColor '#004571' --splashBackgroundColorDark '#004571' --assetPath 'src/mobile-apps/splash-and-icon/resources'
```

⚠️ Do not run it without `--android` or `--ios` because it will generate all the images for all platforms (including web & PWA).

To customize the behavior of the splash screen, the official plugin https://capacitorjs.com/docs/apis/splash-screen is used.

For this purpose, the custom hook `useSplashScreenInitializer` is created and used from `App.tsx`.
