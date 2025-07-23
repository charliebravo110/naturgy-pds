
import React, { useEffect, useRef, useState } from 'react';
import TechnicalData from './TechnicalData';
import UploadPhotography from './UploadPhotography';
import { Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import XLSX from 'xlsx';
import { isMobileApp } from '../../../../mobile-apps/common/detectPlatform';
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchFormData, thunkGetMasterData, thunkSaveFormData, thunkStartTask, thunkUpdateDossier, thunkUpdateDossierViaSahrepoint } from '../../../store/actions/ProvisionsThunkActions';
import { setCurrentProvision } from '../../../store/actions/ProvisionsActions';
import JSZip from 'jszip';
import Spinner from '../../../../common/components/spinner/Spinner';
import InitialForms from './InitialForms';
import useStyles from '../JobExecution.styles';
import DialogImages from './imagesDialog/DialogImages';
import DeleteAdvert from './DeleteAdvert/DeleteAdvert';
import ErrorIcon from '../../../../assets/icons/misdocumentos_rechazado.svg'
import okIcon from '../../../../assets/icons/ico_ok.svg';
import SaveDraftDialog from './saveDraftDialog/saveDraftDialog';
import ConfirmSupplyDialog from './confirmSupply/confirmSupplyDialog';
import { thunkGetListMunicipalities, thunkGetListProvinces } from '../../../../gestionAverias/actions/GestionAveriasThunkActions';
import { adminCheck } from '../../../../common/lib/ValidationLib';
import { thunkGetMasterDataOnlyMaster } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions';


