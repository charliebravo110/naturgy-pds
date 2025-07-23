import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: '24px 6px',
    overflow: 'hidden'
  },
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)'
  },
  icon: {
    width: 60
  },
  description: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold'
  },
  mainDescription: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold'
  },
  subDescription: {
    fontSize: 18,
    color: colors.primary
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 7
  }

}))

export default useStyles