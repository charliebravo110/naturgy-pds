import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { isWeb } from '../common/detectPlatform'
import { TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE } from '../common/configAndConstants'

/** Custom hook used to redirect the user to the PhotosPocPage when the secret sentence is typed in the new CUPS input. See mobile-apps/photos/README.md */
export function useEasterEggPhotosPocPage() {
  const history = useHistory()

  const isWebMemoized = useMemo(() => isWeb(), [])

  function shouldTriggerEasterEgg(text: string): boolean {
    if (text.toLowerCase() !== TEXT_TO_TRIGGER_EASTER_EGG_PHOTOS_POC_PAGE) return false
    if (isWebMemoized) return false
    return true
  }

  function redirectToPhotosPocPage() {
    history.push('/photos-poc')
  }

  return { shouldTriggerEasterEgg, redirectToPhotosPocPage }
}
