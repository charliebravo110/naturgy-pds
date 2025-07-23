import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { setPreferences } from '../common/capacitorPreferencesFunctionality'
import { CAROUSEL_UNDER_DEV } from '../common/configAndConstants'
import { isWeb } from '../common/detectPlatform'
import useGoHomeIf from '../common/useGoHomeIf'
import useStyles from './Carousel.styles'
import { CarouselSlideWithImgSrc, CarouselWelcome, CarouselWhatIsNew } from './interfaces'
import { welcomeData } from './welcome-data/welcomeData'
import { whatIsNewData } from './what-is-new-data/whatIsNewData'

export default function useCarouselLogic() {
  const { t } = useTranslation()
  const history = useHistory()
  const classes = useStyles()

  // slides to show
  const [slides, setSlides] = useState<CarouselSlideWithImgSrc[]>([])
  // reflect if the slides are being loaded
  const [isLoading, setIsLoading] = useState(true)
  // reflect if the slides are welcome slides (true) or what-is-new slides (false)
  const [slidesType, setSlidesType] = useState<null | 'welcome' | 'what-is-new'>(null)

  // carousel requirements dictates only for mobile apps, but what if the user goes manually to the url
  // of the carousel in the browser? then redirect home, unless flag CAROUSEL_UNDER_DEV is raised
  useGoHomeIf(isWeb() && !CAROUSEL_UNDER_DEV)

  // init slidesType
  useEffect(() => {
    // depends on the route
    const route = window.location.pathname
    setSlidesType(route.startsWith('/welcome') ? 'welcome' : 'what-is-new')
  }, [])

  // load slides
  useEffect(() => {
    if (slidesType === null) return
    async function loadSlides() {
      setSlides(await getSlides(slidesType === 'welcome' ? welcomeData : whatIsNewData))
    }
    loadSlides().finally(() => setIsLoading(false))
  }, [slidesType])

  // function to save the fact that the user has seen the carousel,
  // it is called when the user clicks on the button of the last slide
  const saveCarouselSeen = useCallback(async () => {
    if (slides.length === 0 || slidesType === null) return
    const key = slidesType === 'welcome' ? 'carouselWelcomeSeen' : 'carouselLastVersionSeen'
    const value = slidesType === 'welcome' ? 'true' : whatIsNewData.version
    await setPreferences(key, value)
  }, [slides, slidesType])

  // function to save the fact that the user has pressed the skip button, and when.
  const saveSkipped = useCallback(async () => {
    if (slides.length === 0 || slidesType === null) return
    const key = slidesType === 'welcome' ? 'carouselWelcomeSkippedAt' : 'carouselWhatIsNewSkippedAt'
    const value = new Date().toISOString()
    await setPreferences(key, value)
  }, [slides, slidesType])

  // helper function to load the slides
  async function getSlides(from: CarouselWelcome | CarouselWhatIsNew): Promise<CarouselSlideWithImgSrc[]> {
    const folder = from.type === 'welcome' ? 'welcome-data' : 'what-is-new-data'
    // mapping CarouselSlide[] to CarouselSlideWithImgSrc[] to provide imgSrc to the ui
    return from.slides.map((slide) => ({
      ...slide,
      imgSrc: require(`./${folder}/${slide.imageFileName}`),
    }))
  }

  function redirectSomewhere() {
    // afterCarouselGoTo is not defined when the user directly accesses the url, in that case redirect to /login

    const state = history.location.state
    //using a type guard to check if state contains afterCarouselGoTo (it can contain other properties, still works)
    const to = containsAfterCarouselGoTo(state) ? state.afterCarouselGoTo : '/login'
    history.push(to)

    //helper type guard
    function containsAfterCarouselGoTo(state: any): state is { afterCarouselGoTo: string } {
      return state !== null && typeof state === 'object' && 'afterCarouselGoTo' in state
    }
  }

  return { slides, isLoading, saveCarouselSeen, classes, redirectSomewhere, saveSkipped, t }
}
