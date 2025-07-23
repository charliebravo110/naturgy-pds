import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkGetListMunicipalities } from '../../../../actions/GestionAveriasThunkActions';
import { useTranslation } from 'react-i18next';
import { iProvince } from './useProvinces';

export interface iTown { municipalityCode: string, municipalityName: string, provinceCode: string, provinceName: string }
export interface iTownDictionaryElement { provinceCode: string, towns: Array<iTown> }

export const useTowns = (streetNameInformed: boolean, singularEntityInformed: boolean) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [towns, setTowns] = useState<iTown[]>([]);
    const [townDictionary, setTownDictionary] = useState<iTownDictionaryElement[]>([]);
    const { t } = useTranslation()
    const [pending, setPending] = useState<boolean>(false)
    const [retries, setRetries] = useState(0)
    const [cooldown, setCooldown] = useState(3000)
    const [cooldownRetry, setCooldownRetry] = useState(3000)
    const [maxRetries, setMaxRetries] = useState(1)
    let provinceCode = '';
    let townName = ''
    // const [lastTry, setLastTry] = useState(() => {
    //     const today = new Date();
    //     today.setDate(new Date().getDate() - 1)
    //     return today;
    // })
    // const [lastReTry, setLastReTry] = useState(() => {
    //     const today = new Date();
    //     today.setDate(new Date().getDate() - 1)
    //     return today;
    // })

    const dispatch = useDispatch();

    const selectedFromList = useMemo(() => towns.find(town => town.municipalityName === townName), [townName])

    const run = (provinceCodeParam: string, townNameParam: string) => {
        return new Promise<iTown[]>((resolve, reject) => {
            if (provinceCodeParam !== '' || townNameParam !== '') {
                provinceCode = provinceCodeParam;
                townName = townNameParam;
            }
            else {
                return;
            }
            if (streetNameInformed || singularEntityInformed) return
            if (!selectedFromList || (selectedFromList.provinceCode != provinceCode || townNameParam != '')) {
                if (!loading) {
                    setLoading(true)
                    setPending(false)
                    let listTowns = null;
                    if (provinceCode) {
                        listTowns = townDictionary.find(townDicEle => townDicEle.provinceCode === provinceCode)?.towns
                    }
                    else {
                        listTowns = findInTowns();
                    }
                    if (listTowns && listTowns.length !== 0) {
                        setTowns(listTowns)
                        setError(false)
                        setRetries(0)
                        setLoading(false)
                    }
                    else {
                        dispatch(thunkGetListMunicipalities(townName, '', provinceCode, '', (response) => {

                            let townsInPromise: iTown[] = []
                            if (response && response.municipalities && response.municipalities.items) {
                                townsInPromise = response.municipalities.items
                                setTowns([...response.municipalities.items])
                                const cacheable = isCacheable(response.municipalities.items, provinceCodeParam, townNameParam);
                                if (cacheable === 'OK') {
                                    cachearMunicipios(response.municipalities.items, provinceCodeParam)
                                }
                                else if (cacheable !== 'KO' && cacheable !== '') {
                                    setLoading(false)
                                    listTowns = townDictionary.find(townDicEle => townDicEle.provinceCode === cacheable)?.towns
                                    if (!listTowns || (listTowns && listTowns.length === 0)) {
                                        dispatch(thunkGetListMunicipalities('', '', cacheable, '', (response) => {
                                            if (response && response.municipalities && response.municipalities.items) {
                                                townsInPromise = response.municipalities.items
                                                setTowns([...response.municipalities.items])
                                                cachearMunicipios(response.municipalities.items, cacheable)
                                            }
                                        }));
                                    }
                                }
                                setError(false)
                                setRetries(0)
                                resolve(townsInPromise)
                            } else {
                                setError(true)
                                setRetries((prev) => prev + 1)
                                // setLastReTry(new Date())
                                setTimeout(() => {
                                    setPending(true)
                                }, cooldown)
                                reject()
                            }
                            setLoading(false)
                        }));
                    }
                } else {
                    setPending(true)
                }
            }
        })
    }

    const findInTowns = () => {
        for (let i = 0; i < townDictionary.length; i++) {
            const provinceTowns = townDictionary[i].towns;
            const townFound = provinceTowns.find(townDicEleTown => townDicEleTown.municipalityName === townName)?.municipalityName
            if (townFound) {
                return townFound;
            }
        }
        return null;
    }

    const isCacheable = (listRecuperados: any, provinceCodeParam: string, townNameParam: string) => {
        if (provinceCodeParam !== '' && townNameParam === '') {
            return 'OK';
        }
        let lastProvince = '';
        for (let index = 0; index < listRecuperados.length; index++) {
            const element = listRecuperados[index];
            if (lastProvince !== '' && element.provinceCode !== lastProvince) {
                return 'KO';
            }
            if (lastProvince === '') {
                lastProvince = element.provinceCode
            }
        }
        return lastProvince;
    }

    const cachearMunicipios = (listRecuperados: any, provinceCodeParam: string) => {
        let dictionaryElem: iTownDictionaryElement = { provinceCode: provinceCodeParam, towns: listRecuperados }
        setTownDictionary([dictionaryElem, ...townDictionary])
    }

    const setParameters = (cooldownTry: number, cooldownRetryParam: number, maxRetriesParam: number) => {
        setCooldown(cooldownTry)
        setCooldownRetry(cooldownRetryParam)
        setMaxRetries(maxRetriesParam)
    }

    const resetRetries = () => {
        setRetries(0)
    }

    const setTownName = (townNameParam: string) => {
        townName = townNameParam;
    }

    const setInformedTowns = (streetNameInformedParam: boolean, singularEntityInformedParam: boolean) => {
        streetNameInformed = streetNameInformedParam;
        singularEntityInformed = singularEntityInformedParam;
    }

    const setProvinceCode = (provinceCodeParam: string) => {
        provinceCode = provinceCodeParam;
    }



    useEffect(() => {
        if (!loading && pending) {
            run(provinceCode, townName);
        }
    }, [pending, loading])

    useEffect(() => {
        if (error && !loading && retries < maxRetries) {
            run(provinceCode, townName);
        }
    }, [error, loading, retries])

    return ({
        getTowns: run,
        setParametersTowns: setParameters,
        resetRetriesTowns: resetRetries,
        setProvinceCodeTowns: setProvinceCode,
        setTownNameExternal: setTownName,
        setInformedTownsExternal: setInformedTowns,
        loadingTowns: loading,
        errorTowns: error,
        towns: towns,
        clearTowns: () => setTowns([])
    })
}