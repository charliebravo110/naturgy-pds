import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import useStyles, { StyledTableCell } from './IncidentHistory.styles';

import DatepickerV2 from '../../../../common/components/datepickerV2/DatepickerV2';
import Button from '../../../../common/components/button/Button';
import { thunkGetListIncidence, thunkGetListInterruptions } from '../../store/actions/SuppliesDetailsThunkActions';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Spinner from '../../../../common/components/spinner/Spinner';

import LeftArrowIcon from '../../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../../assets/icons/flecha_derecha.svg'
import Tooltip from '../../../../common/components/tooltip/Tooltip';
import IconTextButton from '../../../../common/components/icon-text-button/IconTextButton';
import Imagen1 from '../../../../Imagen1.png'
import Imagen2 from '../../../../Imagen2.png'
import CorteProgramadoIcon from '../../../../assets/icons/ico_CorteProgramado.svg'
import infoIcon from '../../../../assets/icons/info.svg'
import IncidenciaIcon from '../../../../assets/icons/ico_Incidencia.svg'

import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip';
import AveriasUtils from '../../../../gestionAverias/utils/AveriasUtilsClass';

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const IncidentHistory = (props: any) => {

  const {
    supplyData,
    isLoading,
    setIsLoading
  } = props

  const classes = useStyles({});
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [firstTime, setFirstTime] = useState(true)
  const [incidenceList, setIncidenceList] = useState([] as any)
  const [formDateFrom, setFormDateFrom] = useState(new Date())
  const [formDateTo, setFormDateTo] = useState(new Date())

  const getIncidence = (dateFrom: Date, dateTo: Date) => {

    setIsLoading(true)



    dispatch(thunkGetListIncidence(supplyData.cups, dateFrom, dateTo, (response) => {
      if (response && response.incidenceList && response.incidenceList.length > 0) {
        let data = {
          sistema: 'ZEUS',
          incidenceList: response.incidenceList
        }
        dispatch(thunkGetListInterruptions(data, (response) => {
          if (response && response.result && response.result.codResult === '0000' && response.incidenceList.length > 0) {
            setIncidenceList(response.incidenceList)
          }
        }));
      }
      setIsLoading(false)
    }));

  }

  const applyFilters = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'historico de interrupciones',
      click_text: 'aplicar filtros',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    });
    getIncidence(formDateFrom, formDateTo)
  }

  // Paginación
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 15

  useEffect(() => {
    setTotalPages(incidenceList.length === 0 ? 1 : Math.ceil(incidenceList.length / itemsPerPage))
  }, [incidenceList])

  const handleClickLeftArrow = () => {
    setCurrentPage(currentPage === 0 ? 0 : (currentPage - 1))
  }

  const handleClickRightArrow = () => {
    setCurrentPage(currentPage + 1)
  }

  // Cargar incidencias la primera vez
  if (firstTime) {

    const dateTo = new Date();
    const dateFrom = new Date(dateTo);

    dateFrom.setMonth(dateTo.getMonth() - 12);

    setFormDateFrom(dateFrom)
    setFormDateTo(dateTo)

    getIncidence(dateFrom, dateTo)
    setFirstTime(false)

  }

  return (
    <>
      {isLoading &&
        <Spinner fixed={true} />
      }
      <Grid container className={classes.container} justifyContent='center'>
        <Grid item sm={12} md={8} className={classes.maxWidthForBigScreens}>
          <Grid item className={classes.title} md={12} xs={12} sm={6}>
            {t('averias.historic.title')}
          </Grid>
          <Grid item>
            <Grid container direction='row' justifyContent='center' alignItems='center'>
              <DatepickerV2 size='m' selectedDate={formDateFrom} maxDate={formDateTo} handleChange={setFormDateFrom} />
              <DatepickerV2 size='m' selectedDate={formDateTo} minDate={formDateFrom} maxDate={new Date()} handleChange={setFormDateTo} />
              <Button
                className={classes.btn}
                text={t('averias.historic.searchButton')}
                color='primary'
                size='medium'
                variant='contained'
                onClick={applyFilters}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell className={classes.cell}>
                    {t('supplies.type')}
                  </StyledTableCell>
                  <StyledTableCell className={classes.cell}>
                    {t('averias.historic.table.date')}
                  </StyledTableCell>
                  <StyledTableCell className={classes.cell}>
                    <Tooltip title={t('averias.historic.table.interruptionDurationTooltip')} placement='bottom'>
                      <span>{t('averias.historic.table.interruptionDuration')}
                        <img src={infoIcon} className={classes.infoIcon} alt='' />
                      </span>
                    </Tooltip>

                  </StyledTableCell>
                  <StyledTableCell className={classes.cell}>
                    {t('averias.historic.table.interruptionCount')}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(incidenceList.length > 0) ? (
                  incidenceList.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).map((incidence, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>{(incidence.programmed === 'N') ?
                        <ArrowTooltip title={t('supplies.dialogAlertConfirm.incidence')} placement='bottom'>
                          <img src={IncidenciaIcon} alt='' />
                        </ArrowTooltip>
                        : <ArrowTooltip title={t('supplies.dialogAlertConfirm.programmedCut')} placement='bottom'>
                          <img src={CorteProgramadoIcon} alt='' />
                        </ArrowTooltip>}
                      </StyledTableCell>
                      <StyledTableCell>{AveriasUtils.FormatDateAveriasPantalla(incidence.incidenceDate)}</StyledTableCell>
                      <StyledTableCell>{parseInt(incidence.interruptionDuration, 10) === 0 ? '' : parseInt(incidence.interruptionDuration, 10)}</StyledTableCell>
                      <StyledTableCell>{AveriasUtils.FormatTextField(incidence.interruptionCount)}</StyledTableCell>
                    </TableRow>
                  ))
                )
                  :
                  (
                    <TableRow>
                      <StyledTableCell className={classes.emptyList} colSpan={5}>
                        {t('averias.historic.noResults')}
                      </StyledTableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </Grid>
          {totalPages > 1 &&
            <Grid container className={classes.containerPagination}>
              <Grid item>
                <Grid container justifyContent='center'>
                  <img
                    className={`${classes.icon} ${currentPage === 0 && 'disabled'}`}
                    src={LeftArrowIcon}
                    alt=''
                    onClick={handleClickLeftArrow}
                  />
                  <span className={classes.label}><strong>{(currentPage + 1)}</strong> {t('common.pagination.span')} {totalPages}</span>
                  <img
                    className={`${classes.icon} ${(currentPage + 1) === totalPages && 'disabled'}`}
                    src={RightArrowIcon}
                    alt=''
                    onClick={handleClickRightArrow}
                  />
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
    </>
  )
}

export default IncidentHistory;
