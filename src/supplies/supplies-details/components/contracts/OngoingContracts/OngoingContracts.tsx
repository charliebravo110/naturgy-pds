import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'


import useStyles from './OngoingContracts.styles'
import List from './List/List'
import Views from '../views/Views'
import Mosaic from './Mosaic/Mosaic'
import DialogDetail from '../DialogDetail/DialogDetail'
import { title } from 'process'
import { formatIsoDate } from '../../../../../common/lib/FormatLib'
import KoIcon from '../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'

const OngoingContracts = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setIsLoading,
    contracts,
    ongoingContracts,
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
  const [selected, setSelected] = useState<any>()
  const [cupsState, setcupsState] = useState(props.location.state && props.location.state.cups)
  const [dashboard, setDashboard] = useState(props.location.state && props.location.state.dashboard)
  const [contractState, setContractState] = useState(props.location.state && props.location.state.contract)
  const [showingDetailFromState, setShowingDetailFromState] = useState(false)

  useEffect(() => {
    console.log('selected: ', selected);
    console.log('selected: ', selected?.pasos?.paso);
    console.log('selected: ', supplyData.cups);
  }, [selected])

  useEffect(() => {
    if (cupsState && contractState) {
      contractState.estado = contractState.estado.charAt(0).toUpperCase() + contractState.estado.slice(1).toLowerCase()
      contractState.fecSolicitudFormated = formatIsoDate(contractState.fecSolicitud);
      setShowingDetailFromState(true)
    }
  }, [contractState, cupsState])

  const [finalList, setFinalList] = useState(ongoingContracts)


  useEffect(() => {
    if (ongoingContracts.length > 0) {
      setFinalList(ongoingContracts)
    }
  }, [ongoingContracts])

  useEffect(() => {
    if (finalList.length > 20) {
      setTotalPages(ongoingContracts.length === 0 ? 1 : Math.ceil(ongoingContracts.length / rowsPerPage))
    } else {
      setTotalPages(1)
    }
  }, [ongoingContracts, rowsPerPage, finalList])


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
            listItems={ongoingContracts}
            subtype={'Contracts'}
            setCurrentPage={setCurrentPage}
            CUPS={supplyData.cups}
            supplyData={supplyData}
            tab_name={'en curso'}
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

          <img src={CloseIcon} style={{ width: '9px', position: 'absolute', top: 102, right: 20, cursor: 'pointer' }} alt='' onClick={() => { setContractsError(false) }} />

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
            selectedData={selected}
            setSelectedData={setSelected}
            setShowingDialog={setShowingDetail}
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
            selectedData={selected}
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

      {
        (showingDetailFromState) &&

        <DialogDetail
          showingDialog={showingDetailFromState}
          setShowingDialog={setShowingDetailFromState}
          selected={contractState}
          CUPS={cupsState}
        />
      }
    </>
  )
}

export default withRouter(OngoingContracts)
