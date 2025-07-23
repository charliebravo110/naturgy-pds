import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    '& canvas': {
      width: '100% !important'
    }
  },
  pieGraf: {
    color: '#004571',
    fontSize: 12,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginTop: 20
  }
}))

export default useStyles
