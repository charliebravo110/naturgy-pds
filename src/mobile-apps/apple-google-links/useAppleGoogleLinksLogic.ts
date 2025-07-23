import { useEffect, useState } from 'react'
import { FEAT_FLAG_APPLE_GOOGLE_LINKS } from '../common/configAndConstants'
import { isWeb } from '../common/detectPlatform'
import useStyles from './AppleGoogleLinks.styles'

export default function useAppleGoogleLinksLogic() {
  const classes = useStyles({})
  const [showMe, setShowMe] = useState(true)

  useEffect(() => {
    // section shown only for web, not shown for mobile apps
    setShowMe(isWeb() && FEAT_FLAG_APPLE_GOOGLE_LINKS)
  }, [])

  return { showMe, classes }
}