const Forms = (props) => {

  const {
    setShowTr9form,
    showError,
    handleSendSelfJobsEndDate,
    handleSendExp,
    tr9callOK,
    setTr9callOK,
    tr9callKO,
    isTr9Confirm,
    setTr9callKO,
    selfJobsEndDate,
    setInPersonVisit,
    setIsValidPersonVisit,
    errorForm,
    setErrorForm
  } = props

  const { t } = useTranslation()
  const classes = useStyles({})

  const [form1Ok, setForm1Ok] = useState(false)
  const [expandSubPanels, setexpandSubPanels] = useState('')
  const [saveDraftBtn, setSaveDraftBtn] = useState(false)
  const [errorSaveDraftBtn, setErrorSaveDraftBtn] = useState(false)
  const [isActiveSaveDraftBtn, setIsActiveSaveDraftBtn] = useState(false)
  const [isPersonVisitDate, setPersonVisitDate] = useState('')

  interface ImageData {
    name: string;
    type: string;
    base64: string;
    title: string;
  }

  const dispatch = useDispatch()

  const provisions = useSelector((state: any) => state.provisions);
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const tPower = currentProvision?.techData?.totalPower || '';
  const user = useSelector((state: any) => state.user.profile)


  const [selectedTipoFinca, setSelectedTipoFinca] = useState('')
  const [selectedTipoLocal, setSelectedTipoLocal] = useState('')
  const [selectedTipoSuministro, setSelectedTipoSuministro] = useState('')
  const [stairs, setStairs] = useState('')
  const [floor, setFloor] = useState('')
  const [door, setDoor] = useState('')
  const [selectedUbicacion, setSelectedUbicacion] = useState('')
  const [selectedMarca, setSelectedMarca] = useState('')
  const [centralizacion, setCentralizacion] = useState(null)
  const [radioButton0, setRadioButton0] = useState(null)
  const [radioButton1, setRadioButton1] = useState(null)
  const [radioButton2, setRadioButton2] = useState(null)
  const [radioButton3, setRadioButton3] = useState(null)
  const [radioButton4, setRadioButton4] = useState(null)
  const [radioButton5, setRadioButton5] = useState(null)
  const [radioButtonKey, setRadioButtonKey] = useState(null)
  const [radioButtonCentralizacion, setRadioButtonCentralizacion] = useState(null)
  const [onlyCPMorBoth, setOnlyCPMorBoth] = useState('')
  const [CupsObra, setCupsObra] = useState('')
  const [UbicacionNumber, setUbicacionNumber] = useState(10);
  const [key, setKey] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [selectedDerivacionInd, setSelectedDerivacionInd] = useState('')
  const [characters, setCharacters] = useState(300)
  const [disabledButton, setDisabledButton] = useState(true)
  const [cupsValidity, setcupsValidity] = useState(false)
  const [error, seterror] = useState(false)
  const [images, setImages] = useState<{ [key: string]: ImageData }>({});
  const [showForms, setShowForms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledPanel1, setDisabledPanel1] = useState(true)
  const [disabledPanel2, setDisabledPanel2] = useState(true)
  const [CGPdistance, setCGPdistance] = useState(null)
  const [CPMdistance, setCPMdistance] = useState(null)
  const [CGPdistance1, setCGPdistance1] = useState(null)
  const [CPMdistance1, setCPMdistance1] = useState(null)
  const [power, setpower] = useState(tPower)
  const [observations, setObservations] = useState('')
  const [observations2, setObservations2] = useState('')
  const [correctPhotographies, setCorrectPhotographies] = useState(false)
  const [noPerson, setNoPerson] = useState(false)
  const [province, setProvince] = useState('')
  const [town, setTown] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [addressType, setAddressType] = useState('')
  const [address, setAddress] = useState('')
  const [addressNumber, setAddressNumber] = useState('')
  const [duplicator, setDuplicator] = useState('')
  const [description, setDescription] = useState('')
  const [uso, setUso] = useState('')
  const [showing, setShowing] = useState('')
  const [noErrorForm1, setNoErrorForm1] = useState(false)
  const [onlyRead, setOnlyRead] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showDialogDraft, setShowDialogDraft] = useState(false)
  const [showDialogSupply, setShowDialogSupply] = useState(false)
  const [Text, setText] = useState([])
  const [Image, setImage] = useState([])
  const [Title, setTitle] = useState('')
  const [resetKey, setResetKey] = useState(0);
  const [showingCancelDialog, setShowingCancelDialog] = useState(false)
  const [proccessOkMessage, setProccessOkMessage] = useState(false)
  const [genericWaitMessage, setGenericWaitMessage] = useState(false)
  const [errorUpload, setErrorUpload] = useState(false)
  const [errorSupply, setErrorSupply] = useState(false)
  const [okSupply, setOkSupply] = useState(false)
  const [correctUploaded1, setCorrectUploaded1] = useState(false)
  const [correctUploaded2, setCorrectUploaded2] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const [requestType, setRequestType] = useState('');
  const [totalPower, setTotalPower] = useState('');
  const [isAddressButtonEnabled, setIsAddressButtonEnabled] = useState(false);
  const [isDefAddressDeclared, setIsDefAddressDeclared] = useState(false);
  const abortUpdate = useRef(false);
  const [sentToSharepoint, setSentToSharepoint] = useState('');
  const [streetGasCode, setStreetGasCode] = useState('');
  const [gasCode, setGasCode] = useState('');
  const [cgvCode, setCgvCode] = useState('');
  const [errorDirection, setErrorDirection] = useState(false);
  const [totalSupplies, setTotalSupplies] = useState(0);
  const [isAddressSave, setIsAddressSave] = useState(false);
  const [addressExists, setAddressExists] = useState('');  
  const [idStreetSelect, setIdStreetSelect] = useState('')
  const [validAddressManual, setValidAddressManual] = useState(false)

  const [comunicateResolutionDateZeus, setComunicateResolutionDateZeus] = useState('');
  const [errorSharepoint, setErrorSharepoint] = useState(false)
  const [errorIGEA, setErrorIGEA] = useState(false)

  const [busZeusAttempts, setBusZeusAttempts] = useState(1);

  const [showDraftContainer, setShowDraftContainer] = useState(false);
  const [recoveredDraft, setRecoveredDraft] = useState('' as any)
  const [recoverDraft, setRecoverDraft] = useState(false)
  const [isContinueDraft, setIsContinueDraft] = useState(false)
  const [isContinueVerification, setIsContinueVerification] = useState(false)
 
  const attempts = currentProvision.anomalyList.length
  const expedientType = 'TR9'
  const userDoc = currentProvision.applicant.docNumber
  const openingDate = currentProvision.registerDate


  //Guardado de datos recuperados del borrador
  useEffect(() => {
    if (recoverDraft && recoveredDraft !== '') {
      recoveredDraft.accessKey && setAccessKey(recoveredDraft.accessKey)
      recoveredDraft.address && setAddress(recoveredDraft.address)
      recoveredDraft.addressNumber && setAddressNumber(recoveredDraft.addressNumber)
      recoveredDraft.addressType && setAddressType(recoveredDraft.addressType)
      recoveredDraft.codePostal && setCodePostal(recoveredDraft.codePostal)
      recoveredDraft.description && setDescription(recoveredDraft.description)
      recoveredDraft.door && setDoor(recoveredDraft.door)
      recoveredDraft.floor && setFloor(recoveredDraft.floor)
      recoveredDraft.observations && setObservations(recoveredDraft.observations)
      recoveredDraft.onlyCPMorBoth && setOnlyCPMorBoth(recoveredDraft.onlyCPMorBoth)
      recoveredDraft.power && setpower(Number(recoveredDraft.power))
      recoveredDraft.province && setProvince(recoveredDraft.province)
      recoveredDraft.radioButton0 && setRadioButton0(Number(recoveredDraft.radioButton0))
      recoveredDraft.radioButton1 && setRadioButton1(Number(recoveredDraft.radioButton1))
      recoveredDraft.radioButton2 && setRadioButton2(Number(recoveredDraft.radioButton2))
      recoveredDraft.radioButton3 && setRadioButton3(Number(recoveredDraft.radioButton3))
      recoveredDraft.radioButton4 && setRadioButton4(Number(recoveredDraft.radioButton4))
      recoveredDraft.radioButtonCentralizacion && setRadioButtonCentralizacion(Number(recoveredDraft.radioButtonCentralizacion))
      recoveredDraft.radioButtonKey && setRadioButtonKey(Number(recoveredDraft.radioButtonKey))
      recoveredDraft.selectedTipoLocal && setSelectedTipoLocal(recoveredDraft.selectedTipoLocal)
      recoveredDraft.selectedTipoSuministro && setSelectedTipoSuministro(recoveredDraft.selectedTipoSuministro)
      recoveredDraft.selectedUbicacion && setSelectedUbicacion(recoveredDraft.selectedUbicacion)
      recoveredDraft.stairs && setStairs(recoveredDraft.stairs)
      recoveredDraft.town && setTown(recoveredDraft.town)
      recoveredDraft.uso && setUso(recoveredDraft.uso)
      recoveredDraft.gas_code && setGasCode(recoveredDraft.gas_code)
      recoveredDraft.street_gas && setStreetGasCode(recoveredDraft.street_gas)
      recoveredDraft.idStreet && setIdStreetSelect(recoveredDraft.idStreet)
      setRecoverDraft(false)
    }
    
  },[recoveredDraft, recoverDraft])

  const updateZeusDate = () => {
    let dateZEUS = new Date()
    let year = dateZEUS.getFullYear();
    let month = (dateZEUS.getMonth() + 1).toString().padStart(2, '0');
    let day = dateZEUS.getDate().toString().padStart(2, '0');
    let hours = dateZEUS.getHours().toString().padStart(2, '0');
    let minutes = dateZEUS.getMinutes().toString().padStart(2, '0');
    let seconds = dateZEUS.getSeconds().toString().padStart(2, '0');

    setComunicateResolutionDateZeus(day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds)
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds
  }
  
  useEffect(() => {

    dispatch(thunkGetMasterData(
      'TAIS',
      'ES',
      'ENVIO_DOCUMENTACION',
      (response) => {
        if (response && response.length > 0) {
          setSentToSharepoint(response[0].value)
        }
      }
    ))

  }, [])

  const resetRecoveredDraft = () => {
    setRecoveredDraft('')
  }

  const sendAllFiles = async () => {
    //obtenemos parametros de master data para apuntar a sharepoint o documentum
    setIsLoading(true)
    setErrorUpload(false)

    setBusZeusAttempts(prevBusZeusAttempts => prevBusZeusAttempts + 1)    
    //sharepoint, zeus, igea, atom

    if(!validAddressManual) {
      //envio primer formulario de datos
      await generateExcel()
      if (abortUpdate.current) {
        abortUpdate.current = false;
        return;
      }
      //envio segundo formulario de fotografias
      await handleGenerate()
      if (abortUpdate.current) {
        abortUpdate.current = false;
        return;
      }
    }

    if(!errorSharepoint){
      let error = validAddressManual ? false : await startTask()
    
      if(!error) {
        //se modifica la fechaFinTrabajosPropios del expiente en ZEUS
        let dateNow = updateZeusDate()
        handleSendSelfJobsEndDate(dateNow, errorDirection)
        let response = handleSendExp(openingDate, dateNow, attempts, userDoc, expedientType, busZeusAttempts, tr9callOK, errorDirection )
        if(!response && !response.codResult && response.codResult !== '0000') { 
          if(totalSupplies > 1) {
            setErrorForm(true)
          } else {
            setErrorUpload(true)
            setShowButtons(true)
          }
        }
      }
    }

    setIsLoading(false)
    setOnlyRead(true)

  }

  const handleCancel = () => {
    setResetKey(prevKey => prevKey + 1);
    setOnlyRead(false)
    setShowDialog(false);
    setText([]);
    setImage([]);
    setTitle('');
    setForm1Ok(false);
    setSelectedTipoLocal('');
    setSelectedTipoSuministro('');
    setStairs('');
    setFloor('');
    setDoor('');
    setSelectedUbicacion('');
    setRadioButtonCentralizacion(null);
    setRadioButton0(null);
    setRadioButton1(null);
    setRadioButton2(null);
    setRadioButton3(null);
    setRadioButton4(null);
    setRadioButtonKey(null);
    setOnlyCPMorBoth('');
    setAccessKey('');
    setCharacters(300);
    setDisabledButton(false);
    setpower(undefined);
    setProvince('');
    setTown('');
    setCodePostal('');
    setAddressType('');
    setAddress('');
    setAddressNumber('');
    setDescription('');
    setUso('');
    setShowing('');
    setNoErrorForm1(false);
    setObservations('');
    setObservations2('');
    setCGPdistance(null);
    setCPMdistance(null);
    setCGPdistance1(null);
    setCPMdistance1(null);
    setCorrectPhotographies(false);
    setNoPerson(false);
    setImages({});
    setDisabledPanel1(true)
    setDisabledPanel2(true)
    setexpandSubPanels('')
    setShowForms(false)
  };

  const getDossierSubtype = () => {
    if (provisions && provisions.supplyTypes && provisions.supplySubtypes && provisions.selectedSupplySubtype) {
      if (provisions.selectedSupplySubtype === '') {
        return provisions.supplyTypes && provisions.supplyTypes.length > 0 && provisions.supplyTypes.filter(item => item.split('|')[0] === provisions.selectedSupplyType)[0].split('|')[1]
      } else {
        return provisions.supplySubtypes && provisions.supplySubtypes.length > 0 && provisions.supplySubtypes.filter(item => item.split('|')[0] === provisions.selectedSupplySubtype)[0].split('|')[1]
      }
    }
  }

  const handleChangeSubpanel = (panel) => (event, isExpanded) => {
    setexpandSubPanels(isExpanded ? panel : false)
  }

  //Guardar borrador
  const handleSaveDraft = async () => {
    setIsLoading(true);
  


    const formData = {
      expediente: currentProvision.dossierCod,
      province,
      town,
      codePostal,
      addressType,
      address,
      addressNumber,
      radioButton0,
      radioButton1,
      radioButton2,
      radioButton3,
      radioButton4,
      radioButtonCentralizacion,
      selectedUbicacion,
      radioButtonKey,
      accessKey,
      selectedTipoLocal,
      selectedTipoSuministro,
      stairs,
      floor,
      door,
      description,
      uso,
      onlyCPMorBoth,
      observations,
      observations2,
      CPMdistance,
      CPMdistance1,
      CGPdistance,
      CGPdistance1,
      power,
      gas_code: gasCode,
      street_gas: streetGasCode,
      idStreet: idStreetSelect
    };

    try {
      await dispatch(thunkSaveFormData(formData));
      setSaveDraftBtn(true);  // Muestra mensaje de éxito
      setErrorSaveDraftBtn(false);
      setIsActiveSaveDraftBtn(true);
    } catch (error) {
      setErrorSaveDraftBtn(true);  // Mostrar mensaje de error
      setSaveDraftBtn(false);
      setIsActiveSaveDraftBtn(true);
    } finally {
      setIsLoading(false);
    }
  };

  /*useEffect(() => {
    const provisionId = currentProvision?.id;  // Asegúrate de tener el ID disponible
    if (provisionId) {
      dispatch(thunkFetchFormData(provisionId, (response) => {
        
      }));
    }
  }, [dispatch, currentProvision?.id]);*/

  const handleSubmit = () => {
    setDisabledPanel2(false)
    setexpandSubPanels('panel2')
    setForm1Ok(true)
  }

  const handleSubmitSupply = async () => {
    setIsLoading(true);

    let dateNow = updateZeusDate();

    const date = dateNow
		const [datePart, timePart] = date.split(' ');
		const [day, month, year] = datePart.split('/');
		const timeFormatted = timePart.replace(/:/g, '');
		const selfJobsEndDate = `${year}${month}${day}${timeFormatted}`

    const continueDossier = await updateDossierOk(selfJobsEndDate)

    if(continueDossier[0]){
      const continueSendExp = await handleSendExp(openingDate, dateNow, attempts, userDoc, expedientType, busZeusAttempts, continueDossier[1], errorDirection )
      if(continueSendExp) setIsLoading(false)
    }  
  }

  const updateDossierOk = async (selfJobsEndDate) => {
    const dossierCod = currentProvision.dossierCod
    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      fechaFinTrabajosPropios: selfJobsEndDate,
      tr9AdminResult: '3'
    }

    let continueCall = [false, false]
    await dispatch(thunkUpdateDossier(dossierCod, false, data, (response) => {
      if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
        setOkSupply(true)
        continueCall = [true, true]
      } else {
        setErrorForm(true)
        continueCall = [true, false]
      }
    }))

    return continueCall;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  const generateExcel = async () => {

    const fileName = 'data.xlsx';

    // Datos que se van a incluir en el archivo Excel
    const data = [
      {
        province,
        town,
        codePostal,
        addressType,
        address,
        addressNumber,
        radioButton0,
        radioButton3,
        radioButtonCentralizacion,
        selectedUbicacion,
        radioButtonKey,
        accessKey,
        selectedTipoLocal,
        selectedTipoSuministro,
        stairs,
        floor,
        door,
        description,
        uso,
        radioButton2,
        radioButton4,
        onlyCPMorBoth,
        observations,
        observations2,
        CPMdistance,
        CPMdistance1,
        CGPdistance,
        CGPdistance1,
        power
      }
    ];

    // Convertir valores de radioButton a 'Sí' y 'No'
    const formattedData = data.map(item => ({
      ...item,
      radioButton0: item.radioButton0 === 1 ? t('provisions.jobExecution.yes') : (item.radioButton0 === 0 ? t('provisions.jobExecution.no') : ''),
      radioButton3: item.radioButton3 === 1 ? t('provisions.jobExecution.yes') : (item.radioButton3 === 0 ? t('provisions.jobExecution.no') : ''),
      radioButtonKey: item.radioButtonKey === 1 ? t('provisions.jobExecution.yes') : (item.radioButtonKey === 0 ? t('provisions.jobExecution.no') : ''),
      radioButtonCentralizacion: item.radioButtonCentralizacion === 1 ? t('En centralización de contadores') : (item.radioButtonCentralizacion === 0 ? t('Descentralizado (CPM)') : ''),
      radioButton2: item.radioButton2 === 0 ? t('1') : (item.radioButton2 === 1 ? t('2') : ''),
      radioButton4: item.radioButton4 === 0 ? t('provisions.jobExecution.yes') : (item.radioButton4 === 1 ? t('provisions.jobExecution.no') : ''),
      CPMdistance: item.CPMdistance === null ? '0' : item.CPMdistance,
      CPMdistance1: item.CPMdistance1 === null ? '0' : item.CPMdistance1,
      CGPdistance: item.CGPdistance === null ? '0' : item.CGPdistance,
      CGPdistance1: item.CGPdistance1 === null ? '0' : item.CGPdistance1,
      power: item.power === 0 ? '' : item.power
    }));


    // Crear hoja de cálculo con datos y encabezados personalizados
    const headers = [
      t('provisions.jobExecution.province'),
      t('provisions.jobExecution.town'),
      t('provisions.jobExecution.codePostal'),
      t('provisions.jobExecution.addressType'),
      t('provisions.jobExecution.address'),
      t('provisions.jobExecution.addressNumber'),
      t('provisions.jobExecution.radiobutton0'),
      t('provisions.jobExecution.radiobutton3'),
      t('provisions.jobExecution.radioButtonCentralizacion'),
      t('provisions.jobExecution.location'),
      t('provisions.jobExecution.radioButtonKey'),
      t('provisions.jobExecution.accessKeyIndication'),
      t('provisions.jobExecution.localType'),
      t('provisions.jobExecution.supplyType'),
      t('provisions.jobExecution.stair'),
      t('provisions.jobExecution.floor'),
      t('provisions.jobExecution.door'),
      t('provisions.jobExecution.description'),
      t('provisions.jobExecution.uso'),
      t('provisions.jobExecution.radiobutton2'),
      t('provisions.jobExecution.radiobutton4'),
      t('provisions.jobExecution.instalation'),
      t('provisions.jobExecution.observations'),
      t('provisions.jobExecution.observations'),
      t('provisions.jobExecution.cpmDistance1'),
      t('provisions.jobExecution.cpmDistance2'),
      t('provisions.jobExecution.cgpDistance1'),
      t('provisions.jobExecution.cgpDistance2'),
      t('provisions.jobExecution.power'),
    ];

    // Agregar los datos con los encabezados al array que se convertirá a la hoja de cálculo
    const worksheetData = [headers, ...formattedData.map(item => [
      item.province,
      item.town,
      item.codePostal,
      item.addressType,
      item.address,
      item.addressNumber,
      item.radioButton0,
      item.radioButton3,
      item.radioButtonCentralizacion,
      item.selectedUbicacion,
      item.radioButtonKey,
      item.accessKey,
      item.selectedTipoLocal,
      item.selectedTipoSuministro,
      item.stairs,
      item.floor,
      item.door,
      item.description,
      item.uso,
      item.radioButton2,
      item.radioButton4,
      item.onlyCPMorBoth,
      item.observations,
      item.observations2,
      item.CPMdistance,
      item.CPMdistance1,
      item.CGPdistance,
      item.CGPdistance1,
      item.power

    ])];

    // Crear hoja de cálculo con los datos preparados
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Añadir la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    //  // Descargar el archivo Excel
    //   XLSX.writeFile(wb, fileName);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const base64 = await blobToBase64(blob);
    const document1 = base64.split(',')[1];
    //discriminamos segun parametor de masterData si aputnamos a sharepoint o a documentum
    if(sentToSharepoint === 'S'){
      await handleUploadDocumentSharepoint(document1, 'excel')
    }else{
      await handleUploadDocument(document1, 'excel')
    }
  

  }

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const formatPower = (strNumber) => {
    let number = parseFloat(strNumber);

    let formattedNumber = number.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    formattedNumber = formattedNumber.replace('.', ',');

    return formattedNumber;
  }

  const getJobDate = () => {
    const dateDay = currentProvision.fechaFinTrabajosPropios.slice(6, 8);
    const dateYear = currentProvision.fechaFinTrabajosPropios.slice(0, 4);
    const dateMonth = currentProvision.fechaFinTrabajosPropios.slice(4, 6);
    
    const dateHour = currentProvision.fechaFinTrabajosPropios.slice(8, 10);
    const dateMinute = currentProvision.fechaFinTrabajosPropios.slice(10, 12);
    const dateSecond = currentProvision.fechaFinTrabajosPropios.slice(12, 14);

    return dateDay + '/' + dateMonth + '/' + dateYear + ' ' + dateHour + ':' + dateMinute + ':' + dateSecond + 'h';
  }

  const handleGenerate = async () => {
    let zip = new JSZip()

    Object.keys(images).map((key) => {
      let imageData = images[key]
      zip.file(getImageName(imageData.title, imageData.name), imageData.base64, { base64: true })
    })

    const blobZip = await zip.generateAsync({ type: 'blob' });
    const base64zip = await blobToBase64(blobZip);
    const document2 = base64zip.split(',')[1];

    //validamos si apuntamos a sharepoint o a documentum
    if(sentToSharepoint === 'S'){
      await handleUploadDocumentSharepoint(document2, 'zip')
    }else{
      await handleUploadDocument(document2, 'zip')
    }
  }

  const imageNameMapping = {
    [t('provisions.jobExecution.descImage1')]: [t('provisions.jobExecutionentorno_finca')],
    [t('provisions.jobExecution.descImage2')]: [t('provisions.jobExecution.exterior_CPM')],
    [t('provisions.jobExecution.descImage3')]: [t('provisions.jobExecution.interior_CPM')],
    [t('provisions.jobExecution.descImage4')]: [t('provisions.jobExecution.deriv_indiv_CPM')],
    [t('provisions.jobExecution.descImage5')]: [t('provisions.jobExecution.placa_caract_CPM')],
    [t('provisions.jobExecution.descImage6')]: [t('provisions.jobExecution.exterior_CGP')],
    [t('provisions.jobExecution.descImage7')]: [t('provisions.jobExecution.interior_CGP')],
    [t('provisions.jobExecution.descImage8')]: [t('provisions.jobExecution.portafusib_CPM')],
    [t('provisions.jobExecution.descImage9')]: [t('provisions.jobExecution.celda')],
    [t('provisions.jobExecution.descImage10')]: [t('provisions.jobExecution.interruptor_CPM')],

    [t('provisions.jobExecution.image1')]: [t('provisions.jobExecution.entorno_finca')],
    [t('provisions.jobExecution.image2')]: [t('provisions.jobExecution.exterior_CGP')],
    [t('provisions.jobExecution.image3')]: [t('provisions.jobExecution.interior_CGP')],
    [t('provisions.jobExecution.image4')]: [t('provisions.jobExecution.moduloCM_CC')],
    [t('provisions.jobExecution.image5')]: [t('provisions.jobExecution.moduloIGM_CC')],
    [t('provisions.jobExecution.image6')]: [t('provisions.jobExecution.celda')],
    [t('provisions.jobExecution.image7')]: [t('provisions.jobExecution.rotulado_CC')],
    [t('provisions.jobExecution.image8')]: [t('provisions.jobExecution.deriv_indiv_CC')],
    [t('provisions.jobExecution.image9')]: [t('provisions.jobExecution.portafusib_CC')],
    [t('provisions.jobExecution.image10')]: [t('provisions.jobExecution.interruptor_CC')],

  };
  const getImageName = (key, originalName) => {
    const baseName = imageNameMapping[key] || key;
    const extension = originalName.substring(originalName.lastIndexOf('.')); 
    //Resturns name with extension
    return `${baseName}${extension}`;
    //return `${baseName}`;
  };

  const generateDataConsumo =  (base64, type) => {
    // generamos datos a enviar a sharepoint para documento consumo

    let data: any
    let dateZEUS = new Date()
    let year = dateZEUS.getFullYear();
    let month = (dateZEUS.getMonth() + 1).toString().padStart(2, '0');
    let day = dateZEUS.getDate().toString().padStart(2, '0');
    let dateString = (day + '-' + month + '-' + year)


    const updatedAnomalyList = [...currentProvision.anomalyList]

    if (updatedAnomalyList.length > 0) {
      const lastIndex = updatedAnomalyList.length - 1;
      const lastElement = updatedAnomalyList[lastIndex];

      updatedAnomalyList[lastIndex] = {
        ...lastElement,
        petitionDate: dateString,
      }
    }
    if (type == 'zip') {
      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        anomalyList: updatedAnomalyList,
        documentList: {
          document: [
            {
              carpeta:'AP-OVDE',
              nombre: 'images.zip',
              contenido: base64,
              tipoMime: 'application/zip',
              tipo: 'documentacion_ejecucion_consumo',

              documentDesc: 'Fotografias de instalación',
              comment: 'Fotografias de instalación',
              extension: '.zip',                                 
              metadatos: [
                {
                  nombre: 'cod_archivo',
                  valor:'500.20.11'
                },
                {
                  nombre: 'subtipo',
                  valor:'Cliente ejecuta obra instalaciones de enlace (actualmente se envía desde PDS y a futuro desde ZEUS)'
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                },
                {
                  nombre: 'municipio',
                  valor: currentProvision.deliveryAddress.town
                },
                {
                  nombre: 'tipo_conv',
                  valor: 'Grandes desarrollos'
                },
                {
                  nombre: 'fecha_doc',
                  valor: dateString
                },
                {
                  nombre: 'arch_fisico',
                  valor: 'images.zip'
                },
                {
                  nombre: 'idioma_gd',
                  valor: 'ES'
                },
                {
                  nombre: 'cups',
                  valor: currentProvision.techData.cups
                },
                {
                  nombre: 'nif',
                  valor: currentProvision.applicant.docNumber
                },
              ]
            }
          ]
        }
      }
    } else if (type == 'excel') {
      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {
              carpeta:'AP-OVDE',
              nombre: 'data.xlsx',
              contenido: base64,
              tipoMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
              tipo: 'documentacion_ejecucion_consumo',                   

              extension: '.xlsx',
              documentDesc: 'Datos de la instalación',
              comment: 'Datos de la instalación',
              metadatos: [
                {
                  nombre: 'cod_archivo',
                  valor:'500.20.11'
                },
                {
                  nombre: 'subtipo',
                  valor:'Cliente ejecuta obra instalaciones de enlace (actualmente se envía desde PDS y a futuro desde ZEUS)'
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                },
                {
                  nombre: 'municipio',
                  valor: currentProvision.deliveryAddress.town
                },
                {
                  nombre: 'tipo_conv',
                  valor: 'Grandes desarrollos'
                },
                {
                  nombre: 'fecha_doc',
                  valor: dateString
                },
                {
                  nombre: 'arch_fisico',
                  valor: 'data.xlsx'
                },
                {
                  nombre: 'idioma_gd',
                  valor: 'ES'
                },
                {
                  nombre: 'cups',
                  valor: currentProvision.techData.cups
                },
                {
                  nombre: 'nif',
                  valor: currentProvision.applicant.docNumber
                },
              ]
            }
          ]
        }
      }
    }
    return data

  }
  const generateDataAutoconsumo =  (base64, type) => {
    // generamos datos a enviar a sharepoint para documento autoconsumo

    let data: any
    let dateZEUS = new Date()
    let year = dateZEUS.getFullYear();
    let month = (dateZEUS.getMonth() + 1).toString().padStart(2, '0');
    let day = dateZEUS.getDate().toString().padStart(2, '0');
    let dateString = (day + '-' + month + '-' + year)


    const updatedAnomalyList = [...currentProvision.anomalyList]

    if (updatedAnomalyList.length > 0) {
      const lastIndex = updatedAnomalyList.length - 1;
      const lastElement = updatedAnomalyList[lastIndex];

      updatedAnomalyList[lastIndex] = {
        ...lastElement,
        petitionDate: dateString,
      }
    }
    if (type == 'zip') {
      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        anomalyList: updatedAnomalyList,
        documentList: {
          document: [
            {

              carpeta:'AP-OVDE',
              nombre: 'images.zip',
              contenido: base64,
              tipoMime: 'application/zip',
              tipo: 'documentacion_ejecucion',


              documentDesc: 'Fotografias de instalación',
              comment: 'Fotografias de instalación',
              extension: '.zip',                                      
              metadatos: [
                {
                  nombre: 'cod_archivo',
                  valor:'500.10.12'
                },
                {
                  nombre: 'subtipo',
                  valor:'Cliente ejecuta obra instalaciones de enlace (actualmente se envía desde PDS y a futuro desde ZEUS)'
                },
                {
                  nombre: 'expediente',
                  valor: currentProvision.dossierCod
                },
                {
                  nombre: 'tipo_suministro',
                  valor: ''
                },
                {
                  nombre: 'tipo_tecnologia_generacion',
                  valor: currentProvision.idDossierSubtype
                },
                {
                  nombre: 'nom_instal',
                  valor: currentProvision.centralName
                },
                {
                  nombre: 'provincia',
                  valor: currentProvision.deliveryAddress.state
                },
                {
                  nombre: 'm_cups',
                  valor: currentProvision.techData.cups
                },
                {
                  nombre: 'fecha_firma',
                  valor: ''
                },
                {
                  nombre: 't_nif',
                  valor: currentProvision.applicant.docNumber
                },
                {
                  nombre: 'fecha_doc',
                  valor: dateString
                },
                {
                  nombre: 'arch_fisico',
                  valor: 'images.zip'
                },
                {
                  nombre: 'localiz_fisica',
                  valor: ''
                },
                {
                  nombre: 'idioma_gd',
                  valor: 'ES'
                },
              ]
            }
          ]
        }
      }
    } else if (type == 'excel') {
      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {

              carpeta:'AP-OVDE',
              nombre: 'data.xlsx',
              contenido: base64,
              tipoMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              tipo: 'documentacion_ejecucion',

              repositoryName:'AP-OVDE',
              extension: '.xlsx',
              documentDesc: 'Datos de la instalación',
              comment: 'Datos de la instalación',
              metadatos: [
                {
                  nombre: 'cod_archivo',
                  valor:'500.10.12'
                },
                {
                  nombre: 'subtipo',
                  valor:'Cliente ejecuta obra instalaciones de enlace (actualmente se envía desde PDS y a futuro desde ZEUS)'
                },
                {
                  nombre: 'expediente',
                  valor: currentProvision.dossierCod
                },
                {
                  nombre: 'tipo_suministro',
                  valor: ''
                },
                {
                  nombre: 'tipo_tecnologia_generacion',
                  valor: currentProvision.idDossierSubtype
                },
                {
                  nombre: 'nom_instal',
                  valor: currentProvision.centralName
                },
                {
                  nombre: 'provincia',
                  valor: currentProvision.deliveryAddress.state
                },
                {
                  nombre: 'm_cups',
                  valor: currentProvision.techData.cups
                },
                {
                  nombre: 'fecha_firma',
                  valor: ''
                },
                {
                  nombre: 't_nif',
                  valor: currentProvision.applicant.docNumber
                },
                {
                  nombre: 'fecha_doc',
                  valor: dateString
                },
                {
                  nombre: 'arch_fisico',
                  valor: 'data.xlsx'
                },
                {
                  nombre: 'localiz_fisica',
                  valor: ''
                },
                {
                  nombre: 'idioma_gd',
                  valor: 'ES'
                },
              ]
            }
          ]
        }
      }
    }
    return data
  }

  const handleUploadDocumentSharepoint = async (base64, type) => {
    setIsLoading(true)
    let data : any

    // validamos si es tipo consumo (dostype DOSTYP001) o autoconsumo
    if(currentProvision.idDossierTypeId === 'DOSTYP001'){
      data = generateDataConsumo(base64,type)
    }
    else{
      data = generateDataAutoconsumo(base64,type)
    }

    //envio via sharepoint
    await dispatch(thunkUpdateDossierViaSahrepoint(currentProvision.dossierCod, true, data, (response) => {

      if (response && response.result.codResult === '0000') {
        abortUpdate.current = false;
        dispatch(setCurrentProvision({
          ...currentProvision,
          //dossierStatusId: response.dossier.dossierStatusId,
          //documentList: response.dossier.documentList
        }))
        if (type == 'excel') { setCorrectUploaded1(true) }
        if (type == 'zip') { setCorrectUploaded2(true) }
        setIsLoading(false)
      } else {
        abortUpdate.current = true;
        if(totalSupplies > 1) {
          setErrorForm(true)
        } else {
          setErrorUpload(true)
          setShowButtons(true)
        }
        setErrorSharepoint(true)
        setIsLoading(false)
      }
    }))

  }
  const handleUploadDocument = async (base64, type) => {
    // envio via documentum
    setIsLoading(true)
    let data: any
    let dateZEUS = new Date()
    let year = dateZEUS.getFullYear();
    let month = (dateZEUS.getMonth() + 1).toString().padStart(2, '0');
    let day = dateZEUS.getDate().toString().padStart(2, '0');
    let dateString = (day + '/' + month + '/' + year)

    const updatedAnomalyList = [...currentProvision.anomalyList]

    if (updatedAnomalyList.length > 0) {
      const lastIndex = updatedAnomalyList.length - 1;
      const lastElement = updatedAnomalyList[lastIndex];

      updatedAnomalyList[lastIndex] = {
        ...lastElement,
        petitionDate: dateString,
      }
    }
    if (type == 'zip') {
      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        anomalyList: updatedAnomalyList,
        documentList: {
          document: [
            {
              nombre: 'images.zip',
              extension: '.zip',
              tipoMime: 'application/zip',
              carpeta: '/Documentos/ZEUDOCUWBS02',
              tipo: 'ZEUDOCUWBS02',
              contenido: base64,
              documentDesc: 'Fotografias de instalación',
              comment: 'Fotografias de instalación',
              metadatos: [
                {
                  nombre: 'codigo_tipo',
                  valor: 'DOCTYP0275'
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                }
              ]
            }
          ]
        }
      }

    } else if (type == 'excel') {

      data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {
              nombre: 'data.xlsx',
              extension: '.xlsx',
              tipoMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              carpeta: '/Documentos/ZEUDOCUWBS02',
              tipo: 'ZEUDOCUWBS02',
              contenido: base64,
              documentDesc: 'Datos de la instalación',
              comment: 'Datos de la instalación',
              metadatos: [
                {
                  nombre: 'codigo_tipo',
                  valor: 'DOCTYP0275'
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                }
              ]
            }
          ]
        }
      }

    }
    //envio via documentum
    await dispatch(thunkUpdateDossier(currentProvision.dossierCod, true, data, (response) => {
      if (response && response.dossier && response.dossier.dossierCod) {
        dispatch(setCurrentProvision({
          ...currentProvision,
          //dossierStatusId: response.dossier.dossierStatusId,
          //documentList: response.dossier.documentList
        }))
        if (type == 'excel') { setCorrectUploaded1(true) }
        if (type == 'zip') { setCorrectUploaded2(true) }
        setIsLoading(false)
      } else {
        abortUpdate.current = true;
        if(totalSupplies > 1) {
          setErrorForm(true)
        } else {
          setErrorUpload(true)
          setShowButtons(true)
        }
        setErrorSharepoint(true)
        setIsLoading(false)
      }
    }))
  }

  const getCodeProvince = async() => {
    let codeProvince = ''
    let codeMunicipe = ''
    let destination = ''

    const codesMunicipesNorth = ['24198', '49094', '49154', '49162']
    const codesProvincesCenter = ['02', '05', '06', '08', '13', '14', '16', '19', '23', '24', '28', '33', '40', '42', '45', '47', '49', '50']
    const codesProvincesNorth = ['15', '27', '32', '36']

    await dispatch(thunkGetListProvinces('', (listProvinces) => {
      if (listProvinces && listProvinces.provinces && listProvinces.provinces.items && listProvinces.provinces.items.length > 0) {
        const foundProvince = listProvinces.provinces.items.find(provinceItem => provinceItem.provinceName.toLowerCase() === province.toLowerCase())
        codeProvince = foundProvince.provinceCode
      } 
    }))
 
    await dispatch(thunkGetListMunicipalities('', '', codeProvince, '', (listMunicipalities) => {
      if (listMunicipalities && listMunicipalities.municipalities && listMunicipalities.municipalities.items && listMunicipalities.municipalities.items.length > 0) {
        const foundMunicipality = listMunicipalities.municipalities.items.find(provinceItem => provinceItem.municipalityName.toLowerCase() === town.toLowerCase())
        codeMunicipe = codeProvince+''+foundMunicipality.municipalityCode
      }
    }))
 
    if(codesProvincesNorth.includes(codeProvince)){ 
      destination = 'norte'
    }else if(codesProvincesCenter.includes(codeProvince)){
      if(codesMunicipesNorth.includes(codeProvince+''+codeMunicipe)){
        destination = 'norte'
      }else{
        destination = 'centro'
      }
    }
    return destination
  }
  
  const startTask = async() => {
    setIsLoading(true)
    let error = false
    let destination = await getCodeProvince()
    const { adicInfo, powerList, idDossierPhaseType, techData } = currentProvision;

    const idsTipoLocal = [{id: 1, description: "VIVIENDAS"}, {id: 2, description: "ESCALERA Y PORTAL"}, { id: 3, description: "ASCENSORES"}, {id: 4, description: "CALEFACCION"},{id: 5, description: "MOTORES"}, { id: 6, description: "LOCALES COMERCIALES"},  {id: 7, description: "GARAJE"}, {id: 8, description: "OFICINAS"},{id: 9, description: "SERVICIOS GENERALES"}, {id: 10, description: "INDUSTRIA"}, { id: 11, description: "ESPECTACULOS" }, { id: 12, description: "SERVICIOS PUBLICOS"}, {id: 13, description: "DEPENDENCIAS MILITAR"}, {id: 14, description: "EDIFICIO RELIGIOSO"}, {id: 15, description: "EDUCATIVOS"}, {id: 16, description: "DE LA ADMINISTRACION"}, {id: 17, description: "ALMACEN"}, {id: 18, description: "DEPORTIVAS"}, {id: 19, description: "FERIAS Y KIOSCOS"}, {id: 20, description: "OBRA"}]
    let idTipoLocal = 0
    idsTipoLocal.forEach((item) => {
      if(item.description === selectedTipoLocal){
        idTipoLocal = item.id
      }
    })

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const data = {        
      OT: {
        TIPO_PETICION: provisions.dossierSubtype.includes('015') ? 'ampliacion' : 'vale'
      },
      FINCA: {
        COD_NORMA_POB: gasCode,
        COD_NORMA_VIA: streetGasCode ? streetGasCode : '',
        NUMERO_VIA: addressNumber || '',
        ANEXO_VIA: adicInfo || '',
        DIRECCION: address || '',
        ID_TIPO_FINCA: '9'
      },
      CC: {
        CGV_PTO_MEDIDA: selectedUbicacion.slice(0, 6),
        AOL_PTO_MEDIDA: 0,
        ID_TIPO_SOPORTE: radioButtonCentralizacion === 0 ? '5' : '3',
        ID_MARCA_MODULO: '99',
        ID_DESCENTRALIZACION: selectedUbicacion.toLocaleLowerCase() === 'interior' ? '2' : radioButtonCentralizacion === 1 ? '0' : '1',
        ID_TIPO_LLAVE: radioButtonKey === 1 ? 'S' : 'N',
        AVISO_ACCESO: accessKey || ''
      },	
      SUMINISTRO: {
        CGV: cgvCode,
        ID_TIPO_LOCAL: idTipoLocal.toString(),
        ID_TIPO_TENSION: idDossierPhaseType.includes('_MONO') ? 'B8' : 'B9',
        ID_SECCION_SUMINISTRO: '150',
        TIPO_PROTECCION: Number(tPower) >= 15 ? 'F' : 'I',
        FECHA_ULTIMA_REVISION: `${year}${month}${day}`,
        POT_PAGADA: Number(power) * 1000,
        CUPS: techData.cups || '',
        SUM_OBRA_A_DEF: techData.finalPs || ''
      },
      INSTALACION: {
        TIPO_INSTALACION: onlyCPMorBoth || '',
        NUM_SUM_CPM: radioButton2 === null ? '0' : (radioButton2 === 0 ? '1' : '2'),
        ACCESIBLE_VIA: radioButton4 === 0 ? t('provisions.jobExecution.yes') : (radioButton4 === 1 ? t('provisions.jobExecution.no') : ''),
        SUM_OBRA: radioButton0 === 1 ? '1' : '0',
        DIST_CGP_SUELO: CGPdistance === null ? 0 : CGPdistance,
        DIST_CGP_VENTANA: CGPdistance1 === null ? 0 : CGPdistance1,
        DIST_SUPERIOR_CPM: CPMdistance === null ? 0 : CPMdistance,
        DIST_INFERIOR_CPM: CPMdistance1 === null ? 0 : CPMdistance1,
        NUM_SUM_SOLICITUD: totalSupplies
      }        
    }

    await dispatch(thunkStartTask(currentProvision.dossierCod.split('EXP')[1], destination, data, (response) => {
      if (response && response.id_tarea) {
        setIsLoading(false)
      } else {
        if(totalSupplies > 1) {
          setErrorForm(true)
        } else {
          setErrorUpload(true)
          setShowButtons(true)
        }
        error = true
        setErrorIGEA(true)
        setIsLoading(false)
      }
    }))
    return error
  }

  useEffect(() => {
    const isRadioButton0Required = provisions.dossierSubtype !== "DOSSUB011";
    
    if (
      /*province && town && codePostal && addressType && address && addressNumber &&*/
      (isAddressSave || (addressExists === 'exists' || validAddressManual)) &&
      radioButtonCentralizacion !== null &&
      selectedUbicacion && radioButtonKey !== null && selectedTipoLocal &&
      selectedTipoSuministro && noErrorForm1 &&
      (
        (radioButtonKey === 0 && accessKey) ||
        radioButtonKey === 1 ||
        (radioButtonKey === 2 && accessKey) ||
        radioButtonKey === null
      ) &&
      (
        isRadioButton0Required || 
        (radioButton0 === 0 && radioButton3 !== null) ||
        radioButton0 === 1 ||
        radioButton0 === null
      ) &&
      (
        (radioButtonCentralizacion === 0 && onlyCPMorBoth !== '' && radioButton2 !== null && radioButton4 !== null) ||
        radioButtonCentralizacion === 1 ||
        radioButtonCentralizacion === null
      ) &&
      (
        (showing === 'desplegable' && uso !== '') ||
        (showing === 'descripción' && description !== '') ||
        (showing === 'ESPIMA' &&
          ((selectedTipoSuministro === 'CASA/CHALET') || (door !== '' && floor !== ''))
        ))
    ) {
      setDisabledButton(false);
      setForm1Ok(true);
    } else {
      setDisabledButton(true);
    }
}, [isAddressSave, addressExists, validAddressManual, province, town, codePostal, addressType, address, addressNumber, radioButton0, radioButtonCentralizacion, selectedUbicacion, radioButtonKey, selectedTipoLocal, selectedTipoSuministro, noErrorForm1, accessKey, radioButton3, radioButton2, radioButton4, showing, uso, description, selectedTipoSuministro, door, floor, provisions.dossierSubtype, onlyCPMorBoth]);

  useEffect(() => {
    if(radioButtonCentralizacion === 1) {
      setRadioButton2(null)
      setRadioButton4(null)
      setOnlyCPMorBoth('')
    }
  }, [radioButtonCentralizacion])

  useEffect(() => {

    if (correctUploaded1 && correctUploaded2) {
      //setGenericWaitMessage(true)
      setShowButtons(false)
    }

  }, [correctUploaded1, correctUploaded2])

  useEffect(() => {
    updateZeusDate()
  }, [])

  useEffect(() => {
    const { powerList, streetType, streetName, num, addressDescription, zipCode } = currentProvision;

    const state = addressDescription.split(", ")[addressDescription.split(", ").length-1].toString()
    const town = addressDescription.split(", ")[addressDescription.split(", ").length-2].toString()

    if (!isContinueDraft) {
      setProvince(state);
      setTown(town);
      setCodePostal(zipCode);

      dispatch(thunkGetMasterDataOnlyMaster('TIPOS_VIAS_TAIS', 'ES', (response) => {
        if (response && response.length > 0) {
          let tipoVia = streetType
          response.forEach(item => {
            if (!item.steetType && !item.key) {
              tipoVia = item.value
              return
            } 
            if(streetType === item.key){
              tipoVia = item.value
              return
            }
          })
          setAddressType(tipoVia);
        }
      }));

      setAddress(streetName);
      setAddressNumber(num);
      setDuplicator('');
    }

    const formattedPower = formatPower(tPower);
    setTotalPower(formattedPower);

  }, [isContinueDraft, isContinueVerification])

   useEffect(() => {
    const stairCode = stairs.length === 2 ? stairs : stairs.length === 1 ? ' ' + stairs : '  '
    const floorCode = floor.length === 2 ? floor : floor.length === 1 ? ' ' + floor : '  '
    const doorCode = door.length === 2 ? door : door.length === 1 ? ' ' + door : '  '

    setCgvCode(stairCode + '' + floorCode + '' + doorCode)
  }, [stairs, floor, door])

  useEffect(() => {
    if (province && town && codePostal && addressType && address && addressNumber && isDefAddressDeclared ) {
      setIsAddressButtonEnabled(true);
    } else {
      setIsAddressButtonEnabled(false);
    }

  }, [province, town, codePostal, addressType, address, addressNumber, isDefAddressDeclared, ]);
  
  useEffect(() => {
    const totalSuppliesSum = currentProvision.powerList.reduce(
      (sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
      0
    )

    if(totalSupplies === 0) {
      setTotalSupplies(totalSuppliesSum)
    }
  }, [currentProvision, currentProvision.powerList])

  const numberSupplies = () => {
    const totalSupplies = currentProvision.powerList.reduce(
      (sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
      0
    )
      
    return(
      <Grid item className={classes.verifySubtitle} xs={12}>
        {totalSupplies > 1 ?
            t('provisions.jobExecution.isTr9.supplyInfo', {
            numberOfSupplies: totalSupplies,
            }) 
          : 
            t('provisions.jobExecution.isTr9.supplyInfoSingular', {
              numberOfSupplies: totalSupplies,
            })
        }
      </Grid>
    )
  }

  return (

    <Grid key={resetKey} md={10}>
      {
        isLoading &&
        <Spinner fixed={true} />
      }

      {
        (isTr9Confirm) &&
        <>

          <Grid item className={classes.verifyTitle} xs={12}>
            {t('provisions.jobExecution.verifyParticularTitle')}
          </Grid>

          <InitialForms
            setIsLoading={setIsLoading}
            handleSendSelfJobsEndDate={handleSendSelfJobsEndDate}
            setexpandSubPanels={setexpandSubPanels}
            setDisabledPanel1={setDisabledPanel1}
            comunicateResolutionDateZeus={comunicateResolutionDateZeus}
            setShowForms={setShowForms}
            setShowingCancelDialog={setShowingCancelDialog}
            setShowDialogSupply={setShowDialogSupply}
            errorSupply={errorSupply}
            okSupply={okSupply}
            showError={showError}
            recoveredDraft={recoveredDraft}
            setRecoveredDraft={setRecoveredDraft}
            resetRecoveredDraft={resetRecoveredDraft}
            showDraftContainer={showDraftContainer}
            setShowDraftContainer={setShowDraftContainer}
            setRecoverDraft={setRecoverDraft}
            setIsContinueDraft={setIsContinueDraft}
            handleSaveDraft={handleSaveDraft}
            setIsContinueVerification={setIsContinueVerification}
            setIsActiveSaveDraftBtn={setIsActiveSaveDraftBtn}
            setInPersonVisit={setInPersonVisit}
            setIsValidPersonVisit={setIsValidPersonVisit}
            setPersonVisitDate={setPersonVisitDate}
            setErrorForm={setErrorForm}
            tr9callOK={tr9callOK}
            setTr9callOK={setTr9callOK}
            totalSupplies={totalSupplies}
          />

          {(showForms) &&
            <>
              <TechnicalData
                setForm1Ok={setForm1Ok}
                expandSubPanels={expandSubPanels}
                setShowTr9form={setShowTr9form}
                handleChangeSubpanel={handleChangeSubpanel}
                handleSaveDraft={handleSaveDraft}
                handleSubmit={handleSubmit}
                saveDraftBtn={saveDraftBtn}
                errorSaveDraftBtn={errorSaveDraftBtn}
                isActiveSaveDraftBtn={isActiveSaveDraftBtn}
                setexpandSubPanels={setexpandSubPanels}
                selectedTipoLocal={selectedTipoLocal}
                setSelectedTipoLocal={setSelectedTipoLocal}
                selectedTipoSuministro={selectedTipoSuministro}
                setSelectedTipoSuministro={setSelectedTipoSuministro}
                stairs={stairs}
                setStairs={setStairs}
                floor={floor}
                setFloor={setFloor}
                door={door}
                setDoor={setDoor}
                selectedUbicacion={selectedUbicacion}
                setSelectedUbicacion={setSelectedUbicacion}
                radioButtonCentralizacion={radioButtonCentralizacion}
                setRadioButtonCentralizacion={setRadioButtonCentralizacion}
                radioButton0={radioButton0}
                setRadioButton0={setRadioButton0}
                radioButton1={radioButton1}
                setRadioButton1={setRadioButton1}
                radioButton2={radioButton2}
                setRadioButton2={setRadioButton2}
                radioButton3={radioButton3}
                setRadioButton3={setRadioButton3}
                radioButton4={radioButton4}
                setRadioButton4={setRadioButton4}
                radioButtonKey={radioButtonKey}
                setRadioButtonKey={setRadioButtonKey}
                onlyCPMorBoth={onlyCPMorBoth}
                setOnlyCPMorBoth={setOnlyCPMorBoth}
                accessKey={accessKey}
                setAccessKey={setAccessKey}
                characters={characters}
                setCharacters={setCharacters}
                disabledButton={disabledButton}
                setDisabledButton={setDisabledButton}
                disabledPanel1={disabledPanel1}
                setDisabledPanel2={setDisabledPanel2}
                power={power}
                setpower={setpower}
                province={province}
                setProvince={setProvince}
                town={town}
                setTown={setTown}
                codePostal={codePostal}
                setCodePostal={setCodePostal}
                addressType={addressType}
                setAddressType={setAddressType}
                address={address}
                setAddress={setAddress}
                addressNumber={addressNumber}
                setAddressNumber={setAddressNumber}
                duplicator={duplicator}
                setDuplicator={setDuplicator}
                description={description}
                setDescription={setDescription}
                uso={uso}
                setUso={setUso}
                showing={showing}
                setShowing={setShowing}
                noErrorForm1={noErrorForm1}
                setNoErrorForm1={setNoErrorForm1}
                observations={observations}
                setObservations={setObservations}
                onlyRead={onlyRead}
                handleCancel={handleCancel}
                resetKey={resetKey}
                setShowingCancelDialog={setShowingCancelDialog}
                setShowDialogDraft={setShowDialogDraft}
                requestType={getDossierSubtype()}
                dossierSubtype={provisions.dossierSubtype}
                totalPower={totalPower}
                isAddressButtonEnabled={isAddressButtonEnabled}
                isDefAddressDeclared={isDefAddressDeclared}
                setIsDefAddressDeclared={setIsDefAddressDeclared}
                gasCode={gasCode}
                setGasCode={setGasCode}
                streetGasCode={streetGasCode}
                setStreetGasCode={setStreetGasCode}
                setErrorDirection={setErrorDirection}
                isAddressSave={isAddressSave}
                setIsAddressSave={setIsAddressSave}
                addressExists={addressExists}
                setAddressExists={setAddressExists}
                idStreetSelect={idStreetSelect}
                setIdStreetSelect={setIdStreetSelect}
                setValidAddressManual={setValidAddressManual}
              />

              <UploadPhotography
                handleChangeSubpanel={handleChangeSubpanel}
                expandSubPanels={expandSubPanels}
                setShowTr9form={setShowTr9form}
                form1Ok={form1Ok}
                radioButtonCentralizacion={radioButtonCentralizacion}
                sendAllFiles={sendAllFiles}
                images={images}
                setImages={setImages}
                setShowDialogDraft={setShowDialogDraft}
                disabledPanel2={disabledPanel2}
                CGPdistance={CGPdistance}
                setCGPdistance={setCGPdistance}
                CPMdistance={CPMdistance}
                setCPMdistance={setCPMdistance}
                CGPdistance1={CGPdistance1}
                setCGPdistance1={setCGPdistance1}
                CPMdistance1={CPMdistance1}
                setCPMdistance1={setCPMdistance1}
                onlyCPMorBoth={onlyCPMorBoth}
                numberSupplies={radioButton2}
                power={power}
                observations={observations2}
                setObservations={setObservations2}
                correctPhotographies={correctPhotographies}
                setCorrectPhotographies={setCorrectPhotographies}
                noPerson={noPerson}
                setNoPerson={setNoPerson}
                onlyRead={onlyRead}
                setText={setText}
                setImage={setImage}
                setShowDialog={setShowDialog}
                setTitle={setTitle}
                handleCancel={handleCancel}
                setShowingCancelDialog={setShowingCancelDialog}
                showing={showing}
                selectedTipoSuministro={selectedTipoSuministro}
                stairs={stairs}
                floor={floor}
                door={door}
                description={description}
                uso={uso}
                showButtons={showButtons}
                setShowButtons={setShowButtons}
                setOnlyRead={setOnlyRead}
                radioButton0={radioButton0}
                setErrorUpload={setErrorUpload}
                errorUpload={errorUpload}
              />
            </>
          }

        </>

      }
      {
        tr9callOK &&
        <>
          <Grid item className={classes.verifyTitle} xs={12}>
            {t('provisions.jobExecution.verifyParticularTitle')}
          </Grid>
          {numberSupplies()}
          <Grid container item xs={12} md={12} className={classes.errorBox}>
            <Grid item xs={12} style={{textAlign:'center'}}>
              <img src={okIcon} width={'25px'} />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.errorTitle}>{adminCheck() ? t('provisions.jobExecution.okProcessAdmin') : totalSupplies > 1 ? t('provisions.jobExecution.isTr9.OkResponseSupply') : t('provisions.jobExecution.okProcess')}</Typography>
              { (currentProvision && currentProvision.fechaFinTrabajosPropios) ?
                  <Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.okProccessDate')+getJobDate()}</Typography>
                : adminCheck() || totalSupplies > 1 ? 
                  <Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.okProccessDate')+isPersonVisitDate}</Typography>
                :
                  <></>
              }
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.okProccess2')}</Typography>  
            </Grid>
          </Grid>
        </>
      }

      {errorForm &&
        <>
          <Grid item className={classes.verifyTitle} xs={12}>
            {t('provisions.jobExecution.verifyParticularTitle')}
          </Grid>
          {numberSupplies()}
          <Grid container item xs={12} md={12} className={classes.errorBox}>
            <Grid item xs={12} style={{textAlign:'center'}}>
              <img src={ErrorIcon} width={'25px'} />
            </Grid>
            <Grid item  xs={12}>
              <Typography className={classes.errorTitle}>{t('provisions.jobExecution.errorTitle')}</Typography>  
            </Grid>
            <Grid item  xs={12}>
              <Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.errorSubtitle')}</Typography>  
            </Grid>
            <Grid item  xs={12}>
              <Typography  className={classes.errorSubtitle}>{t('provisions.jobExecution.errorText1')} <a className={classes.link} href='https://www.ufd.es/atencion-al-cliente/' target='_blank'>{t('provisions.jobExecution.errorText2')}</a></Typography>
            </Grid>
          </Grid>
        </>
      }

      {
        (genericWaitMessage) &&
        <>
          <Grid container xs={12} justifyContent='center' alignItems='center' className={classes.whiteContainerTr9}>
            <Grid item className={classes.messageTr9NoBottomMargin}>
              {t('provisions.jobExecution.noJobExecution.title')}
            </Grid>
          </Grid>
          <Grid item className={classes.supplyAnomaliaSubtitle} /*className={classes.message} style={{ textAlign: 'center', padding: '22px' }}*/>
            {t('provisions.jobExecution.messageinfo')}
          </Grid>
        </>
      }


      {
        <DeleteAdvert
          showingDialog={showingCancelDialog}
          setShowingDialog={setShowingCancelDialog}
          handleCancel={handleCancel}
        />
      }

      {
        <SaveDraftDialog
          showingDialog={showDialogDraft}
          setShowingDialog={setShowDialogDraft}
          handleCancel={handleSubmit}
          handleSubmit={handleSaveDraft}
        />
      }
      {
        <ConfirmSupplyDialog
          showingDialog={showDialogSupply}
          setShowingDialog={setShowDialogSupply}
          handleSubmit={handleSubmitSupply}
          handleCancel={handleCancel}
        />
      }

      {
        (showDialog) &&
        <DialogImages
          showingDialog={showDialog}
          setShowingDialog={setShowDialog}
          Text={Text}
          Image={Image}
          Title={Title}
        />
      }
    </Grid>
  );
};

export default Forms;
