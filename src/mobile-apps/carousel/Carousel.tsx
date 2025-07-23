import { Button } from '@material-ui/core'
import React from 'react'
import { Navigation, Pagination } from 'swiper'
import 'swiper/modules/pagination/pagination.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import ico_carousel_next from '../../assets/icons/ico_carousel_next.svg'
import useCarouselLogic from './useCarouselLogic'

export default function Carousel() {
  const { isLoading, slides, classes, saveCarouselSeen, redirectSomewhere, saveSkipped, t } = useCarouselLogic()
  const bulletsDivId = 'carousel-bullets'
  const btnNextId = 'carousel-next-btn'

  return (
    <div className={classes.fullscreenOverlay}>
      {/* while loading (a few milliseconds) show only the fullscreenOverlay */}
      {isLoading === false && (
        <Swiper
          className={classes.swiper}
          modules={[Navigation, Pagination]}
          pagination={{ el: `#${bulletsDivId}`, type: 'bullets', bulletActiveClass: classes.activeBullet }}
          navigation={{ nextEl: `#${btnNextId}` }}
        >
          {slides.map(({ title, description, imgSrc, alt }, index) => {
            const isLastSlide = index === slides.length - 1
            return (
              <SwiperSlide key={index} className={classes.swiperSlide}>
                <Button
                  className={classes.buttonSkip}
                  onClick={() => {
                    saveSkipped()
                    redirectSomewhere()
                  }}
                >
                  {t('mobile-apps.carousel.skip')}
                </Button>
                <div className={classes.slideContent}>
                  <div className={classes.imageContainer}>
                    <img src={imgSrc} alt={alt} />
                  </div>
                  <div id={bulletsDivId} className={classes.navBullets} />
                  {/* title not shown if empty, to give more space to description (requested by designer) */}
                  {title.length > 0 && <h1 className={classes.title}>{lineBreaksToBrTags(title)}</h1>}
                  <p className={classes.description}>{lineBreaksToBrTags(description)}</p>
                </div>
                <Button
                  id={btnNextId}
                  variant='contained'
                  className={classes.buttonNext}
                  endIcon={isLastSlide ? null : <img src={ico_carousel_next} alt='>' />}
                  onClick={() => {
                    if (false === isLastSlide) return
                    saveCarouselSeen()
                    redirectSomewhere()
                  }}
                >
                  {isLastSlide ? t('mobile-apps.carousel.done') : t('mobile-apps.carousel.next')}
                </Button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )

  //jsx helper
  function lineBreaksToBrTags(text) {
    const lines = text.split('\n')
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line} <br />
      </React.Fragment>
    ))
  }
}
