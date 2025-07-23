import { makeStyles } from '@material-ui/core/styles'
import {
  COLOR_CLIENT_GREYTEXT,
  COLOR_CLIENT_NAVY,
  COLOR_CLIENT_ORANGE,
  COLOR_CLIENT_TURQUOISE,
} from '../common/configAndConstants'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '80px',
    padding: '20px',
  },
  gridItem: {
    width: '100%',
  },
  title: {
    fontSize: 36,
    color: COLOR_CLIENT_NAVY,
    margin: '26px 0 30px',
    textAlign: 'center',
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconInput: {
    color: COLOR_CLIENT_NAVY,
    display: 'flex',
    alignSelf: 'center'
  },
  notification: {
    display: 'grid',
    gridTemplateColumns: '12px 1fr',
    gap: '12px',
    marginTop: '24px',
    alignItems: 'baseline',
    '& .notification-date': {
      fontSize: '14px',
      lineHeight: '18px',
      color: COLOR_CLIENT_GREYTEXT,
    },
    '& .notification-title': {
      fontSize: '16px',
      lineHeight: '22px',
      color: COLOR_CLIENT_NAVY,
    },
    '&.unread': {
      '& .status-icon': {
        backgroundColor: COLOR_CLIENT_TURQUOISE,
      },
      '& .notification-title': {
        fontWeight: '700',
      },
    },
    '& .status': {
      display: 'flex',
      '& .status-icon': {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        transition: 'background-color 0.3s ease-in-out',
      },
    },
  },
  textField: {
    width: '100%',
  },
  emptyMessage: {
    marginTop: '24px',
    fontSize: '16px',
    lineHeight: '22px',
    color: COLOR_CLIENT_ORANGE,
  }
}))

export default useStyles
