# Biometric Access


## Feature description and requirements

This are the final requirements after the client's requests made at the end of the developmment of the feature.

Allow the user of mobile apps to use biometric access (fingerprint, face recognition, etc) to log in after the first login.

Feature only for mobile apps (not for web), and only when the device supports it.

In the login screen there will be a new button, `Access with biometry`, which will be shown only when the user already accepted to use biometric access (the user is asked to enable it on the first login attempt if the device supports it).

After it is enabled, the next time the user is in the login page when the app is opened, the OS dialog to read the biometric data will be shown automatically, and the user will be logged in if the biometric data is correct.

When the user logs out or when session times out, the user returns to the login screen but this time the OS dialog is not shown automatically, and the user has to click on the `Access with biometry` button to show it.

The user is asked only once to enable biometric access, and the app remembers the user's choice, saving safely the preferences in the device, the credentials are securely stored using Keychain (iOS) and Keystore (Android).

Biometrics access settings are per user basis, if the user logs out and logs in with another username, the biometric access settings are cleared. The new user will be asked to enable biometric access like the first time.

The user is asked only once, and can always change the settings in the user's profile.

## Code affected

For login with biometry the login screen. (LoginForm.tsx)

For saving the user's preferences the user's profile (The component `ProfileSectionBiometry` is added to `Profile.tsx`)