import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TableRow from '@material-ui/core/TableRow'
import useStyles, { StyledTableCell } from './Mosaic.styles'
import Grid from '@material-ui/core/Grid/Grid'
import DynamicSearcher from '../../../common/components/searcher/DynamicSearcher'



const Mosaic = (props: any) => {


  const { t } = useTranslation()
  const classes = useStyles({})

  const {
    searcheUsers,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPagesFilter,
    setTotalPagesFilter,
    exportLimit,
    filteredData,
    setFilteredData,
    startItems,
    endItems,
    totalItems,
  } = props

  const target = document.getElementById('number') as HTMLSelectElement
  const [searchValue, setSearchValue] = useState('');
  //const [filteredData, setFilteredData] = useState(searcheUsers);

  const validResults = ['00', '101', '102', '103', '110', '999']
  
  
  useEffect(() => {
    setFilteredData(searcheUsers)
  }, [searcheUsers])

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (searchValue.trim().length < 3) {
        setFilteredData(searcheUsers);
        return;
    }
    const re = new RegExp(searchValue.trim() , 'i');
    let filteredData = searcheUsers.filter((item) => {
        return (
            re.test(item.requestTimestamp.toString()) ||
            re.test(item.dossierNumber.toString()) ||
            re.test(item.orderId.toString()) ||
            re.test(item.amount.toString()) ||
            re.test(item.custNum.toString()) ||
            re.test(item.status.toString()) ||
            re.test(item.result.toString())
        );
    });
    
    setFilteredData(filteredData);
}

  useEffect(() => {
    setTotalPagesFilter(searcheUsers.length === 0 ? 1 : Math.ceil(searcheUsers.length / itemsPerPage))
    // eslint-disable-next-line
  }, [searcheUsers, itemsPerPage])

  

  return (
    <>
    <br/>
    <Grid container >
        <Grid item xs={12} md={6} style={{marginTop:'auto'}}>
              <Grid container className={classes.itemText}>
                  {t('controlMensajeria.payData.result')}
              </Grid>
         </Grid>
      <Grid item justifyContent='flex-end' md={6} >
      <Grid container alignItems='center' className={classes.searcher}>
        <Grid item className={classes.mobileFullWidth}>
        <DynamicSearcher label={t('provisions.provisionsList.searcher')}   finalList={filteredData}   setFinalList={setFilteredData}   listItems={searcheUsers} subtype={'monitorizacionPagos'} setCurrentPage={setCurrentPage}/>
        </Grid>
        </Grid>
        </Grid>
      </Grid>
      
          {
            // searcheUsers && searcheUsers.usersLogin.items.length > 0 ?
            searcheUsers.length === 0 ?
              <TableRow className={classes.tableBodyRow} >
                <StyledTableCell className={classes.noResults} colSpan={12}>
                  {t('controlMensajeria.management.list.table.body.noResults')}
                </StyledTableCell>
              </TableRow>
              : (searcheUsers.length < exportLimit) ?  (
                filteredData.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map((item, index) => (
                    <>
                    <Grid key={index} container spacing={2} style={{marginTop:'10px',marginBottom:'10px'}}>
                     <Grid item lg={4}  md={6} sm={6} xs={12}>
                      <Grid className={`${classes.item}`}>

                    <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Fecha')}</div>
                    <div className={`${classes.value}`}>{item.requestTimestamp}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Expediente')}</div>
                    <div className={`${classes.value}`}>{item.dossierNumber}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Id de orden')}</div>
                    <div className={`${classes.value}`}>{item.orderId}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Cantidad')}</div>
                    <div className={`${classes.value}`}>{item.amount}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Identificación')}</div>
                    <div className={`${classes.value}`}>{item.custNum}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.Estado')}</div>
                    <div className={`${classes.value}`}>{item.status}</div>
                     </Grid>

                     <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                    <div className={classes.title}>{t('controlMensajeria.payData.CodigoKO')}</div>
                    <div className={`${classes.value}`}>{validResults.includes(item.result) ? item.result+' - '+t(`controlMensajeria.payData.${item.result}`) : (item.result===undefined) ? '' : `${item.result}`}</div>
                    
                     </Grid>
                   
    
                     
                     </Grid>
                     </Grid>
                     </Grid>
                    </>
                ))
              ) : ''
          }
       
    
    </>
  )
}

export default Mosaic;