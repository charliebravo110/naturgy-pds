import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'

import Type from './type/Type'
import DocumentationRequestData from './documentation/Documentation'
import Location from './location/Location'

import useStyles from './RequestData.styles'

const RequestData = (props: any) => {
  const classes = useStyles({})
  
  const {
    history,
    setRequestDataCompleted
  } = props

  const [ activeComponent, setActiveComponent] = useState(0)

  return (
    <Grid container className={classes.maxWidthForBigScreens}>
      {
        activeComponent === 0 &&
          <Type
            history={history}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
      }
      {
        activeComponent === 1 &&
          <DocumentationRequestData
            history={history}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
      }
      {
        activeComponent === 2 &&
          <Location
            history={history}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
            setRequestDataCompleted={setRequestDataCompleted}
          />
      }

    </Grid>
  )
}

export default RequestData
