import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Grid } from 'swiper'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 3
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
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
    fontWeight: 'bold',
  },
  expansionPanelDetailsValue: {
    marginTop: 6
  },
  powerValuesSpacing: {
    marginBottom: 15
  },
  titleSelfConsumption: {
    color: '#004571',
    fontWeight: 'bold',
    padding: '16px 16px 0px 16px'
  },
  expansionPanelDetailsValueSelfConsumption: {
    padding: '16px 16px 0px 16px'
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
    fill: '#004571',
    fontSize: 32
  }
})(ExpandMoreIcon)

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: '32px 5px 32px 32px ',
  }
}))(MuiExpansionPanelDetails)

const useStylesForGrid = makeStyles((theme) => ({
  root: {
    paddingRight: 0
  }
}))

export default useStyles

export {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails,
  useStylesForGrid
}
