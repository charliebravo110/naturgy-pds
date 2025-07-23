import React, { useState, useEffect } from 'react'
import { Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, Link, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import useStyles from './updateCie.styles'
import { useTranslation } from 'react-i18next'
import Button from '../../../common/components/button/Button'
import { thunkCreateDocument, thunkCreateNewRequest } from '../../../requests/store/actions/RequestsThunkActions'
import { useDispatch, useSelector } from 'react-redux'
import { setNewRequestDataDocument } from '../../../requests/store/actions/RequestsActions'
import AddIcon from '../../../assets/icons/mas.svg'
import DeleteIcon from '../../../assets/icons/misdocumentos_eliminar.svg'
import OkIcon from '../../../assets/icons/ico_ok.svg'
import KoIcon from '../../../assets/icons/misdocumentos_rechazado.svg'
import { showError } from '../../../common/store/actions/ErrorActions'
import Spinner from '../../../common/components/spinner/Spinner'
import TextButton from '../../../common/components/text-button/TextButton'
import { ArrowBackIos } from '@material-ui/icons'

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../core/utils/gtm'

const UpdateCie = (props: any) => {

  const { 
    setIsLoadingCont,
    backButton,
    type,
    CIE,
    potenciaCIE,
    PPP,
    finalizeUpdateCie,
    CUPS
   } = props

  const theme = useTheme()
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const user = useSelector((state: any) => state.user)

  const [ isLoading, setIsLoading ] = useState(true)
  const [errors, setErrors] = useState(false)
  const [errorType, setErrorType] = useState(0)
  const [okProcess, setOkProcess] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [fileName, setfileName] = useState('')
  const [file, setFile] = useState() as any
  const [originalCheck, setOriginalCheck] = useState(false)
  const [blockBtn, setBlockBtn] = useState(false)

    const mobileRes = useMediaQuery('(max-width:576px)')

  const extensions = ['PDF']

  const BASE_URL = process.env.REACT_APP_API_ENDPOINT
  let auxAttachedDocument: any


  const getFileBase64 = (file, callback) => {
    let reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      callback(reader.result)
    }

    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }
  
  const handleClickExamineDocument = () => {
    auxAttachedDocument.firstChild.click()
  }

  const handleDocument = (e) => {

    const file = e.target.files[0]

    if (file && file.name && file.name !== '') {

      const lastPoint = file.name.lastIndexOf('.')
      const extensionFile = file.name.slice(lastPoint + 1);
      extensions.map((extension => {
        if (extensionFile.toUpperCase().includes(extension)) {
          setfileName(file.name)
          setFile(file)
          console.log(File)
        }
      }))
    }
  }


  const handleUploadDocument = (e) => {

    sendGAEventUploadDoc()

    setIsLoadingCont(true)
    setBlockBtn(true)
    console.log(file)

    if (file) {
      let documentumData = {
        nombre: file.name,
        extension: file.name && ('.' + file.name.split('.').pop()),
        tipoMime: file.type,
        carpeta: '/Documentos/ZEUDATCWBS01',
        tipo: 'ZEUDATCPRO01',
        metadatos: [
          {
            nombre: 'tipo_sr',
            valor: '0869A06'
          },
          {
            nombre: 'sector',
            valor: 'ELECTRICIDAD'
          },
          {
            nombre: 'nif_consumidor',
            valor: user.profile.documentNumber
          }
        ]
      } as any

      getFileBase64(file, (response) => {
        const base64 = response.substring(response.indexOf('base64,') + 7, response.length)

        documentumData = {
          ...documentumData,
          contenido: base64
        }


        // subir el fichero a Documentum
        dispatch(thunkCreateDocument(documentumData, (response) => {
          if (response) {
              const data = {
                documentType: '',
                documentNumber: user.profile.documentNumber,
                name: user.name,
                surName1: user.surName,
                email: user.email,
                landline: user.phone,
                cellphone: '',
                tipology: '0869A06',
                subtipology: '', //falta codi subtipologia
                dossierNumber: '',
                channel: '10010',
                createdByCode: '',
                createdBy: '',
                savedByCode: '',
                savedBy: '',
                comment: '',
                cups: (CUPS) ? CUPS : '',
                documents: [{
                  url: '',
                  idDocumentum: response && response.idDocumento,
                  nombreArchivo: '',
                  format: '',
                  documentType: 'DOCTYP0242',
                  documentState: ''
                }]
              } as any;
        
            dispatch(thunkCreateNewRequest(data, (response2) => {
              if (!response2) {
                dispatch(showError('2001', 'createServiceRequest'))
                setErrors(true)
                setErrorType(2)
                setIsLoadingCont(false);
                
                
              }
              if (response2 && response2.result && response2.result.codResult !== '0000') {
                dispatch(showError('2001', 'createServiceRequest'))
                setErrors(true)
                setErrorType(2)
                setIsLoadingCont(false);
                
              }
              if (response2 && response2.result && response2.result.codResult === '0000') {
                setOkProcess(true)
              }
            }));
          } 

          if (response && response.result && response.result.codResult !== '0000') {
            setErrors(true)
            setErrorType(2)
            setIsLoadingCont(false);
          }

          setIsLoadingCont(false)
          setBlockBtn(true)

        }))
      })
    }
  }

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const año = hoy.getFullYear();
  
    return `${dia}/${mes}/${año}`;
  };

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventUploadDoc = ():void => {
    sendGAEvent({
      event: 'consult_contract',
      section_name: 'mi conexion a la red',
      click_text: 'subir documento',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      cups: CUPS,
      tab_name: 'consulta de cups de primera contratacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      module_name: 'actualizar cie',
    })
  }

  const sendGAEventCancel = ():void => {
    sendGAEvent({
      event: 'consult_contract',
      section_name: 'mi conexion a la red',
      click_text: 'cancelar',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      cups: CUPS,
      tab_name: 'consulta de cups de primera contratacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      module_name: 'actualizar cie',
    })
  }

  const sendGAEventFinalize = ():void => {
    sendGAEvent({
      event: 'consult_contract',
      section_name: 'mi conexion a la red',
      click_text: 'finalizar',
      element_type: 'conversion de accion',
      page_url: window.location.href,
      cups: CUPS,
      tab_name: 'consulta de cups de primera contratacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      module_name: 'el cie se ha actualizado correctamente en nuestros sistemas',
    })
  }

  return (
    <>
      
      <Grid container direction='row' alignItems='center'>
          <Link
            className={classes.title}
            underline='none'
            onClick={backButton}
          >
            <TextButton className={classes.buttons}>
              <Grid item>
                <ArrowBackIos fontSize='small' />
              </Grid>
              <Grid item style={{position:'relative',bottom:'3px'}}>
                <Typography>
                  {t('provisions.newGeneration.popupMessages.back')}
                </Typography>
              </Grid>
            </TextButton>
          </Link>
        </Grid>

     <Grid container className={classes.generalArea}>
      <Grid item xs={12} sm={12} md={12}>
   
        {(okProcess) && 
          <>
            <Grid container spacing={3} direction='column' style={{ padding: '20px' }}>
              
              <Grid item style={{textAlign:'center'}}>
                <img src={OkIcon} alt='' width={60}/>
              </Grid>

              <Grid item>
                <Typography variant='h6' align='center' className={classes.title}>
                  {t('contracts.updateCIE')}
                </Typography>
              </Grid>

              <Grid container item direction='column' spacing={2}>
                <Grid item>
                  <span className={classes.standardText1}>{t('contracts.type')}</span>
                  <span className={classes.standardText2}>{type}</span>
                </Grid>

                <Grid item>
                  <span className={classes.standardText1}>{t('contracts.cie')}</span>
                  <span className={classes.standardText2}>{(CIE) ? 'Sí' : 'No'}</span>
                </Grid>

                <Grid item>
                  <span className={classes.standardText1}>{t('contracts.power')}</span>
                  <span className={classes.standardText2}>{potenciaCIE}</span>
                </Grid>

                <Grid item>
                  <span className={classes.standardText1}>{t('contracts.ppp')}</span>
                  <span className={classes.standardText2}>{PPP}</span>
                </Grid>

                <Grid item>
                  <span className={classes.standardText1}>{t('contracts.lastUpdate')}</span>
                  <span className={classes.standardText2}>{obtenerFechaActual()}</span>
                </Grid>

              </Grid>

              <Grid item container spacing={3} justify='center'>
                  <Grid item>
                    <Button
                      text={t('Finalizar')}
                      color='primary'
                      size='large'
                      variant='contained'
                      disabled={false}
                      onClick={() => { sendGAEventFinalize(); finalizeUpdateCie()}}
                    />
                  </Grid>
                </Grid>
              </Grid>
          </>
        }

        {(showForm) && 
          <>
            <Grid container spacing={3} direction='column' style={{ padding: '20px' }}>
              
              {/* Título */}
              <Grid item>
                <Grid container direction='column' spacing={1}>
                  <Grid item>
                    <Typography variant='h6' align='center' className={classes.title}>
                    {t('contracts.title')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='subtitle1' align='center' className={classes.subtitle}>
                      {t('contracts.CUPS')}{CUPS}
                    </Typography>
                  </Grid>
                  {
                    (!errors) && 
                      <Grid item>
                        <Typography variant='subtitle1' align='center' className={classes.subtext}>
                          {t('contracts.format')}
                        </Typography>
                      </Grid>
                  }
                 
                </Grid>
              </Grid>

              {
                (!errors) ? 
                <Grid>
                  <Grid container className={classes.attach} spacing={2}>
                    <Grid item md={9} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        variant='outlined'
                        value={fileName}
                        disabled
                        placeholder='Adjuntar el documento CIE'
                        InputProps={{
                          classes: {
                            disabled: classes.disabledInput,  // Aplicar los estilos al estado deshabilitado
                          },
                          endAdornment: (
                            <div style={(fileName === '' ) ? {display:'none'} :{cursor:'pointer'}}>
                              <InputAdornment position='end'>
                                <IconButton >
                                  <img src={DeleteIcon} className={classes.icon}  onClick={() => {setfileName('')}} />
                                </IconButton>
                              </InputAdornment>
                            </div>
                            
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12} style={{padding:'8px 8px 8px 8px'}}>
                      <InputBase
                        type='file'
                        onChange={handleDocument}
                        ref={ref => auxAttachedDocument = ref}
                        style={{ display: 'none' }}
                      />

                      <Grid md={12} item className={`${classes.addBox}`} onClick={handleClickExamineDocument}>
                        <img
                          src={AddIcon}
                          className={`${classes.addIcon}`}
                          alt=''
                        />
                        <Typography className={`${classes.iconText}`}>
                          {t('common.buttons.addDocument')}
                        </Typography>
                      </Grid>

                    </Grid>
                  </Grid>

                  <Typography variant='subtitle1' className={classes.caption}>
                  {t('contracts.format2')}
                  </Typography>
                

                  {/* Checkbox */}
                  <Grid item style={{marginLeft:'11px'}}>
                    <FormControlLabel
                      value={originalCheck}
                      onChange={() => setOriginalCheck(!originalCheck)}
                      style={{color:'#004571'}}
                      control={<Checkbox color='primary' />}
                      label={t('contracts.check')}
                    />
                  </Grid>
                  
                  {/* Botones */}
                  <Grid item container spacing={2} justify='center' style={{padding: '10px 10px 0px 10px', marginTop:'16px', marginBottom:'0px'}}>
                    <Grid item style={{width: mobileRes && '100%'}}>
                      <Button
                        text={t('Cancelar')}
                        color='primary'
                        size='large'
                        variant='outlined'
                        onClick={() => { sendGAEventCancel(); backButton()}}
                        style={{width: mobileRes && '100%', backgroundColor:'white'}}
                      />
                        
                    </Grid>
                    <Grid item style={{width: mobileRes && '100%'}}>
                      <Button
                        text={t('Subir documento')}
                        color='primary'
                        size='large'
                        variant='contained'
                        disabled={(fileName === '' || !originalCheck || blockBtn)}
                        onClick={handleUploadDocument}
                        style={{width: mobileRes && '100%'}}
                      />
                    </Grid>
                  </Grid>

                </Grid>
                :
                <Grid style={{backgroundColor:'#f9f8f7', padding:'30px'}}>
                  <Grid container spacing={3} direction='column' style={{ backgroundColor:'white'}}>
                    <Grid item style={{textAlign:'center'}}>
                      <img src={KoIcon} alt='' width={60}/>
                    </Grid>

                    <Grid item>
                      <Typography variant='h6' align='center' className={classes.title}>
                        {(errorType === 1) && t('contracts.error1')}
                        {(errorType === 2) && t('contracts.error2')}
                      </Typography>
                    </Grid>

                    {
                      (errorType === 1) &&
                       <>
                        <Grid item>
                           <Typography variant='h6' align='center' className={classes.subtitle}>
                              {t('contracts.retry')}
                           </Typography>
                        </Grid>

                        <Grid item style={{textAlign:'center'}}>
                          <Button
                            text={t('Volver a subir documento')}
                            color='primary'
                            size='large'
                            variant='contained'
                            disabled={false}
                            onClick={handleUploadDocument}
                          />
                        </Grid>
                      </> 
                    }

                    {
                      (errorType === 2) &&
                      <Grid item container spacing={3} justifyContent='center' style={{textAlign:'center'}}>
                        <Grid item style={{textAlign:'center'}}>
                           <Typography variant='h6' align='center' className={classes.subtitle}>
                              {`Por favor, inténtalo más tarde o `}<a target='_blank' rel='noopener noreferrer' href='https://www.ufd.es/atencion-al-cliente/'><span style={{textDecoration:'underline', color:'#2d80d3'}}>{`ponte en contacto `}</span></a>{` con nosotros.`}
                           </Typography>
                        </Grid>
                      </Grid> 
                    }

                  </Grid>
                </Grid>
                
              }
              
              
            </Grid>
          </>
        }
      </Grid>
    </Grid>
    </>
  )

}


export default UpdateCie