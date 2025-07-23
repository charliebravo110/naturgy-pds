import { withStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

const NaturgyTooltip = withStyles((theme) => ({
  tooltip:
    {
      backgroundColor: '#EDF2F5',
      color: 'rgba(0, 69, 113, 1)',
      boxShadow: theme.shadows[1],
      padding: 12,
      width: 180,
      fontSize: 13
    }
}))(Tooltip)

export default NaturgyTooltip
