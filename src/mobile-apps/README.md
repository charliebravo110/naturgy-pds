# 📁 src/mobile-apps/README.md

(UPDATE: documentation is not complete, it might be reviewd and expanded)

This is the main readme for the mobile apps development, initially done by Capgemini (we), starting in january 2023.

The purpose is to generate IOS and Android apps from this existing webapp, wich is in production in https://areaprivada.ufd.es/ and to add some features.

The webapp and the mobile apps are sharing the same codebase (same repo), leveraging Capacitor, a cross-platform app runtime that allows you to build web apps that run natively on iOS, Android, and the web.

In addition to creating the mobile apps, some additional features will be developed.

Some specific features will be developed only for mobile apps, and some others will be developed only for the webapp.

This is possible while sharing the same codebase because on runtime the platform can be detected using the following functions that we have created for this purpose:

 - `isWeb()`
 - `isAndroid()`
 - `isIOS()`
 - `isMobileApp()`
 
For most features, a folder under `src/mobile-apps` will be created, and the code will be placed there.

Most folders inside will contain a `README.md` file with the details of the feature or the folder contents explained.

This development tries to integrate with the existing codebase as much as possible, and to keep the existing codebase as much as possible untouched.

We are trying to follow the choices that were already made by the client, e.g.:
 - Folders and files structure, namings... 
 - Code formatting (see `.prettierrc.yml` and `.vscode/settings.json` files)

We are following the branching strategy requested by the client (git flow). 

A new branch `feature/1007636_AppMovil` was created from `develop` branch, and it will be merged back to `develop`.
We will create feature branches from `feature/1007636_AppMovil`

We follow industry standards and best practices, to deliver something self documented, easy to read and maintain.


# Files location

This folder `src/mobile-apps` contains the files related to mobile apps (IOS and Android) development that can be placed at a arbitrary location.

The files/folders added by this development whose location cannot be changed are obviously not contained here, and we will try to keep them all listed in the following table:

| File or folder          | Notes                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| `capacitor.config.json` | Capacitor configuration                                          |
| `android/`              | Android app project folder                                       |
| `ios/`                  | IOS app project folder                                           |
| `.prettierrc.yml`       | prettier configuration file                                      |
| `.env`                  | to create environment variables |

...

# Packages

The packages added to `package.json` for this development will be updated here:
The following list is not complete, neither up to date, it might be updated.

```
    "dependencies": {
        "@capacitor/android": "^4.6.3",
        "@capacitor/core": "^4.6.3",
        "@capacitor/device": "^4.1.0",
        "@capacitor/ios": "^4.6.3",
        "@capacitor/push-notifications": "^4.1.2",
    ...
    "devDependencies": {
        "@capacitor/cli": "^4.6.3",
```


# How it's made

Additional documentation on how this development was approached and some troubleshooting explained can be found in the [src/mobile-apps/_how-its-made](./_how-its-made/README.md) folder, which contains only documentation, no code.