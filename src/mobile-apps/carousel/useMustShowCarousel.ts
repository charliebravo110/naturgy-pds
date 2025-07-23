import { useState, useEffect } from 'react'
import { getPreferences, setPreferences } from '../common/capacitorPreferencesFunctionality'
import { CAROUSEL_UNDER_DEV } from '../common/configAndConstants'
import { isMobileApp } from '../common/detectPlatform'
import { compareSemver, getCurrentVersion, isValidSemver } from '../common/utilsForVersions'
import { welcomeData } from './welcome-data/welcomeData'
import { whatIsNewData } from './what-is-new-data/whatIsNewData'

/** returns flags reflecting if the welcome carousel and the what is new carousel must be shown or not.
 * Logic explained inside the custom hook
 */
export default function useMustShowCarousel() {
  /*
   * The welcome carousel must be shown only once, when the user logs in for the first time.
   *
   * The what is new carousel must be shown once per version, when the user logs in for the first time after an app update.
   * The user never sees the "what is new carousel" corresponding to the version installed when the user first logs in,
   * in other words the first time the user logs in, the welcome carousel is shown but not the what is new carousel.
   * (This last detail was asked and clarified by the project manager on 30th of Jan 2023)
   *
   * I found in the existing code the point where the user is redirected after logging in:
   * Login.tsx (line 148 ATM) and there I actually used the following flags to conditionally redirect
   */
  const [isLoadingMustShowCarousel, setIsLoadingMustShowCarousel] = useState(true)
  const [mustShowWelcomeCarousel, setMustShowWelcomeCarousel] = useState(false)
  const [mustShowWhatIsNewCarousel, setMustShowWhatIsNewCarousel] = useState(false)

  useEffect(() => {
    ;(async function loadValues() {
      setMustShowWelcomeCarousel(await getMustShowWelcomeCarousel())
      setMustShowWhatIsNewCarousel(await getMustShowWhatIsNewCarousel())
    })().finally(() => setIsLoadingMustShowCarousel(false))
  }, [])

  return { isLoadingMustShowCarousel, mustShowWelcomeCarousel, mustShowWhatIsNewCarousel }
}

/// under this line only local helper functions

/** logic explained inside...*/
async function getMustShowWelcomeCarousel() {
  // show it if platform is mobile app and the user has NOT seen it and slides are enabled and has not pressed the skip button (within the last 3 seconds)
  // if CAROUSEL_UNDER_DEV isMobileApp() is not checked, so the carousel can be shown in the browser (for faster development)
  const seen = await getPreferences('carouselWelcomeSeen')
  const enabled = welcomeData.enabled
  const skipped = await userJustSkipped('welcome')
  return CAROUSEL_UNDER_DEV ? !seen && enabled && !skipped : isMobileApp() && !seen && enabled && !skipped
}

/** logic explained inside... */
async function getMustShowWhatIsNewCarousel() {
  /*
    4 versions involved:
    - the current version of the app                       -> currentVer
    - the version of the app when the user first logs in   -> appVersionOnFirstLogin
    - the version that the slides are designed for         -> slidesVer
    - the carousel last version seen                       -> lastVerSeen
  
    LOGIC (order matters):
      1- get & validate data and start responding
      2- do not show it if currentVer === appVersionOnFirstLogin
      3- do not show it if the user has already seen it
      4- do not show it if the user has pressed the skip button within the last 3 seconds
      5- show it only if the user has never seen it 
      6- otherwise, do not show it
    */

  // 1- get & validate data and start responding

  const currentVer = getCurrentVersion()
  if (!currentVer) {
    console.warn('REACT_APP_VERSION is not defined, it was defined in .env file')
    return false
  }
  if (!isValidSemver(currentVer)) {
    console.warn('package.json -> version is not a valid semver (X.X.X) see https://semver.org/')
    return false
  }

  const appVersionOnFirstLogin = await getPreferences('carouselAppVersionOnFirstLogin')
  if (!appVersionOnFirstLogin) {
    // this is the first time the user logs in, save appVersionOnFirstLogin (side effect)
    setPreferences('carouselAppVersionOnFirstLogin', currentVer)
    return false
  }

  const slidesVer = whatIsNewData.version
  if (!slidesVer) {
    console.warn('whatIsNewData.version is not filled correctly')
    return false
  }
  if (!isValidSemver(slidesVer)) {
    console.warn('whatIsNewData.version is not a valid semver (X.X.X) see https://semver.org/')
    return false
  }

  const lastVerSeen = await getPreferences('carouselLastVersionSeen')
  if (lastVerSeen && !isValidSemver(lastVerSeen)) {
    console.warn('lastVerSeen is not a valid semver (X.X.X) see https://semver.org/')
    return false
  }

  // validate that the slides are for the current version and are enabled
  if (compareSemver(currentVer, slidesVer) !== 0 && whatIsNewData.enabled) {
    console.warn('whatIsNewData: when version is not the same as REACT_APP_VERSION enabled should have false value')
    return false
  }

  // 2- do not show it if currentVer === appVersionOnFirstLogin
  if (compareSemver(currentVer, appVersionOnFirstLogin) === 0) return false

  // 3- do not show it if the user has already seen it
  if (lastVerSeen && compareSemver(lastVerSeen, slidesVer) === 0) return false

  // 4- do not show it if the user has pressed the skip button within the last 3 seconds
  if (await userJustSkipped('whatIsNew')) return false

  // 5- show it only if the user has never seen it
  // (Notice every return before this one is false, this was intentional, so the code is easier to read
  // and we can apply the CAROUSEL_UNDER_DEV only to one point)
  if (!lastVerSeen || compareSemver(lastVerSeen, slidesVer) < 0) return CAROUSEL_UNDER_DEV ? true : isMobileApp()

  // 5- otherwise, do not show it
  return false
}

/** checks if the user has pressed the skip button (within the last 3 seconds) */
async function userJustSkipped(which: 'welcome' | 'whatIsNew') {
  const key = which === 'welcome' ? 'carouselWelcomeSkippedAt' : 'carouselWhatIsNewSkippedAt'
  const isoString = await getPreferences(key)
  if (!isoString) return false
  // less than 3 seconds ago?
  return new Date().getTime() - new Date(isoString).getTime() < 3000
}
