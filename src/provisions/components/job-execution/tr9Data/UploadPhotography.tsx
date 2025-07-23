import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import { Divider, InputBase, Typography } from '@material-ui/core';
import TechnicalDataIcon from '../../../../assets/icons/filtros.svg'
import closeIcon from '../../../../assets/icons/cerrar.svg'
import alertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import rayIcon from '../../../../assets/icons/aviso_seguridad_red.svg';
import addImage from '../../../../assets/icons/Anadir_fotografia_desktop.svg'
import addImageDisabled from '../../../../assets/icons/Anadir_fotografia_desktop_inactivo.svg'
import number2 from '../../../../assets/icons/numero_2.svg'

import useStyles, { 
  ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
  ExpansionPanelv2,
  ExpansionPanelSummaryv2,
  ExpansionPanelDetailsv2
 } from '../JobExecution.styles'


import { StyledExpandMoreIcon } from '../../new-provision/steps/Steps.styles'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button';
import TickIcon from '../../../../assets/icons/ok_list.svg'
import AddIcon from '../../../../assets/icons/mas.svg'
import DeleteIcon from '../../../../assets/icons/misdocumentos_eliminar.svg'
import { useDispatch, useSelector } from 'react-redux';
import DialogInvalidExtension from '../../../../requests/components/request-detail/dialog-invalid-extension/DialogInvalidExtension';
import DialogInvalidSize from '../../../../requests/components/request-detail/dialog-invalid-size/DialogInvalidSize';
import Modales from '../../../../supplies/supplies-details/components/consumption/charts/filters/error-message/Modales';
import useModal from '../../../../supplies/supplies-details/components/consumption/charts/filters/error-message/UseModal';
import UbiInput from '.././input/Ubi-input';
import Checkbox from '../../../../common/components/checkbox/Checkbox';
import ErrorIcon from '../../../../assets/icons/misdocumentos_rechazado.svg'







