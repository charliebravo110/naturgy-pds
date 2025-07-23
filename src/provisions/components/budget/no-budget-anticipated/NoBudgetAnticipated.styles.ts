import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '40px 72px',
    boxShadow: '0 0 2px #868686',
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      padding: '20px 36px',
      margin: 8
    }
  },
  title: {
    fontSize: 26,
    color: '#004571'
  },
  subtitle: {
    fontSize: 17,
    color: '#868686'
  },
  link: {
    color: '#5A85A1', 
    cursor: 'pointer'
  }
}))

export default useStyles

