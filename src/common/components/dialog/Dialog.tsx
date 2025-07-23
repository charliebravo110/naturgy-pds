import React from 'react'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'

const NaturgyDialog = (props: any) => {
  const theme = useTheme()
  const width = useMediaQuery(theme.breakpoints.only('xs')) ? '100%' : '65%'

  const CustomDialog = withStyles({
    root: {
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      },
      '& .MuiDialog-paper': {
        width: width
      }
    }
  })(Dialog)

  return <CustomDialog maxWidth={false} {...props} />
}

export default NaturgyDialog
