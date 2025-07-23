import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  containerIE: {
    display: 'block'
  },
  box: {
    margin: '24px auto 0'
  },
  fullWidth: {
    width: '100%'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    width: '100%',
    textAlign: 'center'
  },
  headerSubTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgb(0, 69, 113)',
    textAlign: 'center',
    marginTop: '2%',
    marginBottom: '10px',
    width: '100%'
  },
  validatedContainer: {
    margin: '15px 0 35px 0',
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  },
  validatedTitle: {
    color: '#004571',
    fontSize: 25
  },
  validatedSubtitle: {
    color: '#E77B11',
    fontWeight: 'bold',
    fontSize: 20
  },
  tickContainer: {
    width: '100%',
    margin: '10px 0 25px 0'
  },
  tickText: {
    color: '#838383',
    margin: '10px 0'
  },
  docsListCont: {
    color: '#838383',
    margin: '10px 0px 10px 60px'
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
  fileFormatAdvise: {
    marginTop: '10px',
    marginBottom: '30px',
    fontSize: 15,
    color: '#838383',
    fontWeight: 'bold'
  },
  sentDocumentAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginTop: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '13px'
  },
  alertIcon: {
    width: 35,
    [theme.breakpoints.only('xs')]: {
      margin: '0',
      marginBottom: '15px',
      display: 'block'
    }
  },
  alertIconRevision: {
    width: 20,
    [theme.breakpoints.down('sm')]: {
      margin: '0',
      marginBottom: '15px',
      display: 'block'
    }
  },
  sentDocumentAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094',
    marginLeft: -20
  },
  sentDocumentAdviseSubtitle: {
    color: '#256094',
    marginTop: 10,
    marginLeft: -20
  },
  otherDocAdviseContainer: {
    backgroundColor: '#F2F5F8',
    padding: '15px',
    borderRadius: '5px',
    fontSize: '13px',
    marginTop: '20px'
  },
  otherDocAdviseTitle: {
    color: '#256094',
    marginLeft: -20,
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  documentationExpedientContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: '5px',
    fontSize: '14px',
    marginTop: '20px',
    fontWeight: 'bold'
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

const ExpansionPanelSummary = withStyles({
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
      padding: '0 72px'
    }
  },
  content: {
    '&$expanded': {

    },
  },
  expanded: {},
})(MuiExpansionPanelSummary)

const StyledExpandMoreIcon = withStyles({
  root: {
    fill: '#1674D1',
    fontSize: 32
  }
})(ExpandMoreIcon)

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: '20px 32px'
  },
}))(MuiExpansionPanelDetails)

export default useStyles

export {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
}