const UploadPhotography = (props: any) => {

  const {
        handleChangeSubpanel,
        expandSubPanels,
        setShowTr9form,
        form1Ok,
        sendAllFiles,
        images,
        setImages,
        disabledPanel2,
        CPMdistance,
        CPMdistance1,
        CGPdistance,
        CGPdistance1,
        setCPMdistance,
        setCPMdistance1,
        setCGPdistance,
        setCGPdistance1,
        onlyCPMorBoth,
        numberSupplies,
        power,
        observations,
        setObservations,
        correctPhotographies,
        setCorrectPhotographies,
        noPerson,
        setNoPerson,
        radioButtonCentralizacion,
        onlyRead,
        setText,
        setImage,
        setTitle,
        setShowDialog,
        setShowingCancelDialog,
        showing,
        stairs,
        floor,
        door,
        description,
        uso,
        selectedTipoSuministro,
        showButtons,
        setShowDialogDraft,
        setShowButtons,
        setOnlyRead,
        radioButton0,
        errorUpload,
        setErrorUpload
      } = props

      interface ImageData {
        name: string;
        type: string;
        base64: string;
        title: string;
      }
  
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(10000000) // 10MB
  const [stringMaxUploadFileSize, setStringMaxUploadFileSize] = useState<string>('10000000') // 10MB
  const [showPopupInvalidExtension, setShowPopupInvalidExtension] = useState(false)
  const [showPopupInvalidSize, setShowPopupInvalidSize] = useState(false)
  const {isOpen, toggle} = useModal()
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('En las fotografías no deben haber presencia de  personas')
  const [selectedKey, setSelectedKey] = useState('')
  const [auxList, setAuxList] = useState({})
  const [characters, setCharacters] = useState(300)
  const [formOk2, setFormOk2] = useState(false)
  const [photosReady, setPhotosReady] = useState(false)
  const [allowSendButton, setAllowSendButton] = useState(false)


      

  let totalRequired = 0;
  let requiredIndexs = []

  const fileInputs = useRef({});

  const extensions = ['JPG','PNG','GIF']

  const checkExtensions = (file) => {
    let result = false
    if (file.name && file.name !== '') {

      const lastPoint = file.name.lastIndexOf('.')
      const extensionFile = file.name.slice(lastPoint + 1);
      extensions.map((extension => {
        if (extensionFile.toUpperCase().includes(extension)) {
          result = true
        }
      }))
    }
    
    return result
  }

  const showModal = (key) => {
    toggle()
    setSelectedKey(key)
  }

  let globalIndex = 0

  const handleInputChange = (index, event) => {
    const newValue = event.target.value;
    if (centralizedList[index].change) {
      centralizedList[index].change(newValue);
    }

  };

  const handleFileChange = (event, key,title) => {
    const file = event.target.files[0]
    //const fileSize = (file.size).toString()
    const isBigFile = file &&  file.size && file.size > maxUploadFileSize ? true : false

    if (file && checkExtensions(file) && !isBigFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        if (typeof result === 'string') {
          const base64String = result.split(',')[1]; // Obtener solo el base64 sin el prefijo
          setImages(prevImages => ({
            ...prevImages,
            [key]: {
              name: file.name,
              type: file.type,
              base64: base64String,
              title
            },
          }));
        }
      };
      reader.readAsDataURL(file); // Leer el archivo como DataURL
    }  else if (file && !checkExtensions(file)) {
      setShowPopupInvalidExtension(true)
    }
    else if (isBigFile) {
      setShowPopupInvalidSize(true)
    }
  }

  const handleDelete = (keyToDelete) => {
    const updatedImages = { ...images };
    
    delete updatedImages[keyToDelete];

    setImages(updatedImages);
  }

  const handleAddClick = (key) => {
    //toggle()
    fileInputs.current[key].click();
    
  }

  const checkTitleExists = (literal: string): boolean => {
    // Aseguramos que los valores son de tipo ImageData
    return Object.values(images).some((item) => {
      const imageItem = item as { name: string; type: string; base64: string; title: string };
      return imageItem.title === literal
      });
  };

  const capitalizeWords = (str) => {
    // Divide la cadena en palabras
    return str.split(' ').map(word => {
        // Convierte la primera letra a mayúscula y el resto a minúscula
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

  const centralizedList  = [

    {
      key: "provisions.jobExecution.image1",
      title:t('provisions.jobExecution.image1'),
      href:['/CENTRALIZADA/entorno_1.png'],
      textfield:false,
      required:true,
      formLocation: 'instalation',
      text:''
    },
    {
      key: "provisions.jobExecution.image2",
      title:t('provisions.jobExecution.image2'),
      href:['/CENTRALIZADA/exterior_de_CGP.png'],
      textfield:true,
      required:true,
      formLocation: 'instalation',
      placeholder:'Distancia mínima del CGP al suelo (cm)',
      placeholder1:'Distancia mínima del CGP a ventanas o puertas (cm)',
      value:CGPdistance,
      change:setCGPdistance,
      value1:CGPdistance1,
      typeTextfield:'cgp',
      change1:setCGPdistance1,
      text:''
    },
    {
      key: "provisions.jobExecution.image3",
      title:t('provisions.jobExecution.image3'),
      href:['/CENTRALIZADA/INTERIOR_CGP.png'],
      textfield:false,
      required:false,
      formLocation: 'instalation',
      text:''
    },
    {
      key: "provisions.jobExecution.image4",
      title:t('provisions.jobExecution.image4'),
      href:['/CENTRALIZADA/modulo_CM.png'],
      textfield:false,
      required:true,
      formLocation: 'instalation',
      text: [
        `Por favor, sube una foto de la Columna de Medida (CM) siguiendo estas indicaciones:
        - La Columna de Medida es donde se encuentran los contadores eléctricos.
        - La foto debe mostrar la columna completa, incluyendo todos los contadores, de manera similar a la imagen de ejemplo proporcionada.
        - Asegúrate de que la foto esté bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.image5",
      title:t('provisions.jobExecution.image5'),
      href:['/CENTRALIZADA/IGM.png'],
      textfield:false,
      required:true,
      formLocation: 'instalation',
      text: [
        `Por favor, sube una foto del módulo IGM (Interruptor General de Maniobra) siguiendo estas indicaciones y tomando como referencia la foto del ejemplo:
        - El módulo IGM es común para todos los suministros de la centralización y tiene un interruptor.
        - Asegurate de la foto este iluminada y enfocada para que pueda verse este elemento.`
      ]
    },
    {
      key: "provisions.jobExecution.image6",
      title:t('provisions.jobExecution.image6'),
      href:['/CENTRALIZADA/celda_CC.PNG','/CENTRALIZADA/celda_sum_1_2.png'],
      textfield:false,
      required:true,
      formLocation: 'supply',
      text: [
        `Por favor, sube una fotografía del hueco donde va a ir instalado el contador (o donde ya está instalado) del suministro solicitado siguiendo las siguientes indicaciones y tomando como referencia la foto del ejemplo: 
        - Debe verse el hueco del contador/ contador existente y los cables de entrada al contador.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.image7",
      title:t('provisions.jobExecution.image7'),
      href:[''],
      textfield:false,
      required:true,
      formLocation: 'instalation',
      text: [
        `Por favor sube una fotografía en la que se vea que el suministro solicitado está rotulado. El rotulado debe indicar el destino del suministro. Por ejemplo: "2º B".`
      ]
    },
    {
      key: "provisions.jobExecution.image8",
      title: t('provisions.jobExecution.image8'),
      href:['/CENTRALIZADA/derivación_individual_CC_2.png'],
      textfield:false,
      required:true,
      formLocation: 'supply',
      text: [
        `Por favor, sube una fotografía de la derivación individual correspondiente a tu suministro siguiendo las siguientes indicaciones y tomando como referencia la foto del ejemplo:
        - La foto debe mostrar de cerca la derivación individual que correspondan solo a tu suministro.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.image9",
      title:t('provisions.jobExecution.image9'),
      href:['/CENTRALIZADA/portafusibles_individual_CC_2.png'],
      textfield:false,
      required:true,
      formLocation: 'supply',
      text: [
        `Por favor, sube una fotografía de el/los portafusibles correspondientes a tu suministro siguiendo las siguientes indicaciones y tomando como referencia la foto del ejemplo:
        - La foto debe mostrar de cerca el/los portafusibles que correspondan solo a tu suministro.
        - Si tu solicitud es para un suministro trifásico, deberías tener 3 bases portafusibles con sus fusibles y 1 si es monofásico.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.image10",
      title:t('provisions.jobExecution.image10'),
      href:['/CENTRALIZADA/interruptor_individual_CC.png'],
      textfield:false,
      required:false,
      formLocation: 'supply',
      text: [
        `Por favor, sube una fotografía del interruptor individual correspondiente a tu suministro siguiendo las siguientes indicaciones y tomando como referencia la foto del ejemplo:
        - La foto debe mostrar de cerca el iterruptor individual que correspondan solo a tu suministro.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    
  ]
    

  const NonCentralizedList  = [

    {
      key: "provisions.jobExecution.descImage1",
      title:t('provisions.jobExecution.descImage1'),
      href:['/DESCENTRALIZADA/entorno_1.png'],
      textfield:false,
      formLocation:'instalation',
      type:'descentralized',
      required:true,
      text: [
        `Fotografía de la finca a la que va destinada el suministro. Asegurate de que la foto es tomada a una distancia suficiente para que se vea la finca.`
      ]

    },
    {
      key: "provisions.jobExecution.descImage2",
      title:t('provisions.jobExecution.descImage2'),
      href:['/DESCENTRALIZADA/exterior_CPM_1.png'],
      textfield:true,
      formLocation:'instalation',
      type:'descentralized',
      placeholder:'Distancia mínima de la CPM al suelo (cm)*',
      placeholder1:'Distancia mínima de la CPM a ventanas o puertas (cm)*',
      value:CPMdistance,
      change:setCPMdistance,
      value1:CPMdistance1,
      change1:setCPMdistance1,
      typeTextfield:'cpm',
      required:true,
      text: [
        `Por favor, sube una foto de la Caja de Protección y Medida (CPM) cerrada, siguiendo estas indicaciones y tomando como referencia la foto de ejemplo:
        - La puerta de la CPM debe estar cerrada
        - Asegúrate de que la foto muestre también los elementos cercanos a la CPM, como puertas, ventanas y el suelo.
        - Debes tomar la foto de frente.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage3",
      title:t('provisions.jobExecution.descImage3'),
      href:['/DESCENTRALIZADA/interior_CPM.png','/DESCENTRALIZADA/interior_CPM_2.png'],
      textfield:false,
      formLocation:'instalation',
      type:'descentralized',
      required:true,
      text: [
        `Por favor, sube una foto del interior de la Caja de Protección y Medida (CPM) siguiendo estas indicaciones y tomando como referencia la foto de ejemplo:
         - Se deben ver perfectamente los elementos que se encuentran dentro.
         - La foto debe estar tomada de frente.
         - Procura que la foto tenga buena iluminación y enfoque para que todos los elementos se vean claramente.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage4",
      title: t('provisions.jobExecution.descImage4'),
      href:['/DESCENTRALIZADA/derivacion_indiv_2.png'],
      textfield:false,
      formLocation:'supply',
      type:'descentralized',
      required:true,
      text: [
        `Por favor, sube una foto de la derivación individual de tu instalación siguiendo estas indicaciones y tomando como referencia la foto de ejemplo:
        - La foto debe mostrar de cerca los cables de la derivación individual.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage5",
      title:t('provisions.jobExecution.descImage5'),
      href:['/DESCENTRALIZADA/placa_1.png','/DESCENTRALIZADA/placa_2.png'],
      textfield:false,
      formLocation:'instalation',
      type:'descentralized',
      required:false,
      text: [
        `Por favor, sube una foto de la placa de características de la Caja de Protección y Medida (CPM). Asegúrate de que todos los detalles en la placa sean legibles. Esta placa suele incluir el modelo, la marca y otros detalles técnicos importantes.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage6",
      title:t('provisions.jobExecution.descImage6'),
      href:['/DESCENTRALIZADA/CGP_exterior_1.png'],
      textfield:true,
      formLocation:'instalation',
      type:'CPMCGP',
      placeholder:'Distancia mínima del CGP al suelo (cm)',
      placeholder1:'Distancia mínima del CGP a ventanas o puertas (cm)',
      value:CGPdistance,
      change:setCGPdistance,
      value1:CGPdistance1,
      change1:setCGPdistance1,
      typeTextfield:'cgp',
      required:true,
      text: [
        `Por favor, sube una foto de la Caja General de Protección (CGP) siguiendo estas indicaciones y tomando como referencia la foto de ejemplo:
        - La puerta de la CGP debe estar cerrada
        - Asegúrate de que la foto muestre también los elementos cercanos a la CPM, como puertas, ventanas y el suelo.
        - Debes tomar la foto de frente.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage7",
      title:t('provisions.jobExecution.descImage7'),
      href:['/DESCENTRALIZADA/CGP_interior_1_1.png'],
      textfield:false,
      formLocation:'instalation',
      type:'CPMCGP',
      required:false,
      text: [
        `Solo en caso de poder abrirse la CGP sin dificultad (que no se encuentre en altura) sube una fotografía, del interior de la CGP, en la que se vean perfectamente los elementos que se encuentran dentro, tomando como referencia la foto del ejemplo.`
      ]
    }, 
    {
      key: "provisions.jobExecution.descImage8",
      title:t('provisions.jobExecution.descImage8'),
      href:[],
      textfield:false,
      formLocation:'supply',
      type:'CPM2',
      required:true,
      text: [
        `Como has indicado que tu CPM es de 2 suministros, necesitamos que nos mandes una fotografía del portafusibles correspondiente a tu suministro siguiendo las siguientes indicaciones:
        - La foto debe mostrar de cerca el/ los portafusibles que correspondan solo a tu suministro.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage9",
      title:t('provisions.jobExecution.descImage9'),
      href:[],
      textfield:false,
      formLocation:'supply',
      type:'CPM2',
      required:true,
      text: [
        `Como has indicado que tu CPM es de 2 suministros, necesitamos que nos mandes una fotografía del hueco donde va a ir instalado el contador (o donde ya está instalado) del suministro solicitado siguiendo las siguientes indicaciones: 
        - Debe verse el hueco del contador/ contador existente, los cables de entrada al contador y el rotulado del suministro.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    },
    {
      key: "provisions.jobExecution.descImage10",
      title:t('provisions.jobExecution.descImage10'),
      href:['/DESCENTRALIZADA/interruptor_2sum_CPM_ej1.png'],
      textfield:false,
      formLocation:'supply',
      type:'highPower',
      required:true,
      text: [
        `Como has indicado que tu CPM es de 2 suministros, necesitamos que nos mandes una fotografía del interruptor correspondiente a tu suministro siguiendo las siguientes indicaciones y tomando como referencia la foto del ejemplo:
        - La foto debe mostrar de cerca el interruptor que correspondan solo a tu suministro.
        - La foto debe estar bien iluminada y enfocada.`
      ]
    }
    
  ]

  const imageNameMapping = {
    "provisions.jobExecution.descImage1": "entorno_finca",
    "provisions.jobExecution.descImage2": "exterior_CPM",
    "provisions.jobExecution.descImage3": "interior_CPM",
    "provisions.jobExecution.descImage4": "deriv_indiv_CPM",
    "provisions.jobExecution.descImage5": "placa_caract_CPM",
    "provisions.jobExecution.descImage6": "exterior_CGP",
    "provisions.jobExecution.descImage7": "interior_CGP",
    "provisions.jobExecution.descImage8": "portafusib_CPM",
    "provisions.jobExecution.descImage9": "celda",
    "provisions.jobExecution.descImage10": "interruptor_CPM",


    "provisions.jobExecution.image1": "entorno_finca",
    "provisions.jobExecution.image2": "exterior_CGP",
    "provisions.jobExecution.image3": "interior_CGP",
    "provisions.jobExecution.image4": "moduloCM_CC",
    "provisions.jobExecution.image5": "moduloIGM_CC",
    "provisions.jobExecution.image6": "celda",
    "provisions.jobExecution.image7": "rotulado_CC",
    "provisions.jobExecution.image8": "deriv_indiv_CC",
    "provisions.jobExecution.image9": "portafusib_CC",
    "provisions.jobExecution.image10": "interruptor_CC",

  };
  
  // const getImageName = (title, originalName) => {
  //   // Verificamos si el título tiene un mapeo válido
  //   const baseName = imageNameMapping[title] ? imageNameMapping[title] : title.replace(/ /g, '_').toLowerCase();
  //   const extension = originalName.split(".").pop(); 
  //   return `${baseName}.${extension}`;
  // };

  const getImageName = (key, originalName) => {
    const baseName = imageNameMapping[key] || "imagen_desconocida";
    const extension = originalName.split(".").pop(); 
    return `${baseName}.${extension}`;
  };
  
  
  
  


  const groupByFormLocation = (list) => {
    return list.reduce((acc, item) => {
      acc[item.formLocation] = acc[item.formLocation] || [];
      acc[item.formLocation].push(item);
      return acc;
    }, {});
  };

  const handleInput = (e) => {
    setObservations(e.target.value)
    setCharacters(300 - e.target.value.length)
  }

  const countRequiredTrue = (data) => {
    let count = 0;
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach(item => {
                if (item.required === true) {
                    count++;
                }
            });
        }
    }
    return count;
  }


  useEffect(() => {
    if (radioButtonCentralizacion !== null) {
      const listToGroup = radioButtonCentralizacion === 0 ? NonCentralizedList : centralizedList;
      const groupedList = groupByFormLocation(listToGroup);
      setAuxList(groupedList);
    }
  }, [radioButtonCentralizacion]);

  useEffect(() => {
    
    if (searchIndex(images,requiredIndexs)) {
      setPhotosReady(true)
    } else {
      setPhotosReady(false)
    }
    
  }, [auxList,radioButtonCentralizacion,power,onlyCPMorBoth,numberSupplies,totalRequired,images,requiredIndexs])

  function searchIndex(objeto, requiredIndexs) {
    // Obtener las propiedades del objeto
   
    let propiedadesObjeto = Object.keys(objeto).map(key => parseInt(key, 10) + 1);
    
    return requiredIndexs.every(index => propiedadesObjeto.includes(index));
}

  useEffect(() => {
      if (photosReady && correctPhotographies && noPerson) {
        
        if (
          (onlyCPMorBoth === '' && CGPdistance != null && CGPdistance1 != null) || 
          (onlyCPMorBoth === t('onlyCPM') && CPMdistance != null && CPMdistance1 != null) ||
          (onlyCPMorBoth === t('CPMCGP') && 
            CPMdistance != null  && 
            CPMdistance1 != null && 
            CGPdistance != null && 
            CGPdistance1 != null
          )
        ) {
          setAllowSendButton(true);
        } else {
          setAllowSendButton(false)
        }
        
      
    } else {
      setAllowSendButton(false)
    }
  }, [photosReady,correctPhotographies,noPerson,onlyCPMorBoth,CPMdistance,CPMdistance1,CGPdistance,CGPdistance1])
  
  
  const handleNext = () =>{
    setShowDialogDraft(true)
    setOnlyRead(true)
  }

  return (
    <>

        {showPopupInvalidExtension &&
          <DialogInvalidExtension
            showingDialog={showPopupInvalidExtension}
            setShowingDialog={setShowPopupInvalidExtension}
            extensions={'JPG, PNG, GIF'}
          />
        }

        {showPopupInvalidSize &&
          <DialogInvalidSize
            showingDialog={showPopupInvalidSize}
            setShowingDialog={setShowPopupInvalidSize}
            stringMaxUploadFileSize={stringMaxUploadFileSize}
          />
        }

        <Modales isOpne={isOpen} toggle={toggle}>
          <img src={closeIcon} className={classes.closeButton} alt='close' onClick={toggle} />
          <img src={alertIcon}/>
          <div className={classes.modalTitle}>
            {t(ModalMessage)}
          </div>
          <div className={classes.modalBody}>
            {t(ModalSecondMessage)}
          </div>
          <Grid item>
            <Grid container justifyContent='center'>
              <Button
                className={classes.acceptBtn}
                text={t('errors.date.button.accept')}
                color='primary'
                size='large'
                variant='contained'
                onClick={() => {handleAddClick(selectedKey)}}
              />
            </Grid>
          </Grid>
        </Modales>

      <Grid container justifyContent='center' alignItems='center' style={{padding:'10px 2px 10px 0'}}>
        
        <Grid md={12} item>
          <ExpansionPanel expanded={expandSubPanels === 'panel2'} onChange={handleChangeSubpanel('panel2')} disabled={disabledPanel2}>
              <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                <img className={classes.expansionPanelSummaryIcon} src={number2} alt='' />
                <Typography className={classes.expansionPanelSummaryText}>{t('provisions.jobExecution.photoFormTitle')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>

                  <Grid container item xs={12} md={12} className={classes.warnBox}>
                        <Grid item xs={12} style={{textAlign:'center'}}>
                          <img src={rayIcon} width={'29px'}/>
                        </Grid>
                        <Grid item  xs={12}>
                          <Typography className={classes.warnTitle}>{t('provisions.jobExecution.warning4')}</Typography>  
                        </Grid>
                        <Grid item  xs={12}>
                          <Typography className={classes.warnText}>{t('provisions.jobExecution.warning5')}</Typography>  
                        </Grid>
                    </Grid>

                  <Typography align='left'  className={classes.greyColor} variant='subtitle1'>{t('provisions.jobExecution.photoProcess1')}</Typography>
                   <Typography align='left'  className={classes.greyColor} variant='subtitle1'>{t('provisions.jobExecution.photoProcess21')}<b>{t('provisions.jobExecution.photoProcess22')}</b>{t('provisions.jobExecution.photoProcess23')}</Typography>
                   <Typography align='left' className={classes.greyColor} variant='subtitle1'>{t('provisions.jobExecution.formats')}</Typography>
  

                   <Grid md={12}>
                      <Divider variant='middle' className={classes.dashedDivider} />
                    </Grid>

                  {
                    radioButtonCentralizacion !== null  && (
                      <>

                        {Object.keys(auxList).map(location => (
                          <ExpansionPanelv2 key={location} defaultExpanded={true}>
                            <ExpansionPanelSummaryv2 expandIcon={<StyledExpandMoreIcon />}>
                            <Grid container direction='column'>
                              <Grid item>
                                  <Typography className={classes.expansionPanelSummaryText}>
                                      {location === 'instalation' ? 'Fotografías de la instalación' : 'Fotografías del suministro'}
                                  </Typography>
                              </Grid>
                              {location === 'supply' &&
                                  <Grid item>
                                      <Typography className={classes.expansionPanelSummaryText}>
                                          {selectedTipoSuministro && capitalizeWords(selectedTipoSuministro) + '. '}
                                          {showing === 'desplegable' && uso && capitalizeWords(uso)}
                                          {/* {showing === 'descripción' && description && capitalizeWords(description)} */}
                                          {showing === 'ESPIMA' && stairs && floor && door && `Esc: ${stairs}, Plta: ${floor}, Pta: ${door}`}
                                      </Typography>
                                  </Grid>
                              }
                            </Grid>
                            </ExpansionPanelSummaryv2>
                          <ExpansionPanelDetailsv2>
                              {auxList[location].map((doc, index) => {
                               
                              if (onlyCPMorBoth === t('onlyCPM') && doc.type === 'CPMCGP') {return;}
                              if (numberSupplies === 0 && doc.type === 'CPM2') {return;}
                              if (power <= 15 && doc.type === 'highPower') {return;}

                              const currentIndex = globalIndex;
                              globalIndex++; 

                              if (doc && doc.required) {totalRequired++; requiredIndexs.push(globalIndex)}

                              return <React.Fragment key={currentIndex}>
                                      

                                      <Grid container xs={12} className={classes.docContainer} spacing={2}>
                                        <Grid item xs={1} className={classes.noDisplay}>
                                          <img src={TickIcon} alt='' />
                                        </Grid>
                                        <Grid className={`${classes.Phototext} ${classes.alignPaddingItemContainer}`} xs={12} md={5}>
                                          <Grid>
                                            {doc.title}
                                          </Grid>
                                          <Grid style={{paddingTop: '5px'}}>
                                            {
                                              (images && checkTitleExists(doc.title)) ?
                                              <>
                                                <Grid container className={classes.uploadRound} direction='row' spacing={1}>
                                                  <Grid item xs={9} style={{padding: '0px 4px'}}>
                                                  {/* {images[currentIndex].name} */}
                                                    {getImageName(doc.key, images[currentIndex]?.name)}
                                                    

                                                  </Grid>
                                                  {
                                                    (!onlyRead)  &&
                                                      <Grid item xs={3} style={{padding: '0px 0px 0px 12px'}}>
                                                        <img src={DeleteIcon} width={'26px'}  onClick={() => {handleDelete(currentIndex)}}  style={{cursor:'pointer',position:'relative',top:'2px'}}/>
                                                      </Grid>
                                                  }
                                                  
                                                </Grid>
                                              </>
                                              :
                                              <a className={classes.link} style={{cursor:'pointer'}} onClick={() => {setTitle(doc.title); setText(doc.text); setImage(doc.href); setShowDialog(true)}}>{t('provisions.jobExecution.seeExample')}</a>
                                            }
                                          </Grid>
                                        </Grid>
                                        
                                        <Grid className={classes.alignPaddingItemContainer} style={!doc.textfield ? { display: 'none' } : {}}>
                                          {/* <Input
                                            fullWidth
                                            placeholder={doc.placeholder}
                                            value={doc.value}
                                            onChange={(e) => handleInputChange(index, e)}
                                          /> */}
                                        </Grid>
                                        <Grid>
                                          <InputBase
                                              type='file'
                                              style={{ display: 'none' }}
                                              inputRef={el => fileInputs.current[currentIndex] = el}
                                              onChange={(e) => handleFileChange(e, currentIndex,doc.title)}
                                          />
                                        </Grid>
                                        {
                                          (!onlyRead) &&
                                            <Grid className={`${classes.alignPaddingItemContainer} ${classes.imageContainer}`} xs={12} md={5} onClick={() => {(!checkTitleExists(doc.title)) &&  handleAddClick(currentIndex)}}>
                                              {(!checkTitleExists(doc.title)) || onlyRead ?
                                                 <img src={addImage}  alt='' />
                                                 :
                                                 <img src={addImageDisabled} alt='' />
                                              }
                                             
                                              {/* <img src={AddIcon} className={`${classes.ico2}`} alt='' /> */}
                                              {/* <span className={`${classes.iconText}`} style={(images && checkTitleExists(doc.title) ? {color:'#aeb5bc'} : {color:'#0c69c6'})}>{t('Añadir fotografía')}</span> */}
                                           </Grid>
                                        }
                                        <Grid container xs={12} md={11} style={(!doc.textfield ? { visibility: 'hidden',display:'none' } : {margin:'0 auto',alignItems:'end', display: 'block'})} spacing={3}>
                                          <Grid container md={6} className={classes.alignPaddingItemContainer}>
                                          <Typography align='left' className={classes.subtitle} variant='subtitle2' style={{lineHeight: 1, paddingBottom: 10}}>{doc.placeholder}</Typography>
                                            {
                                                (onlyRead && doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cpm') ? 
                                                <Grid xs={12}>
                                                  {CPMdistance}
                                                </Grid>  
                                              :
                                              (doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cpm') &&
                                                <UbiInput 
                                                  value={CPMdistance}
                                                  setValue={setCPMdistance}
                                                />
                                            }

                                            { 
                                              (onlyRead && doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cgp') ? 
                                              <Grid xs={12}>
                                                {CGPdistance}
                                              </Grid>  
                                              :
                                              (doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cgp') &&
                                                <UbiInput 
                                                  value={CGPdistance}
                                                  setValue={setCGPdistance}
                                                />
                                            }
                                            
                                            {/* <Input
                                              fullWidth
                                              placeholder={doc.placeholder}
                                              value={doc.value}
                                              onChange={(e) => handleInputChange(index, e)}
                                            /> */}
                                          </Grid>
                                          <Grid container md={6} className={classes.alignPaddingItemContainer}>
                                          <Typography align='left' className={classes.subtitle} variant='subtitle2' style={{lineHeight: 1, paddingBottom: 10}}>{doc.placeholder1}</Typography>
                                            {
                                              (onlyRead && doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cpm') ? 
                                                <Grid xs={12}>
                                                  {CPMdistance1}
                                                </Grid>  
                                              :
                                                (doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cpm') &&
                                                  <UbiInput 
                                                    value={CPMdistance1}
                                                    setValue={setCPMdistance1}
                                                  />
                                            }

                                              {
                                                  (onlyRead && doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cgp') ? 
                                                  <Grid xs={12}>
                                                    {CGPdistance1}
                                                  </Grid>  
                                                :
                                                (doc.textfield && doc.typeTextfield && doc.typeTextfield === 'cgp') &&
                                                  <UbiInput 
                                                    value={CGPdistance1}
                                                    setValue={setCGPdistance1}
                                                  />
                                              }
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid md={12}>
                                        <Divider variant='middle' className={classes.dashedDivider} />
                                      </Grid>
                                    </React.Fragment>
                            })}
                            

                          </ExpansionPanelDetailsv2>
                        </ExpansionPanelv2>
                      ))}
                        
                      </>
                  )}


                {
                  (onlyRead) ?
                  <>
                      <Grid xs={12} className={classes.resumeFormSubtitle} style={{textAlign:'left'}}>
                      {t('provisions.jobExecution.observations')}
                      </Grid>
                      <Grid xs={12} style={{textAlign:'left'}}>
                        {observations}
                      </Grid>
                    </>
                  :
                  <Grid item xs={12} md={12} className={classes.input} style={{textAlign:'left'}}>
                    <Typography align='left' className={classes.titleBold}>
                      {t('Observaciones')}
                    </Typography>
                    <Typography align='left' className={classes.subtitle} variant='subtitle2'>{t('provisions.jobExecution.addComment')+':'}
                    </Typography>
                    <Input
                      fullWidth
                      multiline
                      rows='5'
                      value={observations}
                      onChange={handleInput}
                      inputProps={{
                        maxlength: '300'
                      }}
                    />
                    <Grid item className={classes.characterCount} style={{float:'right'}}>
                      {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part1')}

                      {characters}

                      {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.textArea.characters.part2')}
                    </Grid>
                  </Grid>
                }
                  

                  <Grid  container item spacing={1} xs={12} md={12} className={classes.input} style={{marginTop:'35px'}} >
                    <Grid item  xs={2} md={1} style={{textAlign:'center', maxWidth:'35px'}}>
                      <Checkbox
                          style={{
                              color: '#004571',
                          }}
                          checked={correctPhotographies}
                          onClick={(e) => (setCorrectPhotographies(!correctPhotographies))}
                          disabled={onlyRead}
                      />
                    </Grid>
                    <Grid item xs={9} md={10} style={{paddingLeft:'10px'}}>
                      <Typography align='left' style={{color:'#004571'}}  variant='subtitle2'>
                        {t('provisions.jobExecution.checkInstalations')}
                        <span style={{fontWeight: 'bold'}}> {t('provisions.jobExecution.checkInstalations1')}</span>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} item xs={12} md={12} className={classes.input} style={{marginTop:'35px'}}>
                    <Grid item xs={2} md={1} style={{textAlign:'center', maxWidth:'35px'}}>
                      <Checkbox
                          style={{
                              color: '#004571',
                          }}
                          checked={noPerson}
                          onClick={(e) => (setNoPerson(!noPerson))}
                          disabled={onlyRead}
                      />
                    </Grid>  
                    <Grid item xs={9} md={10} style={{paddingLeft:'10px'}}>
                      <Typography align='left' style={{color:'#004571'}} variant='subtitle2'>
                        {t('provisions.jobExecution.noPerson')}
                        <span style={{fontWeight: 'bold'}}> {t('provisions.jobExecution.noPerson1')} </span>
                        {t('provisions.jobExecution.noPerson2')}
                      </Typography>
                    </Grid>      
                  </Grid>

                  {/* <Grid container item xs={12} md={12} className={classes.errorBox}>
                      <Grid item xs={12} style={{textAlign:'center'}}>
                        <img src={ErrorIcon} width={'70px'} />
                      </Grid>
                      <Grid item  xs={12}>
                         <Typography className={classes.errorTitle}>{t('No se ha podido enviar los datos debido a un error del sistema')}</Typography>  
                      </Grid>
                      <Grid item  xs={12}>
                         <Typography className={classes.errorSubtitle}>{t('Por favor, inténtalo más tarde.')}</Typography>  
                      </Grid>
                      <Grid item  xs={12}>
                      <Typography align='center'>{t(`Si el problema persiste, `)} <a className={classes.link}>{t(`ponte en contacto `)}</a> {t('con nosotros')}</Typography>
                      </Grid>
                  </Grid> */}

                  {errorUpload &&
                    <Grid container item xs={12} md={12} className={classes.errorBoxSupplies}>
                      <Grid item xs={12} style={{textAlign:'center'}}>
                        <img src={ErrorIcon} width={'40px'} />
                      </Grid>
                      <Grid item  xs={12}>
                        <Typography className={classes.errorTitle}>{t('provisions.jobExecution.isTr9.errorSaveDraft2')}</Typography>  
                      </Grid>
                      <Grid item  xs={12}>
                        <Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.errorSubtitle')}</Typography>  
                      </Grid>
                      <Grid item  xs={12}>
                        <Typography  className={classes.errorSubtitle}>{t('provisions.jobExecution.errorText1')} <a className={classes.link} href='https://www.ufd.es/atencion-al-cliente/' target='_blank'>{t('provisions.jobExecution.errorText2')}</a></Typography>
                      </Grid>
                    </Grid>
                  }

                  <Grid item md={12} className={classes.paddingLeftTop} style={{marginTop:'35px'}}>
                    <Typography align='center'  variant='subtitle2'>{t('provisions.jobExecution.required')}</Typography>  
                  </Grid>

                  {
                      (showButtons) &&
                        <Grid container md={12} direction='row' justifyContent='center' spacing={3} className={classes.paddingLeftTop}>
                          <Grid item>

                          {
                              (onlyRead) ?
                                  <Button
                                    className={classes.cancelButton}
                                    text={errorUpload ? t('common.buttons.cancel') : t('Volver')}
                                    color='inherit'
                                    size='large'
                                    variant='contained'
                                    onClick={() => {
                                      setOnlyRead(false)
                                      setErrorUpload(false)
                                    }}
                                  />
                              :
                                <Button
                                  className={classes.cancelButton}
                                  text={t('common.buttons.cancel')}
                                  color='inherit'
                                  size='large'
                                  variant='contained'
                                  onClick={() => {setShowingCancelDialog(true)}}
                                />
                            }

                            
                          </Grid>
                          <Grid item>
                            {
                              (onlyRead) ?
                                <Button
                                  className={classes.acceptBtn}
                                  text={errorUpload ? t('common.buttons.send') : t('Confirmar')}
                                  color='primary'
                                  size='large'
                                  variant='contained'
                                  onClick={sendAllFiles}
                                  disabled={!allowSendButton}
                                />
                              :
                                <Button
                                  className={classes.acceptBtn}
                                  text={t('provisions.jobExecution.next')}
                                  color='primary'
                                  size='large'
                                  variant='contained'
                                  onClick={() => { handleNext() }}
                                  disabled={!allowSendButton}
                                />
                            }
                          </Grid>
                        </Grid>
                  
                  }
                    

                </Grid>
              </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </>
  );
}

export default UploadPhotography
