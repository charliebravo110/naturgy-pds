# push notifications

There are three features inside the push notifications folder:
- `fcm-token-handling` for obtaining the FCM token from Firebase and sending it to the backend along with more data
- `preferences` for handling the user's preferences for push notifications (a section in the user's profile)
- `push-received` for handling the push notifications received by the app, which can include a payload with data to redirect the user to a specific route `redirect_to`


In this project it was chosen to show notification also when the app is in foreground.

When a notificatios is tapped and the app opened, the user is redirected to `redirect_to` route if it has a valid value.


## links


Followed https://capacitorjs.com/docs/apis/push-notifications to set up push notifications for Android and iOS.

Followed this to set up push notifications for iOS

https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns

https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request

https://enappd.com/blog/firebase-push-notification-in-ionic-react-capacitor/111/

https://www.google.com/search?q=capacitor+push+notification+android+foregraound+action&oq=capacitor+push+notification+android+foregraound+action&aqs=chrome..69i57j33i10i160l2.11159j0j7&sourceid=chrome&ie=UTF-8

https://stackoverflow.com/questions/75869161/capacitor-ionic-android-foreground-push-notification-pushnotificationactio

https://github.com/ionic-team/capacitor-plugins/pull/1478

https://github.com/ionic-team/capacitor/discussions/6439

https://www.npmjs.com/package/@haylltd/capacitor-push-notifications

https://github.com/HaylLtd/capacitor-push-notifications


### To set up firebase to send notifications to ios

had a hard time trying to export to p12 from Keychain Access finally after unlocking everything on the left, I was able to export it by dropdown (expand) it under login -> my certificates I was trying most of the time fom apple development keychain... more info: https://enappd.com/blog/firebase-push-notification-in-ionic-react-capacitor/111/

