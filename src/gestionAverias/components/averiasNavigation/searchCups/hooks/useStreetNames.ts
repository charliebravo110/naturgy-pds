import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkGetListStreets, thunkGetMasterData } from '../../../../actions/GestionAveriasThunkActions';

export interface iStreetName {
    idStreet: string;
    streetType: string;
    streetName: string;
    municipalityCode: string,
    municipalityName: string;
    provinceCode: string;
    provinceName: string;
    zipCode: string;
    populationCenter?: string,
    singularEntityName?: string,
    groupEntityName?: string
}
interface useStreetNamesParams {
    provinceCode: string,
    townCode: string,
    streetName: string,
    streetType: string,
    singularEntityName?: string,
    groupEntityName?: string
}

export const useStreetNames = (params: useStreetNamesParams) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [streetNames, setStreetNames] = useState<iStreetName[]>([]);
    const [pending, setPending] = useState<boolean>(false)
    const [ready, setReady] = useState(false)
    const [retries, setRetries] = useState(0)
    const [cooldown, setCooldown] = useState(3000)
    const [cooldownRetry, setCooldownRetry] = useState(3000)
    const [maxRetries, setMaxRetries] = useState(1)
    const [singularEntity, setSingularEntity] = useState('')
    const [groupEntity, setGroupEntity] = useState('')
    const { provinceCode, streetName, streetType, townCode } = params
    const dispatch = useDispatch();

    useEffect(() => {
        let timeOutRef: NodeJS.Timeout | undefined = undefined
        if (streetName.length >= 3) {
            const timeOut = setTimeout(() => {
                setReady(true)
            }, cooldown)
            timeOutRef = timeOut
        }
        return () => {
            if(timeOutRef){
                clearTimeout(timeOutRef)
            }
        }
    }, [streetName, cooldown])

    const run = (provinceParam?: string, townParam?: string, streetParam?: string) => {
        return new Promise<iStreetName[]>((resolve, reject) => {

            const street = streetParam? streetParam : streetName

            if (!street || street.length < 1 || retries >= maxRetries) return;
            if (!loading && (ready || provinceParam && townParam && streetParam)) {
                setPending(false)
                setLoading(true)
                setReady(false)

                const provinceSearch = provinceParam? provinceParam : provinceCode
                const townSearch = townParam? townParam : townCode

                dispatch(thunkGetListStreets(street? street : '', provinceSearch ? provinceSearch : '', townSearch ? townSearch : '', streetType, '', singularEntity, groupEntity, (response) => {
                    setLoading(false)
                    if (response && response.streets && response.streets.items) {
                        let auxCandidatesList = []
                        response.streets.items.map((item, index) => {
                            auxCandidatesList.push(item)
                        })
                        setStreetNames(auxCandidatesList)
                        setError(false)
                        setPending(false)
                        setRetries(0)
                        resolve(auxCandidatesList)
                    } else {
                        setError(true)
                        setRetries((prev) => prev + 1)
                        setTimeout(() => {
                            setPending(true)
                        }, cooldownRetry)
                        reject()
                    }
                }));
            } else {
                setPending(true)
            }
        })
    }

    const setParameters = (cooldownTry: number, cooldownRetryParam: number, maxRetriesParam: number) => {
        setCooldown(cooldownTry)
        setCooldownRetry(cooldownRetryParam)
        setMaxRetries(maxRetriesParam)
    }

    const resetRetries = () => {
        setRetries(0)
        setError(false)
    }

    // useEffect(()=>{
    //     ready && run()
    // }, [ready])

    useEffect(() => {
        console.log(ready, error, pending, loading)
        if ((ready || error || pending) && !loading && (retries < maxRetries)) {
            run();
        }
    }, [error, loading, retries, ready, pending, retries, maxRetries])

    

    const setCodes = (provinceCodeParam: string, townCodeParam: string) => {
        params.townCode = townCodeParam
        params.provinceCode = provinceCodeParam
    }

    return {
        getStreetNames: run,
        setCodesListStreets: setCodes,
        setParametersStreetNames: setParameters,
        resetRetriesStreetNames: resetRetries,
        loadingStreetNames: loading,
        errorStreetNames: error,
        streetNames: streetNames,
        setGroupEntityParam: setGroupEntity,
        setSingularEntityParam: setSingularEntity,
        clearStreets: () => setStreetNames([])
    }
}
