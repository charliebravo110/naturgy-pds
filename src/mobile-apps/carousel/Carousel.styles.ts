import { makeStyles } from '@material-ui/core/styles'
import carousel_accent_left from '../../assets/img/carousel_accent_left.svg'
import carousel_accent_right from '../../assets/img/carousel_accent_right.svg'
import { COLOR_CLIENT_NAVY, COLOR_CLIENT_ORANGE } from '../common/configAndConstants'

const useStyles = makeStyles((theme) => {
  return {
    fullscreenOverlay: {
      // Fullscreen overlay, this way no need to hide header and footer
      position: 'fixed',
      display: 'flex',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1001, // zIndex of header is 1000

      background: COLOR_CLIENT_NAVY,
    },
    swiper: {
      width: '100%',
    },
    swiperSlide: {
      height: '100%',

      // 2 different accent images and locations, depends on odd or even slide
      backgroundRepeat: 'no-repeat',
      '&:nth-child(odd)': {
        backgroundImage: `url(${carousel_accent_left})`,
        backgroundPosition: 'left bottom',
      },
      '&:nth-child(even)': {
        backgroundImage: `url(${carousel_accent_right})`,
        backgroundPosition: 'right bottom',
      },

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonSkip: {
      //move to the right of the row
      alignSelf: 'flex-end',
      marginTop: '2vh',
      marginRight: '5vh',

      color: 'white',
      // material ui trasforms to uppercase, to respect the design we override it
      textTransform: 'none',
    },
    buttonNext: {
      // move to the bottom (this is the last element of flex-start)
      marginTop: 'auto',

      // spacing
      marginBottom: '10vh',

      // material ui trasforms to uppercase, to respect the design we override it
      textTransform: 'none',

      color: COLOR_CLIENT_NAVY,
      fontSize: 'large',
      backgroundColor: 'white',
    },
    slideContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '100%',
      maxWidth: '100%',
    },
    imageContainer: {
      // limit the width to appox 56% of vh and never more than 100% of vw. This is done to look good on tablets as well
      // is almost the same as 'calc(100vh * 375 / 667)' (being 375*667 the virtual viewport size of iPhone 6/7/8/SE)
      width: '56vh',
      maxWidth: '100%',

      // Center the image
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      // The image size is adjusted to the container, not the other way around, this allows to have a responsive image
      '& img': {
        width: '80%',
        height: '100%',
        objectFit: 'contain',
      },
    },
    title: {
      fontWeight: 400,
      fontSize: '23px',
      color: 'white',
      textAlign: 'center',
      margin: '0',
      maxWidth: '85vw',
    },
    description: {
      color: 'white',
      textAlign: 'center',
      margin: '0',
      // applies the smallest of the two values, 85vw will be used for mobile phones, 75vh for tablets
      maxWidth: 'min(85vw, 75vh)',
    },
    navBullets: {
      textAlign: 'center',
      '--swiper-pagination-bullet-inactive-color': '#DDDDDD',
      '--swiper-pagination-bullet-inactive-opacity': '1',
    },
    activeBullet: {
      backgroundColor: `${COLOR_CLIENT_ORANGE} !important`,
      width: '19px !important',
      borderRadius: '4px !important',
    },
  }
})

export default useStyles
