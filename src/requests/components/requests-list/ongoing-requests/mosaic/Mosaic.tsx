import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './Mosaic.styles'
import { adminCheck } from '../../../../../common/lib/ValidationLib';
import Pagination from '../../../../../common/components/pagination/Pagination2'
import DialogReiteracion from '../../../request-detail/dialog-reiteracion/DialogReiteracion'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import { completeDate } from '../../../../../common/lib/FormatLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'

const Mosaic = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    requestsList,
    searchingRequestsList,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    handleGetTypologyByCode,
    handleClickButton,
    handleClickViewButton,
    dossierStatusId,
    checkReiteracion,
  } = props

  const target = document.getElementById('number') as HTMLSelectElement

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  useEffect(() => {
    setTotalPagesFilter(requestsList.length === 0 ? 1 : Math.ceil(requestsList.length / rowsPerPage))
    // eslint-disable-next-line
  }, [requestsList, rowsPerPage])
  
  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setRowsPerPage(Number(target.options[target.selectedIndex].value))
  }

  return (
    <>
      {requestsList.length === 0 ? (
        <Grid>
          {searchingRequestsList ? (
            t('requests.requestsList.list.emptyList.searching')
          ) : (
            t('requests.requestsList.list.emptyList.default')
          )}
        </Grid>
      ) : (
        <>
        {
          requestsList.length > 20 && totalPages > 1 ?
            <Grid container className={classes.totalItems}>
            {requestsList.slice((currentPage * rowsPerPage), ((currentPage * rowsPerPage) + rowsPerPage)).length + t('requests.requestsList.requestsFrom') + requestsList.length}
            </Grid>
            :
            <Grid container className={classes.totalItems}>
              {requestsList.length + (requestsList.length > 1 ? t(' peticiones') : t(' petición'))}
            </Grid>
        }
        <Grid container spacing={2}>
          {requestsList
            .slice((currentPage * rowsPerPage), (currentPage * rowsPerPage) + rowsPerPage)
            .map((request, index) => (
              <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
                <Grid className={classes.item}>
                  <Grid className={classes.row}>
                    <Typography className={classes.title}>
                      {t('requests.requestsList.list.requestCode')}
                    </Typography>

                    <Typography
                      className={`${classes.value} ${request.indRead === 1 ? '' : 'bold'}`}
                    >
                      {request.codSR}
                    </Typography>
                  </Grid>

                  {adminCheck() &&
                    <Grid className={classes.row}>
                      <Typography className={classes.title}>
                        {t('requests.requestsList.list.channel')}
                      </Typography>

                      <Typography className={classes.value}>
                        {request.channel}
                      </Typography>
                    </Grid>
                  }

                  <Grid className={classes.row}>
                    <Typography className={classes.title}>
                      {t('requests.requestsList.list.requestType')}
                    </Typography>

                    <Typography className={classes.value}>
                      {handleGetTypologyByCode(request.tipology)}
                    </Typography>
                  </Grid>

                  <Grid className={classes.row}>
                      {/*<Typography className={classes.value}>
                        {handleGetTypologyByCode(request.tipology)}
                      </Typography>*/}
                      <Typography>{dossierStatusId.find(i => i.key === request.tipology) ? dossierStatusId.find(i => i.key === request.tipology).value : ''}</Typography>

                    <Typography className={classes.value}>{request.createDate}</Typography>
                  </Grid>

                  {!adminCheck() &&        
                    <> 
                      {
                        <Grid className={classes.row}>
                          <Grid container justifyContent='center' alignItems='center' className={classes.requestStatusText}  onClick={() => checkReiteracion(request)}>
                            <img className={classes.bellIcon} src={campanaIcono} alt='' />
                            {t('requests.requestsList.list.requestStatus')}
                          </Grid>
                        </Grid>

                        // (checkReiteracion(request.events)) ?
                          
                        // <Tooltip title={t('requests.requestsList.list.tooltipRequestStatus')} placement='bottom' arrow={true}>
                        //   <Grid className={classes.row}>
                        //     <Grid container justifyContent='center' alignItems='center' className={classes.requestStatusTextDis}>
                        //       <img className={classes.bellIcon} src={campanaIcono} alt='' />
                        //       {t('requests.requestsList.list.requestStatus')}
                        //     </Grid>
                        //   </Grid>
                        // </Tooltip>    
                        // :  
                        // <Grid className={classes.row}>
                        //   <Grid container justifyContent='center' alignItems='center' className={classes.requestStatusText}  onClick={() => prepareReiterationPopup(request.codSR)}>
                        //     <img className={classes.bellIcon} src={campanaIcono} alt='' />
                        //     {t('requests.requestsList.list.requestStatus')}
                        //   </Grid>
                        // </Grid>
                      }
                    </>
                  }

                  <Grid className={classes.row}>
                    {window.location.pathname === '/supplies/detail' ||
                      window.location.pathname === '/provisions/detail' ? (
                      <div
                        className={classes.viewButton}
                        onClick={() => handleClickButton(request)}
                      >
                        {t('requests.requestsList.list.view')}
                      </div>
                    ) : (
                      <div
                        className={classes.viewButton}
                        onClick={() => handleClickViewButton(request)}
                      >
                        {t('requests.requestsList.list.view')}
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
        </>
      )}
      {
        requestsList.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
            <option value='20' selected>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      }
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
