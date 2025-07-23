import { makeStyles } from '@material-ui/core/styles'
import { COLOR_CLIENT_GREYTEXT, COLOR_CLIENT_NAVY } from '../../common/configAndConstants'


const COLOR_LINK = '#1674D1'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '80px',
    padding: '20px',
  },
  gridItem: {
    width: '100%',
  },
  goBackContainer: {
    color: COLOR_LINK,
    textDecoration: 'none'
  },
  goBackIcon: {
    height: 24,
    margin: '-1px 0 0 -6px'
  },
  notification: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '24px',
    '& .notification-date': {
      fontSize: '14px',
      lineHeight: '18px',
      color: COLOR_CLIENT_GREYTEXT,
    },
    '& .notification-title': {
      fontSize: '18px',
      lineHeight: '22px',
      fontWeight: '700',
      color: COLOR_CLIENT_NAVY,
    },
    '& .notification-body': {
      fontSize: '16px',
      lineHeight: '22px',
      color: COLOR_CLIENT_GREYTEXT,
    },
    '& .notification-action': {
      color: COLOR_LINK,
    },
  },
}))
export default useStyles
