import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Pagination from '../../../common/components/pagination/Pagination'

import List from './list/List'
import Mosaic from './mosaic/Mosaic'
import requestRoleFilter from '../../../requests/components/request-filter/RequestFilter'
import { thunkGetMasterData } from '../../../provisions/store/actions/ProvisionsThunkActions'

const Requests = (props: any) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    requests
  } = props
 
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ totalPages, setTotalPages ] = useState(0)
  const rowsPerPage = 5

  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    dispatch(thunkGetMasterData(
      'SERVICE_REQUEST_FILTERS',
      'ES',
      'FILTERS',
      (response) => {
        if (response && response.length > 0) {
          setFilterList(response[0].value.split(';'))
        }
      }
    ))
  }, [])

  const requestList = requestRoleFilter(requests.list.filter(item => item.indRead === 0), filterList)

 

  useEffect(() => {
    setTotalPages(requestList.length === 0 ? 1 : Math.ceil(requestList.length / rowsPerPage))
  }, [ requestList ])

  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  return (
    <>
      {
        mobile ?
          <Mosaic
            requestsList={requestRoleFilter(requestList, filterList)}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        :
          <List
            requestsList={requestRoleFilter(requestList, filterList)}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
      }
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />
    </>
  )
}

export default withRouter(Requests)
