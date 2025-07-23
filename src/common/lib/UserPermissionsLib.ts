//ESP: Comprueba si el usuario que ha iniciado sesión es administrador.
//ENG: Checks if the user who logged in is an administrator.
export function isLoggingUserAnAdmin(response: any): boolean {
  let profilesAux;

  if (response.hasOwnProperty('realmUser')) {
    profilesAux = response.realmUser.userProfiles || '';
  } else {
    profilesAux = '';
  }

  const userProfiles = profilesAux;

  return userProfiles.split(',').includes('US_CC');
}


//ESP: Comprueba si el usuario no tiene permisos válidos para acceder, considerando token, roles y suplencia.
//ENG: Checks if the user does not have valid permissions to access, considering token, roles, and impersonation.
export function hasNotUserPermissions(): boolean {
  const token = sessionStorage.getItem('token');

  const realmUser = sessionStorage.getItem('userRoles') || '';

  let realmUserArray = realmUser.split(',');

  const supplantedUser = sessionStorage.getItem('supplantedUser');

  return (!token || (realmUserArray.includes('US_CC') && !supplantedUser));
}
