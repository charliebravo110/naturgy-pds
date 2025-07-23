import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkListGroupEntity, thunkListIndividualEntity } from '../../../../actions/GestionAveriasThunkActions';
import { iTown } from './useTowns';
import { iProvince } from './useProvinces';
import { iCollectiveEntity } from './useGroupEntities';

export interface iIndividualEntity {
    entityName: string,
    groupentityname?: string
    municipalityCode: string,
    municipalityName: string,
    provinceCode: string,
    provinceName: string,
    zipCode: string,
}

export const useIndividualEntities = (provinceCode: string, townCode: string, individualEntity:string, groupEntity: string, singularEntityInformed: boolean) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [individualEntities, setIndividualEntities] = useState<iIndividualEntity[]>([]);
    const dispatch = useDispatch();
    const [retries, setRetries] = useState(0) 
    const [pending, setPending] = useState(false)
	const [cooldown, setCooldown] = useState(3000)
	const [cooldownRetry, setCooldownRetry] = useState(3000)
    const [maxRetries, setMaxRetries] = useState(1)
    
    const run = (selectedTown: iTown | null = null, selectedProvince: iProvince | null = null, selectedColEntity: iCollectiveEntity | null = null) => {
        setIndividualEntities([])
        if(singularEntityInformed) return;
        if(!loading){
            setLoading(true)
            setPending(false)
            if(provinceCode !== '' && townCode !== '' || selectedTown && selectedProvince){

                    const province = provinceCode || selectedProvince.provinceCode
                    const town = townCode || selectedTown.municipalityCode
                    const groupEntitySearch = groupEntity || selectedColEntity?.entityName || ''
                    dispatch(thunkListIndividualEntity(province, town, individualEntity, groupEntitySearch, (response) => {
                        if (response && response.singularEntities && response.singularEntities.items) {
                            setIndividualEntities(response.singularEntities.items)
                            setError(false)
                            setRetries(0)
                        } else {
                            setError(true)
                            setRetries((prev)=>prev+1)
                            // setLastReTry(new Date())
                            setTimeout(()=>{
                                setPending(true)
                            }, cooldownRetry)
                        }
                        setLoading(false)
                    }));
                // }
            }
            else{                
                setLoading(false)
            }
        } else{
            setPending(true)
        }
    }

    const setParameters = (cooldownTry : number, cooldownRetryParam : number, maxRetriesParam : number) => {
        setCooldown(cooldownTry)
        setCooldownRetry(cooldownRetryParam)
        setMaxRetries(maxRetriesParam)
    }

    const resetRetries = () => {
        setRetries(0)
        setError(false)
    }

    useEffect(()=>{
        if(error && !loading && !pending && retries<maxRetries){
            run();
        }
    }, [error, loading, retries, pending, maxRetries])

    // useEffect(()=>{
    //     if(!loading && pending){
    //         run()
    //     }
    // }, [loading, pending])

    return ({
        getIndividualEntities: run,
        setParametersIndividualEntities: setParameters,
        resetRetriesIE: resetRetries,
        loadingIdividualEntities: loading,
        errorIndividualEntities: error,
        individualEntities : individualEntities,
    })
}