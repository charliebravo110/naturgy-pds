import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import ActiveRearm from './active-rearm/ActiveRearm'
import useStyles from './Meter.styles'
import ReconnectingDialog from './reconnecting-dialog/ReconnectingDialog'

const Meter = (props: any) => {
  const classes = useStyles({})

  const {
    supplyData,
    document,
    setRearmExit
  } = props

  const [activeRearm, setActiveRearm] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const meterRearmTimeout = useState(210000)

  const [readingTypesIds, setReadingTypesIds] = useState('')

  const handleReturn = () => {
    setRearmExit(false)
  }

  return (
    <>
      <Grid container className={classes.container} justifyContent='center'>
        <Grid container md={10} direction='column' justifyContent='center' className={classes.maxWidthForBigScreens}>
          {
            isReconnecting &&
            <ReconnectingDialog isConnecting={isReconnecting} timeout={meterRearmTimeout} handleReturn={handleReturn} />
          }

          {
            activeRearm &&
              <ActiveRearm
                setActiveRearm={setActiveRearm}
                setIsReconnecting={setIsReconnecting}
                meterRearmTimeout={meterRearmTimeout}
                supplyData={supplyData}
                readingTypesIds={readingTypesIds}
                document={document}
              />
          }
        </Grid>
      </Grid>
    </>
  )
}

export default Meter
