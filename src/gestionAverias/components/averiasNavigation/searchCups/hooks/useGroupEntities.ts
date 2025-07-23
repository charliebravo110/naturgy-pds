import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkListGroupEntity } from '../../../../actions/GestionAveriasThunkActions';
import { iTown } from './useTowns';
import { iProvince } from './useProvinces';

export interface iCollectiveEntity {
    entityName: string,
    municipalityCode: string,
    municipalityName: string,
    provinceCode: string,
    provinceName: string,
    zipCode: string,
}

export const useCollectiveEntities = (provinceCode: string, townCode: string, collectiveEntity: string, singularEntityInformed: boolean) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [collectiveEntities, setCollectiveEntities] = useState<iCollectiveEntity[]>([]);
    const dispatch = useDispatch();
    const [retries, setRetries] = useState(0) 
    const [pending, setPending] = useState(false)
	const [cooldown, setCooldown] = useState(3000)
	const [cooldownRetry, setCooldownRetry] = useState(3000)
    const [maxRetries, setMaxRetries] = useState(1)
    
    const run = (selectedTown: iTown | null = null, selectedProvince: iProvince | null = null) => {
        if(singularEntityInformed) return;
        if(!loading){
            setPending(false)
            setLoading(true)
            if(provinceCode !== '' && townCode !== '' || selectedTown && selectedProvince){
                    const province = provinceCode || selectedProvince.provinceCode
                    const town = townCode || selectedTown.municipalityCode
                    setCollectiveEntities([])
                    dispatch(thunkListGroupEntity(province, town, collectiveEntity, (response) => {
                        if (response && response.collectivesEntities && response.collectivesEntities.items) {
                            setCollectiveEntities(response.collectivesEntities.items)
                            setError(false)
                            setRetries(0)
                        } else {
                            setError(true)
                            setRetries((prev)=>prev+1)
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
        } else {
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
        getCollectiveEntities: run,
        setParametersGroupEntities: setParameters,
        resetRetriesGE: resetRetries,
        loadingCollectiveEntities: loading,
        errorCollectiveEntities: error,
        collectiveEntities : collectiveEntities,
    })
}