import { useState, useEffect } from 'react'
import { loadModules } from 'esri-loader'

import PunteroSVG from '../../../assets/icons/plano_puntero_ubicacion.svg'

const Pointer = (props) => {
  const [ graphic , setGraphic ] = useState(null)

  const [ lastCoordinates, setLastCoordinates ] = useState({ x: '', y: '' })

  useEffect(() => {
    if (props.x !== lastCoordinates.x && props.y !== lastCoordinates.y) {
      setLastCoordinates({
        x: props.x,
        y: props.x
      })

      loadModules(['esri/Graphic']).then(([Graphic]) => {
        const point = {
          type: 'point',
          latitude: props.y && parseFloat(props.y),
          longitude: props.x && parseFloat(props.x)
        }

        const symbol = {
          type: 'picture-marker',
          url: PunteroSVG,
          yoffset: '10px',
          width: '16px',
          height: '25px'
        }

        // Add the geometry and symbol to a new graphic
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol
        })

        setGraphic(graphic)

        props.view.graphics.add(graphic)
      }).catch((err) => console.error(err))

      return function cleanup() {
        props.view.graphics.remove(graphic)
      }
    }
  // eslint-disable-next-line
  }, [ props ])

  return null
}

export default Pointer
