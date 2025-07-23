import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_BG_SECTION, COLOR_CLIENT_NAVY } from '../common/configAndConstants'
import ratting_start_empty from '../../assets/icons/ratting-star.svg'
import ratting_start_filled from '../../assets/icons/ratting-star-filled.svg'

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      // make it look like a mobile bottom drawer
      '& .MuiDialog-paper': {
        position: 'absolute',
        width: '70%',
        border: `1px solid ${COLOR_CLIENT_NAVY}`,
        'box-shadow': '0px 3px 3px rgba(0, 0, 0, 0.2)',
        'border-radius': '10px',
      },
      // backdrop color & opacity
      '& .MuiBackdrop-root': {
        backgroundColor: `${COLOR_CLIENT_BG_SECTION}CC`, // last two chars are for opacity in hex
      },

      // content
      '& .MuiDialogContent-root': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '36px',
        'overflow-x': 'hidden',
        position: 'relative',

        '& .closeButton': {
          position: 'absolute',
          top: 0,
          right: 0,
        },
        '& h2': {
          color: COLOR_CLIENT_NAVY,
          fontSize: '20px',
          lineHeight: '24px',
          textAlign: 'center',
          fontWeight: 'normal'
        },
      },
      '& .MuiDialogActions-root': {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& button': {
          textTransform: 'none',
          fontSize: '16px',
          color: '#0066CC',
          margin: 'auto', // to center the button when there's only one
        },
      },

      '&.fullscreen': {
        '& .MuiDialog-paper': {
          width: '100%',
          border: `none`,
          'box-shadow': 'none',
          'border-radius': 0,
          'max-height': '100%',
          height: '100%',
        },
        '& .MuiDialogContent-root': {
          justifyContent: 'space-between',
          paddingTop: '60px'
        },
      },
    },
    stars: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'center',
      width: '100%',
    },
    star: {
      width: '36px',
      height: '36px',
      background: `url(${ratting_start_empty}) no-repeat center center`,
      transition: 'background-image 0.1s ease-in',
      '&.filled': {
        backgroundImage: `url(${ratting_start_filled})`,
      },
    },
    'h-100': {
      height: '100%',
    },
    textField: {
      margin: '16px 0',
      width: '100%',
      minHeight: '120px',
      '& .MuiInputBase-input':{
        minHeight: '2em'
      }
    },
  }
})

export default useStyles
