import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { isWeb } from '../common/detectPlatform'
import { useCommonStuff } from '../common/useCommonStuff'
import useMustShowCarousel from './useMustShowCarousel'

/** redirects to welcome carousel or what-is-new carousel if needed, right after someone logs in */
export default function useMaybeGoToCarouselAfterLogin() {
  const { isLoadingMustShowCarousel, mustShowWelcomeCarousel, mustShowWhatIsNewCarousel } = useMustShowCarousel()
  const { someoneIsLoggedIn } = useCommonStuff()
  const history = useHistory()

  useEffect(() => {
    if (isWeb() || !someoneIsLoggedIn || isLoadingMustShowCarousel) return

    if (mustShowWelcomeCarousel) history.push('/welcome')

    if (mustShowWhatIsNewCarousel) history.push('/what-is-new')
  }, [isLoadingMustShowCarousel, someoneIsLoggedIn])
}
