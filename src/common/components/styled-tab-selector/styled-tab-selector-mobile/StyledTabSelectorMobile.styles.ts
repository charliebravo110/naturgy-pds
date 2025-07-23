import { StyledTab } from '../StyledTabSelector'

import { withStyles } from '@material-ui/core/styles'

const MobileTab = withStyles({
  root: {
    padding: '1px !important',
    '&$selected': {
      borderBottom: '4px solid #E97000',
      borderRadius: 3.2
    }
  },
  wrapper: {
    alignItems: 'flex-start',
    marginBottom: '-10px'
  },
  selected: {}
})(StyledTab)

export default MobileTab