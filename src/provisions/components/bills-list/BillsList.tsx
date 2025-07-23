import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import BackIcon from '@material-ui/icons/ChevronLeft'

import { push } from 'connected-react-router';

import List from './list/List'
import Toolbar from './toolbar/toolbar/Toolbar'
import Spinner from '../../../common/components/spinner/Spinner'
import NoItemsAlert from '../../../supplies/supplies-list/components/no-items-alert/NoItemsAlert'

import {
  resetUrlMessages,
  setUrlMessagesCategory, 
  setUrlMessagesDetail 
} from '../../../common/components/send-url/store/actions/UrlMessagesActions'
import { adminCheck } from '../../../common/lib/ValidationLib'

import { thunkGetDocumentBil, thunkGetDocumentBill, thunkGetDocumentBillwRepository, thunkGetDocumentBilwRepository, thunkGetMasterData, thunkListAllDossierBills, thunkListDossierBills } from '../../store/actions/ProvisionsThunkActions'

import useStyles from './BillsList.styles'
import Mosaic from './mosaic/Mosaic'
import { showError } from '../../../common/store/actions/ErrorActions'
import Alert from './alert/Alert'
import { isWeb } from '../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

interface BillsListProps {
	location
	type: 'a' | 'b',
	dossierCod
	provision
}

