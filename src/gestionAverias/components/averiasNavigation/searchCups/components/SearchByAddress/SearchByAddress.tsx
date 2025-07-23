import React, { useState, useEffect, useRef, useMemo, useCallback, Dispatch, SetStateAction } from 'react'

import { Grid } from '@material-ui/core'
import Province from '../Province/Province'
import Town from '../Town/Town'
import BusquedaAvanzada from '../BusquedaAvanzada/BusquedaAvanzada'
import ColEntity from '../ColEntity/ColEntity'
import IndEntity from '../IndEntity/IndEntity'
import ZipCode from '../ZipCode/ZipCode'
import StreetType from '../StreetType/streetType'
import StreetName from '../StreetName/StreetName'
import NumberInput from '../NumberInput/NumberInput'
import BtnSend from '../BtnSend/BtnSend'
import { iProvince } from '../../hooks/useProvinces'
import { iTown } from '../../hooks/useTowns'
import useStyles from '../../SearchCups.styles'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { iStreetName } from '../../hooks/useStreetNames'
import { iCollectiveEntity } from '../../hooks/useGroupEntities'
import { iIndividualEntity } from '../../hooks/useIndividualEntities'
import SupplyPoint from '../../../../../../common/interfaces/SupplyPoint'
import InputWithTitle from '../Duplicator/Duplicator'


export interface iAddressFormData {
    town?: iTown,
    province?: iProvince,
    indEntity?: iIndividualEntity,
    colEntity?: iCollectiveEntity,
    streetName?: iStreetName
}

export interface iAddress {

    isCapital: string,
    provinceCode: string,
    province: string,
    townCode: string,
    town: string,
    zipCode: string,
    zone: string,
    area: string,
    street: string,
    streetType: string,
    number: string,
    duplicator: string,
    singularEntity: string,
    colectiveEntity: string,
    stair: string,
    floor: string,
    complement: string,
    door: string,

}
interface TSearchByAddressProps {
    collectiveEntities: iCollectiveEntity[],
    cooldownTry: number,
    errorProvinces?: boolean,
    errorTowns?: boolean,
    errorCollectiveEntities?: boolean,
    errorIndividualEntities?: boolean,
    errorStreetNames?: boolean,
    handleChangeInput: (input: string, value: string) => void,
    handleSearchButton: () => void
    individualEntities: iIndividualEntity[],
    loadingStatesList: boolean,
    loadingTowns: boolean,
    loadingCollectiveEntities: boolean,
    loadingIndividualEntities: boolean,
    loadingStreetNames: boolean,
    number: string,
    statesList: iProvince[],
    streetNames: iStreetName[],
    streetType: string,
    toggleOpenModal?: () => void,
    towns: iTown[],
    townCode: string,
    tracksList: string[],
    zipCode: string,
    zipCodesList: any,
    reset: boolean,
    onReset: () => void,
    onUpdate: (data: iAddressFormData) => void,
    getIndividualEntities: (town?: iTown | null, province?: iProvince | null, colEntity?: iCollectiveEntity | null) => void
    getColectiveEntities: (town?: iTown | null, province?: iProvince | null) => void
    dataFromAdvance?: iStreetName
    getProvinces?: () => void,
    province: string,
    town: string,
    colEntity: string,
    indEntity: string,
    getTowns: (province: string, town: string) => Promise<iTown[]>,
    supplyPoint?: SupplyPoint,
    getStreetNames: (provinceParam?: string, townParam?: string, streetParam?: string) => Promise<iStreetName[]>
    streetName: string
    onSetSupply?: () => void
    readOnlyProvince?: iProvince,
    readOnlyTown?: iTown,
    clearStreets: () => void,
    resetTown: boolean,
    offResetTown: () => void
}

