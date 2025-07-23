import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import Spinner from '../../common/components/spinner/Spinner';
import useStyles from './AuditManagement.styles';
import { useTranslation } from 'react-i18next';
import Filter from './filter/Filter';
import List from './list/List';
import { thunkGetAuditList } from '../actions/AuditThunkActions';
import { Redirect } from 'react-router-dom'

const AuditManagement = () => {
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
	const styles = useStyles({});
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [auditList, setAuditList] = useState([] as any);
	const [showList, setShowList] = useState<boolean>(false);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [filterGlobal, setFilterGlobal] = useState<any>();
	const [lastKey, setLastKey] = useState<any>();
	const userRoles = sessionStorage.getItem('userRoles') || ''
	const userRolesArray = userRoles.split(',')

	const getFilterDate = (date1: Date, date2: Date): Date => {
		return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), new Date(date2).getHours(), new Date(date2).getMinutes());
	}

	const handleFilter = (filter: any) => {
		setFilterGlobal(filter);
		const from_date = getFilterDate(filter.dateFrom, filter.hourFrom);
		const to_date = getFilterDate(filter.dateTo, filter.hourTo);

		const filterObj = {
			'from_date': Math.round(from_date.getTime() / 1000),
			'to_date': Math.round(to_date.getTime() / 1000),
			'username': filter.document || '',
			'validated_login': filter.loginVal,
			'mfa_channel': filter.loginVal !== 'no' ? filter.channel : '',
			'validated_mfa': filter.loginVal !== 'no' ? filter.doubleVal : '',
			'size': itemsPerPage
		};

		setIsLoadingList(true);
		dispatch(thunkGetAuditList((response) => {
			if (response && response.result && response.result.codResult === '0000') {
				setAuditList(response.records);
				setLastKey(response.lastEvaluatedKey);
				setShowList(true);
				setIsLoadingList(false);
			} else {
				setIsLoadingList(false);
				setAuditList([]);
			}
		}, filterObj, ''));
	}

	const handleExport = () => {
		const from_date = getFilterDate(filterGlobal.dateFrom, filterGlobal.hourFrom);
		const to_date = getFilterDate(filterGlobal.dateTo, filterGlobal.hourTo);

		const filterObj = {
			'from_date': Math.round(from_date.getTime() / 1000),
			'to_date': Math.round(to_date.getTime() / 1000),
			'username': filterGlobal.document || '',
			'validated_login': filterGlobal.loginVal,
			'mfa_channel': filterGlobal.loginVal !== 'no' ? filterGlobal.channel : '',
			'validated_mfa': filterGlobal.loginVal !== 'no' ? filterGlobal.doubleVal : '',
			'size': itemsPerPage
		};

		setIsLoadingList(true);
		dispatch(thunkGetAuditList((response) => {
			if (response && response.result && response.result.codResult === '0000') {
				setIsLoadingList(false);
				window.open(response.url)
			} else {
				setIsLoadingList(false);
			}
		}, filterObj, 'text/csv'));
	}

	const handleMoreResults = () => {
		setIsLoadingList(true);
		const from_date = getFilterDate(filterGlobal.dateFrom, filterGlobal.hourFrom);
		const to_date = getFilterDate(filterGlobal.dateTo, filterGlobal.hourTo);

		const filterObj = {
			'from_date': Math.round(from_date.getTime() / 1000),
			'to_date': Math.round(to_date.getTime() / 1000),
			'username': filterGlobal.document || '',
			'validated_login': filterGlobal.loginVal,
			'mfa_channel': filterGlobal.loginVal !== 'no' ? filterGlobal.channel : '',
			'validated_mfa': filterGlobal.loginVal !== 'no' ? filterGlobal.doubleVal : '',
			'size': itemsPerPage
		};

		dispatch(thunkGetAuditList((response) => {
			if (response && response.result && response.result.codResult === '0000') {
				const newList = [...auditList, ...response.records];
				setAuditList(newList);
				setLastKey(response.lastEvaluatedKey);
				setIsLoadingList(false);
			} else {
				setIsLoadingList(false);
				setAuditList([]);
			}
		}, { ...filterObj, lastEvaluatedKey: { ...lastKey } }, ''));
	}

	if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER')) {
			return <Redirect to='/dashboard' />
		} else if (userRolesArray.includes('US_CONSULTANT')) {
			return <Redirect to='/supplies' />
		} else {
			return <Redirect to='/landing' />
		}
	}

	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}
			<Grid container justifyContent='center' alignItems='center' className={styles.container}>
				<Grid item xs={11} sm={10} className={styles.maxWidthForBigScreens}>
					<Grid item className={styles.headerTitle}>
						{t('audit.title')}
					</Grid>
					<Grid container justifyContent='center'>
						<Grid item className={styles.orangeSubtitle}>{t('audit.subtitle')}</Grid>
						<Grid item className={styles.lightSubtitle}>{t('audit.subtitle2')}</Grid>
						<Filter
							setAuditList={setAuditList}
							handleFilter={handleFilter}
						/>
						{
							showList && <List
								items={auditList}
								setItemsPerPage={setItemsPerPage}
								handleExport={handleExport}
								handleMoreResults={handleMoreResults}
								lastKey={lastKey}
								showDynamicSearcher={false}
							/>
						}
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default AuditManagement;