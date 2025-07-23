import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

import Grid from '@material-ui/core/Grid'

import {
	completeDateWithSlash,
	formatDateAndHourStringWithBars,
	formatMonth
} from '../../../../common/lib/FormatLib'

import useStyles from './LineGraph.styles'

import DynamicLegend from '../dynamicLegend/DynamicLegend'
//import LegendSelfConsumption from '../legend/LegendSelfConsumption'

// Plugin para redondear las esquinas de las barras
//require('../../../../../../common/components/chart/chartRounded.styles.js')

const LineGraph = (props: any) => {
	const classes = useStyles({})
	const { t } = useTranslation()

	const {
		currentSupplyConsumptions,
		currentCompareConsumptions,
		consumptionsFilters,
		energiaReactiva
	} = props

	const [state, setState] = useState({
		checkedEHCR: true as boolean,
		checkedEHAC: true as boolean,
		checkedEHCCA: true as boolean,
		checkedEHEX: true as boolean,
		checkedEHNG: true as boolean,
		checkedEHCSA: true as boolean,
		checkedEHCRi: true as boolean,
		checkedEHACi: true as boolean,
		checkedEHCi: true as boolean,
		checkedEHEXi: true as boolean,
		checkedEHNGi: true as boolean,
		checkedEHEXG: true as boolean
	});

	const [containValue, setContainValue] = useState({
		EHCR: false as boolean,
		EHAC: false as boolean,
		EHCCA: false as boolean,
		EHEX: false as boolean,
		EHNG: false as boolean,
		EHCSA: false as boolean,
		EHCRi: false as boolean,
		EHACi: false as boolean,
		EHCi: false as boolean,
		EHEXi: false as boolean,
		EHNGi: false as boolean,
		EHEXG: false as boolean
	});

	//usaremos insertValues como funcion para introducir los valores en las variables
	const insertValues = (value: any, values: any, labelAux: any) => {
		let day = new Date(labelAux[2], labelAux[1] - 1, labelAux[0]).getDay() - 1
		if (day === -1) { day = 6 }

		if (consumptionsFilters.granularity === 'S') {
			value && values.splice(day, 1, parseFloat(value.replace(',', '.')))
		} else {
			values.push(parseFloat(value.replace(',', '.')))
		}
	}

	//usaremos pushinsertValues como funcion para introducir los valores en las variables
	const insertPushValues = (value: any, values: any, labelAux: any) => {
		let day = new Date(labelAux[2], labelAux[1] - 1, labelAux[0]).getDay() - 1
		if (day === -1) { day = 6 }

		if (consumptionsFilters.granularity === 'S') {
			value && values.splice(day, 1, 0.0000001)
		} else {
			values.push(0.0000001)
		}
	}

	const chartData = (canvas: any) => {

		let labels = [] as any

		// Caso de prueba 1
		let valuesEHCR = []
		let valuesEHAC = []
		let valuesEHCCA = []
		let valuesEHEX = []
		let valuesEHNG = []
		let valuesEHCSA = []
		//Caso de prueba 2
		let valuesEHCRi = []
		let valuesEHACi = []
		let valuesEHCi = []
		let valuesEHEXi = []
		let valuesEHNGi = []
		let valuesEHEXG = []
		// Caso de prueba 1 compare
		let valuesEHCRcompare = []
		let valuesEHACcompare = []
		let valuesEHCCAcompare = []
		let valuesEHEXcompare = []
		let valuesEHNGcompare = []
		let valuesEHCSAcompare = []
		//Caso de prueba 2 compare
		let valuesEHCRicompare = []
		let valuesEHACicompare = []
		let valuesEHCicompare = []
		let valuesEHEXicompare = []
		let valuesEHNGicompare = []
		let valuesEHEXGcompare = []

		//En caso de estar viendo semanas le damos las posiciones iniciales a los arrays que contendrán los valores a mostrar
		if (consumptionsFilters.granularity === 'S') {
			labels = getWeekDays()
			// labels = [t('supplies.suppliesDetails.components.consumption.charts.week.lunes'), t('supplies.suppliesDetails.components.consumption.charts.week.martes'), t('supplies.suppliesDetails.components.consumption.charts.week.miercoles'), t('supplies.suppliesDetails.components.consumption.charts.week.jueves'), t('supplies.suppliesDetails.components.consumption.charts.week.viernes'), t('supplies.suppliesDetails.components.consumption.charts.week.sabado'), t('supplies.suppliesDetails.components.consumption.charts.week.domingo')]
			valuesEHCRi = ['', '', '', '', '', '', '']
			valuesEHACi = ['', '', '', '', '', '', '']
			valuesEHCi = ['', '', '', '', '', '', '']
			valuesEHEXi = ['', '', '', '', '', '', '']
			valuesEHNGi = ['', '', '', '', '', '', '']
			valuesEHEXG = ['', '', '', '', '', '', '']
			valuesEHCR = ['', '', '', '', '', '', '']
			valuesEHAC = ['', '', '', '', '', '', '']
			valuesEHCCA = ['', '', '', '', '', '', '']
			valuesEHEX = ['', '', '', '', '', '', '']
			valuesEHNG = ['', '', '', '', '', '', '']
			valuesEHCSA = ['', '', '', '', '', '', '']
			valuesEHCRicompare = ['', '', '', '', '', '', '']
			valuesEHACicompare = ['', '', '', '', '', '', '']
			valuesEHCicompare = ['', '', '', '', '', '', '']
			valuesEHEXicompare = ['', '', '', '', '', '', '']
			valuesEHNGicompare = ['', '', '', '', '', '', '']
			valuesEHEXGcompare = ['', '', '', '', '', '', '']
			valuesEHCRcompare = ['', '', '', '', '', '', '']
			valuesEHACcompare = ['', '', '', '', '', '', '']
			valuesEHCCAcompare = ['', '', '', '', '', '', '']
			valuesEHEXcompare = ['', '', '', '', '', '', '']
			valuesEHNGcompare = ['', '', '', '', '', '', '']
			valuesEHCSAcompare = ['', '', '', '', '', '', '']
		}

		if (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0) {

			let dayCounter = 1

			currentSupplyConsumptions.map(
				(item) => {
					let labelAux = []
					if (item.date) {
						labelAux = item.date.split('/')
					}
					//Tenemos que coger los valores que nos lleguen indistintamente de cualquier esquema
					if (item.EHCR) {
						if (item.EHCR !== '') {
							insertValues(item.EHCR, valuesEHCR, labelAux)
							if (!containValue.EHCR) {
								setContainValue({
									...containValue,
									EHCR: true
								})
							}
						} else {
							insertPushValues(item.EHCR, valuesEHCR, labelAux)
						}
					} else {
						insertPushValues(item.EHCR, valuesEHCR, labelAux)
					}

					if (item.EHAC) {
						if (item.EHAC !== '') {
							insertValues(item.EHAC, valuesEHAC, labelAux)
							if (!containValue.EHAC) {
								setContainValue({
									...containValue,
									EHAC: true
								})
							}
						} else {
							insertPushValues(item.EHAC, valuesEHAC, labelAux)
						}
					} else {
						insertPushValues(item.EHAC, valuesEHAC, labelAux)
					}

					if (item.EHCCA) {
						if (item.EHCCA !== '') {
							insertValues(item.EHCCA, valuesEHCCA, labelAux)
							if (!containValue.EHCCA) {
								setContainValue({
									...containValue,
									EHCCA: true
								})
							}
						} else {
							insertPushValues(item.EHCCA, valuesEHCCA, labelAux)
						}
					} else {
						insertPushValues(item.EHCCA, valuesEHCCA, labelAux)
					}

					if (item.EHEX) {
						if (item.EHEX !== '') {
							insertValues(item.EHEX, valuesEHEX, labelAux)
							if (!containValue.EHEX) {
								setContainValue({
									...containValue,
									EHEX: true
								})
							}
						} else {
							insertPushValues(item.EHEX, valuesEHEX, labelAux)
						}
					} else {
						insertPushValues(item.EHEX, valuesEHEX, labelAux)
					}

					if (item.EHNG) {
						if (item.EHNG !== '') {
							insertValues(item.EHNG, valuesEHNG, labelAux)
							if (!containValue.EHNG) {
								setContainValue({
									...containValue,
									EHNG: true
								})
							}
						} else {
							insertPushValues(item.EHNG, valuesEHNG, labelAux)
						}
					} else {
						insertPushValues(item.EHNG, valuesEHNG, labelAux)
					}

					if (item.EHCRi) {
						if (item.EHCRi !== '') {
							insertValues(item.EHCRi, valuesEHCRi, labelAux)
							if (!containValue.EHCRi) {
								setContainValue({
									...containValue,
									EHCRi: true
								})
							}
						} else {
							insertPushValues(item.EHCRi, valuesEHCRi, labelAux)
						}
					} else {
						insertPushValues(item.EHCRi, valuesEHCRi, labelAux)
					}

					if (item.EHACi) {
						if (item.EHACi !== '') {
							insertValues(item.EHACi, valuesEHACi, labelAux)
							if (!containValue.EHACi) {
								setContainValue({
									...containValue,
									EHACi: true
								})
							}
						} else {
							insertPushValues(item.EHACi, valuesEHACi, labelAux)
						}
					} else {
						insertPushValues(item.EHACi, valuesEHACi, labelAux)
					}

					if (item.EHCi) {
						if (item.EHCi !== '') {
							insertValues(item.EHCi, valuesEHCi, labelAux)
							if (!containValue.EHCi) {
								setContainValue({
									...containValue,
									EHCi: true
								})
							}
						} else {
							insertPushValues(item.EHCi, valuesEHCi, labelAux)
						}
					} else {
						insertPushValues(item.EHCi, valuesEHCi, labelAux)
					}

					if (item.EHEXi) {
						if (item.EHEXi !== '') {
							insertValues(item.EHEXi, valuesEHEXi, labelAux)
							if (!containValue.EHEXi) {
								setContainValue({
									...containValue,
									EHEXi: true
								})
							}
						} else {
							insertPushValues(item.EHEXi, valuesEHEXi, labelAux)
						}
					} else {
						insertPushValues(item.EHEXi, valuesEHEXi, labelAux)
					}

					if (item.EHNGi) {
						if (item.EHNGi !== '') {
							insertValues(item.EHNGi, valuesEHNGi, labelAux)
							if (!containValue.EHNGi) {
								setContainValue({
									...containValue,
									EHNGi: true
								})
							}
						} else {
							insertPushValues(item.EHNGi, valuesEHNGi, labelAux)
						}
					} else {
						insertPushValues(item.EHNGi, valuesEHNGi, labelAux)
					}

					if (item.EHCSA) {
						if (item.EHCSA !== '') {
							insertValues(item.EHCSA, valuesEHCSA, labelAux)
							if (!containValue.EHCSA) {
								setContainValue({
									...containValue,
									EHCSA: true
								})
							}
						} else {
							insertPushValues(item.EHCSA, valuesEHCSA, labelAux)
						}
					} else {
						insertPushValues(item.EHCSA, valuesEHCSA, labelAux)
					}

					if (item.EHEXG) {
						if (item.EHEXG !== '') {
							insertValues(item.EHEXG, valuesEHEXG, labelAux)
							if (!containValue.EHEXG) {
								setContainValue({
									...containValue,
									EHEXG: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHEXG, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHEXG, labelAux)
					}

					if (consumptionsFilters.granularity === 'D') {
						labels.push(dayCounter)
						dayCounter++
					}

					if (consumptionsFilters.granularity === 'M') {
						if (item.date) {
							labels.push(formatMonth(labelAux[1].toString()) + ' ' + labelAux[2].toString())
						}
					}

					if (consumptionsFilters.granularity === 'H') {
						labels.push(item.hour + ':00')
					}

				}
			)
		}

		if (currentCompareConsumptions && !currentCompareConsumptions.consumptions && currentCompareConsumptions.length !== 0) {

			let dayCounter = 1

			currentCompareConsumptions.map(
				(item) => {
					let labelAux = []
					if (item.date) {
						labelAux = item.date.split('/')
					}
					//Tenemos que coger los valores que nos lleguen indistintamente de cualquier esquema
					if (item.EHCR) {
						if (item.EHCR !== '') {
							insertValues(item.EHCR, valuesEHCRcompare, labelAux)
							if (!containValue.EHCR) {
								setContainValue({
									...containValue,
									EHCR: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHCRcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHCRcompare, labelAux)
					}

					if (item.EHAC) {
						if (item.EHAC !== '') {
							insertValues(item.EHAC, valuesEHACcompare, labelAux)
							if (!containValue.EHAC) {
								setContainValue({
									...containValue,
									EHAC: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHACcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHACcompare, labelAux)
					}

					if (item.EHCCA) {
						if (item.EHCCA !== '') {
							insertValues(item.EHCCA, valuesEHCCAcompare, labelAux)
							if (!containValue.EHCCA) {
								setContainValue({
									...containValue,
									EHCCA: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHCCAcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHCCAcompare, labelAux)
					}

					if (item.EHEX) {
						if (item.EHEX !== '') {
							insertValues(item.EHEX, valuesEHEXcompare, labelAux)
							if (!containValue.EHEX) {
								setContainValue({
									...containValue,
									EHEX: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHEXcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHEXcompare, labelAux)
					}

					if (item.EHNG) {
						if (item.EHNG !== '') {
							insertValues(item.EHNG, valuesEHNGcompare, labelAux)
							if (!containValue.EHNG) {
								setContainValue({
									...containValue,
									EHNG: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHNGcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHNGcompare, labelAux)
					}

					if (item.EHCRi) {
						if (item.EHCRi !== '') {
							insertValues(item.EHCRi, valuesEHCRicompare, labelAux)
							if (!containValue.EHCRi) {
								setContainValue({
									...containValue,
									EHCRi: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHCRicompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHCRicompare, labelAux)
					}

					if (item.EHACi) {
						if (item.EHACi !== '') {
							insertValues(item.EHACi, valuesEHACicompare, labelAux)
							if (!containValue.EHACi) {
								setContainValue({
									...containValue,
									EHACi: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHACicompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHACicompare, labelAux)
					}

					if (item.EHCi) {
						if (item.EHCi !== '') {
							insertValues(item.EHCi, valuesEHCicompare, labelAux)
							if (!containValue.EHCi) {
								setContainValue({
									...containValue,
									EHCi: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHCicompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHCicompare, labelAux)
					}

					if (item.EHEXi) {
						if (item.EHEXi !== '') {
							insertValues(item.EHEXi, valuesEHEXicompare, labelAux)
							if (!containValue.EHEXi) {
								setContainValue({
									...containValue,
									EHEXi: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHEXicompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHEXicompare, labelAux)
					}

					if (item.EHNGi) {
						if (item.EHNGi !== '') {
							insertValues(item.EHNGi, valuesEHNGicompare, labelAux)
							if (!containValue.EHNGi) {
								setContainValue({
									...containValue,
									EHNGi: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHNGicompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHNGicompare, labelAux)
					}

					if (item.EHCSA) {
						if (item.EHCSA !== '') {
							insertValues(item.EHCSA, valuesEHCSAcompare, labelAux)
							if (!containValue.EHCSA) {
								setContainValue({
									...containValue,
									EHCSA: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHCSAcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHCSAcompare, labelAux)
					}

					if (item.EHEXG) {
						if (item.EHEXG !== '') {
							insertValues(item.EHEXG, valuesEHEXGcompare, labelAux)
							if (!containValue.EHEXG) {
								setContainValue({
									...containValue,
									EHEXG: true
								})
							}
						} else {
							insertPushValues(item.EHEXG, valuesEHEXGcompare, labelAux)
						}
					} else {
						insertPushValues(item.EHEXG, valuesEHEXGcompare, labelAux)
					}
				}
			)
		}

		return {
			labels: labels,
			datasets: [
				{
					label: 'EHCR',
					fill: false,
					borderColor: '#009aa6',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCR && containValue.EHCR && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCR,
					backgroundColor: '#009aa6'
				},
				{
					label: 'EHAC',
					fill: false,
					borderColor: '#a2ad00',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHAC && containValue.EHAC && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHAC,
					backgroundColor: '#a2ad00'
				},
				{
					label: 'EHCCA',
					fill: false,
					borderColor: '#0066cc',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCCA && containValue.EHCCA && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCCA,
					backgroundColor: '#0066cc'
				},
				{
					label: 'EHEX',
					fill: false,
					borderColor: '#e57200',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEX && containValue.EHEX && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEX,
					backgroundColor: '#e57200'
				},
				{
					label: 'EHNG',
					fill: false,
					borderColor: '#004571',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHNG && containValue.EHNG && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHNG,
					backgroundColor: '#004571'
				},
				{
					label: 'EHCSA',
					fill: false,
					borderColor: '#ad57e2',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCSA && containValue.EHCSA && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCSA,
					backgroundColor: '#ad57e2'
				},
				{
					label: 'EHCRi',
					fill: false,
					borderColor: '#d7af05',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCRi && containValue.EHCRi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCRi,
					backgroundColor: '#d7af05'
				},
				{
					label: 'EHACi',
					fill: false,
					borderColor: '#6fcf97',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHACi && containValue.EHACi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHACi,
					backgroundColor: '#6fcf97'
				},
				{
					label: 'EHCi',
					fill: false,
					borderColor: '#8217e5',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCi && containValue.EHCi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHCi,
					backgroundColor: '#8217e5'
				},
				{
					label: 'EHEXi',
					fill: false,
					borderColor: '#56ccf2',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEXi && containValue.EHEXi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEXi,
					backgroundColor: '#56ccf2'
				},
				{
					label: 'EHNGi',
					fill: false,
					borderColor: '#b5474c',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHNGi && containValue.EHNGi && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHNGi,
					backgroundColor: '#b5474c'
				},
				{
					label: 'EHEXG',
					fill: false,
					borderColor: '#4e7e17',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEXG && containValue.EHEXG && (currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0)) && valuesEHEXG,
					backgroundColor: '#4e7e17'
				},
				{
					label: 'EHCRcompare',
					fill: false,
					borderColor: '#009aa6',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCR && containValue.EHCR && consumptionsFilters.compare === 'C') && valuesEHCRcompare,
					backgroundColor: '#009aa6',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHACcompare',
					fill: false,
					borderColor: '#a2ad00',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHAC && containValue.EHAC && consumptionsFilters.compare === 'C') && valuesEHACcompare,
					backgroundColor: '#a2ad00',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHCCAcompare',
					fill: false,
					borderColor: '#0051a2',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCCA && containValue.EHCCA && consumptionsFilters.compare === 'C') && valuesEHCCAcompare,
					backgroundColor: '#0051a2',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHEXcompare',
					fill: false,
					borderColor: '#e57200',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEX && containValue.EHEX && consumptionsFilters.compare === 'C') && valuesEHEXcompare,
					backgroundColor: '#e57200',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHNGcompare',
					fill: false,
					borderColor: '#004571',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHNG && containValue.EHNG && consumptionsFilters.compare === 'C') && valuesEHNGcompare,
					backgroundColor: '#004571',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHCSAcompare',
					fill: false,
					borderColor: '#ad57e2',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCSA && containValue.EHCSA && consumptionsFilters.compare === 'C') && valuesEHCSAcompare,
					backgroundColor: '#ad57e2',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHCRicompare',
					fill: false,
					borderColor: '#d7af05',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCRi && containValue.EHCRi && consumptionsFilters.compare === 'C') && valuesEHCRicompare,
					backgroundColor: '#d7af05',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHACicompare',
					fill: false,
					borderColor: '#6fcf97',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHACi && containValue.EHACi && consumptionsFilters.compare === 'C') && valuesEHACicompare,
					backgroundColor: '#6fcf97',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHCicompare',
					fill: false,
					borderColor: '#8217e5',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHCi && containValue.EHCi && consumptionsFilters.compare === 'C') && valuesEHCicompare,
					backgroundColor: '#8217e5',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHEXicompare',
					fill: false,
					borderColor: '#56ccf2',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEXi && containValue.EHEXi && consumptionsFilters.compare === 'C') && valuesEHEXicompare,
					backgroundColor: '#56ccf2',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHNGicompare',
					fill: false,
					borderColor: '#b5474c',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHNGi && containValue.EHNGi && consumptionsFilters.compare === 'C') && valuesEHNGicompare,
					backgroundColor: '#b5474c',
					borderDash: [5],
					borderDashOffset: 5
				},
				{
					label: 'EHEXGcompare',
					fill: false,
					borderColor: '#4e7e17',
					borderWidth: 1,
					lineTension: 0,
					data: (state.checkedEHEXG && containValue.EHEXG && consumptionsFilters.compare === 'C') && valuesEHEXGcompare,
					backgroundColor: '#4e7e17',
					borderDash: [5],
					borderDashOffset: 5
				}
			]
		}
	}

	let missingValue = t('supplies.suppliesDetails.components.consumption.charts.graph.missingData')

	const chartOptions = {
		cornerRadius: 8,
		legend: {
			display: false
		},
		responsive: true,
		maintainAspectRatio: false,
		tooltips: {
			mode: 'index',
			intersect: false,
			callbacks: {
				label: function (t, d) {
					if (t.datasetIndex === 0) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 1) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 2) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 3) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 4) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 5) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 6) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 7) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 8) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 9) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 10) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 11) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 12) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 13) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 14) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 15) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 16) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 17) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 18) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 19) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 20) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 21) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 22) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					} else if (t.datasetIndex === 23) {
						if (t.value === 'NaN' || t.value === '1e-7') {
							return missingValue
						} else {
							return (energiaReactiva ? t.yLabel.toFixed(2) + ' kVArh' : t.yLabel.toFixed(2) + ' kWh')
						}
					}
				}
			}
		},
		scales: {
			xAxes: [{
				barPercentage: 0.3,
				gridLines: {
					display: false,
					stepsSize: 10
				},
				ticks: {
					fontColor: '#004571',
					fontSize: 11
				}
			}],
			yAxes: [{
				gridLines: {
					display: true,
					color: '#D8D8D8',
					borderDash: [12, 6]
				},
				ticks: {
					beginAtZero: true,
					stepsSize: 50,
					fontColor: '#004571',
					fontSize: 11,
					padding: 16,
					callback: function (label) {
						if (energiaReactiva) {
							return label + ' kVArh '
						}
						return label + ' kWh'
					}
				}
			}]
		}
		/*onClick: function (c, i) {
			if (i && i[0]) {
				//setDatesRange(i[0]._chart.data.labels[0])
				var elem = auxLabels[0].split('/')
				let auxIndex = parseInt(elem[1]) - 1
				let index = i[0]._index - auxIndex //El índice que viene del graph tiene dos posiciones más que los items del currentSupplyConsumption ya que hay meses vacíos delante
				let label = auxLabels[index]
				//let label = auxDates[index]

				setCurrentCompareConsumptions([])

				if (consumptionsFilters.granularity === 'M') {
					let startDate = new Date(formatDateHyphens(label))
					let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

					setIsLoading(true)

					setConsumptionsFilters({
						...consumptionsFilters,
						granularity: 'D',
						startDate: label,
						endDate: formatDate(endDate)
					})
				}
				else if ((consumptionsFilters.granularity === 'D' || consumptionsFilters.granularity === 'S') && consumptionsFilters.compare === 'N') {
					setIsLoading(true)

					setConsumptionsFilters({
						...consumptionsFilters,
						granularity: 'H',
						startDate: label,
						endDate: label,
						//compare: 'N'
					})
				}
			}
		}*/

	
	}
	const getWeekDays = () => {
		let weekDays = [] as any
		let fecha = new Date(completeDateWithSlash(consumptionsFilters.startDate + ' 00:00:00'))
    
		for(let i = 0; i < 7; i++){
			weekDays.push((formatDateAndHourStringWithBars(fecha).split(' '))[0])	
			fecha.setDate((fecha.getDate()+1))
			console.log(weekDays);
		}

    return weekDays
	}
	return (
		<>
			<Grid container item md={12} className={classes.container}>

				<Line
					width={800}
					height={300}
					data={chartData}
					options={chartOptions}
				/>

			</Grid>
			{(currentSupplyConsumptions && !currentSupplyConsumptions.consumptions && currentSupplyConsumptions.length !== 0) &&
        <>
          <DynamicLegend
            state={state}
            setState={setState}
            containValue={containValue}
          />
        </>
      }

		</>
	)
}

export default LineGraph
