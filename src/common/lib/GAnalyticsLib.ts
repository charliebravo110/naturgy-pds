// NOTE: Estas urls llevan un Hash asociado que es necesario quitar para no registrarlo en Google Analytics
const URLS_TO_CHANGE = ['/profile/changePassword', '/signup/activate', '/delegation/update']


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
