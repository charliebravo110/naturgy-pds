import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  inputs: {
    marginTop: '25px'
  },
  label: {
    fontWeight: 'bold'
  },
  text: {
    color: '#868686'
  },
  inputContainer: {
    marginBottom: 25
  },
  noInput: {
    marginBottom: 120
  },
  input: {
    marginTop: 8,
    color: '#868686',
    '& .MuiFormControl-root': {
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    }
  },
}))
export default useStyles