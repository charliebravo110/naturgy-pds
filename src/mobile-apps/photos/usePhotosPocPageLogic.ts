import { useEffect, useState } from 'react'
import { isWeb } from '../common/detectPlatform'
import useGoHomeIf from '../common/useGoHomeIf'
import {
  pickAndSaveAPic,
  takeAndSaveAPic,
  getCameraPermissionStatus,
  getLocationPermissionStatus,
  getLocationCurrentPosition,
} from './photosFunctionality'
import useStyles from './PhotosPocPage.styles'

export default function usePhotosPocPageLogic() {
  const classes = useStyles()
  const [processing, setProcessing] = useState(true)
  const [permCamera, setPermCamera] = useState('')
  const [permGallery, setPermGallery] = useState('')
  const [permLocation, setPermLocation] = useState('')
  const [thumbSrc, setThumbSrc] = useState<string | null>(null)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)

  useGoHomeIf(isWeb()) // if the user on web goes manually to this url, then redirect home.

  // initially read permissions state
  useEffect(() => {
    reflectPermissionsStatus().finally(() => setProcessing(false))
  }, [])

  async function reflectPermissionsStatus() {
    const { camera, photos } = await getCameraPermissionStatus()
    const { location } = await getLocationPermissionStatus()
    setPermCamera(camera)
    setPermGallery(photos)
    setPermLocation(location)
  }

  async function handleTakePhoto() {
    setProcessing(true)
    try {
      const photo = await takeAndSaveAPic()
      if (!photo) console.log('User cancelled taking a photo')
      const { coords } = await getLocationCurrentPosition()
      setThumbSrc(photo?.webviewPath || null)
      setLat(coords.latitude || null)
      setLon(coords.longitude || null)
      setAccuracy(coords.accuracy || null)
    } catch (error) {
      console.log('error', error, 'search this random-3423443')
    } finally {
      await reflectPermissionsStatus() //because they might have changed
      setProcessing(false)
    }
  }

  async function handlePickImage() {
    setProcessing(true)
    try {
      const image = await pickAndSaveAPic()
      if (!image) console.log('User cancelled picking an image')
      setThumbSrc(image?.webviewPath || null)
      setLat(null)
      setLon(null)
      setAccuracy(null)
    } catch (error) {
      console.log('error', error, 'search this random-3423443')
    } finally {
      await reflectPermissionsStatus() //because they might have changed
      setProcessing(false)
    }
  }

  // this is what the ui needs
  return {
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
  }
}
