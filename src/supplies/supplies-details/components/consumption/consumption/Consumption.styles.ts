import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  text: {
    lineHeight: '20px',
    '& a': {
      color: '#1674D1'
    }
  },
  message: {
    alignItems: 'center',
    float: 'left',
    marginTop: 26,
  },  
  icon: {
    float: 'left',
    margin: 21
  },

  containerteleoperable: {
    backgroundColor: '#E5ECF0',
    borderRadius: 4,
    margin: 20,
    color: 'rgba(0, 69, 113, 1)',
    display: 'flex'
  },
  badge: {
    paddingRight: 16
  },
  customBadge: {
    backgroundColor: '#CF0E11',
    color: '#FFF'
  },
  tab: {
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
  },
  views: {
    width: '100%',
    marginTop: 22,
    '& div[data-swipeable="true"]': {
      overflow: 'hidden !important'
    }
  },
  tabs: {
    borderBottom: 0,
    '& button': {
      padding: '0 12px',
      marginRight: 12
    }
  },
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    marginTop: 15
  },
  box2: {
    position: 'relative',
    padding: 32,
    marginTop: 15,
    [theme.breakpoints.only('xs')]: {
      padding: 0,
    }
  },
  navigation: {
    margin: '-19px 0 0 -15px'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  noResults: {
    // width: '100%',
    textAlign: 'center',
    padding: 40,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 50
  },
  title: {
    paddingBottom: 20,
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginRight: 15,
    borderBottom: 'solid 1px #E1E9EE'
  },
  titleSinBorderBottom: {
    paddingBottom: 20,
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginRight: 15,
   
  },
  BorderBottom: {
    borderBottom: 'solid 1px #E1E9EE'
  },

 

  titleDesplegable: {   
    //gridAutoRows: '1fr',
    fontSize: 36,    
    //background: '#D8D8D8'
  },
  titleDetalle: {
    height: '20%',
    width:'inherit',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8
    },
    '&.selected': {
      fontWeight: 'bold'
    },
    '&.disabled': {
      filter: 'grayscale(80%)'
    }
  },
  description: {
    paddingBottom: 20,
    marginBottom: 20,
    marginTop: 16,
    color: '#555555',
    lineHeight: '20px'
  },
  descriptionPeajes: {
    paddingBottom: 20,
    marginBottom: 20,
    marginTop: 4,
    color: '#555555',
    lineHeight: '20px'
  },
  dateLabel: {
    color: 'rgba(0, 69, 113, 1)'
  },
  menu: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  menuItem: {
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  downloadBlock: {
    backgroundColor: '#F1F5F8',
    padding: '40px',
    marginTop: '40px'
  },
  downloadTextBlock: {
    color: '#7C7D81',
    marginBottom: 20
  },
  downloadTextBold: {
    fontWeight: 'bold'
  },
 
  export: {
    color: '#1674D1',
    cursor: 'pointer',
    '&.marginLeft': {
      marginLeft: 58
    },
    [theme.breakpoints.down('sm')]: {
      '&.marginTop': {
        marginTop: 12
      },
      '&.marginLeft': {
        marginLeft: 0
      }
    }
  },
  exportContainer: {
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  checkbox: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    color: 'transparent',
    fontSize: 10,
    padding: '1px 4px',
    border: 'solid 1px #798996',
    borderRadius: 4,
    '&::before': {
      content: '"✓"'
    },
    '&.active': {
      backgroundColor: '#1674D1',
      color: '#FFF',
      borderColor: '#1674D1'
    }
  },

  noConsumptionIcon: {
    marginBottom: 10
  },
  label: {
    marginLeft: 7
  },
  buttonBlock: {
    marginTop: 40
  },
  teleoperableAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
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