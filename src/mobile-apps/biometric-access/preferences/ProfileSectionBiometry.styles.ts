import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_BG_SECTION, COLOR_CLIENT_GREYTEXT, COLOR_CLIENT_NAVY } from '../../common/configAndConstants'

const useStyles = makeStyles((theme) => ({
  container: {
    //mobile first
    padding: '16px 0 0 0',
    [theme.breakpoints.up('sm')]: {
      padding: '32px',
    },
  },
  content: {
    backgroundColor: COLOR_CLIENT_BG_SECTION,
    width: '100%',
    //mobile first
    padding: '23px 15px 32px 17px',
    [theme.breakpoints.up('sm')]: {
      padding: '32px',
    },
    '& > h3': {
      color: COLOR_CLIENT_NAVY,
      fontSize: '24px',
      fontWeight: '400',
      marginTop: '0',
      marginBottom: '0',
    },
    '& > p': {
      color: COLOR_CLIENT_GREYTEXT,
    },
    '& label': {
      color: COLOR_CLIENT_NAVY,
    },
    '& > button': {
      height: '56px',
      marginTop: '16px',
      '&.Mui-disabled': {
        color: 'white !important',
        backgroundColor: '#BDBDBD !important',
      },
    },
  },
  toggleGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'top',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

export default useStyles
