import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import Spinner from '../../../../../common/components/spinner/Spinner'

import InfoIcon from '../../../../../assets/icons/info.svg'

import { setCustomerApplicantData } from '../../../../store/actions/ProvisionsActions'
import { thunkGetCustomer, thunkGetProvision } from '../../../../store/actions/ProvisionsThunkActions'
import { validateMail, validateIdentityCard, validateMobileNumber } from '../../../../../common/lib/ValidationLib'
import { getTracksTypes, noAccents } from '../../../../../common/lib/FormatLib'

import useStyles from './PersonData.styles'
import { useLocation } from 'react-router'

// LCS: Importar la función
import { sendGAEvent } from '../../../../../core/utils/gtm'

const PersonData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const portalRef: any = useRef(null)
  const stairRef: any = useRef(null)
  const floorRef: any = useRef(null)
  const doorRef: any = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchMade, setSearchMade] = useState(false)
  const [searchDocumentNumber, setSearchDocumentNumber] = useState()
  const [searchDocumentNumberRepre, setSearchDocumentNumberRepre] = useState()
  const [searchCustomer, setSearchCustomer] = useState<any>()
  const [searchCustomerRepre, setSearchCustomerRepre] = useState<any>()
  const [showForm, setShowForm] = useState(false)
  const [invoicedAdress,setInvoiceAdress] = useState<any>([])

  const user = useSelector((state: any) => state.user.profile)
  const customerOwner = useSelector((state: any) => state.provisions.customerOwner)
  const customerPayer = useSelector((state: any) => state.provisions.customerPayer)

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const Provisions = useSelector((state: any) => state.provisions)
  const currentApplicant = useSelector((state: any) => state.provisions.currentProvision.applicant)
  const currentOwner = useSelector((state: any) => state.provisions.currentProvision.owner)
  const currentPayer = useSelector((state: any) => state.provisions.currentProvision.payer)
  const currentContactList = useSelector((state: any) => state.provisions.currentProvision.contactList)
  let location = useLocation() as any;

  const {
    readOnly,
    billOwner,
    billPayer,
    applicantData,
    userExists,
    setUserExists,
    updateStateFunction,
    setIsEmpty,
    setErrorCheck,
    type,
    setType,
    person,
    datosUser,
    setLoadingConfirmation,
    setDocumentValue,
    setIsIdDocumentEmpty,
    setLoadingSearch
  } = props

  const emptyPersonData = {
    customerName: '',
    surname1: '',
    telephone1: '',
    streetType: '',
    streetName: '',
    addNumber: '',
    town: '',
    docNumber: '',
    email1: '',
    zipcode: '',
    state: ''
  } as any

  const [personData, setPersonData] = useState(emptyPersonData)
  const [somePersonDataIsEmpty, setSomePersonDataIsEmpty] = useState(false)
  const [errors, setErrors] = useState({
    customerName: false,
    surname1: false,
    telephone1: false,
    streetType: false,
    streetName: false,
    addNumber: false,
    town: false,
    docNumber: false,
    email1: false,
    zipcode: false,
    state: false
  })

  const [invalidDoc, setInvalidDoc] = useState(false)


  const [invalidPhone, setInvalidPhone] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidZip, setInvalidZip] = useState(false)

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT

  const [statesList, setStatesList] = useState([] as any)
  const [townsList, setTownsList] = useState([] as any)
  const [loadingStatesList, setLoadingStatesList] = useState(false)
  const [loadingTownsList, setLoadingTownsList] = useState(false)
  const [searchTry, setSearchTry] = useState(false)

  useEffect(() => {
    if (person) {
      dispatch(updateStateFunction(emptyPersonData))
    }
    // eslint-disable-next-line
  }, [person])

  const searchUser = (e) => {
    const docNumber = e.target.value
    // Llamada para averiguar si el usuario existe
    if (validateDocument(e) && docNumber !== '') {
      setIsLoadingSearch(true)
      setLoadingSearch(true)
      dispatch(thunkGetCustomer(docNumber, (response) => {
        if (response) {
          response = response.customers && response.customers.items && response.customers.items.length > 0 && response.customers.items[0]
          setSearchDocumentNumber(docNumber)
          setSearchCustomer(response)
          setSearchMade(true)
          setIsIdDocumentEmpty(false)
        }
        setSearchTry(!searchTry)
        setIsLoadingSearch(false)
        setLoadingSearch(false)
      }))
    }
  }

  const searchUserSelected = (e) => {
    const docNumber = e
    // Llamada para averiguar si el usuario existe
    if (docNumber !== '') {
      setIsLoadingSearch(true)
      setLoadingSearch(true)
      dispatch(thunkGetCustomer(docNumber, (response) => {
        if (response) {
          response = response.customers && response.customers.items && response.customers.items.length > 0 && response.customers.items[0]
          setSearchDocumentNumberRepre(docNumber)
          setSearchCustomerRepre(response)
          setSearchMade(true)
        }
        setSearchTry(!searchTry)
        setIsLoadingSearch(false)
        setLoadingSearch(false)
      }))
    }
  }

  useEffect(() => {
    if (searchDocumentNumberRepre && searchCustomerRepre) {
      if (searchCustomerRepre.idRelationship) {
        setUserExists(true)
        setIsEmpty(false)
        setErrorCheck(false)
        //setPersonData({ docNumber: searchDocumentNumberRepre })

        if (type === 'owner' || type === 'payer') {
          dispatch(updateStateFunction({ idRelationship: searchCustomerRepre.idRelationship }))
        }
      } else {
        setUserExists(false)
        setIsEmpty(true)
        setErrorCheck(true)
        //setPersonData({ ...emptyPersonData, docNumber: searchDocumentNumberRepre })
        dispatch(updateStateFunction({ ...emptyPersonData, docNumber: searchDocumentNumberRepre }))
      }
    }
    // eslint-disable-next-line
  }, [searchDocumentNumberRepre, searchCustomerRepre])

  useEffect(() => {
    if (searchDocumentNumber && searchCustomer) {
      if (searchCustomer.idRelationship) {
        setUserExists(true)
        setIsEmpty(false)
        setErrorCheck(false)
        setPersonData({ docNumber: searchDocumentNumber })
        // Si es de tipo payer se necesita el docNumber en la store
        // para la llamada a billingCompany
        if (type === 'payer') {
          dispatch(updateStateFunction({ idRelationship: searchCustomer.idRelationship, docNumber: searchDocumentNumber }))
        } else {
          dispatch(updateStateFunction({ idRelationship: searchCustomer.idRelationship }))
        }
      } else {
        setUserExists(false)
        setIsEmpty(true)
        setErrorCheck(true)
        setPersonData({ ...emptyPersonData, docNumber: searchDocumentNumber })
        dispatch(updateStateFunction({ ...emptyPersonData, docNumber: searchDocumentNumber }))
      }
    }
    // eslint-disable-next-line
  }, [searchDocumentNumber, searchCustomer])

  const setErrorsAndUpdate = (data) => {
    setErrors(data)

    applicantData && dispatch(setCustomerApplicantData({ ...personData }))

    dispatch(updateStateFunction({ ...personData }))
  }

  useEffect(() => {
    billOwner && setPersonData(customerOwner)

    billPayer && setPersonData(customerPayer)
    // eslint-disable-next-line
  }, [billOwner, billPayer])

  /* Si hay una provision vigente se cargan los datos en el formulario */
  useEffect(() => {
    console.log('currentProvision',currentProvision)
    if (currentProvision && currentApplicant && currentOwner && currentPayer) {
      if (applicantData && currentProvision) {
        let formattedApplicantData = currentProvision.applicant
        /* Si no vienen estos datos de ZEUS se cargan los del usuario de la web */
        if (!currentProvision.applicant.customerName || currentProvision.applicant.customerName === '') {
          formattedApplicantData = {
            ...formattedApplicantData,
            customerName: user.name
          }
        }
        if (!currentProvision.applicant.surname1 || currentProvision.applicant.surname1 === '') {
          formattedApplicantData = {
            ...formattedApplicantData,
            surname1: user.surName
          }
        }
        {/*if (!currentProvision.applicant.telephone1  || currentProvision.applicant.telephone1 === '') {
          formattedApplicantData = {
            ...formattedApplicantData,
            telephone1: user.phone
          }
        }
        if (!currentProvision.applicant.email1 || currentProvision.applicant.email1 === '') {
          formattedApplicantData = {
            ...formattedApplicantData,
            email1: user.email
          }
        }*/}

        formattedApplicantData = {
          ...formattedApplicantData,
          telephone1: currentContactList[0].valuePhone1,
          email1: currentContactList[0].valueEmail
        }

        setPersonData({ ...formattedApplicantData, surname1: formattedApplicantData.surname1 + (formattedApplicantData.surname2 ? (' ' + formattedApplicantData.surname2) : '') })
        setShowForm(true)
      } else if (type === 'owner' && currentApplicant.idRelationship !== currentOwner.idRelationship) {
        setType(true)
        setShowForm(true)
        setPersonData({ ...currentProvision.owner, surname1: currentProvision.owner.surname1 + (currentProvision.owner.surname2 ? (' ' + currentProvision.owner.surname2) : '') })
      } else if (type === 'payer' && currentApplicant.idRelationship !== currentPayer.idRelationship) {
        setType(true)
        setShowForm(true)
        setPersonData({ ...currentProvision.payer, surname1: currentProvision.payer.surname1 + (currentProvision.payer.surname2 ? (' ' + currentProvision.payer.surname2) : '') })
      }
    }
    // eslint-disable-next-line
  }, [currentProvision, type])

  useEffect(() => {
    if (applicantData && !currentProvision.applicant) {
      setIsLoading(true)
      dispatch(thunkGetCustomer(user.documentNumber, (response) => {
        if (response) {
          response = response.customers && response.customers.items && response.customers.items.length > 0 && response.customers.items[0]

          if (!response.customerName || response.customerName === '') {
            // el usuario no existe en zeus
            setUserExists(false)

            const auxPersonData = {
              ...emptyPersonData,
              docNumber: user.documentNumber
            }

            setPersonData(auxPersonData)
            dispatch(updateStateFunction(auxPersonData))
          } else {
            if (response.userType !== '0') {
              // Se setea el user como existente
              setUserExists(true)

              // Si es consumer se setean solo el idRelationship y el docNumber
              let formattedPersonDataSend
              let formattedPersonData

              formattedPersonDataSend = { idRelationship: response.idRelationship, docNumber: response.docNumber }
              formattedPersonData = { ...response, surname1: response.surname1 + (response.surname2 ? (' ' + response.surname2) : '') }

              /* Si no vienen estos datos de ZEUS se cargan los del usuario de la web */
              if (!response.customerName || response.customerName === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  customerName: user.name
                }
              }
              if (!response.surname1 || response.surname1 === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  surname1: user.surName
                }
              }
              {/*if (!response.telephone1  || response.telephone1 === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  telephone1: user.phone
                }
              }
              if (!response.email1 || response.email1 === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  email1: user.email
                }
              }*/}

              if (!response.town || response.town === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  town: ''
                }
              }

              if (!response.streetType || response.streetType === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  streetType: ''
                }
              }

              if (!response.state || response.state === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  state: ''
                }
              }

              if (!response.streetName || response.streetName === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  streetName: ''
                }
              }

              if (!response.addNumber || response.addNumber === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  addNumber: ''
                }
              }

              if (!response.zipcode || response.zipcode === '') {
                formattedPersonData = {
                  ...formattedPersonData,
                  zipcode: ''
                }
              }

              if (
                (!response.town || response.town === '') ||
                (!response.streetType || response.streetType === '') ||
                (!response.state || response.state === '') ||
                (!response.streetName || response.streetName === '') ||
                (!response.addNumber || response.addNumber === '') ||
                (!response.zipcode || response.zipcode === '')
              ) {
                setSomePersonDataIsEmpty(true)
              }

              formattedPersonData = {
                ...formattedPersonData,
                telephone1: validateMobileNumber(user.phone) ? user.phone : '',
                email1: user.email
              }

              // Se guardan los datos del solicitante en la store para su uso en otras partes de la peticion
              //dispatch(setCustomerApplicantData(response))
              dispatch(setCustomerApplicantData(formattedPersonData))

              // Se aplican los datos al estado local y al estado de la store
              setPersonData(formattedPersonData)
              //dispatch(updateStateFunction(formattedPersonDataSend))
              dispatch(updateStateFunction(formattedPersonData))

            } else {
              // Se setea el user como inexistente
              setUserExists(false)

              const formattedPersonData = {
                ...personData,
                customerName: user.name,
                surname1: user.surName,
                docNumber: user.documentNumber,
                telephone1: user.phone,
                email1: user.email,
              }

              setPersonData(formattedPersonData)
              dispatch(updateStateFunction(formattedPersonData))
            }
          }
        }

        setIsLoading(false)
      }))
    }
    // eslint-disable-next-line
  }, [user, currentProvision])

  // Comprobar si el formulario tiene algun campo vacio
  useEffect(() => {
    setIsEmpty && setIsEmpty(Object.keys(personData).filter((key) => personData[key] === '').length > 0)
    // eslint-disable-next-line
  }, [personData])

  // Comprobar si hay errores en el fromulario
  useEffect(() => {
    setErrorCheck && setErrorCheck(Object.keys(errors).filter((key) => errors[key]).length > 0)
    // eslint-disable-next-line
  }, [errors])

  // Comprobación para mostrar el formulario
  useEffect(() => {
    if (currentProvision && !currentProvision.dossierCod) {
      if (type !== 'owner' && type !== 'payer') {
        setShowForm(true)
      } else if (searchMade && !userExists) {
        setShowForm(true)
      } else {
        setShowForm(false)
        if (personData.docNumber !== '') {
          setIsEmpty(false)
          setErrorCheck(false)
        }
      }
    }
    // eslint-disable-next-line
  }, [user, type, searchMade, userExists, customerOwner, customerPayer, personData, currentProvision])

  useEffect(() => {
    if (!userExists && portalRef.current && stairRef.current && floorRef.current && doorRef.current) {
      const portal = portalRef.current.querySelector('input')
      const stair = stairRef.current.querySelector('input')
      const floor = floorRef.current.querySelector('input')
      const door = doorRef.current.querySelector('input')
  
      if (portal) portal.value = ''
      if (stair) stair.value = ''
      if (floor) floor.value = ''
      if (door) door.value = ''
    }

    // eslint-disable-next-line
  }, [searchTry])

  useEffect(() => {
    setDocumentValue && setDocumentValue(personData.docNumber)
  },[personData])

  const handleData = (e, field) => {
    const isEmpty = e.target.value === ''

    const auxPersonData = personData

    if (field !== 'portal' && field !== 'stair' && field !== 'floor' && field !== 'door') {
      if (field === 'state' || field === 'town') {
        setPersonData({ ...personData, [field]: noAccents(e.target.value) })
      } else {
        setPersonData({ ...personData, [field]: e.target.value })
      }
    } else {
      if (field === 'portal' && isEmpty) {
        delete auxPersonData.portal
      } else if (field === 'stair' && isEmpty) {
        delete auxPersonData.stair
      } else if (field === 'floor' && isEmpty) {
        delete auxPersonData.floor
      } else if (field === 'door' && isEmpty) {
        delete auxPersonData.door
      }

      const auxPersonData2 = {
        ...auxPersonData,
        [field]: e.target.value
      }

      !isEmpty && setPersonData(auxPersonData2)

      dispatch(updateStateFunction(auxPersonData2))
    }
  }

  const handleDataSelected = (e, field) => {
    setPersonData({ ...personData, [field]: e })
  }

  const validatePhone = (e) => {
    if (validateMobileNumber(e.target.value)) {
      setInvalidPhone(false)
      setErrorsAndUpdate({ ...errors, telephone1: false })
    } else {
      if (e.target.value !== '') {
        setInvalidPhone(true)
      } else {
        setInvalidPhone(false)
      }
      setErrorsAndUpdate({ ...errors, telephone1: true })
    }
  }

  const validateDocument = (e) => {
    if (validateIdentityCard(e.target.value)) {
      setInvalidDoc(false)
      setLoadingConfirmation && setLoadingConfirmation(false)
      setErrorsAndUpdate({ ...errors, docNumber: false })
      setIsIdDocumentEmpty(false)
      return true
    } else {
      if (e.target.value !== '') {
        setInvalidDoc(true)
        setIsIdDocumentEmpty(false)
        setLoadingConfirmation && setLoadingConfirmation(true)
      } else {
        setInvalidDoc(false)
        setIsIdDocumentEmpty(true)
        setLoadingConfirmation && setLoadingConfirmation(false)
      }
      setErrorsAndUpdate({ ...errors, docNumber: true })
      return false
    }
  }

  const validateEmail = (e) => {
    if (validateMail(e.target.value)) {
      setInvalidEmail(false)
      setErrorsAndUpdate({ ...errors, email1: false })
    } else {
      if (e.target.value !== '') {
        setInvalidEmail(true)
      } else {
        setInvalidEmail(false)
      }
      setErrorsAndUpdate({ ...errors, email1: true })
    }
  }

  

  const validateZipCode = (e) => {
    if (!isNaN(e.target.value) && e.target.value.length === 5) {
      setInvalidZip(false)
      setErrorsAndUpdate({ ...errors, zipcode: false })
    } else {
      if (e.target.value !== '') {
        setInvalidZip(true)
      } else {
        setInvalidZip(false)
      }
      setErrorsAndUpdate({ ...errors, zipcode: true })
    }
  }

  useEffect(() => {
    // cargar lista de provincias
    //PRUEBA
    if ((!readOnly && !userExists) || (userExists && personData.state === '')) {
      setLoadingStatesList(true)

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        fetch(cadastreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            'GNFHeader': {
              'IDServicio': 'CATASTRO',
              'IDOperacion': 'ConsultaProvincia',
              'IDCliente': 'ZEUS'
            }
          })
        }).then(async (response) => {
          const responseJson = await response.json()
  
          const statesList = [] as any
  
          responseJson && responseJson.provincias && responseJson.provincias.length > 0 && responseJson.provincias.map((item, key) => {
            return statesList.push(noAccents(item.nombre))
          })
  
          setStatesList(statesList)
  
          setLoadingStatesList(false)
        })

        // LCS: Registrar el tiempo final y calcular la duración
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /catastro',
            apiUrlShort: 'post /catastro',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });
      } catch (e) {
        // LCS: Enviar evento a GA
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'PersonData.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [readOnly, userExists])

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    if ((!readOnly && personData.state !== '' && !userExists) || (userExists && personData.state !== '')) {
      setLoadingTownsList(true)

      let state = personData.state

      if (state && state.startsWith('A CORU')) {
        state = 'A CORUÑA'
      }

      const body = '{"GNFHeader":{"IDServicio":"CATASTRO","IDOperacion":"ConsultaMunicipio","IDCliente":"ZEUS"},"provincia":"' + state + '"}'

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();
        
        fetch(cadastreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body
        }).then(async (response) => {
          const responseJson = await response.json()
  
          const townsList = [] as any
  
          responseJson && responseJson.municipios && responseJson.municipios.length > 0 && responseJson.municipios.map((item, key) => {
            return townsList.push(noAccents(item.nombre))
          })
  
          setTownsList(townsList)
  
          setLoadingTownsList(false)
        })

        // LCS: Registrar el tiempo final y calcular la duración
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /catastro',
            apiUrlShort: 'post /catastro',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });
      } catch (e) {
        // LCS: Enviar evento a GA
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'PersonData.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
    // eslint-disable-next-line
  }, [personData.state, userExists])
