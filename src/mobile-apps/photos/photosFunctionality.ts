import { Camera, CameraResultType, CameraSource, GalleryPhoto, Photo } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import { Preferences } from '@capacitor/preferences'

const ONE_EXAMPLE_PIC_KEY = 'a-random-string-03275497' // just a random id to store ONE pic taken or picked (see photos-poc/README.md)

interface UserPhoto {
  filepath: string
  webviewPath?: string
}

export async function takeAndSaveAPic() {
  // if permissions right now are denied, request them
  let { camera } = await Camera.checkPermissions()
  if (camera === 'denied') camera = (await Camera.requestPermissions({ permissions: ['camera'] })).camera

  // if permission still denied, abort
  if (camera === 'denied') {
    alert('You need to grant permissions to take a photo')
    return null
  }

  try {
    const filenameToSave = new Date().getTime() + '-taken.jpeg'
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 50,
    })
    // console.debug("handleTakePic photo:", photo);
    const savedFileImage = await savePicture(photo, filenameToSave)
    Preferences.set({ key: ONE_EXAMPLE_PIC_KEY, value: JSON.stringify(savedFileImage) })
    return savedFileImage
  } catch (error) {
    console.log('error', error, 'search this random-21342234')
    return null
  }
}

export async function pickAndSaveAPic() {
  // if permissions right now are denied, request them
  let { photos } = await Camera.checkPermissions()
  if (photos === 'denied') photos = (await Camera.requestPermissions({ permissions: ['photos'] })).photos

  // if permission still denied, abort
  if (photos === 'denied') {
    alert('You need to grant permissions to pick an image')
    return null
  }

  try {
    const filenameToSave = new Date().getTime() + '-chosen.jpeg'
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 50,
    })
    const savedFileImage = await savePicture(photo, filenameToSave)
    Preferences.set({ key: ONE_EXAMPLE_PIC_KEY, value: JSON.stringify(savedFileImage) })
    return savedFileImage
  } catch (error) {
    console.log('error', error, 'search this random-3254465')
    return null
  }
}

/** loads previously saved photo */
export async function loadSaved() {
  const { value } = await Preferences.get({ key: ONE_EXAMPLE_PIC_KEY })
  if (!value) return null
  return JSON.parse(value) as UserPhoto
}

/** ... */
export async function getCameraPermissionStatus() {
  return await Camera.checkPermissions()
}

/** ... */
export async function getLocationPermissionStatus() {
  return await Geolocation.checkPermissions()
}

/** ... */
export async function getLocationCurrentPosition() {
  let { location } = await Geolocation.checkPermissions()
  if (location === 'denied') location = (await Geolocation.requestPermissions()).location
  // if permission still denied, abort
  if (location === 'denied') {
    alert('You need to grant permissions to get your location')
    return null
  }
  return await Geolocation.getCurrentPosition()
}

/** local helper, not exported on purpose */
async function savePicture(photo: Photo | GalleryPhoto, fileName: string): Promise<UserPhoto> {
  // Use webPath to display the new image instead of base64 since it's already loaded into memory
  return {
    filepath: fileName,
    webviewPath: photo.webPath,
  }
}