const BillsList = (props: BillsListProps) => {
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('sm'))

	const type = props && props.type ? props.type : 'a'
	const dossierCod = (props && props.dossierCod) && props.dossierCod

	const provision = props.provision

	const [billsList, setBillsList] = useState([])
	const [billsListSuccess, setBillsListSuccess] = useState(false)
	const [auxBillsList, setAuxBillsList] = useState([])

	const clientDossierPanel = useSelector((state: any) => state.urlMessages.clientDossierPanel)

	let userRoles = sessionStorage.getItem('userRoles') || ''
	let userRolesArray = userRoles.split(',')

	const user = useSelector((state: any) => state.user.profile)

	const classes = useStyles({})
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const [searchedBills] = useState('')

	// paginación
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)
	const [totalPages, setTotalPages] = useState(0)

	const [searchValue] = useState('')

	const [isLoading, setIsLoading] = useState(false)

	const dni = useSelector((state: any) => state.user.profile.documentNumber)
	let href = sessionStorage.getItem('href')
	let nif
	let factura

	// Modal descarga factura
	const [isDowloadModalVisible, setIsDowloadModalVisible] = useState<boolean>(false)
	const [numFactura, setNumFactura] = useState<String>('')
	const [codExp, setCodExp] = useState<String>('')
	const [status, setStatus] = useState<String>('')

	const [activeRepository, setactiveRepository] = useState('D')

	useEffect(() => {
		// LCS: Enviar evento de GdC a GA - Wave 3
		sendGAEvent({
		  event: 'view',
		  content_group: 'mis facturas de consumo a la red',
		  page_url: removeEmails(window.location.href),
		  user_id: sessionStorage.getItem('id'),
		  previous_path: removeEmails(sessionStorage.getItem("previousPage")),
		  user_type: sessionStorage.getItem('user_type'),
		  browsing_type: sessionStorage.getItem('browsing_type'),
		  element_type: 'medicion de pagina',
		  ga_client_id: sessionStorage.getItem('ga_client_id'),
		  cups: 'no aplica',
		  supply_type: 'no aplica'
		});
		sessionStorage.setItem("previousPage", window.location.href);
	  },[])

	useEffect(() => {
		setIsLoading(true)
    dispatch(thunkGetMasterData(
      'GET_DOCUMENTO',
      'ES',
      'CONSULTA_FACTURAS',
      (r) => {
        if ( r && r[0] && r[0].value) {
					setactiveRepository(r[0].value)
        } 
      }
    ))
		setIsLoading(false)
  }, [])

	

	//dependienmdo el tipo hace una busqueda u otra (DNI o por expendiente y DNI)
	useEffect(() => {
		if(!isLoading && !billsListSuccess){
			setIsLoading(true)
			if (type === 'a' && dni !== '') {
				dispatch(thunkListAllDossierBills(
					(response) => {
						if (response && response.bills.bill && response.bills.bill.length > 0) {
							setBillsList(response.bills.bill)
							setAuxBillsList(response.bills.bill)
						}
						setBillsListSuccess(true)
						setIsLoading(false)
					}))
	
			} else if (type === 'b' && dni !== '') {
				dispatch(thunkListDossierBills(dossierCod,
					(response) => {
						if (response && response.bills.bill && response.bills.bill.length > 0) {
							setBillsList(response.bills.bill)
							setAuxBillsList(response.bills.bill)
						}
						setIsLoading(false)
						setBillsListSuccess(true)
					}))
			}
		}
	}, [dni, dispatch, dossierCod, isLoading, type, billsListSuccess])

	useEffect(() => {
		setTotalPages(auxBillsList.length === 0 ? 1 : Math.ceil(auxBillsList.length / itemsPerPage))
	}, [auxBillsList, itemsPerPage])

  
  useEffect(() => {
	// PPM 1007560 - Reseteamos la información de urlMessages (redux) si no hemos accedido mediante URL de email/SMS (clientDossierPanel informado en redux)
    if (!adminCheck() && !clientDossierPanel) {
      dispatch(resetUrlMessages())
    }
	// PPM 1007560 - Seteamos la categoría y el detalle de la pantalla actual para que el usuario Admin pueda mandarle el enlace al cliente vía correo/sms
    else if (adminCheck() && window.location.pathname.includes('/bills-list')) {
      dispatch(resetUrlMessages())
      dispatch(setUrlMessagesCategory('BILLS'))
      dispatch(setUrlMessagesDetail('BILLS_LIST'))
    }
  }, [clientDossierPanel, dispatch])

	if (!userRolesArray.includes('US_CC') && !userRolesArray.includes('US_DOSSIER_CLIENT')) {
		return <Redirect to='/landing' />
	}

	const handleButtonBack = (): void => {
		dispatch(push('/provisions'));
	}

	let tipoDocumental = 'ZEUFACTPRO02'

	const handleDownloadModal = (billNumber: String, dossierCod: String, status: String) => {
		setNumFactura(billNumber)
		setCodExp(dossierCod)
		setStatus(status)
		setIsDowloadModalVisible(true)
	}

	const handleDownloadDocument = (billNumber, dossierCod, selloDigital) => {
		if (billNumber) {
			setIsLoading(true)
			dispatch(thunkGetDocumentBillwRepository(billNumber, tipoDocumental, (response) => {
				if (response && response.documentos) {
					let attachment = response.documentos.documento.id
					if (attachment) {
						dispatch(thunkGetDocumentBilwRepository(attachment, dossierCod, selloDigital, (response) => {
							if (response && response.documento) {
								const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`

								if (isWeb()) {
									const downloadLink = window.document.createElement('a')
									downloadLink.href = linkSource
									downloadLink.download = response.documento.nombre
									downloadLink.click()
								} else {
									// downloadLink.click() will attempt to force a client-side download, works for web,
									// for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
									createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
								} 
								setIsLoading(false)
							} else {
								setIsLoading(false)
							}
						},activeRepository))
					} else {
						setIsLoading(false)
					}
				} else {
					dispatch(showError('YYY'))
					setIsLoading(false)
				}
			},activeRepository))
		}
	}

	//comprobamos si el href guardado en sessionStorage contiene los params para descargar factura
	if (href && href.includes('nifcliente') && href.includes('numfactura')) {
		let splitHref = href.split('=')
		let splitHref2 = splitHref[1].split('|')
		let splitNif = splitHref2[0].split('::')
		let splitFact = splitHref2[1].split('::')
		nif = splitNif[1]
		factura = splitFact[1]
		sessionStorage.setItem('nif_factura', nif)
		sessionStorage.setItem('factura', factura)
		sessionStorage.removeItem('href')
	}

	return (
		<div className={classes.block}>

			<Alert
				openAlert={isDowloadModalVisible}
				setOpenAlert={setIsDowloadModalVisible}
				handleDownloadDocument={handleDownloadDocument}
				numFactura={numFactura}
				codExp={codExp}
				status={status}
				type={type}
				provision={provision}
			/>

			<Grid container className={classes.container}>
				<Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
					<div className={(user && user.userId && user.userId === 0) ? classes.notRegisteredTitle : classes.title}>{t('provisions.bills.title')}</div>
					{
						props.location.pathname === '/provisions/bills-list' &&
						<Grid container md={10}>
							<div className={classes.goBackContainer}>
								<Grid container className={classes.goBack} onClick={handleButtonBack}>
									<Grid item className={classes.goBackIcon}>
										<BackIcon />
									</Grid>

									<Grid item>
										{t('provisions.bills.return')}
									</Grid>
								</Grid>
							</div>
						</Grid>
					}
					<div className={classes.message}>{t('provisions.bills.message')}</div>
					<Grid container className={classes.box}>
						<Toolbar
							billsList={billsList}
							finalList={auxBillsList}
							setAuxBillsList={setAuxBillsList}
							type={type}
							dossierCod={dossierCod}
							provision={provision}
						/>
						{
							isLoading &&
							<Spinner />
						}
						<div className={type === 'a' ? classes.listContainer : classes.listContainerB}>
							{
								// (bills.count === 0) ?
								(!auxBillsList || auxBillsList.length === 0) ?
									<NoItemsAlert
										searchingItems={searchedBills}
										defaultMessage={t('provisions.billsList.noResult')}
										searchMessage={t('provisions.billsList.noSearchResult')}
									/>
									:
									<>
										{!mobile ?
											<List
												listItems={auxBillsList}
												setFinalList={setAuxBillsList}
												currentPage={currentPage}
												setCurrentPage={setCurrentPage}
												itemsPerPage={itemsPerPage}
												setItemsPerPage={setItemsPerPage}
												totalPages={totalPages}
												searchValue={searchValue}
												handleDownloadModal={handleDownloadModal}
												// handleDownloadDocument={handleDownloadDocument}
												type={type}
											/>
											:
											<Mosaic
												listItems={auxBillsList}
												setFinalList={setAuxBillsList}
												currentPage={currentPage}
												setCurrentPage={setCurrentPage}
												itemsPerPage={itemsPerPage}
												setItemsPerPage={setItemsPerPage}
												totalPages={totalPages}
												searchValue={searchValue}
												handleDownloadModal={handleDownloadModal}
												// handleDownloadDocument={handleDownloadDocument}
												type={type}
											/>
										}
									</>
							}
						</div>
					</Grid>
				</Grid>
			</Grid>
		</div>
	)

}

export default BillsList
