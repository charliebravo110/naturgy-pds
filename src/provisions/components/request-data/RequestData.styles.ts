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
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  expansionPanelSummaryIcon: {
    width: 24,
    height: 24
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
  button: {
    margin: 10
  },
  cancelButton: {
    color: '#004571'
  },
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  },
  dialogContainer: {
    position: 'relative',
    padding: 36
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    '& .row': {
      display: 'block',
      textAlign: 'center',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
    '& .buttons': {
      justifyContent: 'center',
      marginTop: 36
    }
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'rgba(0, 69, 113, 1)'
  },
  textBold: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)'
  },
  alertIcon: {
    height: '100%'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  disabledDocAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  disabledDocAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  fullWidth: {
    width: '100%'
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
      padding: '0 72px',
      [theme.breakpoints.down('sm')]: {
        padding: '0 20px'
      }
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