useEffect(() => {
  if (location.pathname == '/provisions/detail'  && location &&  location.state && location.state.invoiceAddress) {
    setInvoiceAdress(location.state.invoiceAddress)
     
  }    
   
  },[])
  
  
  useEffect(() => {
    if (datosUser && datosUser.preType && datosUser.docRepresentante !== '') {
      handleDataSelected(datosUser.docRepresentante, 'docNumber')
      searchUserSelected(datosUser.docRepresentante)
    }
  }, [])

  return (
    <>
      {
        isLoading &&
        <Spinner fixed={true} />
      }
      <Grid container spacing={3}>

        <Grid container direction='column' item md={6} className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.document')}</Typography>
          </Grid>
          <Grid item className={classes.input}>
            {readOnly ?
              <Typography className={classes.stateLabel}>{personData.docNumber}</Typography>
              :
              applicantData ?
                <Input
                  fullWidth
                  value={personData && personData.docNumber}
                  onBlur={(e) => {
                    handleData(e, 'docNumber')
                    validateDocument(e)
                  }}
                  error={errors.docNumber}
                  errorSearch={searchMade && !userExists}
                  helperText={errors.docNumber && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                  disabled={true}
                />
                :
                /*  ***    State 1  ||?   ***  */
                datosUser && datosUser.preType ?
                  <Input
                    fullWidth
                    value={datosUser.docRepresentante}
                    showValidationIcon={true}
                    disabled={true}
                  />
                  :
                  <Input
                    fullWidth
                    onBlur={(e) => {
                      handleData(e, 'docNumber')
                      searchUser(e)
                    }}
                    error={errors.docNumber}
                    errorSearch={searchMade && !userExists}
                    helperText={errors.docNumber &&
                      (invalidDoc ?
                        t('provisions.newProvision.requestData.supplyType.form.errors.invalidDoc')
                        :
                        t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                    showValidationIcon={searchMade ? '1' : '0'}
                    isLoading={isLoadingSearch}
                  />
            }
          </Grid>
        </Grid>


        {(type === 'payer' || type === 'owner') && !readOnly ?
          searchMade ? (
            userExists ?
              <Grid container alignItems='center' className={classes.tagContainer} md={6}>
                <Grid container className={classes.tag}>
                  <Grid md={2} sm={2} xs={2} item>
                    <img src={InfoIcon} className={classes.infoIcon} alt='' />
                  </Grid>
                  <Grid md={10} sm={10} xs={10} item>
                    {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.advises.found')}
                  </Grid>
                </Grid>
              </Grid>
              :
              <Grid container alignItems='center' className={classes.tagContainer} md={6}>
                <Grid container className={classes.tag}>
                  <Grid md={2} sm={2} xs={2} item>
                    <img src={InfoIcon} className={classes.infoIcon} alt='' />
                  </Grid>
                  <Grid md={10} sm={10} xs={10} item>
                    {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.advises.notFound')}
                  </Grid>
                </Grid>
              </Grid>
          )
            :
            <Grid container item md={6} className={classes.noInput} />
          :
          <Grid container item md={6} className={classes.noInput} />
        }

        {(type === 'payer' || type === 'owner') && !readOnly &&
          searchMade && (
            !userExists &&
            <Grid container alignItems='center' className={classes.info} md={12}>
              {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.advises.completeInputs.text')}
              {type === 'payer' ?
                t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.advises.completeInputs.types.payer')
                :
                t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.advises.completeInputs.types.owner')
              }
            </Grid>
          )
        }
       
        {showForm &&
          <>
            <Grid container direction='column' item md={6} className={classes.inputContainer}>
              <Grid item className={classes.label}>
                <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.name')}</Typography>
              </Grid>
              <Grid item className={classes.input}>
                {readOnly ?
                  <Typography className={classes.stateLabel}>{personData.customerName}</Typography>
                  :
                  <Input
                    fullWidth
                    value={applicantData ? (!isLoading ? personData.customerName : '') : personData.customerName}
                    onChange={(e) => handleData(e, 'customerName')}
                    onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, customerName: true }) : setErrorsAndUpdate({ ...errors, customerName: false })}
                    error={errors.customerName}
                    helperText={errors.customerName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                    disabled={userExists}
                  />
                }
              </Grid>
            </Grid>

            <Grid container direction='column' item md={6} className={classes.inputContainer}>
              <Grid item className={classes.label}>
                <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.surnames')}</Typography>
              </Grid>
              <Grid item className={classes.input}>
                {readOnly ?
                  <Typography className={classes.stateLabel}>{personData.surname1}</Typography>
                  :
                  <Input
                    fullWidth
                    value={applicantData ? (!isLoading ? personData.surname1 : '') : personData.surname1}
                    onChange={(e) => handleData(e, 'surname1')}
                    onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, surname1: true }) : setErrorsAndUpdate({ ...errors, surname1: false })}
                    error={errors.surname1}
                    helperText={errors.surname1 && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                    disabled={userExists}
                  />
                }
              </Grid>
            </Grid>
            {!(readOnly && (type === 'owner' || type === 'payer')) && (
              <>
                {type !== 'owner' && type !== 'payer' && (
                    <>
                      <Grid container direction='column' md={12} className={classes.textColor}>
                        <Typography className={classes.textColorTitle}>
                          {t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.titleContact')}
                        </Typography>
                      </Grid>
                    </>
                )}
                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.phone')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{currentProvision && currentProvision.contactList[0] && currentProvision.contactList[0].valuePhone1}</Typography>
                      :
                      <Input
                        fullWidth
                        value={applicantData ? (!isLoading ? personData.telephone1 : '') : personData.telephone1}
                        onChange={(e) => handleData(e, 'telephone1')}
                        onBlur={validatePhone}
                        error={errors.telephone1}
                        helperText={errors.telephone1 &&
                          (invalidPhone ?
                            t('provisions.newProvision.requestData.supplyType.form.errors.invalidPhone')
                            :
                            t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.email')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{currentProvision && currentProvision.deliveryAddress && currentProvision.deliveryAddress.email}</Typography>
                      :
                      <Input
                        fullWidth
                        value={applicantData ? (!isLoading ? personData.email1 : '') : personData.email1}
                        onChange={(e) => handleData(e, 'email1')}
                        onBlur={validateEmail}
                        error={errors.email1}
                        helperText={errors.email1 &&
                          (invalidEmail ?
                            t('provisions.newProvision.requestData.supplyType.form.errors.invalidEmail')
                            :
                            t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                      />
                    }
                  </Grid>
                </Grid>
                <Grid container direction='column' md={12} className={classes.textColor}>
                  <Typography className={classes.textColorTitle}>
                      {
                        (type === 'owner' || type === 'payer')
                          ? t('averias.management.consult.columnDireccion')
                          : t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.titleAddress')
                      }
                    </Typography>
                </Grid>
                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.province')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.state}</Typography>
                    :
                      <Select
                        fullWidth
                        label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.provinceLabel')}
                        value={personData && personData.state}
                        values={statesList}
                        onChange={(e) => {
                          setPersonData({
                            ...personData,
                            town: ''
                          })

                          handleData(e, 'state')
                        }}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, state: true }) : setErrorsAndUpdate({ ...errors, state: false })}
                        error={errors.state}
                        helperText={errors.state && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                        disabled={loadingStatesList}
                        isLoading={loadingStatesList}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.municipality')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.town}</Typography>
                    :
                      <Select
                        fullWidth
                        label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.townLabel')}
                        value={personData && personData.town}
                        values={townsList}
                        onChange={(e) => handleData(e, 'town')}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, town: true }) : setErrorsAndUpdate({ ...errors, town: false })}
                        error={errors.town}
                        helperText={errors.town && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                        disabled={personData.state === '' || loadingTownsList}
                        isLoading={loadingTownsList}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.zipcode')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.zipcode}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.zipcode}
                        onChange={(e) => handleData(e, 'zipcode')}
                        onBlur={validateZipCode}
                        error={errors.zipcode}
                        helperText={errors.zipcode &&
                          (invalidZip ?
                            t('provisions.newProvision.requestData.supplyType.form.errors.invalidZip')
                            :
                            t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetType')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.streetType}</Typography>
                    :
                      <Select
                        fullWidth
                        codFiltering
                        label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetTypeLabel')}
                        value={personData && personData.streetType}
                        values={getTracksTypes()}
                        onChange={(e) => handleData(e, 'streetType')}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, streetType: true }) : setErrorsAndUpdate({ ...errors, streetType: false })}
                        error={errors.streetType}
                        helperText={errors.streetType && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetName')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.streetName}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.streetName}
                        onChange={(e) => handleData(e, 'streetName')}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, streetName: true }) : setErrorsAndUpdate({ ...errors, streetName: false })}
                        error={errors.streetName}
                        helperText={errors.streetName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={6} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.addNumber')}</Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.addNumber}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.addNumber}
                        onChange={(e) => handleData(e, 'addNumber')}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, addNumber: true }) : setErrorsAndUpdate({ ...errors, addNumber: false })}
                        error={errors.addNumber}
                        helperText={errors.addNumber && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                        inputProps={{
                          maxLength: 15
                        }}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={3} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.portal')}</Typography>
                  </Grid>
                  <Grid item className={classes.input} ref={portalRef}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.portal}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.portal}
                        onChange={(e) => handleData(e, 'portal')}
                        inputProps={{
                          maxLength: 15
                        }}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={3} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.stair')}</Typography>
                  </Grid>
                  <Grid item className={classes.input} ref={stairRef}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.stair}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.stair}
                        onChange={(e) => handleData(e, 'stair')}
                        inputProps={{
                          maxLength: 15
                        }}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={3} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.floor')}</Typography>
                  </Grid>
                  <Grid item className={classes.input} ref={floorRef}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.floor}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.floor}
                        onChange={(e) => handleData(e, 'floor')}
                        inputProps={{
                          maxLength: 15
                        }}
                      />
                    }
                  </Grid>
                </Grid>

                <Grid container direction='column' item md={3} className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.door')}</Typography>
                  </Grid>
                  <Grid item className={classes.input} ref={doorRef}>
                    {readOnly ?
                      <Typography className={classes.stateLabel}>{readOnly && location.pathname == '/provisions/detail' && currentProvision.deliveryAddress.door}</Typography>
                    :
                      <Input
                        fullWidth
                        value={personData && personData.door}
                        onChange={(e) => handleData(e, 'door')}
                        inputProps={{
                          maxLength: 15
                        }}
                      />
                    }
                  </Grid>
                </Grid>
              </>
            )}
          </>
        }
      </Grid>
    </>
  )
}

export default PersonData