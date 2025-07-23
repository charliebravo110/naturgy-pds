import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    '& canvas': {
      width: '100% !important'
    }
  },
  selectorCont: {
    margin: '20px 0 20px 0'
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    padding: 40,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 50
  },
  icon: {
    width: 64
  },
  text: {
    marginTop: 20
  },
  tab: {
    color: colors.primary,
    fontSize: '0.8rem',
    border: '1px solid',
    borderColor: colors.lightBlue,
    padding: '0.8rem 2.5rem',
    cursor: 'pointer',
    marginRight: 15,
    minWidth: '100px',
    textAlign: 'center'
  },
  selectedTab: {
    color: colors.primary,
    fontSize: '0.8rem',
    fontWeight: 600,
    border: '2px solid',
    borderColor: colors.accent,
    padding: '0.8rem 2.5rem',
    cursor: 'pointer',
    marginRight: 15,
    minWidth: '100px',
    textAlign: 'center'
  },
}))

export default useStyles