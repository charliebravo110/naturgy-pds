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
    padding: '23px 16px 16px 16px',
    [theme.breakpoints.up('sm')]: {
      padding: '32px',
    },
    '& > a': {
      color: '#0066CC',
      display: 'flex',
      textDecoration: 'none',
      fontSize: '16px',
      margin: '15px 0',
      '& img': {
        width: '12px',
        height: '12px',
        marginLeft: '6px'
      },
      '& span': {
        margin: '-10px 0 0 10px'
      },
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
    '& > button': {
      height: '56px',
      marginTop: '16px',
      '&.Mui-disabled': {
        color: 'white !important',
        backgroundColor: '#BDBDBD !important',
      },
    },
  },
  hrStyled: {
    border: 'none',
    height: '1px',
    backgroundColor: '#00457133',
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
  labelArea: {
    paddingRight: theme.spacing(1),
    '& > label': {
      color: COLOR_CLIENT_NAVY,
    },
    '& > span': {
      color: COLOR_CLIENT_GREYTEXT,
    },
  },
  switchAll: {
    '& > label': {
      fontWeight: '700',
      color: COLOR_CLIENT_NAVY,
    },
  },
}))

export default useStyles
