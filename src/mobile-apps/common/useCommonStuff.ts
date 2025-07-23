import { useMediaQuery } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { AppState } from '../../common/store/reducers/MainReducer'

/** custom hook for common stuff */
export function useCommonStuff() {
  const userToken = useSelector((state: AppState) => state.user.token)
  const adminToken = useSelector((state: AppState) => state.admin.token)

  const mobileRes = useMediaQuery('(max-width:576px)')

  return {
    mobileRes,
    regularUserIsLoggedIn: !!userToken, // reflects if a regular user is logged in
    someoneIsLoggedIn: !!userToken || !!adminToken, // reflects if someone is logged in (either regular user or admin)
  }
}

/**
 * This function is used to ensure that the redirect_to field of a notification is a valid URL
 * Sometimes the backend sends a URL with the domain https://areaprivada.ufd.es/provisions and, sometimes it sends
 * /provisions. The app needs to ensure that the URL is valid, so this function is used to ensure that the URL is
 * valid and relative.
 * @param redirectTo
 * @param search_value
 */
export function getNotificationPathRedirectTo({ redirectTo, search_value }: {
  redirectTo: string,
  search_value: string
}) {
  const loginRedirectTo = '/login?redirectTo='
  // Remove the domain from the URL. This should be done in the backend, but it is not.
  redirectTo = redirectTo.replace('https://areaprivada.ufd.es', '')

  // Ensure that the url contains the loginRedirectTo string at the beginning. This should be done in the backend, but it is not.
  redirectTo = redirectTo.includes(loginRedirectTo) ? redirectTo : `${loginRedirectTo}${redirectTo}`

  // Split the URL by the = character
  // If the URL contains the = character at least two times,
  // then it means that the URL contains a search_value, and it needs to be replaced
  const separateRedirect = redirectTo.split('=')

  if (separateRedirect.length > 2) {
    // Join the array again
    redirectTo = `${separateRedirect.slice(0, 2).join('=')}=${search_value}${separateRedirect.slice(2).join('=')}`
  }

  return redirectTo
}
