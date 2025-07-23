import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './Mosaic.styles'
import Pagination from '../../../../../../common/components/pagination/Pagination2'

import endIcon from '../../../../../../assets/icons/misdocumentos_validado.svg'
import rejectedIcon from '../../../../../../assets/icons/misdocumentos_rechazado.svg'
import LoadingAnimation from '../../../../../../assets/img/spinner.gif'
import { useMediaQuery } from 'usehooks-ts'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent } from '../../../../../../core/utils/gtm'


const Mosaic = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    contractsList,
    searchingRequestsList,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setShowingDialog,
    setSelectedData,
    isSubLoading,
    supplyData
  } = props

  const target = document.getElementById('number') as HTMLSelectElement

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  const mobileRes = useMediaQuery('(max-width:576px)')

  useEffect(() => {
    setTotalPagesFilter(contractsList.length === 0 ? 1 : Math.ceil(contractsList.length / rowsPerPage))
    // eslint-disable-next-line
  }, [contractsList, rowsPerPage])
  
  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  const onChangeSelector = (event) => {
    setCurrentPage(0);
    setRowsPerPage(Number(event.target.value));
  };
  
  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventClosedContracts = (contract:any):void => {
    sendGAEvent({
      event: 'consult_request',
      section_name: 'mis suministros',
      subsection_name: 'solicitudes de contratacion',
      click_text: 'ver detalle',
      element_type: 'conversion de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: 'finalizadas',
      request_status: getExpStatus(contract.estado),
      request_type: contract.desProceso.toLowerCase(),
      issue_date: contract.fecSolicitudFormated,
    })
  }
  

  return (
    <>
      {
        isSubLoading &&
        <Grid container className={classes.loadingBox}>
          <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
          <span className={classes.loadingText}>{t('supplies.suppliesDetails.components.contracts.loading')}</span>
        </Grid>
      }
      {contractsList.length === 0 ? (
        <Grid>
          {searchingRequestsList ? (
            t('requests.requestsList.list.emptyList.searching')
          ) : (
            t('requests.requestsList.list.emptyList.ClosedContracts')
          )}
        </Grid>
      ) : (
        <>
        {
          contractsList.length > 20 && totalPages > 1 ?
            <Grid container className={classes.totalItems}>
              {contractsList.slice((currentPage * rowsPerPage), ((currentPage * rowsPerPage) + rowsPerPage)).length + t('supplies.suppliesDetails.components.contracts.requestsFrom') + contractsList.length}
            </Grid>
            :
            (contractsList) && contractsList.length > 0 &&
             <Grid container className={classes.totalItems}>
              {contractsList.length + (contractsList.length > 1 ? t('supplies.suppliesDetails.components.contracts.requests') : t('supplies.suppliesDetails.components.contracts.request'))}
            </Grid>
        }
        <Grid container spacing={2}>
          {contractsList
            .slice((currentPage * rowsPerPage), (currentPage * rowsPerPage) + rowsPerPage)
            .map((contract, index) => (
              <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
                <Grid className={classes.item}>
                  <Grid className={classes.row}>
                    <Typography className={classes.title}>
                      {t('supplies.suppliesDetails.components.contracts.items.type')}
                    </Typography>

                    <Typography
                      className={`${classes.value}`}
                    >
                      {contract.desProceso}
                    </Typography>
                  </Grid>

                 
                    <Grid className={classes.row}>
                      <Typography className={classes.title}>
                        {t('supplies.suppliesDetails.components.contracts.items.comerc')}
                      </Typography>

                      <Typography className={classes.value}>
                        {contract.desComercializador}
                      </Typography>
                    </Grid>

                    <Grid className={classes.row}>
                      <Typography className={classes.title}>
                        {t('supplies.suppliesDetails.components.contracts.items.status')}
                      </Typography>

                      <Grid container justifyContent='center' className={classes.value}>
                            <Grid item className={classes.TypeIcon}>
                              {
                                contract.estado === t('supplies.suppliesDetails.components.contracts.states.finished') &&
                                <img src={endIcon} alt='' />
                              }
                              {
                                contract.estado === t('supplies.suppliesDetails.components.contracts.states.rejected') &&
                                <img src={rejectedIcon} alt=''  style={{color:'#d3222a'}}/>
                              }
                              {
                                contract.estado === t('supplies.suppliesDetails.components.contracts.states.canceled') &&
                                <img src={rejectedIcon} alt=''  style={{color:'#BDBDBD'}}/>
                              }
                            </Grid>
                            <Grid item className={classes.TypeLabel}>
                             {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.finished')) && t('supplies.suppliesDetails.components.contracts.states.finished')}
                             {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.rejected')) && t('supplies.suppliesDetails.components.contracts.states.rejected')}
                             {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.canceled')) && t('supplies.suppliesDetails.components.contracts.states.canceled')}
                            </Grid>
                      </Grid>
                    </Grid>

                    <Grid className={classes.row}>
                      <Typography className={classes.title}>
                        {t('supplies.suppliesDetails.components.contracts.items.startDate')}
                      </Typography>

                      <Typography className={classes.value}>
                        {contract.fecSolicitudFormated}
                      </Typography>
                    </Grid>
                  

                    <Grid className={classes.row}>
                     

                      <Typography className={classes.value}>
                        <div
                          className={classes.viewButton}
                          onClick={() => {
                            sendGAEventClosedContracts(contract);
                            setShowingDialog(true)
                            setSelectedData(contract)
                          }}
                        >
                          {t('supplies.suppliesDetails.components.contracts.items.seeDetail')}
                        </div>
                      </Typography>
                    </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
        </>
      )}
      {contractsList.length > 20 && (
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select
            id='number'
            name='number'
            onChange={onChangeSelector}
            value={rowsPerPage}
            className={classes.select}
          >
            <option value='20'>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      )}
      {
        totalPagesFilter > 1 &&
          <Grid container className={classes.paginationContainer}>
            <Pagination
              totalPages={totalPagesFilter}
              currentPage={currentPage}
              handleChangePage={handleChangePage}
            />
          </Grid>
      }
    </>
  )
}

export default Mosaic
