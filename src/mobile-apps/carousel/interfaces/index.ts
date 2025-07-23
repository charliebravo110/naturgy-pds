/** each slide used in the carousel, not exported on purpose */
interface CarouselSlide {
  title: string
  description: string
  imageFileName: string
  /** alt text for the image */
  alt: string
}

/** higher level data for the carousel, variant 'welcome' */
export type CarouselWelcome = {
  type: 'welcome'
  /** if false, the carousel will not be shown */
  enabled: boolean
  slides: CarouselSlide[]
}

/** higher level data for the carousel, variant 'what is new' */
export type CarouselWhatIsNew = {
  type: 'what-is-new'
  /** version of the app that this slides are for (X.X.X) */
  version: string
  /** if false, the carousel will not be shown */
  enabled: boolean
  slides: CarouselSlide[]
}

/** adding imgSrc to each slide, so the image is more easily consumed by the ui */
export interface CarouselSlideWithImgSrc extends CarouselSlide {
  imgSrc: string
}
