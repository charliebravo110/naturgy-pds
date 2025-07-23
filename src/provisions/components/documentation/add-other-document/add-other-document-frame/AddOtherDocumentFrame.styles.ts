import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  documentContainer: {
    [theme.breakpoints.only('xs')]: {
      margin: '0 auto'
    }
  },
  item: {
    backgroundColor: '#F8F7F6',
    border: '1px solid #E3E6E8',
    borderRadius: '5px',
    position: 'relative',
    minHeight: '230px',
    width: '180px'
  },
  container: {
    margin: '70px auto',
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
    fontSize: 14
  },
  icon: {
    width: '40px',
    height: '33px',
    cursor: 'pointer'
  }
}))

export default useStyles
