import React, { useEffect, useState } from 'react';
import useStyles from './SuministroDisp.style'
import Button from '../../../../common/components/button/Button';
import currentIcon from '../../../../assets/icons/ico_en_proceso.svg'
import changeValues from '../../../../common/services/changeValues';
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux';
import { thunkGetMasterData } from '../../../../gestionAverias/actions/GestionAveriasThunkActions';
import { thunkGetContractsSupply, thunkGetContractsUser } from '../../../../supplies/store/actions/SuppliesThunkActions';
import { showError } from '../../../../common/store/actions/ErrorActions';
import { validateCIF, validateNIE, validateNIF } from '../../../../common/lib/ValidationLib';

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../../../core/utils/gtm';

interface ErrorInterface {
  setIsLoadingCont: any,
  document: string,
  CUPS : string,
  buttonCIE: any,
  type: string,
  CIE: boolean,
  potenciaCIE: string,
  PPP: string,
  enCurso: boolean,
  titular: boolean
}

export default function SuministroDisp(props: any) {

  const dispatch = useDispatch()
  const classes = useStyles({})
  const history = useHistory()

  const { buttonCIE,showDetailButton, setShowDetailButton, CUPS, document, enCurso, setIsLoadingCont} = props

  const [updateCieButton, setUpdateCieButton] = useState(false)
  const [detailButton, setDetailButton] = useState(false)
  const [isLoadingManaged, setIsLoadingManaged] = useState(false)
  const [errorProceso, setErrorProceso] = useState(false)
  const [proceso, setProceso] = useState()

  const verDetalle = () => {

    history.push({
      pathname: '/supplies/detail',
      state: {
        cups: CUPS,
        dashboard: 'contracts',
        contract: proceso,
      },
    })
  }

  useEffect(() => {
    setIsLoadingCont(isLoadingManaged)
  }, [isLoadingManaged])

  const validateDocument = () => {
    return (validateCIF(document) || validateNIE(document) || validateNIF(document))
  }

  useEffect(() => {
    if (enCurso && validateDocument()) {
      setIsLoadingManaged(true)
      dispatch(thunkGetContractsSupply(document, CUPS, (response) => {
        if (response && response.resp && response.resp.respCupsDocs && response.resp.respCupsDocs.respCupsDoc && response.resp.respCupsDocs.respCupsDoc && response.resp.respCupsDocs.respCupsDoc.length > 0) {
          const respCupsDoc = response.resp.respCupsDocs.respCupsDoc[0]
          if (respCupsDoc.procesos && respCupsDoc.procesos.proceso.length > 0) {
            let found = false
            respCupsDoc.procesos.proceso.forEach((item) => {
              if (item.estado && item.estado === 'EN CURSO') {
                let newProceso = item
                
                //Ordenar los pasos
                if (newProceso.pasos && newProceso.pasos.paso && newProceso.pasos.paso.length > 1) {
                  newProceso.pasos.paso.sort((a, b) => (a.fechaPaso > b.fechaPaso ? -1 : 1))
                }

                setProceso(newProceso)
                setIsLoadingManaged(false)
                found = true
              }
            })

            if (!found) {
              setErrorProceso(true)
              dispatch(showError('XXX'))
            }
            setIsLoadingManaged(false)
          } else {
            setErrorProceso(true)
            setIsLoadingManaged(false)
            dispatch(showError('XXX'))
          }
        } else {
          setErrorProceso(true)
          setIsLoadingManaged(false)
          dispatch(showError('XXX'))
        }
      }))
    }
  }, [enCurso])

  useEffect(() => {
    dispatch(thunkGetMasterData('CIE', 'ES', 'ShowButtonCIE', (r) => {
      if (r && r.length > 0) {
        if (r[0].value === '1') {
          setUpdateCieButton(true)
        } else if (r[0].value === '0') {
          setUpdateCieButton(false)
        } else {
          setUpdateCieButton(false)
        }
      }
    }))
  }, [])

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventUpdateCIE = ():void => {
    sendGAEvent({
      event: 'consult_contract',
      section_name: 'mi conexion a la red',
      click_text: 'quiero actualizar al cie',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      cups: CUPS,
      tab_name: 'consulta de cups de primera contratacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
      module_name: 'suministro disponible para contratacion',
    })
  }

  return (
    <div style={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', backgroundColor: '#F9F8F7', flexDirection: 'column' }}>
      <p className={classes.textFont} style={{ color: '#004571', margin: 0, marginTop: '2rem', marginBottom: '2rem', fontWeight: 'bold',  textAlign: 'center' }}>
        Suministro disponible para contratación.
      </p>
      {props.enCurso && !detailButton? (
        <div  className={classes.buttonTextContainer} style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '1rem', alignContent: 'center', alignItems: 'center' }}>
            <div
              className={classes.buttonCurso}
            >
              <img
                src={currentIcon}
                alt=''
                style={{ width: '30px', height: '30px', marginRight: '8px', }}
              />
              <p
                style={{ color: '#004571', margin: 0, fontSize: '1.2rem', textAlign: 'center', alignContent: 'center' }}
              >
                Contratación en curso
              </p>
            </div>
         {!props.titular ? ( 
              <p style={{ color: '#808286', margin: 0, fontSize: '1rem', textAlign: 'center', marginTop: '1.5rem' }}>
                Para ver la información de la solicitud de la contratación has de ser titular o persona autorizada.
              </p>
           ) : ( 
              <Button
                style={{marginTop: '25px'}}
                text='Ver detalle'
                color='primary'
                size='large'
                variant='contained'
                onClick={verDetalle}
                disabled={isLoadingManaged || errorProceso}
              />
             )} 
          </div>
        </div>
       ) : (
         <div className={classes.buttonTextContainer}  style={{  width: '100%', justifyContent: 'space-between', marginBottom: '1rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem' }}>
             <div className={classes.textContainer}>
               <span style={{ color: '#004571', margin: 0, fontWeight: 'bold' }}>
                 Tipo de acometida:
               </span>
               <span className={classes.textInfo}>{props.type}</span>
             </div>
             <div className={classes.textContainer}>
                 <span style={{ color: '#004571', margin: 0, fontWeight: 'bold' }}>
                   CIE registrado:
                 </span>
                 <span className={classes.textInfo}> {props.CIE}</span>
             </div>
             <div className={classes.textContainer}>
                 <span
                   style={{
                     color: '#004571',
                     margin: 0,
                     fontWeight: 'bold'
                   }}
                 >
                   Potencia del CIE:
                 </span> 
                 <span className={classes.textInfo}>{props.potenciaCIE}</span> 
             </div>
             <div className={classes.textContainer}>
                 <span style={{ color: '#004571', margin: 0, fontWeight: 'bold' }}>
                   Potencia maxima de la acometida (PPP):
                 </span> 
                 <span className={classes.textInfo}>{props.PPP}</span>
             </div>
           </div>
           {
             updateCieButton && (
               <div style={{ paddingRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', }} >
                 <Button
                   text='Quiero actualizar el CIE'
                   color='primary'
                   size='large'
                   variant='contained'
                   onClick={() => { sendGAEventUpdateCIE(); buttonCIE()}}
                 />
               </div>
             )
           }
         </div>
       )}
    </div>
  )
}