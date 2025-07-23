/// store links
export const GOOGLE_PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=es.ufd.areaprivada'
export const APPLE_APP_STORE_LINK = 'https://apps.apple.com/us/app/ufd/id6447208107'

/// colors
export const COLOR_CLIENT_ORANGE = '#E57200'
export const COLOR_CLIENT_NAVY = '#004571'
export const COLOR_CLIENT_TURQUOISE = '#009AA6'
export const COLOR_CLIENT_GREYTEXT = '#555555'
export const COLOR_CLIENT_BG_SECTION = '#F2F6F8'

/// config
export const BOTTOM_NAV_UNDER_DEV = false // see menu-bottom-nav/README.md
export const CAROUSEL_UNDER_DEV = false // see carousel/README.md
export const TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE = 'abracadabra fotos' // see photos/README.md

/** order matters, it's the order in which the items are shown in the UI. see push-notifications/preferences/README.md */
export const NOTIFICATION_NAME_LIST = ['NewCups', 'Hippo', 'Hippo2']

/// ratting form
export const RATTING_EMAIL_SERVICE_ID =`service_axaqedh`
export const RATTING_EMAIL_USER_ID =`neZGFRC59e_KaSoX6`
export const RATTING_EMAIL_TEMPLATE_ID =`template_1edqo9o`
export const RATTING_EMAIL_DEST_LIST = ['gestionapp@ufd.es']
export const RATTING_DAYS_TO_SHOW = 40

/// feature flags (aka feature toggles, toggle switches, etc.)

/** When enabled, platform dependent headers will be used (some headers are expecting different values for iOS, Android and web)
 *  When disabled, all three platforms will use the same values (the ones for web), 
 *  affects src/common/BaseRestService.ts  See _how-its-made/common-headers-mods.md */
export const FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS = true
// 👆 During development this was not ready from the backend side, so we created this feature flag to toggle it when ready

/** whether to enforce the last version of the mobile app or not, see version-enforcer/README.md */
export const FEAT_FLAG_LASTVERSION_ENFORCEMENT = true

/** whether to show the section in user's profile with links to the Apple and Google stores or not, see apple-google-links/README.md */
export const FEAT_FLAG_APPLE_GOOGLE_LINKS = false

// Stored credentials in local storage
export const STORED_USERNAME = 'storedUsername'
export const STORED_PASSWORD = 'storedPassword'

