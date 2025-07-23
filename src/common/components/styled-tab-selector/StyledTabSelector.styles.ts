import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const NaturgyTabs = withStyles({
  root: {
    borderBottom: '1px solid #DBDBDB'
  },
  indicator: {
    backgroundColor: '#E97000',
    height: 5,
    borderRadius: 8
  }
})(Tabs)

const NaturgyTabsReactive = withStyles({
  root: {
    borderBottom: '1px solid #DBDBDB'
  },
  indicator: {
    backgroundColor: '#E97000',
    height: 5,
    borderRadius: 8
  }
})(Tabs)

const NaturgyTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: 32,
    color: '#004571',
    '&:hover': {
      opacity: 0.8
    },
    '&$selected': {
      fontWeight: 'bold',
      color: '#004571'
    },
    '&:focus': {
      fontWeight: 'bold'
    },
    [theme.breakpoints.only('xs')]: {
      marginRight: 0
    }
  },
  selected: {}
}))(Tab)

export { NaturgyTabs, NaturgyTab, NaturgyTabsReactive }
