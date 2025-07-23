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
  tableTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004571',
    [theme.breakpoints.down('sm')]: {
      marginTop: 30
    }
  },
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none',
    minHeight: '60vh',
    maxHeight: '80vh'
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
  marginBottomMobile: {
    marginBottom: 4,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 8
    }
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
  label: {
    fontWeight: 'bold'
  },
  text: {
    color: '#868686'
  },
  inputContainer: {
    marginBottom: 25
  },
  topMarginContainer:{
    marginTop:10
  },
  topMarginContainerv2:{
    marginTop:5
  },
  input: {
    flexBasis: 'auto',
    color: '#868686',
    '& .MuiFormControl-root': {
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: '220px',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '13px',
    padding: '5px 8px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  separator: {
    width: '100%',
    height: '2px',
    backgroundColor: '#EBE9E6',
    margin: '30px 0'
  },
  button: {
    margin: 10
  },
  cancelButton: {
    color: '#004571'
  },
  addressLabel: {
    display: 'inline-flex',
    maxWidth: 600
  },
  checkboxContainer2: {
    alignItems: 'center',
    margin: '12px 0 30px 0',
    '& .checkbox': {
      // marginTop: 12,
    },
    '& .label': {
      marginLeft: 6,
      // marginTop: 12,
      '& span': {
        color: '#1674D1',
        fontSize: 14,
        cursor: 'pointer',
      }
    }
  },
  budgetExtension: {
    margin: '12px 0 30px 0'
  },
  stateLabel: {
    color: '#868686'
  },
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
      padding: '32px 15px'
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
