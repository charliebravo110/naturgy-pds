import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_NAVY } from '../../common/configAndConstants'

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      // make it look like a mobile bottom drawer
      '& .MuiDialog-paper': {
        position: 'absolute',
        minHeight: '45%',
        maxHeight: '45%',
        width: '100%',
        bottom: 0,
        margin: 0,
      },
      // backdrop color & opacity
      '& .MuiBackdrop-root': {
        backgroundColor: `${COLOR_CLIENT_NAVY}CC`, // last two chars are for opacity in hex
      },

      // content
      '& .MuiDialogContent-root': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingLeft: '50px',
        paddingRight: '50px',

        '& h2': {
          color: COLOR_CLIENT_NAVY,
          fontSize: '16px',
          textAlign: 'center',
        },
        '& p': {
          color: '#333333',
          fontSize: '16px',
          textAlign: 'center',
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
    },
  }
})

export default useStyles
