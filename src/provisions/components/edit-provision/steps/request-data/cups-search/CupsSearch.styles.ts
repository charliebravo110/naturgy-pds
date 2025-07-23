import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px 0 10px',
    justifyContent: 'center'
  },
  containerData: {
    display: 'block',
    marginTop: 25,
    marginBottom: 10,
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  inputAddress: {
    display: 'block',
    marginTop: 6,
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
    },
    '& input': {
      height: 'auto',
      boxSizing: 'border-box'
    },
    '& .MuiInputBase-root': {
      display: 'flex'
    },
    '& .makeStyles-inputAddress-430': {
      display: 'flex'
    },
    '& .MuiSvgIcon-root': {
      fill: '#004571',
      position: 'absolute'
    }
  },
  textBlue:{
    display: 'block',
    fontSize: 14,
    color: '#1674D1'
  },
  selectContainer:{
    marginTop: 6
  },
  textBlueBold:{
    fontSize: 14,
    color: '#004571',
    fontWeight: 'bold',
    marginTop:25,
    marginBottom: 10
  },
  containerInput: {
    margin: '30px auto 0',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  inputSearch: {
    width: '100%',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
    }
  },
  imgAlert:{
    width: 25,
    margin: '5px 16px 0 0',
  },
  containerResult: {
    margin: '35px auto 0',
    backgroundColor: '#F2F1EF',
    textAlign: 'center',
    padding: '9px 0',
    '& span': {
      position: 'relative',
      top: -6,
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  locationButton: {
    marginLeft: 12,
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 24,
      marginLeft: 0
    }
  },
  containerLocation: {
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textLink:{
    color: '#1674D1',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  text: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 15
  },
  iconColor: {
    color: '#004571',
    cursor: 'pointer'
  },
  expansionPanelSummaryText: {
    color: '#004571',
    fontSize: 17,
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
  marginBottom: {
    marginBottom: '20px'
  },
  marginBottomMax: {
    marginBottom: '40px'
  },
  buttons: {
    justifyContent: 'center',
    margin: 35,
    '& button': {
      margin: '0 16px',
      marginBottom: '10px'
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
