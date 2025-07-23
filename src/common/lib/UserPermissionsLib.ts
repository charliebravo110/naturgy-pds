export function isLoggingUserAnAdmin(response: any): boolean {
  
  let profilesAux
  
  if (response.hasOwnProperty('realmUser')) {
    profilesAux = response.realmUser.userProfiles || ''
  } else {
    profilesAux = ''
  }

  const userProfiles = profilesAux

  return userProfiles.split(',').includes('US_CC')
}

export function hasNotUserPermissions(): boolean {
  const token = sessionStorage.getItem('token')

  const realmUser = sessionStorage.getItem('userRoles') || ''

  let realmUserArray = realmUser.split(',')
  
  const supplantedUser = sessionStorage.getItem('supplantedUser')

  return (!token || (realmUserArray.includes('US_CC') && !supplantedUser))
}
