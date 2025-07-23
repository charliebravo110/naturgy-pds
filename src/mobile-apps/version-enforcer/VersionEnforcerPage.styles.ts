import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_NAVY } from '../common/configAndConstants'
import carousel_accent_right from '../../assets/img/carousel_accent_right.svg'

const useStyles = makeStyles((theme) => ({
  fullscreenOverlay: {
    position: 'fixed',
    display: 'flex',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1100, // zIndex of header is 1000

    background: COLOR_CLIENT_NAVY,
    backgroundImage: `url(${carousel_accent_right})`,
    backgroundPosition: 'right bottom',
    backgroundRepeat: 'no-repeat',
  },
  content: {
    margin: 'auto',
    height: '90%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    padding: theme.spacing(2),
    maxWidth: '-webkit-fill-available',
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
    // applies the smallest of the two values, 85vw will be used for mobile phones, 75vh for tablets
    maxWidth: 'min(75vw, 75vh)',
  },
  description: {
    color: 'white',
    textAlign: 'center',
    margin: '0',
    maxWidth: 'min(75vw, 75vh)',
  },
  button: {
    // material ui trasforms to uppercase, to respect the design we override it
    textTransform: 'none',

    color: COLOR_CLIENT_NAVY,
    fontSize: 'large',
    backgroundColor: 'white',

    marginBottom: '5vh',
  },
}))

export default useStyles
