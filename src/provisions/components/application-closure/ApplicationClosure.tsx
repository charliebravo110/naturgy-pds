import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import XLSX from 'xlsx'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import OkIcon from '../../../assets/icons/aviso_ok.svg'
import ArchiveIcon from '../../../assets/icons/plano_documento_adjunto.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import { thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './ApplicationClosure.styles'
import { isMobileApp } from '../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const ApplicationClosure = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const cups = (currentProvision.dossierCups && currentProvision.dossierCups.length > 0) ? currentProvision.dossierCups : [] as any

  const dispatch = useDispatch()

  const [numberOfPhasesSelect, setNumberOfPhasesSelect] = useState([] as any)
  const [voltageSupplySelect, setVoltageSupplySelect] = useState([] as any)

  const [instalationType, setInstalationType] = useState('');
  const [tensionSubtension, setTensionSubtension] = useState('');
  const [provisionType, setProvisionType] = useState('');
  const [maxPowerCIE, setMaxPowerCIE] = useState('');

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'cierre de la solicitud',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter(item => item.substring(0, item.indexOf('|')) === value)

    return keyValue && keyValue[0] && keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
  }

  const getAndSetMasterData = (key: string, setSelect: any, keyToApplyRemoveItem?: string, removeItem?: number) => {
    dispatch(thunkGetMasterData('DossierDatosTecnicos', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        setSelect(response.map(item => item.value).filter((item, index) => {
          if (keyToApplyRemoveItem && key === keyToApplyRemoveItem) {
            return index !== removeItem
          }

          return true
        }))
      }
    }))
  }

  const translateSelectedSupplyType = (value) => {
    if (value === 'DOSSUB004' || value === 'DOSSUB006' || value === 'DOSSUB005' || value === 'DOSSUB008' ||
      value === 'DOSSUB002' || value === 'DOSSUB003' || value === 'DOSSUB009' || value === 'DOSSUB012' ||
      value === 'DOSSUB013' || value === 'DOSSUB014' || value === 'DOSSUB007') {
      return 'Definitivo'
    } else if (value === 'DOSSUB011') {
      return 'Obra'
    } else if (value === 'DOSSUB010') {
      return 'Eventual'
    } else {
      return ''
    }
  }

  // Uso Residencial      --> DOSSUB004, DOSSUB006, DOSSUB005
  // Uso No Residencial   --> DOSSUB006, DOSSUB008, DOSSUB002, DOSSUB003, DOSSUB009
  // Socorro              --> DOSSUB012, DOSSUB013, DOSSUB014
  // Suministro de Obra   --> DOSSUB011
  // Eventuales           --> DOSSUB010
  // Uso Público          --> DOSSUB007

  const handleDownloadCups = () => {
    if (cups.length > 0) {
      const auxCups = [] as any

      let ws

      let fileName

      if (cups.length > 1) {
        cups && cups.map(
          (item) => {
            if (item.cups) {
              auxCups.push({
                cups: item.cups,
                potenciaContratada: item.potenciaContratada,
                direccion: item.dirección
              })
            }

            return null
          }
        )

        ws = XLSX.utils.json_to_sheet(auxCups, {
          header: [
            'cups',
            'potenciaContratada',
            'direccion'
          ]
        })

        ws['A1'].v = t('provisions.applicationClosure.downloadCupsExcel.cups')
        ws['B1'].v = t('provisions.applicationClosure.downloadCupsExcel.power')
        ws['C1'].v = t('provisions.applicationClosure.downloadCupsExcel.address')

      } else {

        cups && cups.map(
          (item) => {
            if (item.cups) {
              auxCups.push({
                cups: item.cups,
                direccion: item.dirección,
                tipoInstalacion: instalationType,
                tensionSubtension: tensionSubtension,
                tipoSuministro: provisionType,
                potenciaMaxima: maxPowerCIE,
                potenciaDE: item.potenciaContratada,
              })
            }

            return null
          }
        )

        ws = XLSX.utils.json_to_sheet(auxCups, {
          header: [
            'cups',
            'direccion',
            'tipoInstalacion',
            'tensionSubtension',
            'tipoSuministro',
            'potenciaMaxima',
            'potenciaDE'
          ]
        })

        ws['A1'].v = t('provisions.applicationClosure.downloadCupsExcel.cups')
        ws['B1'].v = t('provisions.applicationClosure.downloadCupsExcel.address')
        ws['C1'].v = t('provisions.applicationClosure.downloadCupsExcel.instalationType')
        ws['D1'].v = t('provisions.applicationClosure.downloadCupsExcel.tensionSubtension')
        ws['E1'].v = t('provisions.applicationClosure.downloadCupsExcel.supplyType')
        ws['F1'].v = t('provisions.applicationClosure.downloadCupsExcel.maxPowerCIE')
        ws['G1'].v = t('provisions.applicationClosure.downloadCupsExcel.extensionRights')
      }

      fileName = 'cups.xlsx'

      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'cups')

      XLSX.writeFile(wb, fileName)
      // LCS: Enviar evento de GdC a GA - Wave 3
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        title_screen: 'ya has finalizado la conexion a la red',
        click_text: 'descargar el listado de cups',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_number: currentProvision.dossierCod,
        request_status: getExpStatus(currentProvision.dossierStatusId),
        type_budget: 'no aplica',//FALTA POR TERMINAR
        tab_name: 'mi conexion a la red',
        request_type: 'quiero una nueva conexion a la red',
        request_step_name: 'ejecucion de la solicitud',
        payment_type: 'no aplica',//FALTA POR TERMINAR
        browsing_type: sessionStorage.getItem('browsing_type')
      })

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
       
    }
  }

  useEffect(() => {
    setInstalationType(selectValue(numberOfPhasesSelect, currentProvision.idDossierPhaseType))
    setTensionSubtension(selectValue(voltageSupplySelect, currentProvision.idTensionType))
    setProvisionType(translateSelectedSupplyType(currentProvision.idDossierSubtype))
    setMaxPowerCIE(currentProvision.powerCie)
  }, [numberOfPhasesSelect, voltageSupplySelect, currentProvision]);

  useEffect(() => {
    if (cups.length <= 1) {
      getAndSetMasterData('DT_FASES', setNumberOfPhasesSelect)
      getAndSetMasterData('DT_TENSION_SUM', setVoltageSupplySelect)
    }
  }, [cups]);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={11} sm={11} md={11}>
        <Grid container justifyContent='center' alignItems='center' className={classes.block}>
          {
            (cups.length > 0 && cups[0] && cups[0].cups !== '') ?
              <>
                <Grid container className={classes.inner} justifyContent='center' alignItems='center' xs={12} sm={9} md={8} spacing={5}>
                  <Grid item>
                    <Grid container direction='column' justifyContent='center' alignItems='center'>
                      <Grid item>
                        <img src={OkIcon} className={classes.okIcon} alt='' />
                      </Grid>

                      <Grid item className={classes.title}>
                        {t('provisions.applicationClosure.title')}
                      </Grid>
                    </Grid>
                  </Grid>

                  { (currentProvision.idDossierTypeId === 'DOSTYP002') ?
                      <Grid/>
	                :
                    <>
                    { (currentProvision.idDossierTypeId === 'DOSTYP001' && currentProvision.idDossierSubtype === 'DOSSUB015') ?
                      <>
                        <Grid item className={classes.advise}>
                          {t('provisions.applicationClosure.subtitle2')}
                        </Grid>
                      </>
	                    :
                      <>
                        <Grid item className={classes.advise}>
                          {t('provisions.applicationClosure.subtitle')}
                        </Grid>
                      </>
                    }

                      <Grid container>
                        <ul>
                          <li className={classes.marginBottomLi}>
                            <span className={classes.maxPowerTitle}>
                              {t('provisions.applicationClosure.maxPower')}
                            </span>                        
                            {' '}
                            <span className={classes.maxPowerDescription}>
                              {t('provisions.applicationClosure.maxPowerDescription')}
                            </span>                        
                          </li>
                          <li className={classes.marginBottomLi}>
                            <span className={classes.maxPowerTitle}>
                              {t('provisions.applicationClosure.AcometidaMaxPower')}
                            </span>                        
                            {' '}
                            <span className={classes.maxPowerDescription}>
                              {t('provisions.applicationClosure.AcometidaMaxPowerDescription')}
                            </span>                        
                          </li>
                          <li>
                            <span className={classes.maxPowerTitle}>
                              {t('provisions.applicationClosure.extensionRights')}
                            </span>                        
                            {' '}
                            <span className={classes.extensionRightsDescription}>
                              {t('provisions.applicationClosure.extensionRightsDescription')}
                            </span>                        
                          </li>
                        </ul>
                      </Grid>
                    </>
                  }
                </Grid>

                { (currentProvision.idDossierTypeId === 'DOSTYP002') ?                    
	                    <Grid/>
	                :
                    <>
                    <Grid item xs={12} sm={12} md={12}>
                      {cups.length > 1 ?
                        <Table className={classes.suppliesTable}>
                          <TableHead>
                            <TableRow className={classes.tableRow}>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableHead')}
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {
                              cups.map((item, index) => (
                                <TableRow key={index} className={classes.tableBodyRow}>
                                  <StyledTableCell>
                                    {item.cups}
                                  </StyledTableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      :
                        <Table className={classes.suppliesTable}>
                          <TableHead>
                            <TableRow className={classes.tableRow}>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableHead')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableAddress')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableInstalation')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableTension')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableSupply')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableMaxPower')}
                              </StyledTableCell>
                              <StyledTableCell>
                                {t('provisions.applicationClosure.tableExtensionRights')}
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {
                              cups.map((item, index) => (
                                <TableRow key={index} className={classes.tableBodyRow}>
                                  <StyledTableCell>
                                    {item.cups}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {item.dirección}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {instalationType}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {tensionSubtension}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {provisionType}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {maxPowerCIE}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {item.potenciaContratada}
                                  </StyledTableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      }
                    </Grid>
                    
                    <Grid container className={classes.inner} justifyContent='center' alignItems='center' xs={12} sm={9} md={8} spacing={5}>
                      <Grid item>
                        <Grid container justifyContent='center' alignItems='center' className={`${classes.download} ${cups.length === 0 && 'disabled'}`} onClick={handleDownloadCups}>
                          <Grid item md={1} sm={1} xs={1}>
                            <img src={ArchiveIcon} className={classes.downloadIcon} alt='' />
                          </Grid>

                          <Grid item className={classes.downloadText} md={9} sm={9} xs={9}>
                            {t('provisions.applicationClosure.download')}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item className={classes.advise}>
                        {`${t('provisions.applicationClosure.advise.string1')} `}
                        <a href='https://facturaluz.cnmc.es/' target='_blank' rel='noopener noreferrer'>CNMC</a>
                        {t('provisions.applicationClosure.advise.string2')}
                      </Grid>
                    </Grid>
                  </>
                }
              </>
              :
              <Grid container className={classes.inner} justifyContent='center' alignItems='center' xs={12} sm={9} md={8} spacing={5}>
                <Grid container className={classes.noItems}>
                  <img src={AlertIcon} className={classes.noItemsIcon} alt='' />

                  <span className={classes.noItemsTitle}>{t('provisions.applicationClosure.noItems.title')}</span>

                  { (currentProvision.idDossierTypeId === 'DOSTYP002' || currentProvision.idDossierTypeId === 'DOSTYP003') ?
                    <>
                      <span className={classes.noItemsDescription}>{t('provisions.applicationClosure.noItems.description2')}</span>
                    </>
	                  :
                    <>
                      <span className={classes.noItemsDescription}>{t('provisions.applicationClosure.noItems.description')}</span>
                    </>
                  }
                </Grid>
              </Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ApplicationClosure