export const SearchByAddress = (props: TSearchByAddressProps) => {

    const {
        collectiveEntities,
        cooldownTry,
        errorCollectiveEntities,
        errorIndividualEntities,
        handleChangeInput,
        handleSearchButton,
        individualEntities,
        loadingStatesList,
        loadingTowns,
        loadingCollectiveEntities,
        loadingIndividualEntities,
        loadingStreetNames,
        number,
        onReset,
        reset,
        statesList,
        streetNames,
        streetType,
        toggleOpenModal,
        towns,
        tracksList,
        zipCode,
        zipCodesList,
        onUpdate,
        getIndividualEntities,
        getColectiveEntities,
        dataFromAdvance,
        errorProvinces,
        errorStreetNames,
        errorTowns,
        getProvinces,
        province,
        town,
        colEntity,
        indEntity,
        getTowns,
        supplyPoint,
        getStreetNames,
        streetName,
        readOnlyProvince,
        readOnlyTown,
        clearStreets,
        resetTown,
        offResetTown
    } = props

    const [selectedProvince, setSelectedProvince] = useState<iProvince | null>(null)
    const [selectedTown, setSelectedTown] = useState<iTown | null>(null)
    const [selectedIndEntity, setSelectedIndEntity] = useState<iIndividualEntity | null>(null)
    const [selectedColEntity, setSelectedColEntity] = useState<iCollectiveEntity | null>(null)
    const [selectedStreet, setSelectedStreet] = useState<iStreetName | null>(null)
    const [townFromSupply, setTownFromSupply] = useState<iTown | undefined>(undefined)


    useMemo(() => {
        if (readOnlyProvince) {
            setSelectedProvince(readOnlyProvince)
        }
    }, [readOnlyProvince])

    useMemo(() => {
        setSelectedTown(readOnlyTown)

    }, [readOnlyTown])


    useEffect(() => {
        getProvinces()
    }, [])

    useEffect(() => {
        province && selectedProvince && !selectedTown && getTowns(province, town)
    }, [province, selectedProvince, selectedTown, town])

    useEffect(() => {
        if (town) {
            getIndividualEntities()
            getColectiveEntities()
        }
    }, [town])

    useEffect(() => {
        if (colEntity.length >= 3) {
            getIndividualEntities()
        }
    }, [colEntity])

    // buscar streetName con colectivas y singulares

    useEffect(() => {
        if (streetName.length >= 3 && !selectedStreet && !supplyPoint) {
            getStreetNames();
        }

    }, [streetName, selectedStreet, supplyPoint])

    useEffect(() => {
        if (reset) {
            setSelectedStreet(null)
            setSelectedColEntity(null)
            setSelectedIndEntity(null)
            setSelectedTown(null)
            setSelectedProvince(null)
            onReset()
        }
    }, [reset])

    useEffect(() => {
        if (resetTown) {
            setSelectedStreet(null)
            setSelectedColEntity(null)
            setSelectedIndEntity(null)
            setSelectedTown(null)
            offResetTown()
        }
    }, [resetTown])

    useEffect(() => {
        if (dataFromAdvance) {
            setSelectedStreet(dataFromAdvance)
        }
    }, [dataFromAdvance])

    useEffect(() => {
        onUpdate({ colEntity: selectedColEntity, indEntity: selectedIndEntity, province: selectedProvince, town: selectedTown, streetName: selectedStreet })
    }, [selectedColEntity, selectedIndEntity, selectedProvince, selectedTown, selectedStreet])

    const styles = useStyles({})
    const { t } = useTranslation()

    // efectos para informar campos entre ellos
    useEffect(() => {
        if (selectedTown) {
            setSelectedProvince({ provinceCode: selectedTown.provinceCode, provinceName: selectedTown.provinceName })
        }
    }, [selectedTown])

    useEffect(() => {
        if (selectedIndEntity) {
            const newTown = { municipalityCode: selectedIndEntity.municipalityCode, municipalityName: selectedIndEntity.municipalityName, provinceCode: selectedIndEntity.provinceCode, provinceName: selectedIndEntity.provinceName }

            if (selectedTown && selectedTown.municipalityCode != selectedIndEntity.municipalityCode) {
                setSelectedTown(newTown)
            }
            if (selectedIndEntity.groupentityname) {
                setSelectedColEntity({ ...newTown, entityName: selectedIndEntity.groupentityname, zipCode: selectedIndEntity.zipCode })
            }
        }
    }, [selectedIndEntity, selectedTown])

    useEffect(() => {
        if (selectedColEntity) {
            const newTown = { municipalityCode: selectedColEntity.municipalityCode, municipalityName: selectedColEntity.municipalityName, provinceCode: selectedColEntity.provinceCode, provinceName: selectedColEntity.provinceName }

            if (selectedTown?.municipalityCode != selectedColEntity.municipalityCode) { setSelectedTown(newTown) }
        }
    }, [selectedColEntity, selectedTown])

    useEffect(() => {
        if (selectedStreet) {
            const newTown = { municipalityCode: selectedStreet.municipalityCode, municipalityName: selectedStreet.municipalityName, provinceCode: selectedStreet.provinceCode, provinceName: selectedStreet.provinceName }
            setSelectedTown(newTown)

            if (selectedStreet.singularEntityName) {
                const newSingularEntity: iIndividualEntity = { ...newTown, entityName: selectedStreet.singularEntityName, zipCode: selectedStreet.zipCode, groupentityname: selectedStreet.groupEntityName }
                setSelectedIndEntity(newSingularEntity)
            }

            if (selectedStreet.groupEntityName) {
                const newGroupEntity: iCollectiveEntity = { ...newTown, entityName: selectedStreet.groupEntityName, zipCode: selectedStreet.zipCode }
                setSelectedColEntity(newGroupEntity)
            }
        }
    }, [selectedStreet])

    useEffect(() => {
        if (supplyPoint) {
            setSelectedTown(null)
            setSelectedColEntity(null)
            setSelectedStreet(null)
            setSelectedProvince(null)

            if (statesList && (statesList.length !== 0)) {
                const provinceFromSupply = statesList.find(state => state.provinceName === supplyPoint.address.province)
                setSelectedProvince(provinceFromSupply)
                if (towns && (towns.length !== 0)) {
                    const townFromSupply = towns.find(townFromList => townFromList.municipalityName === supplyPoint.address.town)
                    if (!townFromSupply) {
                        getTowns(provinceFromSupply.provinceCode, supplyPoint.address.town).then(townsPromise => {
                            if (townsPromise && townsPromise[0]) {
                                setTownFromSupply(townsPromise[0])
                            }
                        })
                    } else {
                        setTownFromSupply(townFromSupply)
                    }
                }
            }
        }
    }, [supplyPoint])


    useEffect(() => {
        if (townFromSupply && supplyPoint && supplyPoint.address.town === townFromSupply.municipalityName) {
            getStreetNames(townFromSupply.provinceCode, townFromSupply.municipalityCode, supplyPoint.address.street).then(streets => {
                const possibleStreets = streets.filter(street => street.streetName === supplyPoint.address.street)
                if (possibleStreets.length === 1) {
                    setSelectedStreet(possibleStreets[0])
                } else {
                    setSelectedStreet(possibleStreets.find(street => street.streetType === streetType))

                }
            })
            setSelectedTown(townFromSupply)
            supplyPoint.address.singularEntity && setSelectedIndEntity({ ...townFromSupply, entityName: supplyPoint.address.singularEntity, zipCode: `${supplyPoint.address.zipCode}` })
            supplyPoint.address.colectiveEntity && setSelectedColEntity({ ...townFromSupply, entityName: supplyPoint.address.colectiveEntity, zipCode: `${supplyPoint.address.zipCode}` })
        }
    }, [townFromSupply])

    console.log(Boolean(selectedTown && selectedProvince && selectedStreet))

    return <>
        <Grid container className={`${styles.inputsArea} margin`}>
            <div className={styles.titleWrapper}>
                <span className={styles.searchTitle}>{t('averias.management.searchCups.address.label')}</span>
            </div>
            <Grid container xs={11} sm={10} md={12} spacing={3}>
                <Province
                    handleChangeInput={handleChangeInput}
                    loadingStatesList={loadingStatesList}
                    statesList={statesList}
                    onSelect={(province) => {
                        setSelectedProvince(province)
                        if (selectedTown && selectedTown.provinceCode != province.provinceCode) {
                            setSelectedTown(null)
                        }
                    }}
                    isClearable={!selectedTown}
                    onClear={() => {
                        setSelectedProvince(null)
                    }}
                    onClick={() => errorProvinces && getProvinces()}
                    error={errorProvinces}
                    value={selectedProvince ? { value: selectedProvince, label: selectedProvince.provinceName } : null}
                    cooldown={cooldownTry}
                    disabled={readOnlyProvince !== undefined}
                />
                <Grid item xs={12} sm={4} />
                {
                    props.toggleOpenModal && <BusquedaAvanzada
                        onClick={toggleOpenModal}
                    />
                }

            </Grid>
        </Grid>
        <Grid container xs={11} sm={10} md={12} spacing={3} className={`${styles.inputsArea} margin`}>
            <Town
                handleChangeInput={(input, value) => {
                    handleChangeInput(input, value)
                }
                }
                townsList={towns}
                loading={loadingTowns}
                onSelect={(town) => {
                    setSelectedTown(town)
                    setSelectedIndEntity(null)
                    setSelectedColEntity(null)
                    setSelectedStreet(null)
                }}
                onClick={() => errorTowns || !towns.length && getTowns(province, town)}
                cooldown={props.cooldownTry}
                value={selectedTown ? { value: selectedTown, label: selectedTown?.municipalityName } : null}
                isClearable={!selectedColEntity && !selectedIndEntity && !selectedStreet}
                onClear={() => setSelectedTown(null)}
                error={errorTowns}
                disabled={readOnlyTown !== undefined}
            />
            <ColEntity
                handleChangeInput={handleChangeInput}
                colectiveEntityList={collectiveEntities}
                isDisabled={collectiveEntities.length === 0}
                onSelect={(entity) => {
                    setSelectedColEntity(entity)
                    setSelectedIndEntity(null)
                    setSelectedStreet(null)
                }}
                onClick={() => errorCollectiveEntities && getColectiveEntities()}
                isClearable={!selectedStreet || (selectedIndEntity && Boolean(selectedIndEntity.groupentityname))}
                value={selectedColEntity ? { value: selectedColEntity, label: selectedColEntity.entityName } : null}
                onClear={() => setSelectedColEntity(null)}
                loading={loadingCollectiveEntities}
                error={errorCollectiveEntities}
                disabled={!selectedTown || !selectedProvince}
                noData={collectiveEntities.length === 0 && !loadingCollectiveEntities && selectedTown && selectedProvince && !errorCollectiveEntities}
            />
            <IndEntity
                handleChangeInput={handleChangeInput}
                individualEntityList={individualEntities}
                isDisabled={individualEntities.length === 0}
                onClick={() => errorIndividualEntities && getIndividualEntities(selectedTown, selectedProvince, selectedColEntity)}
                onSelect={(entity) => {
                    entity.groupentityname ? setSelectedColEntity({ ...entity, entityName: entity.groupentityname }) : setSelectedColEntity(null)
                    setSelectedIndEntity(entity)
                    setSelectedStreet(null)
                }}
                isClearable={!selectedStreet}
                value={selectedIndEntity ? { value: selectedIndEntity, label: selectedIndEntity.entityName } : null}
                onClear={() => setSelectedIndEntity(null)}
                loading={loadingIndividualEntities}
                error={errorIndividualEntities}
                disabled={!selectedTown || !selectedProvince}
                noData={individualEntities.length === 0 && !loadingIndividualEntities && selectedTown && selectedProvince && !errorIndividualEntities}

            />
            <ZipCode
                zipCode={selectedStreet ? selectedStreet.zipCode : zipCode}
                handleChangeInput={handleChangeInput}
                zipCodesList={zipCodesList}
            />
            <StreetType
                streetType={selectedStreet ? selectedStreet.streetType : streetType}
                handleChangeInput={handleChangeInput}
                tracksList={tracksList}
            />
            <StreetName
                handleChangeInput={handleChangeInput}
                loading={loadingStreetNames}
                candidatesList={streetNames}
                onClick={() => errorStreetNames && getStreetNames()}
                onSelect={(selectedStreet) => {
                    setSelectedStreet(selectedStreet)
                }}
                onClear={() => setSelectedStreet(null)}
                value={selectedStreet ? { value: selectedStreet, label: selectedStreet?.streetName } : null}
                isClearable
                error={errorStreetNames}

            />
            <NumberInput
                number={number}
                handleChangeInput={handleChangeInput}
            />
            <BtnSend
                showButon={!Boolean(selectedTown && selectedProvince && selectedStreet)}
                handleSearchButton={handleSearchButton}
            />
        </Grid>
    </>
}