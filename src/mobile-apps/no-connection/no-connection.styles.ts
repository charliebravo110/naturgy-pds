import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_NAVY, COLOR_CLIENT_ORANGE } from '../common/configAndConstants'

const useStyles = makeStyles((theme) => ({
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '44px'
  },
  imgContainer: {
    margin: 0,
    padding: 0,
    position: 'relative',
  },
  textContainer: {
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '0 48px'
  },
  title: {
    fontSize: '23px',
    lineHeight: '27.6px',
    margin: 0,
    fontWeight: 400,
  },
  text: {
    fontSize: '16px',
    lineHeight: '19.2px',
    fontWeight: 400,
    margin: 0,
  },
  imgPhone: {
    height: '262px',
    width: 'auto'
  },
  imgShadow: {
    position: 'absolute',
    left: 0,
    bottom: '-15px',
    opacity: '0.5'
  },
  footer: {
    width: '375px',
    height: '200px',
    position: 'absolute',
    backgroundColor: COLOR_CLIENT_ORANGE,
    bottom: '-145px',
    borderRadius: '100%',
  }
}))

export default useStyles