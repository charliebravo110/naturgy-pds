import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import List from '../list/List'
import Mosaic from '../mosaic/Mosaic'
import Toolbar from '../toolbar/toolbar/Toolbar'
import NoItemsAlert from '../../../../supplies/supplies-list/components/no-items-alert/NoItemsAlert'
import Spinner from '../../../../common/components/spinner/Spinner'
import InfoIcon from '../../../../assets/icons/info.svg'

import useStyles from './OngoingProvisions.styles'
import AlertInfo from '../alert-info/AlertInfo'

const OngoingRequests = (props: any) => {
	const classes = useStyles({})
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { t } = useTranslation()

	const {
		handleChangeView,
		view,
		provisionsList,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		setIsLoadingDossier,
		isLoading,
		provisions,
		searchedProvisions,
		isSubLoading,
		dossierStatus,
		setDossierStatus,
		certificateON,
		setCertificateON
	} = props

	//filtramos para que solo aparezcan las que están en curso
	const list = provisionsList.filter(item => (item.dossierStatusId !== 'STATUS0099' && item.dossierStatusId !== 'STATUS0098' && item.dossierStatusId !== 'STATUS0096' && item.dossierStatusId !== 'STATUS0102'))
	const [finalList, setFinalList] = useState(list)
	const [totalPages, setTotalPages] = useState(0)
	//const [itemsPerPage , setItemsPerPage] = useState(20)

	useEffect(() => {
		setTotalPages(list.length === 0 ? 1 : Math.ceil(list.length / itemsPerPage))
		// eslint-disable-next-line
	}, [provisionsList, itemsPerPage])

	return (
		<Grid container>
			<Toolbar
				view={view}
				handleChangeView={handleChangeView}
				mobile={mobile}
				finalList={finalList.length === 0 ? list : finalList}
				setFinalList={setFinalList}
				totalList={list}
				dossierStatus={dossierStatus}
				isLoading={isLoading}
			/>
			{
				isLoading ?
					<Spinner fixed={true} />
					:
					<>
						{
							(provisions.count === 0) ?
								<NoItemsAlert
									searchingItems={searchedProvisions}
									defaultMessage={t('provisions.provisionsList.noResult')}
									searchMessage={t('provisions.provisionsList.noSearchResult')}
								/>
								:
								<>
									{
										view === 0 && !mobile ?
											<List
												listItems={finalList.length === 0 ? list : finalList}
												setFinalList={setFinalList}
												currentPage={currentPage}
												setCurrentPage={setCurrentPage}
												itemsPerPage={itemsPerPage}
												setItemsPerPage={setItemsPerPage}
												totalPages={totalPages}
												setIsLoading={setIsLoadingDossier}
												isSubLoading={isSubLoading}
												dossierStatus={dossierStatus}
												setDossierStatus={setDossierStatus}
												certificateON={certificateON}
												setCertificateON={setCertificateON}
											/>
											:
											<Mosaic
												listItems={finalList.length === 0 ? list : finalList}
												currentPage={currentPage}
												itemsPerPage={itemsPerPage}
												setItemsPerPage={setItemsPerPage}
												totalPages={totalPages}
												setCurrentPage={setCurrentPage}
												setIsLoading={setIsLoadingDossier}
												isSubLoading={isSubLoading}
											/>
									}
									<AlertInfo />
								</>
						}
					</>
			}
		</Grid>
	)
}

export default withRouter(OngoingRequests)
