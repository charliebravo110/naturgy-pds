import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NewRequest from '../../../../requests/components/new-request/NewRequest'
import RequestsList from '../../../../requests/components/requests-list/RequestsList'
import RequestDetail from '../../../../requests/components/request-detail/RequestDetail'

const Requests = (props: any) => {
  const { setCreatingNewRequestFromMeter, creatingNewRequestFromMeter, supplyData, isLoading, setIsLoading } = props
  const dispatch = useDispatch()

  const [ creatingNewRequest, setCreatingNewRequest ] = useState(false)
  const [ showingRequestDetail, setShowingRequestDetail ] = useState(false)

  const [ requestData, setRequestData ] = useState({} as any)

  return (
    <>
      {
        (creatingNewRequest || creatingNewRequestFromMeter > 0)  ?
          <NewRequest setCreatingNewRequest={setCreatingNewRequest} setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter} creatingNewRequestFromMeter={creatingNewRequestFromMeter} supplyData={supplyData} isLoading={isLoading} setIsLoading={setIsLoading} />
        :
          showingRequestDetail ?
            <RequestDetail requestData={requestData} setShowingRequestDetail={setShowingRequestDetail} />
          :
            <RequestsList setIsLoading={setIsLoading} setCreatingNewRequest={setCreatingNewRequest} setShowingRequestDetail={setShowingRequestDetail} supplyData={supplyData} setRequestData={setRequestData} />
      }
    </>
  )
}
export default Requests
