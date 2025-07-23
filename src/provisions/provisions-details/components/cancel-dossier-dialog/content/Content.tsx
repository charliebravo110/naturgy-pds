import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { DialogContent } from '@material-ui/core'
import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Button from '../../../../../common/components/button/Button'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import { thunkGetMasterData, thunkGetProvision} from '../../../../store/actions/ProvisionsThunkActions'


import { checkDocumentTypeInString,getCupsGenerationValue,getCupsConsumoValue  } from '../../../../../common/lib/ValidationLib'


import {
  setRequestsList,
  setRequestsListDossier
} from '../../../../../requests/store/actions/RequestsActions'
import { thunkGetRequestsList, thunkCreateNewRequest } from '../../../../../requests/store/actions/RequestsThunkActions'

import useStyles from './Content.styles'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)
  const user = useSelector((state: any) => state.user)
  const requests = useSelector((state: any) => state.requests)

  const {
    setShowing,
    handleCloseDialog,
    currentProvision
  } = props

  const [ loading, setLoading ] = useState(false)
  const [cupsGeneration, setCupsGeneration] = useState({} as any)
  const [cupsConsumo, setcupsConsumo] = useState({} as any) 
  const [provision, setProvision] = useState({} as any)
  const [tipologyValue, setTipologyValue] = useState('')
  const [subtipologyValue, setSubtipologyValue] = useState('')

  useEffect(() => {
    //GENERACION
    getCupsGenerationValue().then(result => {
      setCupsGeneration(result)

    })
    //GLOBAL
    getCupsConsumoValue().then(result => {
      setcupsConsumo(result)})
  },[])


  const handleAcceptDialog = () => {

    sendGAEventAccept()

    setLoading(true)
    console.log('provision->',provisions)
    let subtipology = '';
    let tipology = '';
    if (provisions.dossierType === 'DOSTYP002' && provisions.dossierType !== 'DOSSUB000'){
      subtipology = 'CANCELAR' in cupsGeneration ? cupsGeneration.CANCELAR : '';
      tipology = subtipology.substr(0, 7);
    }else{
      subtipology = 'CANCELAR' in cupsConsumo ? cupsConsumo.CANCELAR : '';
      tipology = subtipology.substr(0, 7);
    } 
    let data = {
      documentType: checkDocumentTypeInString(user.profile.documentNumber),
      documentNumber: user.profile.documentNumber,
      name: user.profile.name,
      surName1: user.profile.surName,
      email: user.profile.email,
      landline: user.profile.phone, // phone
      cellphone: user.profile.phone, // phonemob
      //tipology: '1074A20',
      //subtipology: '10463',
      subtipology: subtipology,
      tipology: tipology,  
      cups: '',
      dossierNumber: provisions.currentProvision.dossierCod,
      comment: 'CANCELACION EXPEDIENTE',
      documents: [{
        url: '',
        idDocumentum: '',
        nombreArchivo: '',
        format: '',
        documentType: '',
        documentState: ''
      }]
    } as any

    dispatch(thunkCreateNewRequest(data, (response) => {
      let filter = `documentNumber::${user.profile.documentNumber}|status::1`

      dispatch(thunkGetRequestsList(filter, (response) => {
        if (response && response.length > 0) {
          // ok
          dispatch(setRequestsList(response))
        }
      }))

      filter = filter + `|dossierNumber::${provisions.currentProvision.dossierCod}`

      if (provisions.currentProvision.applicant && provisions.currentProvision.applicant.docNumber) {
        filter = filter + `|applicantNif::${provisions.currentProvision.applicant.docNumber}`
      }

      dispatch(thunkGetRequestsList(filter, (response) => {
        if (response && response.length > 0) {
          // ok
          dispatch(setRequestsListDossier(response))
        }

        setLoading(false)

        setShowing(false)
      }))
    }))
  }

  const sendGAEventAccept = ():void => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'cancel_file',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      click_text: 'aceptar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_number: provisions.currentProvision.dossierCod,
      request_status: getExpStatus(provisions.currentProvision.dossierStatusId),
      browsing_type: sessionStorage.getItem('browsing_type')
    })
  }

  return (
    <>
      {
        loading &&
          <Spinner fixed />
      }

      <DialogContent className={classes.container}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <div className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={AlertIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {t('provisions.provisionsDetails.dialog.title')}
            </Grid>

            {
              (
                provisions.currentProvision.dossierStatusId === 'STATUS0040' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0072' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0078' ||
                provisions.currentProvision.dossierStatusId === 'STATUS0099'
              ) ?
                <>
                  <Grid item className={classes.subTitle}>
                    {t('provisions.provisionsDetails.dialog.descriptions.text2')}
                  </Grid>

                  <Grid item className={classes.subTitle}>
                    {t('provisions.provisionsDetails.dialog.descriptions.text3')}
                  </Grid>
                </>
              :
                <Grid item className={classes.subTitle}>
                  {t('provisions.provisionsDetails.dialog.descriptions.text1')}
                </Grid>
            }
          </Grid>
        </div>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAcceptDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </>
  )
}

export default Content
