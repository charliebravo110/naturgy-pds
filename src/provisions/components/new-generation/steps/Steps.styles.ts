import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 100
  },
  container: {
    padding: '22px 0 20px',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  root: {
    width: '98%',
    '& .MuiStepper-root': {
      [theme.breakpoints.only('xs')]: {
        padding: 12
      }
    },
    '& .MuiStepper-alternativeLabel': {
      width: '100%',
      boxSizing: 'border-box'
    },
    '& .MuiStepIcon-root': {
      color: '#F2F1EF',
      border: 'solid 1px #D8D8D8',
      borderRadius: '50%'
    },
    '& .MuiStepIcon-active':{
      color: '#4C7C9B',
      borderColor: 'rgba(76, 124, 155, .2)',
      borderWidth: 4,
      marginTop: -4,
      '& .MuiStepIcon-text': {
        fill: '#FFF'
      }
    },
    '& .MuiStepLabel-label': {
      color: '#004571'
    },
    '& .MuiStepLabel-active': {
      color: '#4C7C9B',
      fontWeight: 'bold'
    },
    '& .MuiStepIcon-text':{
      fill: '#004571'
    },
    '& .MuiPaper-root': {
      backgroundColor: 'transparent'
    },
    '& .MuiStepIcon-completed': {
      color: '#4C7C9B'
    },
    '& .MuiStepConnector-root': {
      left: 'calc(-50%)',
      right: 'calc(50%)',
      zIndex: -1
    },
    '& .MuiStepConnector-line': {
      borderColor: '#D8D8D8'
    }
  },
  expansionPanelSummaryIndex: {
    width: 24,
    height: 24,
    boxSizing: 'border-box',
    color: '#004571',
    backgroundColor: '#FFF',
    fontSize: 12,
    padding: '4px 0 0 7px',
    border: '1px solid #E1E9EE',
    borderRadius: '50%'
  },
  indexActive: {
    boxShadow: '0px 0px 0px 5px #ffffff40'
  },
  expansionPanelSummaryText: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold'
  },
  textActive: {
    color: '#FFF'
  },
  dossierDateAdviseBox: {
    margin: '0 auto'
  },
  dossierDateAdviseContainer: {
    backgroundColor: '#FFF9E1',
    marginBottom: 46,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  dossierDateAdviseTitle: {
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  infoIcon: {
    width: 35,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      marginBottom: '15px',
      display: 'block'
    }
  },
  actionBox: {
    display: 'inline-flex',
    width: 'auto',
    backgroundColor: '#E1EDF0',
    color: '#164258',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: 4,
    marginLeft: '10px'
  },
  alertLabel: {
    marginLeft: 8
  },
  alertIcon: {
    height: 16
  }
}))

const ExpansionPanel = withStyles({
  root: {
    width: '100%',
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
    },
    '&.Mui-disabled': {
      backgroundColor: '#F2F1EF'
    }
  },
  expanded: {},
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles({
  root: {
    border: '1px solid #E1E9EE',
    fontWeight: 'bold',
    minHeight: 56,
    '&.disabled': {
      color: '#004571'
    },
    '&.active': {
      backgroundColor: '#4c7c9b',
      color: '#004571'
    },
    '&.done': {
      backgroundColor: '#004571',
      color: '#FFF'
    },
    '&$expanded': {
      minHeight: 56
    },
    '&.colored': {
      backgroundColor: '#004571',
      color: '#FFF'
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
    fontSize: 32,
    '&.disabled': {
      fill: '#004571'
    },
    '&.active': {
      fill: 'white'
    },
    '&.done': {
      fill: 'white'
    }
  }
})(ExpandMoreIcon)

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: 32,
    [theme.breakpoints.only('xs')]: {
      padding: 8
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
