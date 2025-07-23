
const requestRoleFilter = (list, filterList) => {

    let auxList
    let roles = sessionStorage.getItem('userRoles') || ''
    let rolesArray = roles.split(',')

    if (list.length > 0 && !rolesArray.includes('US_CC')) {
      auxList = list.filter(item => (
        filterList.includes(item.channel)
        /*item.channel === 'ATENCIÓN PERSONALIZADA ESCRITOS ELECT' ||
        item.channel === 'CC BO DIS PS' ||
        item.channel === 'CC CANAL EMPLEADOS_ELECT' ||
        item.channel === 'CC DIS ELECTRICIDAD' ||
        item.channel === 'CC REDES SOCIALES DIS ELECTRICIDAD' ||
        item.channel === 'FAX/MAIL ELECTRICIDAD' ||
        item.channel === 'PORTAL DIS ELECTRICIDAD'|| 
        item.channel === 'CC BO DIS ELECTRICIDAD' ||
        item.channel === 'CC DIS ELECTRICIDAD-COL' ||
        item.channel === 'CC REDES SOCIALES DIS ELECTRICIDAD-COL' ||
        item.channel === 'CC BO DIS PS-COL' ||
        item.channel === 'CC BO DIS ELECTRICIDAD-COL' ||
        item.channel === 'FAX/MAIL ELECTRICIDAD-COL' ||
        item.channel === 'CC CANAL EMPLEADOS_ELECT-COL' ||
        item.channel === 'PDS ÁREA PÚBLICA'*/
      ))
 
      return auxList

    } else {
      return list
    }
}

export default requestRoleFilter
