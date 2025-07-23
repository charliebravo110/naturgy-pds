import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    
  },
  billingDatepickerCont: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  },
  label: {
    color: '#004571',
  },
  billingDatepicker: {
    margin: '6px 12px 0 0',
  }
}))

export default useStyles
