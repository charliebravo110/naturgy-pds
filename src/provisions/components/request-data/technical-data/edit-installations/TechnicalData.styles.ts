import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignSelf: 'center'
  },
  summaryContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 30px'
    }
  },
  expansionPanelSummaryIcon: {
    width: 24
  },
  expansionPanelSummaryText: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 24
  },
  expansionPanelDetailsTitle: {
    color: '#004571',
    fontWeight: 'bold'
  },
  expansionPanelDetailsValue: {
    marginTop: 6
  },
  compulsoryMessage: {
    color: '#838383',
    margin: '40px 10px 20px',
    textAlign: 'center'
  },
  textAlignRight: {
    textAlign: 'right',
    marginRight: '5px'
  },
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
    flexBasis: 'auto',
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
  separator: {
    width: '100%',
    height: '2px',
    backgroundColor: '#EBE9E6',
    margin: '15px 0'
  },
  button: {
    margin: 10
  },
  cancelButton: {
    color: '#004571'
  },
  description: {
    color: '#868686',
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiSelect-root': {
      color: '#868686'
    },
    '& textarea': {
      color: '#868686'
    },
    '& p.Mui-error': {
      [theme.breakpoints.up('sm')]: {
        position: 'absolute',
        top: '100%'
      }
    }
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: '220px',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '13px',
    padding: '5px 8px',
    textAlign: 'center',
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      marginTop: 10
    }
  }
}))

const ExpansionPanel = withStyles({
  root: {
    width: '100%',
    border: '1px solid #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&:first-child': {
      marginTop: 0
    },
    '&$expanded': {
      marginTop: 20
    }
  },
  expanded: {},
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles(theme => ({
  root: {
    borderBottom: '1px solid #E1E9EE',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    },
    '&:not($expanded)': {
      borderBottom: 0
    },
    '&.colored': {
      backgroundColor: '#F2F5F8',
      color: '#004571',
      padding: '0'
    }
  },
  content: {
    '&$expanded': {

    },
  },
  expanded: {},
}))(MuiExpansionPanelSummary)

const StyledExpandMoreIcon = withStyles({
  root: {
    fill: '#1674D1',
    fontSize: 32
  }
})(ExpandMoreIcon)

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: '32px 72px',
    color: '#004571',
    [theme.breakpoints.down('sm')]: {
      padding: '32px 30px'
    }
  },
}))(MuiExpansionPanelDetails)

export default useStyles

export {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
}
