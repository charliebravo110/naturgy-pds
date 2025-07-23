import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Button from '../../../common/components/button/Button'
import RefuseBudget from './refused-budget/RefuseBudget'
import AskReasonReview from './ask-reason-review/AskReasonReview'

import { adminCheck } from '../../../common/lib/ValidationLib'

import { setCurrentProvision } from '../../store/actions/ProvisionsActions'
import { thunkUpdateDossier } from '../../store/actions/ProvisionsThunkActions'

import useStyles from './BudgetButtons.styles'
import BigFileDialog from '../documentation/big-file-dialog/BigFileDialog'
// LCS: Enviar evento de GdC a GA - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const BudgetButtons = (props: any) => {
  const dispatch = useDispatch()
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setAcceptedBudget,
    setButtonClicked,
    setShowNoBudgetSolutionAccess,
    setMessage,
    setMessage2,
    setPropPrev,
    baremos,
    statusPrevProposal,
    setIsLoading,
    setCommentInRevision,
    propPrev,
    isBudget,
    isReinforcementBudget,
    isReinforcementAndExtensionBudget
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const dossierCod = useSelector((state: any) => state.provisions.currentProvision.dossierCod)
  const dossierStatusId = useSelector((state: any) => state.provisions.currentProvision.dossierStatusId)

  const [indAceptoFacturaDigital] = useSelector((state: any) => state.provisions.currentProvision.indAceptoFacturaDigital)
  const [newDocumentsRecieved, setNewDocumentsRecieved] = useState({} as any)
  const [uploaded, setUploaded] = useState<boolean>()

  const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument && currentProvision.documentList.sentDocument.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')
  const [sentDocument, setSentDocument] = useState(filteredSentDocumentList ? filteredSentDocumentList : [])

  const [bigFilePopup, setBigFilePopup] = useState(false)

  const valoration = useSelector((state: any) => state.provisions.currentProvision.valoration)
  const [refusedBudget, setRefusedBudget] = useState(false)
  const [showingRefuseBudget, setShowingRefuseBudget] = useState(false)
  const [showingAskReason, setShowingAskReason] = useState(false)
  const [revisedBudget, setRevisedBudget] = useState({ click: false, subtipology: '', comment: '' })


  const [isBaremo] = useState(baremos.isBaremo)
  const [isBaremoAnticip] = useState(baremos.isBaremoAnticip)
  const [isRetranqueo] = useState(baremos.isRetranqueo)

  //const [ isBaremo ] = useState(true) 


  const [showButtonAccept, setShowButtonAccept] = useState(false)
  const [showButtonReject, setShowButtonReject] = useState(false)
  const [showButtonRevise, setShowButtonRevise] = useState(false)
  const [showButtonRequestExtension, setShowButtonRequestExtension] = useState(false)
  const [showButtonAcceptOnlyReinforcement, setShowButtonAcceptOnlyReinforcement] = useState(false)
  const [showAnyButton, setShowAnyButton] = useState(false)

  const reviewTipology = '1074A25'
  //const acceptTipology ='1074A26'
  const refuseTipology = '1074A27'

  const statePpPdteDefinition = 'PREPRCOD1'
  const statePpPdteAceptation = 'PREPRCOD2'
  const statePpInRevision = 'PREPRCOD3'
  const statePpPdteAceptationAfterReview = 'PREPRCOD4'
  const statePpAcepted = 'PREPRCOD5'
  const statePpPaid10 = 'PREPRCOD6'

  /*
PREPRCOD1 ->PDTE DEFINICIÓN
PREPRCOD2 ->PDTE ACEPTACIÓN
PREPRCOD3 ->EN REVISIÓN
PREPRCOD4 ->PDTE ACEPTACIÓN TRAS REVISIÓN
PREPRCOD5 ->ACEPTADA
PREPRCOD6 ->PAGADO 10%
PREPRCOD7 ->FIRMADA
PREPRCOD8 ->RECHAZADA
PREPRCOD9 ->CADUCADA
PREPRCOD10 ->CANCELADA
*/
  const stateDossierValorated = 'STATUS0014'
  const stateDossierOpen = 'STATUS0010'
  const stateDossierBudgeted = 'STATUS0012'

  // Comprobar si hace menos de 6 que se acepto la propuesta previa
  const sixMonthsfromAccept = () => {

    let plazo6mOk = true
    let activitiesAcceptedPp = []

    activitiesAcceptedPp = currentProvision && currentProvision.activitiesList &&
      currentProvision.activitiesList.filter((item) => item.dossierStatusId === 'STATUS0014' &&
        item.idActivity === 'ACTTYPE017')

    if (activitiesAcceptedPp.length > 0) {
      let acceptDay = activitiesAcceptedPp[0].activityDate
      let today = new Date()
      let acceptDay6M = new Date(today)

      acceptDay6M.setFullYear(Number(acceptDay.substr(0, 4)))
      acceptDay6M.setMonth(Number(acceptDay.substr(4, 2)) + 5)
      acceptDay6M.setDate(Number(acceptDay.substr(6, 2)))

      if (today > acceptDay6M) {
        plazo6mOk = false
      }
    }
    return plazo6mOk
  }

  /* Activacion/Desactivacion botones*/
  const handlButtonsState = (accept: boolean, refuse: boolean, review: boolean, acceptOnlyReinforcement: boolean, solicitoExten: boolean) => {
    setShowButtonAccept(accept)
    setShowButtonReject(refuse)
    setShowButtonRevise(review)

    if (acceptOnlyReinforcement) {
      if (valoration &&
        valoration.extensionWorkBudgetInd === '1' &&
        valoration.extensionClientBudgetInd === '1' &&
        valoration.sendExtensionBudgetInd === '1') {
        setShowButtonAcceptOnlyReinforcement(true)
        setShowAnyButton(true)
      }
    } else {
      setShowButtonAcceptOnlyReinforcement(false)
    }

    if (solicitoExten) {
      if (valoration &&
        valoration.extensionWorkBudgetInd === '1' &&
        valoration.extensionClientBudgetInd === '0' &&
        valoration.extensionClientWorkBudgetInd === '1') {

        let comunicationsExtension = []

        comunicationsExtension = currentProvision && currentProvision.communicationList &&
          currentProvision.communicationList.filter((item) => (item.idCommunicationType === 'COMTYP064' ||
            item.idCommunicationType === 'COMTYP061'))

        if (comunicationsExtension.length > 0 && sixMonthsfromAccept()) {
          setShowButtonRequestExtension(true)
          setShowAnyButton(true)
        }
      }
    } else {
      setShowButtonRequestExtension(false)
    }

    if (!showAnyButton && (accept || refuse || review)) {
      setShowAnyButton(true)
    }
  }

  /* Tratamiento de expedientes Abierto/Presupeustado */
  const handleExpAbiertoPresupuestado = () => {
    if (isBaremo || isBaremoAnticip || isRetranqueo) {
      setPropPrev(false)
      setShowNoBudgetSolutionAccess(true)

      let commentInRevision = { comment1: '', comment2: '' }
      commentInRevision.comment1 = t('provisions.budget.noBudget.title')
      commentInRevision.comment2 = t('provisions.budget.noBudget.subtitle')
      setCommentInRevision(commentInRevision)

      setMessage(t(''))
      setMessage2(t(''))
    } else {
      let commentInRevision = { comment1: '', comment2: '' }
      //handlButtonsState = (accept, refuse, review , acceptOnlyReinforcement)
      handlButtonsState(false, false, false, false, false)
      setShowAnyButton(false)

      switch (statusPrevProposal) {
        case statePpPdteDefinition:
          //Llamar a  <NoBudgetSolutionAccess /> que ya muestra:
          // "Hemos validado tu solicitud y la estamos analizando."
          setShowNoBudgetSolutionAccess(true)

          setMessage('')
          setMessage2('')
          break
        case statePpInRevision:
          //"Gracias por tu petición, la revisión que nos has solicitado está en curso"
          setShowNoBudgetSolutionAccess(true)
          commentInRevision = { comment1: '', comment2: '' }
          commentInRevision.comment1 = t('provisions.budget.info.itemRevisedOpen')

          setCommentInRevision(commentInRevision)

          break
        case statePpAcepted:
          setAcceptedBudget(true)
          //setMessage(t('provisions.budget.info.itemAccepted2'))
          //setMessage2('')     
          setShowNoBudgetSolutionAccess(true)
          //commentInRevision = { comment1: '', comment2: ''}
          commentInRevision = { comment1: '', comment2: '' }
          commentInRevision.comment1 = t('provisions.budget.info.itemAccepted2')

          setCommentInRevision(commentInRevision)
          break
      }
    }
  }


  /* Tratamiento de expedientes Valorado */
  const handleExpValorated = () => {
    //handlButtonsState = (accept, refuse, review , acceptOnlyReinforcement, validate6months)
    handlButtonsState(false, false, false, false, false)
    setShowAnyButton(false)

    let fake = 'PREPRCOD2'
    let fake2 = false

    switch (statusPrevProposal) {
      case statePpPaid10:
        setPropPrev(true)
        // Mensaje: "Has realizado el pago del 10%. Nos pondremos en contacto contigo para continuar con tu expediente."
        setMessage(t('provisions.budget.info.itemPaid10'))
        setMessage2('')
        break
      case statePpAcepted:
        //if (isBaremo || isBaremoAnticip || isRetranqueo) { /*en exp Valorado no tenemos en cuenta el baremo anticipado
        if (isBaremo || isRetranqueo) {
          setPropPrev(false)
          setAcceptedBudget(true)
          setMessage(t('provisions.budget.info.itemAcceptedPresup'))

          //no hacer nada
        } else {
          setPropPrev(true)
          handlButtonsState(false, false, false, false, false)
          setAcceptedBudget(true)
          setMessage(t('provisions.budget.info.itemAccepted'))
          setMessage2(t('provisions.budget.info.itemAcceptedM2'))

        }
        break
      case statePpPdteDefinition:
        if (isBaremo || isBaremoAnticip || isRetranqueo) {
          setPropPrev(false)
          setShowNoBudgetSolutionAccess(true)

          let commentInRevision = { comment1: '', comment2: '' }
          commentInRevision.comment1 = t('provisions.budget.noBudget.title')
          commentInRevision.comment2 = t('provisions.budget.noBudget.subtitle')
          setCommentInRevision(commentInRevision)

          setMessage(t(''))
          setMessage2(t(''))
        } else {
          setPropPrev(true)
          //Llamar a  <NoBudgetSolutionAccess /> que ya muestra:
          // "Hemos validado tu solicitud y la estamos analizando."
          setShowNoBudgetSolutionAccess(true)

          setMessage('')
          setMessage2('')
        }
        break
      //Asumimos que los estados "En Revision" y "Pdte REvision" son el mismo estado  
      case statePpInRevision:
        //if (isBaremo || isBaremoAnticip || isRetranqueo) { //en exp Valorado no tenemos en cuenta el baremo anticipado
        if (isBaremo || isRetranqueo) {
          setPropPrev(false)
          setShowNoBudgetSolutionAccess(true)

          let commentInRevision = { comment1: '', comment2: '' }
          commentInRevision.comment1 = t('provisions.budget.noBudget.title')
          commentInRevision.comment2 = t('provisions.budget.noBudget.subtitle')
          setCommentInRevision(commentInRevision)

          setMessage(t(''))
          setMessage2(t(''))
        } else {
          setPropPrev(true)
          //"Gracias por tu petición, la revisión que nos has solicitado está en curso"
          setShowNoBudgetSolutionAccess(true)
          let commentInRevision = { comment1: '', comment2: '' }
          commentInRevision.comment1 = t('provisions.budget.info.itemRevisedOpen')

          setCommentInRevision(commentInRevision)
        }
        break
      case statePpPdteAceptation:
        //if (isBaremo || isBaremoAnticip) { //en exp Valorado no tenemos en cuenta el baremo anticipado
        if (isBaremo) {
          setPropPrev(false)
          //handlButtonsState = (accept, refuse, review , acceptOnlyReinforcement)
          handlButtonsState(true, true, false, false, false)
        } else if (isRetranqueo) {
          setPropPrev(false)
          handlButtonsState(true, true, true, false, false)
        } else {
          setPropPrev(true)
          handlButtonsState(true, true, true, true, false)
        }
        break
      case statePpPdteAceptationAfterReview:
        //if (isBaremo || isBaremoAnticip) { //en exp Valorado no tenemos en cuenta el baremo anticipado
        if (isBaremo) {
          //handlButtonsState = (accept, refuse, review , acceptOnlyReinforcement)
          setPropPrev(false)
          handlButtonsState(true, true, false, false, false)
        } else if (isRetranqueo) {
          setPropPrev(false)
          handlButtonsState(true, true, false, false, false)
        } else {
          setPropPrev(true)
          handlButtonsState(true, true, false, true, false)
        }
        break
    }
  }

  // Mensajes y botones a mostrar en funcion de los estados de Exped y Propuesta Previa
  useEffect(() => {
    console.log('entra bugetButtons - presupuestado o valorado')
    console.log('dossierStatusId: ', dossierStatusId)
    switch (dossierStatusId) {
      case stateDossierOpen:
      case stateDossierBudgeted:
        handleExpAbiertoPresupuestado()
        break
      case stateDossierValorated:
        handleExpValorated()
        break
    }
    // eslint-disable-next-line
  }, [currentProvision.dossierStatusId, currentProvision.statusPrevProposal])

  const updateDossierOk = (dossierCod: string, data: any) => {
    let resultOk = false

    dispatch(thunkUpdateDossier(dossierCod, false, data, (response) => {
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
          resultOk = true
        }
      }
      setIsLoading(false)
    }))
    return resultOk
  }

  const handleAccept = () => {

    var typeBudgetAux = 'no aplica'
    if (isBudget) {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'aceptar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'presupuesto',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      type_budget: typeBudgetAux,
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      dossierAction: 'PPA000001'
    }

    if (updateDossierOk(currentProvision.dossierCod, data)) {
      setButtonClicked('Aceptar')
      setAcceptedBudget(true)

      if (!(isBaremo || isBaremoAnticip || isRetranqueo)) {
        setMessage(t('provisions.budget.info.itemAccepted'))
        setMessage2(t('provisions.budget.info.itemAcceptedM2'))
      }
    }
  }



  const handleRefuse = () => {

    var typeBudgetAux = 'no aplica'
    if (isBudget) {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'rechazar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'presupuesto',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      type_budget: typeBudgetAux,
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setShowingRefuseBudget(true)
  }

  const handleRevise = () => {

    var typeBudgetAux = 'no aplica'
    if (isBudget) {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'revisar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'presupuesto',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      type_budget: typeBudgetAux,
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    })
    setShowingAskReason(true)
  }

  const handleRequestExtension = () => {
    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      extensionBudgetInd: '1'
    }

    if (updateDossierOk(currentProvision.dossierCod, data)) {
      setButtonClicked('"Solicito extensión"')
    }
  }

  const handlePerformExtensionWork = () => {
    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      budgetValorationRejection: '1',
      budgetValorationRejectionComment: t('provisions.budget.extensionWorkReason')
    }

    if (updateDossierOk(currentProvision.dossierCod, data)) {
      setButtonClicked('"Realizo obra extensión"')
    }
  }


  const handleAcceptOnlyReinforcement = () => {

    var typeBudgetAux = 'no aplica'
    if (isBudget) {
      typeBudgetAux = 'baremos'
    } else if (isReinforcementBudget) {
      typeBudgetAux = 'refuerzo'
    } else if (isReinforcementAndExtensionBudget) {
      typeBudgetAux = 'refuezo y extension'
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'ayuntamiento de madrid, este es tu presupuesto',
      click_text: 'aceptar solo refuerzo',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'presupuesto',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      type_budget: typeBudgetAux,
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type')
    })

    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      dossierAction: 'PPA000001',
      sendExtensionBudgetInd: '0',
      budgetValorationRejection: '1',
      budgetValorationRejectionComment: t('provisions.budget.extensionWorkReason')
    }

    if (updateDossierOk(currentProvision.dossierCod, data)) {
      setButtonClicked('Aceptar sólo refuerzo')
    }
  }


  useEffect(() => {
    if (revisedBudget.click) {
      setIsLoading(true)

      const data = {
        dossierCod: currentProvision.dossierCod,
        applicant: {
          docNumber: user.documentNumber
        },
        dossierAction: 'PPA000003',
        revisionTypeMotive: revisedBudget.subtipology,
        actionComment: revisedBudget.comment
      }

      if (updateDossierOk(dossierCod, data)) {
        setButtonClicked('Revisar')
        setMessage(t('provisions.budget.info.itemRevisedOpen'))
      }
    }
  }, [revisedBudget])


  useEffect(() => {
    if (refusedBudget) {
      setIsLoading(true)

      const data = {
        dossierCod: currentProvision.dossierCod,
        applicant: {
          docNumber: user.documentNumber
        },
        dossierAction: 'PPA000002'
      }

      if (updateDossierOk(dossierCod, data)) {
        setButtonClicked('Rechazr')
        setMessage(t('provisions.budget.info.itemRefused'))
        setMessage2('')
      }
    }
  }, [refusedBudget])


  return (
    <>
      <BigFileDialog
        popup={bigFilePopup}
        setPopup={setBigFilePopup}
      />
      <Grid item md={12}>
        {showingAskReason &&
          <AskReasonReview
            showing={showingAskReason}
            setShowing={setShowingAskReason}
            tipology={reviewTipology}
            setRevisedBudget={setRevisedBudget}
            setMessage={setMessage}
            setMessage2={setMessage2}
            propPrev={propPrev}
            indAceptoFacturaDigital={indAceptoFacturaDigital}
            setNewDocumentsRecieved={setNewDocumentsRecieved}
            setUploaded={setUploaded}
            setSentDocument={setSentDocument}
            setBigFilePopup={setBigFilePopup}
          />
        }
        {showingRefuseBudget &&
          <RefuseBudget
            showing={showingRefuseBudget}
            setShowing={setShowingRefuseBudget}
            tipology={refuseTipology}
            setRefusedBudget={setRefusedBudget}
            setMessage={setMessage}
            setMessage2={setMessage2}
            propPrev={propPrev}
          />
        }

        {showAnyButton &&

          <Grid item xs={12} className={classes.buttons}>
            <Grid container justifyContent='center'>
              {showButtonAccept &&
                <Button
                  className={classes.button}
                  text={t('common.buttons.accept')}
                  color='primary'
                  size='large'
                  variant='contained'
                  disabled={adminCheck()}
                  onClick={handleAccept}
                />
              }
              {showButtonAcceptOnlyReinforcement &&
                <Button
                  className={classes.button}
                  text={t('common.buttons.acceptOnlyReinforcement')}
                  color='primary'
                  size='large'
                  variant='contained'
                  disabled={adminCheck()}
                  onClick={handleAcceptOnlyReinforcement}
                />
              }
              {showButtonReject &&
                <Button
                  className={classes.button}
                  text={t('common.buttons.reject')}
                  color='primary'
                  size='large'
                  variant='contained'
                  disabled={adminCheck()}
                  onClick={handleRefuse}
                />
              }
              {showButtonRevise &&
                <Button
                  className={classes.button}
                  text={t('common.buttons.revise')}
                  color='primary'
                  size='large'
                  variant='contained'
                  disabled={adminCheck()}
                  onClick={handleRevise}
                />
              }
              {showButtonRequestExtension &&
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

            </Grid>
          </Grid>
        }
        {/*Boton "Solicito extensión" -> Solo para baremos consumo y retranqueo*/}
        {(!propPrev && isReinforcementBudget) &&
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
        {/*Boton "Realizo obra extension" -> Solo para baremos consumo y retranqueo*/}
        {(!propPrev && isReinforcementAndExtensionBudget) &&
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
    </>
  )
}

export default BudgetButtons
