import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import colors from '../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    alignSelf: 'center'
  },
  marginLeft: {
    marginLeft: 10
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
  expansionPanelSummaryText2: {
    color: '#004571',
    fontSize: 17,
    marginLeft: 24
  },
  expansionPanelDetailsTitle: {
    color: '#004571',
    fontWeight: 'bold'
  },
  expansionPanelDetailsValue: {
    marginTop: 6
  },
  inputContainer: {
    marginBottom: 30,
    minHeight: 87
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
  label: {
    marginBottom: 7,
    color: '#004571',
    '& img': {
      position: 'relative',
      top: 3,
      left: 6
    }
  },
  stateLabel: {
    color: '#868686'
  },
  stateLabel_: {
    color: '#868686',
    marginLeft: 24,
    fontSize: 16
  },
  procedure: {
    marginTop: 30
  },
  checkboxContainer: {
    alignItems: 'center',
    '& .checkbox': {

    },
    '& .label': {
      marginLeft: 6,
      '& span': {
        color: '#1674D1',
        fontSize: 14,
        cursor: 'pointer',
      }
    }
  },
  checkboxContainer2: {
    alignItems: 'center',
    '& .checkbox': {
      marginTop: 12,
    },
    '& .label': {
      marginLeft: 6,
      marginTop: 12,
      marginRight: 6,
      '& span': {
        color: '#1674D1',
        fontSize: 14,
        cursor: 'pointer',
      }
    },
    '& .link': {
      // marginLeft: 6,
      marginTop: 12,
      '& span': {
        color: '#1674D1',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline'
      }    
    }
  },
  royalDecreeContainer: {
    backgroundColor: '#F2F5F8',
    borderRadius: 4,
    padding: 16,
    '& .separated': {
      marginTop: 12
    },
    '& a': {
      color: '#1674D1'
    }
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 8
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
  },
  blueBox: {
    backgroundColor: '#f3f5f8',
  },
  separator: {
    height: 2,
    backgroundColor: '#ccdae3',
    margin: '15px 24px 0 24px'
  },
  fullSize: {
    width: '100%'
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
    },
    '&.blue': {
      backgroundColor: colors.lighterBlue,
      // color: '#004571',
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
