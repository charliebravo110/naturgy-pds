import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'


import useStyles from '../OngoingContracts/OngoingContracts.styles'
import List from '../ClosedContracts/List/List'
import Views from '../views/Views'
import Mosaic from '../ClosedContracts/Mosaic/Mosaic'
import DialogDetail from '../DialogDetail/DialogDetail'
import KoIcon from '../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'

const ClosedContracts = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setIsLoading,
    contracts,
    closedContracts,
    key,
    changedTab,
    supplyData,
    contractsError,
    setContractsError,
    isSubLoading
  } = props

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [showMosaic, setShowMosaic] = useState(0)
  const [showingDetail, setShowingDetail] = useState(false)

  const [finalList, setFinalList] = useState(closedContracts)
  const [selected, setSelected] = useState()

  useEffect(() => {
    if (closedContracts.length > 0) {
      setFinalList(closedContracts)
    }
  }, [closedContracts])

  useEffect(() => {
    if (finalList.length > 20) {
      setTotalPages(closedContracts.length === 0 ? 1 : Math.ceil(closedContracts.length / rowsPerPage))
    } else {
      setTotalPages(1)
    }
  }, [closedContracts, rowsPerPage, finalList])

  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  return (
    <>
      <Grid container alignItems='center' className={classes.searcher}>
        {!mobile && (
          <Grid item className={classes.mobileFullWidth2}>
            <Views
              view={showMosaic}
              handleChangeView={setShowMosaic}
            />
          </Grid>
        )}
        <Grid item className={classes.mobileFullWidth}>
          <DynamicSearcher
            label={t('provisions.provisionsList.searcher')}
            finalList={finalList}
            setFinalList={setFinalList}
            listItems={closedContracts}
            subtype={'Contracts'}
            setCurrentPage={setCurrentPage}
            CUPS={supplyData.cups}
            supplyData={supplyData}
            tab_name={'finalizadas'}
          />
        </Grid>
      </Grid>

      {
        (contractsError) &&
        <Grid container style={{ color: 'rgba(0, 69, 113, 1)', backgroundColor: '#f8dedf', padding: '12px', marginTop: '15px', marginBottom: '3px' }}>
          <Grid item style={{ textAlign: 'center' }}>
            <img src={KoIcon} alt='' width={38} />
          </Grid>

          <Grid item style={{ marginLeft: '10px' }}>
            <div>
              {'Por motivos técnicos, no podemos mostrarte la información de tus suministros.'}
            </div>
            <div>
              {'Por favor, intentalo más tarde.'}
            </div>
          </Grid>

          <img src={CloseIcon} style={{ width: '9px', position: 'relative', bottom: 20, left: '235px', cursor: 'pointer' }} alt='' onClick={() => { setContractsError(false) }} />

        </Grid>
      }


      {
        (mobile || showMosaic === 1) ?
          <Mosaic
            contractsList={finalList}
            setFinalList={setFinalList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleChangePage={handleChangePage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setShowingDialog={setShowingDetail}
            changedTab={changedTab}
            setSelectedData={setSelected}
            isSubLoading={isSubLoading}
            supplyData={supplyData}
          />
          :
          <List
            contractsList={finalList}
            setFinalList={setFinalList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleChangePage={handleChangePage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setShowingDialog={setShowingDetail}
            changedTab={changedTab}
            setSelectedData={setSelected}
            isSubLoading={isSubLoading}
            supplyData={supplyData}
          />
      }
      {
        (showingDetail) &&
        <DialogDetail
          showingDialog={showingDetail}
          setShowingDialog={setShowingDetail}
          selected={selected}
          CUPS={supplyData.cups}
        />
      }
    </>
  )
}

export default withRouter(ClosedContracts)
