import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: '24px 6px',
    // overflow: 'hidden'
    
  },
  toolbar: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004571'
  }
}))

export default useStyles
