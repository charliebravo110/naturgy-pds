import React from 'react'
import Grid from '@material-ui/core/Grid'
import usePhotosPocPageLogic from './usePhotosPocPageLogic'
import { Button, Chip } from '@material-ui/core'
import { TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE } from '../common/configAndConstants'

function PhotosPocPage() {
  const {
    classes,
    handleTakePhoto,
    handlePickImage,
    processing,
    permCamera,
    permGallery,
    permLocation,
    thumbSrc,
    lat,
    lon,
    accuracy,
  } = usePhotosPocPageLogic()

  return (
    <div className={classes.root}>
      <span>
        <b>Demo fotos app móvil.</b>
        &nbsp;
        <a
          href='#'
          onClick={() => {
            alert(
              'Esto es un ejemplo de uso de la cámara, la galería de fotos y de la geolocalización desde una app móvil.' +
                '\nSe ofrece como referencia para próximos desarrollos.' +
                '\n\nEsta página no es para el usuario final y no está enlazada a ningún menú de la aplicación.' +
                ' Para acceder, a modo de ¨huevo de pascua / easter egg¨ hay que escribir ¨' +
                TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE +
                '¨ en el input de CUPS (suministros)' +
                '\n\nPara más información, ver la documentación del código.'
            )
          }}
        >
          Más info
        </a>
      </span>
      <br />
      <p>Estado actual de permisos:</p>
      <ul>
        <li>
          Acceso a la cámara: <Chip size='small' label={permCamera} />
        </li>
        <li>
          Acceso a la galería: <Chip size='small' label={permGallery} />
        </li>
        <li>
          Acceso a la ubicación: <Chip size='small' label={permLocation} />
        </li>
      </ul>
      <Button variant='contained' color='primary' onClick={handleTakePhoto} disabled={processing}>
        Hacer foto y leer ubicación
      </Button>
      <Button variant='contained' color='primary' onClick={handlePickImage} disabled={processing}>
        Seleccionar imagen
      </Button>
      <br />
      {thumbSrc && (
        <>
          <p>Resultado:</p>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <div>Latitud</div>
            </Grid>
            <Grid item xs={8}>
              {lat || 'No disponible'}
            </Grid>
            <Grid item xs={4}>
              <div>Longitud</div>
            </Grid>
            <Grid item xs={8}>
              {lon || 'No disponible'}
            </Grid>
            <Grid item xs={4}>
              <div>Exactitud</div>
            </Grid>
            <Grid item xs={8}>
              {accuracy ? accuracy.toFixed(0) + ' m' : 'No disponible'}
            </Grid>
            <Grid item xs={4}>
              <div>Miniatura</div>
            </Grid>
            <Grid item xs={8}>
              <img className={classes.imgThumb} src={thumbSrc} alt={thumbSrc} />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  )
}

export default PhotosPocPage
