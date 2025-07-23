import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DelegationsList from '../list/delegations-list/DelegationsList'
import DelegationsMosaic from '../list/delegations-mosaic/DelegationsMosaic'
import Toolbar from '../list/toolbar/toolbar/Toolbar'
import { manageDelegationCheck,
  checkDelegationByDelegationType,
  uncheckDelegationByDelegationType,
  checkDelegationByCups,
  uncheckDelegationByCups,
  setDelegationsToDelete,
  resetDelegationsToDelete,
  setCurrentDelegation,
  setCurrentDelegatesList } from '../../../../store/actions/SuppliesActions'

import useStyles from './DelegatesInManagers.styles'
import NoItemsAlert from '../../../components/no-items-alert/NoItemsAlert'
import { thunkGetContractsSupply, thunkGetContractsUserDelegates } from '../../../../store/actions/SuppliesThunkActions'
import ContractsAdvice from '../../../contractsAdvice'
import KoIcon from '../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const DelegatesInManagers = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const [ searchedDelegations, setSearchedDelegations ] = useState([] as any)
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ view, setView ] = useState(0)
  const [ isSearching, setIsSearching ] = useState(false)
  const [contractsCall, setContractsCall] = useState(true)
  const documentNumber = useSelector((state: any) => state.user.profile.documentNumber)
  const [contractList, setContractList] = useState([])
  //const [contractsEnabled] = useState(props.contractsEnabled)
  const [contractsError, setContractsError] = useState(false)

  let supplantedUser = sessionStorage.getItem('supplantedUser')

  let suppliesDelegationsList = useSelector((state: any) => state.delegations.delegationsInManagersList)
  let delegationsToDelete = useSelector((state: any) => state.delegations.delegationsToDelete)
  const {
    selectedTab,
    setDelegationProfile,
    setDelegationProfileStatus,
    setRemoveDelegation,
    contractsEnabled,
    contractsInfo,
    contractsSols,
    suppliesList
  } = props

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'DelegatesInManagers.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  //const rowsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const totalPages = suppliesDelegationsList.length === 0 ? 1 : Math.ceil(suppliesDelegationsList.length / rowsPerPage)

  const dispatch = useDispatch()
  const classes = useStyles({})
  const { t } = useTranslation()

  const handleCommonCheckbox = ({ target }, delegateType: string) => {

    let delegationsToDeleteArray: string[] = delegationsToDelete

    let delegationsIds = suppliesDelegationsList.map(supply => supply[delegateType].map(delegate => delegate.delegationId)).flat(1)

    if(target.checked){
      delegationsIds.forEach(delegationId => {
        if(!delegationsToDeleteArray.find(item => item === delegationId)){
          delegationsToDeleteArray.push(delegationId)
        }
      })

      dispatch(checkDelegationByDelegationType(delegateType))
      dispatch(setDelegationsToDelete(delegationsToDeleteArray))

    }else{
      const newDelegationsToDelete = delegationsToDeleteArray.filter(delegationId => {
        return !delegationsIds.find(delegation => delegation === delegationId )
      })

      dispatch(uncheckDelegationByDelegationType(delegateType))
      dispatch(setDelegationsToDelete(newDelegationsToDelete))
    }
  }

  const handleSupplyCheckbox = async({ target }, delegateType: string, cups: string) => {

    let delegationsToDeleteArray: string[] = delegationsToDelete

    let delegationsSupply: string[] = suppliesDelegationsList.filter(item => item.cups === cups)

    let delegationsIds = delegationsSupply[0][delegateType].map(delegate => delegate.delegationId)

    if(target.checked){
      delegationsIds.forEach(delegationId => {
        if(!delegationsToDeleteArray.find(item => item === delegationId)){
          delegationsToDeleteArray.push(delegationId)
        }
      })

      dispatch(checkDelegationByCups({delegateType, cups}))
      dispatch(setDelegationsToDelete(delegationsToDeleteArray))

    }else{
      const newDelegationsToDelete = delegationsToDeleteArray.filter(delegationId => {
        return delegationsIds.find(delegation => delegation === delegationId ) === undefined
      })

      dispatch(uncheckDelegationByCups({delegateType, cups}))
      dispatch(setDelegationsToDelete(newDelegationsToDelete))
    }

  }

  const handleCheckbox = async({ target }, delegationId: string) => {

    let delegationsToDeleteArray: string[] = delegationsToDelete

    dispatch(manageDelegationCheck(delegationId))

    if(target.checked){

      if(!delegationsToDeleteArray.find(item => item === delegationId)){
        delegationsToDeleteArray.push(delegationId)
      }

      dispatch(setDelegationsToDelete(delegationsToDeleteArray))

    }else{
      const newDelegationsToDelete = delegationsToDeleteArray.filter(item => item !== delegationId)

      dispatch(setDelegationsToDelete(newDelegationsToDelete))
    }
  }

  const handleChangeSearch = (value) => {
    handleSearch(value.toLowerCase())
  }

  const handleSearch = (value) => {
    const matches = suppliesDelegationsList.filter(supply => (
      (supply.cups && supply.cups.toLowerCase().includes(value))
    ))

    if(value === ''){
      setIsSearching(false)
      setSearchedDelegations([])
    }else{
      setIsSearching(true)
      setSearchedDelegations(matches)
    }

    setCurrentPage(1)
  }

  const handleChangePage = (number) => {
    setSearchedDelegations([])

    setCurrentPage(number)
  }

  const handleChangeView = (newView) => {
    setView(newView)

    setCurrentPage(1)
  }

  const openDetailPopup = (delegation: any) => {
    if (!supplantedUser) {
      dispatch(setCurrentDelegation(delegation))
      setDelegationProfileStatus(2)
      setDelegationProfile(true)
    }
  }

  const chunkArray = (cupsString, chunkSize) => {
    const cupsArray = cupsString.split(','); // Convierte el string en un array de CUPS
    const chunks = [];
  
    for (let i = 0; i < cupsArray.length; i += chunkSize) {
      chunks.push(cupsArray.slice(i, i + chunkSize)); // Agrupa los CUPS en bloques de 10
    }
  
    return chunks;
  };

  const openListPopup = (delegatesList: any) => {
    dispatch(setCurrentDelegatesList(delegatesList))
    setDelegationProfileStatus(1)
    setDelegationProfile(true)
  }

  const extractDelegatesDocs = (data:any) => {
    // Crear un conjunto para almacenar valores únicos de documentNumber
      const documentNumbers = new Set();

    // Iterar sobre cada objeto de datos
    data.forEach(item => {
      // Extraer documentNumber de managers
      item.managers.forEach(manager => {
          documentNumbers.add(manager.documentNumber);
      });

      // Extraer documentNumber de consultants
      item.consultants.forEach(consultant => {
          documentNumbers.add(consultant.documentNumber);
      });
    });

    // Convertir el Set a un array si se necesita en ese formato
    const uniqueDocumentNumbers = Array.from(documentNumbers);
    return uniqueDocumentNumbers

  }

  useEffect(() => {

    return function(){
      dispatch(resetDelegationsToDelete())
    }
  }, [dispatch])

  useEffect(() => {
    if (contractsEnabled) {
      if (contractsCall && suppliesDelegationsList.length > 0) {
  
        const processDelegatesDocuments = async () => {
          let equivalentContract;
          let matchingContract;
          let matchingProcess;
  
            const newContracts = [];
    
            for (const item of suppliesDelegationsList) {
              matchingContract = contractsInfo.find(doc => doc.cdaCups === item.cups);
              
              if (matchingContract) {
              
                if (contractsSols) {
                    equivalentContract = contractsSols.find(doc => doc.cdaCups === matchingContract.cdaCups);

                  if (equivalentContract) {
                    matchingProcess = matchingContract.procesos.proceso.find(proceso => proceso.cdaSolicitud === equivalentContract.cdaSolicitud);
      
                    if (matchingProcess) {
                      newContracts.push({
                        cups: matchingContract.cdaCups,
                        proceso: matchingProcess
                      });
                    }
                  }
                }
                
              }
            }

            setContractList(prevList => [...prevList, ...newContracts]);
  
        };
  
        // Ejecutamos la función asíncrona
        processDelegatesDocuments()
  
      }

    } 
  }, [contractsCall, suppliesDelegationsList,contractsInfo,contractsSols]);
  


  return (
    <Grid container className={classes.table}>
      <Toolbar
        view={view}
        delegationsToDelete={delegationsToDelete}
        handleChangeView={handleChangeView}
        handleChangeSearch={handleChangeSearch}
        handleSearch={handleSearch}
        mobile={mobile}
        openRemoveDelegation={() => {
          if (delegationsToDelete.length > 0 && !supplantedUser) {
            setRemoveDelegation(true)
          }
        }
      }
        listItems={isSearching ? searchedDelegations : suppliesDelegationsList}
      />

{
        (contractsError) &&
        <Grid container style={{color: 'rgba(0, 69, 113, 1)',backgroundColor: '#f8dedf',padding: '12px',marginTop:'15px',marginBottom:'15px'}}>
          <Grid item style={{textAlign:'center'}}>
            <img src={KoIcon} alt='' width={38}/>
          </Grid>

          <Grid item style={{marginLeft:'10px'}}>
            <div>
              {'Por motivos técnicos, no podemos mostrarte la información de tus suministros.'}
            </div>
            <div>
              {'Por favor, intentalo más tarde.'}
            </div>
          </Grid>

          <img src={CloseIcon} style={{ width:'11px',position: 'relative',bottom: 15,left: 474, cursor: 'pointer'}} alt='' onClick={() => {setContractsError(false)}} />

        </Grid>
      }
     

      {
        (suppliesDelegationsList.length === 0 || (isSearching && searchedDelegations.length === 0)) ?
        <NoItemsAlert
          searchingItems={searchedDelegations}
          defaultMessage={t('delegations.delegatesInManagers.components.delegatesInManagers.defaultMessage')}
          searchMessage={t('delegations.delegatesInManagers.components.delegatesInManagers.searchMessage')}
        />
        :
        <>
        {
          view === 0 && !mobile ?
          <DelegationsList
            listItems={isSearching ? searchedDelegations : suppliesDelegationsList}
            handleCommonCheckbox={handleCommonCheckbox}
            handleSupplyCheckbox={handleSupplyCheckbox}
            handleCheckbox={handleCheckbox}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
            setDelegationProfile={setDelegationProfile}
            setDelegationProfileStatus={setDelegationProfileStatus}
            openDetailPopup={openDetailPopup}
            openListPopup={openListPopup}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            selectedTab={selectedTab}
            contractList={contractList}
            suppliesList={suppliesList}
          />
          :
          <DelegationsMosaic
            listItems={isSearching ? searchedDelegations : suppliesDelegationsList}
            handleSupplyCheckbox={handleSupplyCheckbox}
            handleCheckbox={handleCheckbox}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
            setDelegationProfile={setDelegationProfile}
            setDelegationProfileStatus={setDelegationProfileStatus}
            openDetailPopup={openDetailPopup}
            openListPopup={openListPopup}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            selectedTab={selectedTab}
            contractList={contractList}
            suppliesList={suppliesList}
          />
        }
        </>
      }
    </Grid>
  )
}

export default DelegatesInManagers
