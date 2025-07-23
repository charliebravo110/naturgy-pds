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
    marginTop: 126,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    },
    '&.without-margin': {
      marginTop: -46
    },
    '&.with-margin': {
      marginTop: 126
    }
  },
  container: {
    position: 'relative',
    padding: '20px 0',
    justifyContent: 'center'
  },
  goBackContainer: {
    position: 'absolute',
    top: 55,
    color: '#6AA1D8',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      top: 20
    }
  },
  goBack: {
    alignItems: 'center'
  },
  goBackIcon: {
    height: 24
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 26,
    '&.without-margin': {
      marginTop: 0
    }
  },
  description: {
    color: '#E97000',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 24
  },
  list: {
    justifyContent: 'center',
    marginTop: 42
  },
  panelTitle: {
    color: '#004571',
    fontWeight: 'bold'
  },
  searchContainer: {
    padding: 10,
    [theme.breakpoints.only('xs')]: {
      padding: '20px 20px 0 20px'
    }
  },
  inputContainer: {
    position: 'relative'
  },
  searchBox: {
    position: 'absolute',
    width: '100%',
    heigth: 'fit-content',
    maxHeight: '150px',
    backgroundColor: '#FFF',
    border: '1px solid rgba(0, 69, 113, 0.5)',
    borderTop: '0',
    top: 'calc(100%)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#004571',
      borderRadius: '10px'
    }
  },
  searchItem: {
    padding: '10px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 69, 113, 0.5)',
      color: '#FFF'
    },
    '&:active': {
      backgroundColor: 'rgba(0, 69, 113, 0.8)',
      color: '#FFF'
    }
  },
  input: {
    color: '#868686',
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiSelect-root': {
      color: '#868686'
    },
    '& textarea': {
      color: '#868686'
    }
  },
  iconColor: {
    color: '#004571'
  },
  buttons: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 42,
  },
  exit: {
    '& a': {
      color: '#6AA1D8'
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
    padding: 0
  },
}))(MuiExpansionPanelDetails)

export default useStyles

export {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
}
