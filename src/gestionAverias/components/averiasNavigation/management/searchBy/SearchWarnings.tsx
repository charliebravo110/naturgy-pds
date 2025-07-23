import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './SearchBy.styles'
import Button from '../../../../../common/components/button/Button'
import Select from '../../../../../common/components/select/Select'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import { useMediaQuery } from '@material-ui/core'

const SearchWarnings = (props: any) => {

	const { t } = useTranslation();
	const styles = useStyles({});
	const mobileRes = useMediaQuery('(max-width:576px)')

	const {
		zoneList,
		zone,
		handleChangeInput,
		statesList,
		province,
		performSearch,
		resetFilters,
		statusList,
		status,
		datepickerDate1,
		setDatepickerDate1,
		datepickerDate2,
		setDatepickerDate2
	} = props

	//const [datepickerDate1, setDatepickerDate1] = useState<Date>(new Date());
	//const [datepickerDate2, setDatepickerDate2] = useState<Date>(new Date());

	return (
		<Grid container direction='column' className={styles.inputsArea}>
			<Grid container className={styles.inputsArea}>
				<Grid container xs={12} sm={12} md={12} spacing={3}>
				<Grid item xs={12} sm={3}>
						<span className={styles.inputTitle}>{t('averias.management.consult.province')}</span>
						<Select
							className={styles.inputV2}
							label={t('averias.management.searchCups.address.select')}
							values={statesList}
							value={province}
							onChange={(e) => handleChangeInput('state', e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={3} md={6}>
						<span className={styles.inputTitle}>{t('averias.management.consult.zone')}</span>
						<Select
							className={styles.inputV2}
							label={t('averias.management.consult.selectZone')}
							values={zoneList}
							value={zone}
							onChange={(e) => handleChangeInput('zone', e.target.value)}
						/>
					</Grid>					
				</Grid>
			</Grid>

			<Grid container className={styles.inputsArea}>
				<Grid container xs={12} sm={12} md={12} spacing={3}>
					<Grid item xs={12} sm={12} md={5}>
						<span className={styles.inputTitle}>{t('averias.management.consult.status')}</span>
						<Select
							className={styles.inputV2}
							default
							label={t('averias.management.searchCups.address.select')}
							values={statusList}
							value={status}
							onChange={(e) => handleChangeInput('status', e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={2}>
						<span className={styles.inputTitle}>{t('averias.management.consult.startDate')}</span>
						<DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'}/>
					</Grid>
					<Grid item xs={12} sm={12} md={2}>
						<span className={styles.inputTitle}>{t('averias.management.consult.endDate')}</span>
						<DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' maxDate={new Date()} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
					</Grid>
				</Grid>
			</Grid>
			<Grid container direction='row' justifyContent='center' spacing={3} className={styles.buttons}>
				<Grid item  justifyContent='center'>
					<Button
						className={styles.cancelButton}
						text={t('common.buttons.cancel')}
						color='inherit'
						size='large'
						variant='contained'
						onClick={resetFilters}
					/>
				</Grid>

				<Grid item  justifyContent='center'>
					<Button
						className={styles.button}
						text={t('averias.management.consult.searchButton')}
						color='primary'
						size='large'
						variant='contained'
						onClick={performSearch}
					/>
				</Grid>

				<Grid item xs={12} style={{display:'flex'}} justifyContent='center'>
					<p className={styles.link} onClick={resetFilters}>
						{t('averias.management.searchCups.resetFilters')}
					</p>
				</Grid>

			</Grid>
		</Grid>
	);
}

export default SearchWarnings;
