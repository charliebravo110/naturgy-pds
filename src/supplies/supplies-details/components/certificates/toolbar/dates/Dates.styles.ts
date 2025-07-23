import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dates: {

  },
  label: {
    color: '#004571'
  },
  date: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  }
}))

export default useStyles
