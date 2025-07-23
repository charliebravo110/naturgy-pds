import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_NAVY } from '../../common/configAndConstants'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: '#F2F6F8',
      '&:hover': {
        backgroundColor: '#F0F4F6',
      },
      textTransform: 'none',
      fontSize: 'large',
      marginTop: '20px',
      boxShadow: 'none',
      color: COLOR_CLIENT_NAVY,
      '& img': {
        marginRight: '15px',
        maxWidth: '30px',
        maxHeight: '30px',
      },
      // to match the width of the inputs:
      width: '74%',
    },
  }
})

export default useStyles
