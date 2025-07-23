import React, { useEffect } from 'react';

import { Grid } from '@material-ui/core';
import ProvinceAdvance from '../ProvinceAdvance/ProvinceAdvance';
import { useState } from 'react';
import TownAdvance from '../TownAdvance/TownAdvance';
import StreetNameAdvane from '../StreetNameAdvane/StreetNameAdvane';
import Button from '../../../../../../common/components/button/Button';
import { useDispatch } from 'react-redux';
import { thunkGetListStreets } from '../../../../../actions/GestionAveriasThunkActions';
import useStyles from '../../SearchCups.styles';
import { useTranslation } from 'react-i18next';
import ListDirection from '../../list/ListDirection';

interface BusquedaExtraI {
    handleClick: Function,
    toggle?:Function
    province?: string
    // setProvince?: Function
    // population?: string
    // setPopulation?: Function
    // street?: string
    // setStreet?: Function
	provinces : Array<any>;
	// errorTowns : boolean;
	// getTowns : any;
	// setParametersTowns : any;
	// resetRetriesTowns : any;
	// loadingTowns : boolean;
	// towns : Array<any>;	
	// setProvinceCodeTowns : any;
	// setInformedTownsExternal : any;
	// setTownNameExternal : any;
	// clearTowns : any;
    // clear?:Function
}

export default function BusquedaExtra(props:BusquedaExtraI) {
    const styles = useStyles({})
	const { t } = useTranslation()
    const dispatch = useDispatch()

    const [stateName, setStateName] = useState(props.province ? props.province : '')
    const [townName, setTownName] = useState('')
    const [streetName, setStreetName] = useState('')
    const [extraInfo, setExtraInfo] = useState(false)
    const [streetEstra, setStreetExtra] = useState([])

    const findSum = () => {
        setExtraInfo(false)
		const okProvince = props.provinces.find(provinceFromList => provinceFromList.provinceName === stateName)
        if (okProvince) {
            dispatch(thunkGetListStreets(streetName, okProvince.provinceCode, '', '', townName, '', '', (response) => {
                if (response && response.streets && response.streets.items) {
                    setStreetExtra(response.streets.items)
                    setExtraInfo(true)
                }
                 
            }))
        } else {
            dispatch(thunkGetListStreets(streetName, '', '', '', townName, '', '', (response) => {
                if (response && response.streets && response.streets.items) {
                    setStreetExtra(response.streets.items)
                    setExtraInfo(true)
                }
            }))
        }
	}

    const resetFilters = () => {
            setStateName('')
            // props.setPopulation('')
            setTownName('')
            // props.setProvince('')
            setStreetName('')
            // props.setStreet('')
        
    }




    return (
        <>
            <Grid container xs={12} sm={10} md={12} spacing={2} className={styles.bkg} style={{marginTop: '0'}}>
                <ProvinceAdvance
                    stateName={stateName}
                    setStateName={setStateName}
                    // setProvince={props.setProvince}
                    statesList={props.provinces}
                />
            </Grid>
            <Grid container xs={12} sm={10} md={12} spacing={2} className={styles.bkg} style={{marginBottom: 0}}>
                <TownAdvance
                    townName={townName}
                    setTownName={setTownName}
                    // errorTowns={props.errorTowns}
                    // getTowns={props.getTowns}
                    // setParametersTowns={props.setParametersTowns}
                    // resetRetriesTowns={props.resetRetriesTowns}
                    // loadingTowns={props.loadingTowns}
                    // towns={props.towns}
                    // setProvinceCodeTowns={props.setProvinceCodeTowns}
                    // setInformedTownsExternal={props.setInformedTownsExternal}
                    // setTownNameExternal={props.setTownNameExternal}
                    // clearTowns={props.clearTowns}
                />
                <StreetNameAdvane
                    streetName={streetName}
                    setStreetName={setStreetName}
                />
            </Grid>
            <Grid container xs={12} sm={10} md={12} spacing={2} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: '15px 0 0 0' }}>
                <Button
                    className={styles.button}
                    text={t('common.buttons.SearchSumExtra')}
                    color='primary'
                    size='large'
                    variant='contained'
                    // disabled={(error === false && (credential.trim() !== '') || (socialReason.trim() !== '') || (name.trim() !== '') || (surname1.trim() !== '') || (surname2.trim() !== '') || (idAddress.trim() !== '' || (town.trim() !== '' && province.trim() !== '' && zipCode.trim() !== '' && streetType.trim() !== '' && streetName.trim() !== '' && number.trim() !== '')) || (name.trim() !== '' && surname1.trim() !== '') || (name.trim() !== '') || (surname1.trim() !== '') || (surname2.trim() !== '')) ? false : true}
                    onClick={findSum}
                    style={{margin: 'auto'}}
                />

                {(stateName?.trim() !== '' || townName.trim() !== '' || streetName.trim() !== '') && (
                    <Grid item style={{position: 'absolute', marginLeft: '350px'}}>
                        <p className={styles.link} onClick={resetFilters} style={{margin: 0, padding: 0}}>
                            {t('averias.management.searchCups.resetFilters')}
                        </p>
                    </Grid>
                )}

            </Grid>
            {
                extraInfo && (
                    <ListDirection
                        extra={streetEstra}
                        handleClick={props.handleClick}
                        toggle={props.toggle}
                    />
                )
            }
        </>
    )
}