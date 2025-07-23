import React, { useEffect, useState } from 'react'
import Recaptcha from '../../../../common/components/recaptcha/Recaptcha'
import Button from '../../../../common/components/button/Button'
import useStyles from './FirstContration.styles'
import Input from '../../../../common/components/input/Input'
import AlertInfo from '../alert-info/AlertInfo'
import { validateCIF, validateCupsNumber, validateIdentityCard, validateNIE } from '../../../../common/lib/ValidationLib'
import ValidateCups from '../../../../requests/components/new-request/form/validatorCupsCs/ValidateCups'
import ErrorMessage from '../errorMessage/ErrorMessage'
import { useDispatch } from 'react-redux'
import { thunkGetContractsCUPS } from '../../../../supplies/store/actions/SuppliesThunkActions'
import CupsNotExist from '../CupsNotExist/CupsNotExisit'
import CupsNoDisponible from '../CupsNoDisponible/CupsNoDisponible'
import SuministroDisp from '../SuministroDisp/SuministroDisp'
import UpdateCie from '../../updateCie/UpdateCie'
import ErrorSystemMessage from '../ErrorSystemMessage/ErrorSystemMessage'
import { useTranslation } from 'react-i18next'
import changeValues from '../../../../common/services/changeValues'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm'

export default function FirstContration(props: any) {

  const { setIsLoadingCont } = props

  const dispatch = useDispatch()
  const classes = useStyles({})
  const { t } = useTranslation()

  const [captcha, setCaptcha] = useState(false)
  const [CUPS, setCUPS] = useState('')
  const [cupsValidate, SetCupsValidate] = useState(false)
  const [errorInPetition, setErrorInPetition] = useState(false)
  const [errorSystem, setErrorSystem] = useState(false)
  const [CupsNotExisis, setCupsNotExisits] = useState(false)
  const [CupsNoDisp, setCupsNoDisp] = useState(false)
  const [CupsNoDispText, setCupsNoDispText] = useState('')

  const [cupsDisp, setCupsDisp] = useState(false)

  const [btnDisabled, setBtnDisabled] = useState(false)
  const [DNI, setDNI] = useState(sessionStorage.getItem('userDocument'))
  const [document, setDocument] = useState()

  const [TipoAcometida, setTipoAcometida] = useState('')
  const [CIERegistrado, setCIERegistrado] = useState<any>('')
  const [potenciaCIE, setPotenciaCIE] = useState('')
  const [PPP, setPPP] = useState('')

  const [showDetailButton, setShowDetailButton] = useState(false)
  const [contractData, setContractData] = useState<any>()
  const [solicitudes,setSolicitudes]= useState<any>()

  const [showInitialForm, setShowInitialForm] = useState(true)
  const [showCieForm, setShowCieForm] = useState(false)
  const [blankCUPS, setBlankCUPS] = useState(true)
  const [enCurso, setEnCurso] = useState(false)
  const [errorInCUPS, setErrorInCUPS] = useState(false)
  const [isTitular, setIsTitular] = useState(false)

  useEffect(() => {
    // validamos que el captcha i que el CUPS sean validos
    setBtnDisabled(!(captcha && cupsValidate))
  }, [captcha, cupsValidate])

  // useEffect(() => {
  //   if (!firstLoad) {
  //     SetCupsValidate(!validateCupsNumber(CUPS));
  //   } else if (firstLoad) {
  //     setFirstLoad(false)
  //   }
  // }, [CUPS])

  const onChangeCaptcha = () => {
    setCaptcha(!captcha)
  }

  const setCallError = () => {
    setErrorSystem(true)
    setErrorInPetition(false)
    setErrorInCUPS(false)
  }

  const setCupsError = () => {
    setErrorInCUPS(true)
    setErrorSystem(false)
    setErrorInPetition(false)
  }
  const boolReset = () => {
    // Resetea todos los estados
    setCupsNoDisp(false);
    setCupsNoDispText('');
    setCupsDisp(false);
    setErrorSystem(false);
    setErrorInPetition(false);
    setErrorInCUPS(false);
    setEnCurso(false);
    setIsTitular(false);
  }

  const changeCUPS = ({ target }) => {
    setBlankCUPS(target.value === '')
    
    SetCupsValidate(validateCupsNumber(target.value))
    setBtnDisabled(!(captcha && validateCupsNumber(target.value)))
    
    boolReset()

    setCUPS(target.value)
  }

  const tratarDatos = (input) => {

    let number = parseFloat(input)
    if(isNaN(number)){
      return t('contracts.firstContraction.notAvailable')
    }
    const formattedNumber = number
    .toFixed(2) // Convertir a string con 2 decimales (no pierde ceros)
    .replace('.', ',') // Cambiar punto por coma
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añadir puntos como separadores de miles

    return `${formattedNumber} kW`;
  }


  const btnOnClick = () => {

    setBtnDisabled(true)

    boolReset()
    setIsLoadingCont(true)
    dispatch(thunkGetContractsCUPS(DNI, CUPS, (response) => {
      if (response) {
        if (response?.result?.codResult && response.result.codResult === '0000') {
          // respuesta OK, modificamos objeto con datos de respuesta
          setContractData(response.supplyPoints.items[0])
          setSolicitudes(response.resp.solicitudes)

          setPPP(!response?.supplyPoints?.items[0]?.hasOwnProperty('maxAvalaibleVoltage') ? t('contracts.firstContraction.notApply') : (response.supplyPoints.items[0].maxAvalaibleVoltage ==''? t('contracts.firstContraction.notAvailable') : tratarDatos(response.supplyPoints.items[0].maxAvalaibleVoltage)))
 
          setPotenciaCIE(!response?.supplyPoints?.items[0]?.hasOwnProperty('maxAuthorizedVoltage') ? t('contracts.firstContraction.notApply') : response.supplyPoints.items[0].maxAuthorizedVoltage ==''? t('contracts.firstContraction.notAvailable') : tratarDatos(response.supplyPoints.items[0].maxAuthorizedVoltage))
                    
          setCIERegistrado(!response?.supplyPoints?.items[0]?.hasOwnProperty('CIEApprovalDate') ? t('contracts.firstContraction.notApply') : response.supplyPoints.items[0].CIEApprovalDate? t('genericUnMutable.Si') : t('genericUnMutable.No'))

          setTipoAcometida(!response?.supplyPoints?.items[0]?.hasOwnProperty('installationType') ? t('contracts.firstContraction.notApply') : (response.supplyPoints.items[0].installationType ==''? t('contracts.firstContraction.notAvailable') : response.supplyPoints.items[0].installationType))

          setDocument(response?.supplyPoints?.items[0]?.ownership)
          //validamos estados del CUPS
          if (response.supplyPoints.items[0].codStatus === 'SSSTAT0001') {
            //Status valido, revisamos que tenga solicutdes
            
            if(response.resp.solicitudes?.solicitud && response.resp.solicitudes.solicitud.length > 0){
              //revisamos si el propietario es el que corresponda
              if (validateIdentityCard(response.supplyPoints.items[0].ownership)) {
                //Es propietario o delegado o asesor
                setEnCurso(true)
                setIsTitular(true)
              }
              else {
                //no es propietario ni delagado ni asesor
                setEnCurso(true)
                setIsTitular(false)
              }
            }
            setCupsDisp(true)
          }
          else if (response.supplyPoints.items[0].codStatus === 'SSSTAT0003') {
            if (validateIdentityCard(response.supplyPoints.items[0].ownership)) {
              //Es propietario o delegado o asesor
              setEnCurso(true)
              setIsTitular(true)
            }
            else {
              //no es propietario ni delagado ni asesor
              setEnCurso(true)
              setIsTitular(false)
            }
            setCupsDisp(true)
          }
          else if (response.supplyPoints.items[0].codStatus === 'SSSTAT0004') {
            //Activo contrado no disponible 06b
            setCupsNoDisp(true)
            setCupsNoDispText(t('contracts.firstContraction.cupsHired'))
          }
          else {
            //activo contratado no disponible 06c
            setCupsNoDisp(true)
            setCupsNoDispText(t('contracts.firstContraction.cupsNotAvailable'))
          }
        }
        else if (response?.result?.codResult && response.result.codResult === '2002') {
          // error de llamada, mostramos mensaje de error de llamada
          setCallError()
        }
        else if (response?.result?.codResult && response.result.codResult === '2001') {
          //errro de formato CUPS, mostramos mensaje de error de CUPS
          setCupsError()
        }
        setIsLoadingCont(false)
      }
      else{
        //No hay respuesta
        setCallError()
      }
    }))
  }

  const buttonCIE = () => {
    setShowInitialForm(false)
    setShowCieForm(true)
  }

  const backButton = () => {
    setShowInitialForm(true)
    setShowCieForm(false)
  }

  const finalizeUpdateCie = () => {
    setShowInitialForm(true)
    setShowCieForm(false)
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventConsultCUPS = ():void => {
    sendGAEvent({
      event: 'consult_contract',
      section_name: 'mi conexion a la red',
      click_text: 'consultar',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      cups: CUPS,
      tab_name: 'consulta de cups de primera contratacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <>
      {(showInitialForm) &&
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <p style={{ textAlign: 'center', color: '#65676B' }}>
            {t('contracts.firstContraction.conultCups')}
          </p>
          <div className={classes.inputCups}>
            <Input
              label={t('contracts.firstContraction.writeCups')}
              style={{
                width: '100%',
              }}
              onChange={changeCUPS}
              value={CUPS}
              error={(!cupsValidate || errorInCUPS) && !blankCUPS}
            />
            {((!cupsValidate || errorInCUPS) && !blankCUPS) && (
              <div className={classes.errorCups}>
                <p style={{ margin: 0 }}>
                {t('contracts.firstContraction.CupsInvalidFormat')}
                </p>
              </div>
            )}
          </div>
          <Recaptcha
            onChangeCaptcha={onChangeCaptcha}
          />
          <Button
            className={classes.button}
            name={t('genericUnMutable.Accept')}
            text={t('contracts.firstContraction.Consult')}
            color='primary'
            size='large'
            variant='contained'
            disabled={btnDisabled}
            onClick={() => { sendGAEventConsultCUPS(); btnOnClick()}}
          />
          {errorInPetition ? (
            <ErrorMessage />
          ) : errorSystem ? (
            <ErrorSystemMessage />
          ) : CupsNotExisis ? (
            <CupsNotExist />
          ) : CupsNoDisp ? (
            <CupsNoDisponible
              title={CupsNoDispText}
            />
          ) : cupsDisp ? (
            <SuministroDisp
              setIsLoadingCont={setIsLoadingCont}
              document={document}
              CUPS={CUPS}
              showDetailButton={showDetailButton}
              setShowDetailButton={setShowDetailButton}
              buttonCIE={buttonCIE}
              type={TipoAcometida}
              CIE={CIERegistrado}
              potenciaCIE={potenciaCIE}
              PPP={PPP}
              enCurso={enCurso}
              titular={isTitular}
            />
          ) : (
            <></>
          )}
        </div>
      }

      {(showCieForm) &&
        <UpdateCie
          setIsLoadingCont={setIsLoadingCont}
          backButton={backButton}
          type={TipoAcometida}
          CIE={CIERegistrado}
          potenciaCIE={potenciaCIE}
          PPP={PPP}
          finalizeUpdateCie={finalizeUpdateCie}
          CUPS={CUPS}
        />
      }
      <AlertInfo />
    </>
  )
}