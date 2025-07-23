import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'

import Type from './type/Type'
import PreType from './type/PreType'
import Cups from './cups/Cups'
import Documentation from './documentation/Documentation'
import Location from './location/Location'
import useStyles from './RequestData.styles'
import { thunkGetMasterData } from '../../../../store/actions/ProvisionsThunkActions'

const RequestData = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()

  const {
    history,
    setRequestDataCompleted,
    autoconsumo,
    generaCogen,
    setGeneraCogen,
    datosUser,
    setDatosUser,
    setIsOnDeck,
    setFotovoltaicaSuperficie,
    setTypeAutoconsumo,
    setTypeConexion,
    setCGPSelected
  } = props

  const [activeComponent, setActiveComponent] = useState(-1)
  const [certificateON, setCertificateON] = useState('')
  const provisions = useSelector((state: any) => state.provisions)
  const [indAceptoFacturaDigital, setIndAceptoFacturaDigital] = useState(provisions.currentProvision.indAceptoFacturaDigital)


  
  useEffect(() => {
    dispatch(thunkGetMasterData('CERTIFICATE', 'ES', 'ACTIVE', (response) => {
      if (response[0].value !== '1') {
        setCertificateON('0')
        setActiveComponent(0)
      } else {
        setCertificateON('1')
      }
    }))
    sessionStorage.removeItem('cups');
  }, [])

  return (
    <Grid container className={classes.maxWidthForBigScreens}>

      {activeComponent === -1 && certificateON === '1' &&

        <PreType
          history={history}
          datosUser={datosUser}
          setActiveComponent={setActiveComponent}
          setDatosUser={setDatosUser}
        />
      }

      {activeComponent === 0 &&

        <Type
          history={history}
          setActiveComponent={setActiveComponent}
          autoconsumo={autoconsumo}
          setGeneraCogen={setGeneraCogen}
          setIsOnDeck={setIsOnDeck}
          setFotovoltaicaSuperficie={setFotovoltaicaSuperficie}
          setTypeAutoconsumo={setTypeAutoconsumo}
          setTypeConexion={setTypeConexion}
          setCGPSelected={setCGPSelected}
        />
      }

      {activeComponent === 1 &&

        <Cups history={history} setActiveComponent={setActiveComponent} />
      }

      {activeComponent === 2 &&

        <Documentation
          history={history}
          setActiveComponent={setActiveComponent}
          autoconsumo={autoconsumo}
          generaCogen={generaCogen}
          indAceptoFacturaDigital={indAceptoFacturaDigital}
          setIndAceptoFacturaDigital={setIndAceptoFacturaDigital}
        />
      }

      {activeComponent === 3 &&

        <Location
          setActiveComponent={setActiveComponent}
          setRequestDataCompleted={setRequestDataCompleted}
        />
      }
    </Grid>
  )
}

export default RequestData
