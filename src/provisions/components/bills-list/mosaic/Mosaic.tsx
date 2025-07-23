import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import LoadingAnimation from '../../../../assets/img/spinner.gif'
import DownloadPdf from '../../../../assets/icons/descargar_pdf.svg'

import { thunkGetMasterData, thunkGetDocument } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './Mosaic.styles'
import Pagination from '../../../../common/components/pagination/Pagination2'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm';

const Mosaic = (props: any) => {
  const {
    listItems,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    isSubLoading,
    setCurrentPage,
    handleDownloadModal,
    // handleDownloadDocument,
    type
  } = props


  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [dossierStatus, setDossierStatus] = useState([] as any)
  const classes = useStyles({})

  const target = document.getElementById('number') as HTMLSelectElement

  const onChangeSelector = () => {
    setItemsPerPage(target.options[target.selectedIndex].value)
  }

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      // const hour = date.substring(8, 10)
      // const min = date.substring(10, 12)
      // const sec = date.substring(12, 14)
      return (day + '/' + month + '/' + year)
      // return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
    }
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  useEffect(() => {
    setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
    // eslint-disable-next-line
  }, [listItems, itemsPerPage])

  useEffect(() => {
    if (dossierStatus.length === 0) {
      dispatch(thunkGetMasterData('DOSSIER_STATUS_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
        if (response) {
          setDossierStatus(response)
        }
      }))

    }
    // eslint-disable-next-line
  }, [])

  const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}

  const handleDownload = (billNumber: String, codExp: String, status: String) => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    if(type == 'b'){
      sendGAEvent({
        event: 'browsing',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        click_text: 'descargar',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        request_number: codExp,
        request_status: sessionStorage.getItem('provisionDossierStatus'),
        module_name: 'facturas',
        billing_number: billNumber,
        billing_status: status.toLowerCase(),
        browsing_type: sessionStorage.getItem('browsing_type'),
        issue_date: `${day}/${month}/${year}`,
      });
    } else{
      sendGAEvent({
        event: 'browsing',
        section_name: 'mi conexion a la red',
        subsection_name: 'mis facturas de conexion a la red',
        click_text: 'descargar',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        billing_number: billNumber,
        request_number: codExp,
        billing_status: status.toLowerCase(),
        issue_date: `${day}/${month}/${year}`,
        browsing_type: sessionStorage.getItem('browsing_type')
      });
    }
    handleDownloadModal(billNumber, codExp)
  }

  return (
    <Grid className={classes.table}>
      {
        listItems.length === 0 ?
          <Grid>
            {t('delegates.delegatesList.noResults')}
          </Grid>
          :
          <>
            {
              listItems.length > 20 && totalPages > 1 ?
                <Grid container className={classes.totalItems}>
                  {listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('provisions.provisionsList.solicitudesDe') + listItems.length}
                  {
                    isSubLoading &&
                    <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                  }
                </Grid>
                :
                <Grid container className={classes.totalItems}>
                  {listItems.length + (listItems.length > 1 ? t(' solicitudes') : t(' solicitud'))}
                  {
                    isSubLoading &&
                    <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                  }
                </Grid>
            }
            <Grid container spacing={2}>
              {
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (bill, index) => (
                    <Grid
                      item
                      key={index}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                    >
                      <Grid className={classes.item}>
                        {type === 'a' &&
                          <Grid className={classes.nameRow}>
                            <Typography className={classes.title}>{t('provisions.billsList.codExp')}</Typography>

                            <Typography className={`${classes.value} bold`}>{bill.numberexpedient}</Typography>
                          </Grid>
                        }

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.billsList.codBill')}</Typography>

                          <Typography className={classes.value}>{bill.billCod}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.billsList.sendDate')}</Typography>

                          <Typography className={classes.value}>{formatDateAndTime(bill.registerDate)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.billsList.billType')}</Typography>

                          <Typography className={classes.value}>{formatText(bill.billType)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.billsList.status')}</Typography>

                          <Typography className={classes.value}>{formatText(bill.billStatus)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.billsList.amount')}</Typography>

                          <Typography className={classes.value}>{bill.import + '€'}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title} />

                          <Typography className={classes.value}>
                            <div
                              onClick={(e) => handleDownload(bill.billNumber, bill.numberexpedient, bill.billStatus)}
                            >
                              <img className={classes.pointer} src={DownloadPdf} alt='' />

                            </div>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                )
              }
            </Grid>
          </>
      }
      {
        listItems.length > 20 &&
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
            handleChangePage={setCurrentPage}
          />
        </Grid>
      }
    </Grid>
  )
}

export default withRouter(Mosaic)
