import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'

import NewRequest from '../../../../requests/components/new-request/NewRequest'
import RequestsList from '../../../../requests/components/requests-list/RequestsList'
import RequestDetail from '../../../../requests/components/request-detail/RequestDetail'

import useStyles from './Requests.styles'

const Requests = (props: any) => {
  const classes = useStyles({})

  const { isLoading, setIsLoading } = props

  const [ creatingNewRequest, setCreatingNewRequest ] = useState(false)
  const [ showingRequestDetail, setShowingRequestDetail ] = useState(false)

  const [ requestData, setRequestData ] = useState({} as any)

  return (
    <Grid container justifyContent='center' alignItems='center'>
      <Grid item container md={12} className={classes.container}>
        {
          creatingNewRequest ?
            <NewRequest setCreatingNewRequest={setCreatingNewRequest} isLoading={isLoading} setIsLoading={setIsLoading} />
          : (
            showingRequestDetail ?
              <RequestDetail requestData={requestData} setShowingRequestDetail={setShowingRequestDetail} />
            :
              <RequestsList setIsLoading={setIsLoading} setCreatingNewRequest={setCreatingNewRequest} setShowingRequestDetail={setShowingRequestDetail} setRequestData={setRequestData} />
          )
        }
      </Grid>
    </Grid>
  )
}
export default Requests
