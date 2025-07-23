import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Dialog from '../../../../components/dialog/Dialog'
import Alert from '../../../../../common/components/alert/Alert'
import Toolbar from '../toolbar/Toolbar'
import List from '../list/List'
import Mosaic from '../mosaic/Mosaic'
import NoItemsAlert from '../../../components/no-items-alert/NoItemsAlert'

import { thunkListDelegates } from '../../../../../delegates/store/actions/DelegatesThunkActions'

import useStyles from './ManagedByMe.styles'
import Mosaic_2 from '../mosaic_2/Mosaic'
import { thunkGetContractsSupply, thunkGetContractsUser } from '../../../../store/actions/SuppliesThunkActions'
import Spinner from '../../../../../common/components/spinner/Spinner'

import ContractsAdvice from '../../../contractsAdvice'
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const ManagedByMe = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    history,
    selectedTab,
    suppliesList,
    setSuppliesList,
    setIsLoading,
    contractsEnabled,
    setContractsInfo,
    setContractsSols
  } = props

  const supplies = useSelector((state: any) => state.supplies)
  //const suppliesListSelectorDescStatusFiltered = supplies.list
  const [suppliesListSelectorDescStatusFiltered, setSuppliesListSelectorDescStatusFiltered] = useState(supplies.list)
  /*
  filter para que solo muestre activos contratados, sacar del comentario y comentar el suppliesListSelectorDescStatusFiltered para volver a usar el filtro
  =================================================
  const suppliesListSelectorDescStatusFiltered = supplies.list.filter(item => item.descStatus == 'ACTIVO CONTRATADO')
  =================================================
  */
  const adminToken = useSelector((state: any) => state.admin.token)
  const documentNumber = useSelector((state: any) => state.user.profile.documentNumber)

  const [selectedItemsList, setSelectedItemsList] = useState([] as any)

  const [view, setView] = useState(0)

  // paginación
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [finalList, setFinalList] = useState(suppliesListSelectorDescStatusFiltered)
  const [contracts, setContracts] = useState([])
  const [contractsCall, setContractsCall] = useState(true)
  const [isLoadingManaged, setIsLoadingManaged] = useState(false)
  //const [contractsEnabled] = useState(props.contractsEnabled)
  const [contractsError, setContractsError] = useState(false)

  const [onlyDescStatus, setOnlyDescStatus] = useState(suppliesList);
  // const [onlyDescStatus, setOnlyDescStatus] = useState(suppliesList.filter(item => item.descStatus == 'ACTIVO CONTRATADO'));

  useEffect(() => {
    if (finalList.length > 20) {
      setTotalPages(suppliesListSelectorDescStatusFiltered.length === 0 ? 1 : Math.ceil(suppliesListSelectorDescStatusFiltered.length / itemsPerPage))
    } else {
      setTotalPages(1)
    }

    // eslint-disable-next-line
  }, [suppliesListSelectorDescStatusFiltered, itemsPerPage, finalList])

  // LCS: Carga de componente - Wave GdC
  useEffect(() => {
    sendGAEvent({
      event: 'component_loaded',
      info: {
        reactComponent: 'ManagedByMe.tsx'
      },
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
    })
  },[])

  useEffect(() => {
    if (contractsEnabled) {
      let accumulatedRespCupsDocs = []
      if (contractsCall) {
        dispatch(thunkGetContractsUser(documentNumber, (response) => {
          setIsLoadingManaged(true)
          if (response && response.resp && response.resp.solicitudes && response.resp.solicitudes.solicitud) {
            const ongoingContracts = response.resp.solicitudes.solicitud.filter(solicitud => solicitud.cdaStatus === '0');
            setContracts(ongoingContracts)
            setContractsSols(ongoingContracts)
            const cdaCupsList = ongoingContracts
            .map(solicitud => solicitud.cdaCups)
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(',');
            if (cdaCupsList.length > 0) {
              const cdaCupsChunks = chunkArray(cdaCupsList, 10);
              
              const promises = cdaCupsChunks.map((chunk) => {
                return new Promise<void>((resolve) => {
                  const chunkString = chunk.join(','); // Convierte cada grupo en una cadena separada por comas
            
                  // Realiza la llamada con el grupo actual de 10 CUPS
                  const repeatedDocumentNumber = Array(chunk.length).fill(documentNumber).join(',');  

                  dispatch(thunkGetContractsSupply(repeatedDocumentNumber, chunkString, (response) => {
                    if (response && response.resp.respCupsDocs && response.resp.respCupsDocs.respCupsDoc) {
                      accumulatedRespCupsDocs = accumulatedRespCupsDocs.concat(response.resp.respCupsDocs.respCupsDoc); // Acumula los respCupsDoc
                    }
                    resolve(); // Resuelve la promesa una vez se ha procesado la respuesta
                  }));
                });
              });
    
            
              // Ejecuta todas las llamadas secuenciales
              return Promise.all(promises).then(() => {
    
                setContractsInfo(accumulatedRespCupsDocs)
                setFinalList(prevFinalList => 
                  prevFinalList.map(item => {
                    // Busca en accumulatedRespCupsDocs un objeto cuyo cdaCups coincida con el cups de finalList
                    const matchingContract = accumulatedRespCupsDocs.find(doc => 
                      doc.cdaCups === item.cups
                    );
    
    
                    const equivalentContract = ongoingContracts.find(doc => 
                      doc?.cdaCups && matchingContract?.cdaCups && doc.cdaCups === matchingContract.cdaCups
                    );
                    
    
                
                    if (matchingContract && equivalentContract) {
    
                      const matchingProcess = matchingContract?.procesos?.proceso.find(proceso => 
                        proceso.cdaSolicitud === equivalentContract.cdaSolicitud
                      )
                
                      // Si se encontró un proceso, lo añadimos al item
                      if (matchingProcess) {
                        return {
                          ...item, 
                          proceso: matchingProcess // Añade el proceso correspondiente al item
                        };
                      }
                    }
                    return item;
                  })
                );

                setSuppliesListSelectorDescStatusFiltered(prevList => 
                  prevList.map(item => {
                    // Busca en accumulatedRespCupsDocs un objeto cuyo cdaCups coincida con el cups de finalList
                    const matchingContract = accumulatedRespCupsDocs.find(doc => 
                      doc.cdaCups === item.cups
                    );
    
    
                    const equivalentContract = ongoingContracts.find(doc => 
                      doc?.cdaCups && matchingContract?.cdaCups && doc.cdaCups === matchingContract.cdaCups
                    );
                    
    
                
                    if (matchingContract && equivalentContract) {
    
                      const matchingProcess = matchingContract?.procesos?.proceso.find(proceso => 
                        proceso.cdaSolicitud === equivalentContract.cdaSolicitud
                      )
                
                      // Si se encontró un proceso, lo añadimos al item
                      if (matchingProcess) {
                        return {
                          ...item, 
                          proceso: matchingProcess // Añade el proceso correspondiente al item
                        };
                      }
                    }
                    return item;
                  })
                );
                
                


                setIsLoadingManaged(false)
              });
  
            } else {
              setIsLoadingManaged(false)
            }
  
  
           
        } else {
          setIsLoadingManaged(false)
          setContractsError(true)
          //setLoadingContracts(false)
        }
        }))
  
        setContractsCall(false)
      } 
    }
  }, [contractsCall, contractsEnabled])
  
  const [showingDialog, setShowingDialog] = useState(false)

  const [delegatesList, setDelegatesList] = useState([] as any)

  const [delegateRole, setDelegateRole] = useState('')

  const [loadingDelegatesList, setLoadingDelegatesList] = useState(true)

  const [openAlert, setOpenAlert] = useState(false)

  const handleClickCheckbox = (cups: any) => {
    if (cups) {
      if (selectedItemsList.includes(cups)) {
        const itemIndex = selectedItemsList.indexOf(cups)

        let auxSelectedItemsList = [...selectedItemsList]

        auxSelectedItemsList.splice(itemIndex, 1)

        setSelectedItemsList(auxSelectedItemsList)
      } else {
        setSelectedItemsList([
          ...selectedItemsList,
          cups
        ])
      }
    } else if (onlyDescStatus.length > 0) {
      if (selectedItemsList.length < finalList.length) {
        let auxSelectedItemsList = finalList.map(item => item.cups)

        setSelectedItemsList(auxSelectedItemsList)
      } else {
        setSelectedItemsList([])
      }
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

  const handleChangeView = (view) => {
    setView(view)

    setCurrentPage(0)
  }

  const handleChangePage = (page) => {
    setCurrentPage(page)
  }

  const handleDelegateOrAuthorize = (role: string) => {
    setShowingDialog(true)

    setDelegateRole(role)

    dispatch(thunkListDelegates(role, setLoadingDelegatesList, (response) => {
      if (response && response.result.codResult === '0000') {
        if (response.delegates.items.length === 0) {
          setDelegatesList([])
        } else {
          setDelegatesList(response.delegates.items)
        }
      } else {
        setShowingDialog(false)
      }
    }))
  }

  const handleClickDelegate = (active: boolean, role: string) => {
    if (active) {
      handleDelegateOrAuthorize(role)
    }
  }

  const handleClickAuthorize = (active: boolean, role: string) => {
    if (active) {
      handleDelegateOrAuthorize(role)
    }
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  return (
    <>
      <Alert
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        message={t('delegations.managedByMe.alertMessage')}
      />

      <Dialog
        history={history}
        showingDialog={showingDialog}
        setShowingDialog={setShowingDialog}
        suppliesList={suppliesListSelectorDescStatusFiltered}
        setSuppliesList={setSuppliesList}
        selectedItemsList={selectedItemsList}
        setSelectedItemsList={setSelectedItemsList}
        delegatesList={delegatesList}
        loadingDelegatesList={loadingDelegatesList}
        setLoadingDelegatesList={setLoadingDelegatesList}
        delegateRole={delegateRole}
        handleOpenAlert={handleOpenAlert}
      />

      <Toolbar
        view={view}
        suppliesList={suppliesListSelectorDescStatusFiltered}
        selectedItemsList={selectedItemsList}
        handleClickCheckbox={handleClickCheckbox}
        handleChangeView={handleChangeView}
        handleClickDelegate={handleClickDelegate}
        handleClickAuthorize={handleClickAuthorize}
        mobile={mobile}
        adminToken={adminToken}
        finalList={finalList}
        setFinalList={setFinalList}
        setCurrentPage={setCurrentPage}
      />

      <ContractsAdvice 
        contractsError={contractsError}
        setContractsError={setContractsError}
      />

      <Grid container className={classes.table}>
        {
          suppliesListSelectorDescStatusFiltered.length === 0 ? (
            <NoItemsAlert
              searchingItems={false}
              defaultMessage={t('delegations.managedByMe.defaultMessage')}
              searchMessage={t('delegations.managedByMe.searchMessage')}
            />
          ) : view === 0 && !mobile ? (
            <List
              listItems={finalList}
              setFinalList={setFinalList}
              selectedItemsList={selectedItemsList}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
              setIsLoading={setIsLoading}
              handleClickCheckbox={handleClickCheckbox}
              handleChangePage={handleChangePage}
              handleClickDelegate={handleClickDelegate}
              selectedTab={selectedTab}
              adminToken={adminToken}
              isLoadingManaged={isLoadingManaged}
            />
          ) : view === 0 && mobile ? (
            <Mosaic_2
              listItems={finalList}
              selectedItemsList={selectedItemsList}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
              setIsLoading={setIsLoading}
              handleClickCheckbox={handleClickCheckbox}
              handleChangePage={handleChangePage}
              handleClickDelegate={handleClickDelegate}
              selectedTab={selectedTab}
              adminToken={adminToken}
              isLoadingManaged={isLoadingManaged}
            />
          ) : (
            <Mosaic
              listItems={finalList}
              selectedItemsList={selectedItemsList}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
              setIsLoading={setIsLoading}
              handleClickCheckbox={handleClickCheckbox}
              handleChangePage={handleChangePage}
              handleClickDelegate={handleClickDelegate}
              selectedTab={selectedTab}
              adminToken={adminToken}
              isLoadingManaged={isLoadingManaged}
            />
          )
        }
      </Grid>
    </>
  )
}

export default ManagedByMe
