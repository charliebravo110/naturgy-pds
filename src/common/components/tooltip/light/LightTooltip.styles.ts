import { withStyles } from '@material-ui/core/styles'

import Tooltip from '../Tooltip'

const NaturgyLightTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: 172,
    backgroundColor: '#EDF2F5',
    color: 'rgba(0, 69, 113, 1)'
  }
}))(Tooltip)

export default NaturgyLightTooltip
