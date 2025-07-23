import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import Spinner from '../../../common/components/spinner/Spinner'

import ArchiveIcon from '../../../assets/icons/plano_documento_adjunto.svg'

import NoBudget from './no-budget/NoBudget'
import NoBudgetAnticipated from './no-budget-anticipated/NoBudgetAnticipated'
import ExtendedBudgetSuccess from './extended-budget-success/ExtendedBudgetSuccess'

import { adminCheck } from '../../../common/lib/ValidationLib'

import { setCurrentProvision } from '../../store/actions/ProvisionsActions'
import {
  thunkGetDocument,
  thunkUpdateDossier,
  thunkGetCardPayment
} from '../../store/actions/ProvisionsThunkActions'

import useStyles from './Budget.styles'
import { isWeb } from '../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const Budget = (props: any) => {
  const dispatch = useDispatch()
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    state,
    setState,
    setAcceptedBudget,
    setPaymentDoneBudget
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const dossierCod = useSelector((state: any) => state.provisions.currentProvision.dossierCod)

  const valoration = useSelector((state: any) => state.provisions.currentProvision.valoration)

  const [ isLoading, setIsLoading ] = useState(false)

  // lógica de pantallas
  const [ isBudget ] = useState(provisions.currentProvisionScaleInd === '1') // presupuesto (baremo)
  const [ isReinforcementBudget ] = useState(
    valoration && (
      valoration.extensionWorkBudgetInd === '1' &&
      valoration.extensionClientBudgetInd === '0' &&
      valoration.extensionClientWorkBudgetInd === '1'
    )
  ) // presupuesto de refuerzo
  const [ isReinforcementAndExtensionBudget ] = useState(
    valoration && (
      valoration.extensionWorkBudgetInd === '1' &&
      valoration.extensionClientBudgetInd === '1' &&
      valoration.sendExtensionBudgetInd === '1'
    )
  ) // presupuesto de refuerzo y extensión

  const [ sendedExtensionBudgetSuccess, setSendedExtensionBudgetSuccess ] = useState(false)

  const formatDate = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)

      return '(' + day + '/' + month + '/' + year + ')'
    }
  }

  const [ amount ] = useState(valoration && valoration.valorationTotalAmount)
  const [ date ] = useState(formatDate(valoration && valoration.valorationDate))

  const [ recentBudgetCommunicationList, setRecentBudgetCommunicationList ] = useState([] as any)
  const [ lastBudgetList, setLastBudgetList ] = useState(false)

  const [ recentSheetCommunicationList, setRecentSheetCommunicationList ] = useState([] as any)
  const [ lastSheetList, setLastSheetList ] = useState([] as any)

  const [ budgetDocumentId, setBudgetDocumentId ] = useState('')

  const [ sheetDocumentId, setSheetDocumentId ] = useState('')

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'presupuesto de refuerzo',
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

  /* Comprobación de pago realizado */
  useEffect(() => {
    if (currentProvision && currentProvision.dossierCod && state === 5) {
      setIsLoading(true)

      dispatch(thunkGetCardPayment(currentProvision.dossierCod, (response) => {
        if (response && response.cardPayments && response.cardPayments.items && response.cardPayments.items.length > 0) {
          setState(6)

          setPaymentDoneBudget(true)
        }

        setIsLoading(false)
      }))
    }
  // eslint-disable-next-line
  }, [])

  /* Búsqueda del último documento 'Presupuesto' en communicationList */
  useEffect(() => {
    if (currentProvision &&
      currentProvision.communicationList &&
      currentProvision.communicationList.length > 0
    ) {
      // Se consigue la lista de relacionados con 'Presupuesto
      currentProvision.communicationList.map((item, index) => {
        if (item.communicationStatusCod && item.idCommunicationType) {
          const communicationStatusCod = item.communicationStatusCod === 'COMSTA0010'

          let idCommunicationTypeCods: any

          if (isBudget) {
            idCommunicationTypeCods = [ 'COMTYP045', 'COMTYP047', 'COMTYP074', 'COMTYP292' ]
          } else {
            idCommunicationTypeCods = [
              'COMTYP054', 'COMTYP055', 'COMTYP056', 'COMTYP057', 'COMTYP058', 'COMTYP059',
              'COMTYP060', 'COMTYP061', 'COMTYP062', 'COMTYP063', 'COMTYP064', 'COMTYP065',
              'COMTYP066', 'COMTYP094', 'COMTYP095', 'COMTYP096', 'COMTYP097', 'COMTYP098',
              'COMTYP099', 'COMTYP125', 'COMTYP126', 'COMTYP127', 'COMTYP128', 'COMTYP129',
              'COMTYP130', 'COMTYP135', 'COMTYP288', 'COMTYP289', 'COMTYP290', 'COMTYP296',
              'COMTYP297', 'COMTYP298'
            ]
          }

          if (communicationStatusCod && idCommunicationTypeCods.includes(item.idCommunicationType)) {
            setRecentBudgetCommunicationList([
              ...recentBudgetCommunicationList,
              item
            ])
          }
        }

        if (index + 1 === currentProvision.communicationList.length) {
          setLastBudgetList(true)
        }

        return null
      })
    }
  // eslint-disable-next-line
  }, [ currentProvision.communicationList ])

  useEffect(() => {
    if (lastBudgetList && budgetDocumentId === '' && recentBudgetCommunicationList.length > 0) {
      // Se busca el más reciente de esa lista
      const communication = recentBudgetCommunicationList.sort((a, b) => b.sendDate - a.sendDate)[0]

      if (communication) {
        // Y se consigue su documentumId
        const documentumId = communication.documentumId

        documentumId && setBudgetDocumentId(documentumId)
      }
    }
  // eslint-disable-next-line
  }, [ lastBudgetList ])

  /* Búsqueda del último documento 'Pliego de condiciones' en communicationList */
  useEffect(() => {
    if (currentProvision &&
      currentProvision.communicationList &&
      currentProvision.communicationList.length > 0
    ) {
      // Se consigue la lista de relacionados con 'Pliego de condiciones'
      currentProvision.communicationList.map((item, index) => {
        if (item.communicationStatusCod && item.idCommunicationType) {
          const communicationStatusCod = item.communicationStatusCod === 'COMSTA0010'

          let idCommunicationTypeCods = [
            'COMTYP048', 'COMTYP049', 'COMTYP050', 'COMTYP051', 'COMTYP052', 'COMTYP053',
            'COMTYP067', 'COMTYP068', 'COMTYP069', 'COMTYP070', 'COMTYP071', 'COMTYP072',
            'COMTYP100', 'COMTYP101', 'COMTYP115', 'COMTYP116', 'COMTYP117', 'COMTYP118',
            'COMTYP119', 'COMTYP120', 'COMTYP121', 'COMTYP122', 'COMTYP123', 'COMTYP124',
            'COMTYP285', 'COMTYP286', 'COMTYP287', 'COMTYP293', 'COMTYP294', 'COMTYP295'
          ] as any

          if (communicationStatusCod && idCommunicationTypeCods.includes(item.idCommunicationType)) {
            setRecentSheetCommunicationList([
              ...recentSheetCommunicationList,
              item
            ])
          }
        }

        if (index + 1 === currentProvision.communicationList.length) {
          setLastSheetList(true)
        }

        return null
      })
    }
  // eslint-disable-next-line
  }, [ currentProvision.communicationList ])

  useEffect(() => {
    if (lastSheetList && sheetDocumentId === '' && recentSheetCommunicationList.length > 0) {
      // Se busca el más reciente de esa lista
      const communication = recentSheetCommunicationList.sort((a, b) => b.sendDate - a.sendDate)[0]

      if (communication) {
        // Y se consigue su documentumId
        const documentumId = communication.documentumId

        documentumId && setSheetDocumentId(documentumId)
      }
    }
  // eslint-disable-next-line
  }, [ lastSheetList ])

  /* Se consigue el documento del 'Presupuesto' a traves del documentumId */
  const handleBudgetClick = () => {

    var typeBudgetAux = 'no aplica'
    if (provisions.currentProvisionScaleInd === '1') {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'descargar presupuesto detallado',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'presupuesto',
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:typeBudgetAux,
      tab_name:'mi conexion a la red',
      browsing_type:sessionStorage.getItem('browsing_type')
    })

    if (budgetDocumentId !== '') {
      setIsLoading(true)

      dispatch(thunkGetDocument(budgetDocumentId, (response) => {
        if (response && response.documento) {
          const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

          if (isWeb()) {
            const downloadLink = window.document.createElement('a')
            downloadLink.href = linkSource
            downloadLink.download = response.documento.nombre
            downloadLink.click()
          } else {
            // downloadLink.click() will attempt to force a client-side download, works for web,
            // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
            createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
          } 
        }

        setIsLoading(false)
      }))
    }
  }

  /* Se consigue el documento del 'Pliego de condiciones' a traves del documentumId */
  const handleSheetClick = () => {

    var typeBudgetAux = 'no aplica'
    if (provisions.currentProvisionScaleInd === '1') {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name:'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'descargar pliego de condiciones tecnicas',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'presupuesto',
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:typeBudgetAux,
      tab_name:'mi conexion a la red',
      browsing_type:sessionStorage.getItem('browsing_type')
    })

    if (!isBudget && sheetDocumentId !== '') {
      setIsLoading(true)

      dispatch(thunkGetDocument(sheetDocumentId, (response) => {
        if (response && response.documento) {
          const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

          const downloadLink = window.document.createElement('a')

          downloadLink.href = linkSource
          downloadLink.download = response.documento.nombre
          downloadLink.click()
        }

        setIsLoading(false)
      }))
    }
  }

  const handleRequestExtension = () => {

    var typeBudgetAux = 'no aplica'
    if (provisions.currentProvisionScaleInd === '1') {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'rechazar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'presupuesto',
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:typeBudgetAux,
      tab_name:'mi conexion a la red',
      browsing_type:sessionStorage.getItem('browsing_type')
    })

    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      extensionBudgetInd : '1'
    }

    dispatch(thunkUpdateDossier(dossierCod, false, data, (response) => {
      if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
        setSendedExtensionBudgetSuccess(true)
      }

      setIsLoading(false)
    }))
  }

  const handlePerformExtensionWork = () => {

    var typeBudgetAux = 'no aplica'
    if (provisions.currentProvisionScaleInd === '1') {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'revisar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'presupuesto',
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:typeBudgetAux,
      tab_name:'mi conexion a la red',
      browsing_type:sessionStorage.getItem('browsing_type')
    })

    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      budgetValorationRejection: '1',
      budgetValorationRejectionComment: t('provisions.budget.extensionWorkReason')
    }

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, data, (response) => {
      if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
        let provision = currentProvision

        if (response.dossier && response.dossier.dossierCod) {
          provision = {
            ...provision,
            ...response.dossier,
            dossierStatusId: response.dossier.dossierStatusId,
            valoration: provision.valoration,
            techData: provision.techData
          }

          dispatch(setCurrentProvision(provision))
        }
      }

      setIsLoading(false)
    }))
  }

  const handleAccept = () => {

    var typeBudgetAux = 'no aplica'
    if (provisions.currentProvisionScaleInd === '1') {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'aceptar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type:'quiero una nueva conexion a la red',
      request_step_name:'presupuesto',
      request_number:currentProvision.dossierCod,
      request_status:getExpStatus(currentProvision.dossierStatusId),
      type_budget:typeBudgetAux,
      tab_name:'mi conexion a la red',
      browsing_type:sessionStorage.getItem('browsing_type')
    })

    setAcceptedBudget(true)
  }

  return (
    <Grid item md={12}>
      {
        isLoading &&
          <Spinner />
      }

      {/* <TituloHabilitante location={2} /> */}

      {
        (
          currentProvision.dossierStatusId === 'STATUS0010' &&
          currentProvision.communicationList
        ) && currentProvision.communicationList.map(item => {
          if (item.idCommunicationType && item.idCommunicationType === 'COMTYP292') {
            return item
          } else {
            return false
          }
        }).filter(item => item.documentumId).length > 0 ?
          <NoBudgetAnticipated setIsLoading={setIsLoading} />
        :
          state <= 4 ?
            <NoBudget />
          :
            !sendedExtensionBudgetSuccess ?
              <Grid container className={classes.container}>
                <Grid item xs={11} sm={11} md={11}>
                  <div className={classes.title}>{user.name ? user.name : user.surName}{t('provisions.budget.title')}</div>

                  <Grid container className={classes.block}>
                    {
                      isReinforcementBudget &&
                        <Grid item xs={12}>
                          <Grid container className={classes.info} spacing={2}>
                            <Grid xs={12} item>{t('provisions.budget.info.item1')}</Grid>

                            <Grid xs={12} item>{t('provisions.budget.info.item2')}</Grid>
                          </Grid>
                        </Grid>
                    }

                    <Grid item xs={12}>
                      <Grid container justifyContent='center'>
                        <Grid item xs={12}>
                          <Grid container xs={12}>
                            <Grid item xs={12} className={classes.budgetTitle}>
                              {
                                isBudget ?
                                  t('provisions.budget.budgetTitle')
                                :
                                  isReinforcementBudget ?
                                    t('provisions.budget.budgetTitleExtension')
                                  :
                                    isReinforcementAndExtensionBudget ?
                                      t('provisions.budget.budgetTitleReinforcementExtension')
                                    :
                                      t('provisions.budget.budgetTitleExtension')
                              }
                            </Grid>

                            <Grid item xs={12} className={classes.date}>{date}</Grid>
                          </Grid>

                        </Grid>

                        {
                          isBudget &&
                            <Grid item xs={12} md={10} className={classes.adviseBlock}>
                              <div className={classes.advise}>{t('provisions.budget.advise1')}</div>
                            </Grid>
                        }

                        <Grid item xs={12}>
                          <div className={classes.budget}>{amount}* €</div>
                        </Grid>

                        <Grid item xs={12}>
                          <div className={classes.iva}>{t('provisions.budget.iva')}</div>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid container xs={12} justifyContent='center'>
                      <Grid item md={10} className={classes.advise}>
                        {t('provisions.budget.advise2')}
                      </Grid>
                    </Grid>

                    <Grid container xs={12} justifyContent='center'>
                      <Grid item md={8} sm={8} xs={11} className={classes.downloadBlock}>
                        <Grid container xs={12} justifyContent='space-between' className={classes.downloadBlockIE11}>
                          <Grid item sm={isBudget ? 12 : 6}>
                            <Grid container className={`${classes.download} ${budgetDocumentId === '' && 'disabled'}`}>
                              <Grid item md={1} sm={1} xs={1}><img src={ArchiveIcon} className={classes.downloadIcon} alt='' /></Grid>

                              <Grid item className={classes.downloadText} md={9} sm={9} xs={10}>
                                <div onClick={handleBudgetClick}>{t('provisions.budget.download.detail')}</div>
                              </Grid>
                            </Grid>
                          </Grid>

                          {
                            !isBudget &&
                              <Grid item sm={6}>
                                <Grid container className={`${classes.download} ${(sheetDocumentId === '') && 'disabled'}`}>
                                  <Grid item md={1} sm={1} xs={1}><img src={ArchiveIcon} className={classes.downloadIcon} alt='' /></Grid>

                                  <Grid item className={classes.downloadText} md={9} sm={9} xs={10}>
                                    <div onClick={handleSheetClick}>{t('provisions.budget.download.conditions')}</div>
                                  </Grid>
                                </Grid>
                              </Grid>
                          }
                        </Grid>
                      </Grid>
                    </Grid>

                    {
                      (state === 4 || state === 5) &&
                        <Grid item xs={12} className={classes.buttons}>
                          <Grid container justifyContent='center'>
                            <Button
                              className={classes.button}
                              text={t('common.buttons.accept')}
                              color='primary'
                              size='large'
                              variant='contained'
                              disabled={adminCheck()}
                              onClick={handleAccept}
                            />

                            {
                              isReinforcementBudget &&
                                <Button
                                  className={classes.button}
                                  text={t('provisions.budget.buttons.extension')}
                                  color='inherit'
                                  size='large'
                                  variant='contained'
                                  disabled={adminCheck()}
                                  onClick={handleRequestExtension}
                                />
                            }

                            {
                              isReinforcementAndExtensionBudget &&
                                <Button
                                  className={classes.button}
                                  text={t('provisions.budget.buttons.extensionWork')}
                                  color='inherit'
                                  size='large'
                                  variant='contained'
                                  disabled={adminCheck()}
                                  onClick={handlePerformExtensionWork}
                                />
                            }
                          </Grid>
                        </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
            :
              <ExtendedBudgetSuccess />
      }
    </Grid>
  )
}

export default Budget
