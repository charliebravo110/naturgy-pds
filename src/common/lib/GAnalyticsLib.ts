const URLS_TO_CHANGE = ['/profile/changePassword', '/signup/activate', '/delegation/update']

//ESP: Elimina parámetros de ciertas URLs para evitar su registro en Google Analytics.
//ENG: Removes parameters from specific URLs to prevent their logging in Google Analytics.
export function removeParamsFromUrls(initialUrl: string, routesUrls: any) {
  let returnItem = false
  routesUrls.forEach(item => {
    if((initialUrl === item || initialUrl === (item + '/')) && !initialUrl.includes('/not-found')) {
      returnItem = true
    }
  })
  URLS_TO_CHANGE.forEach(item => {
    if(initialUrl.includes(item) && !initialUrl.includes('/success')) {
      initialUrl = item
      returnItem = true
    }
  })

  if(returnItem){
    return initialUrl
  }
  return false
}
