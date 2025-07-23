import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkGetListProvinces } from '../../../../actions/GestionAveriasThunkActions';
import { log } from 'console';

export interface iProvince {provinceCode: string, provinceName: string}

export const useProvinces = () => {
    const [error, setError] = useState(false);
    const [provinces, setProvinces] = useState<iProvince[]>([]);
    const dispatch = useDispatch();
    const [retries, setRetries] = useState(0) 
	const [cooldown, setCooldown] = useState(3000)
    const [maxRetries, setMaxRetries] = useState(3)
    const [pending, setPending] = useState(false)

    let loading = false;

    const run = () => {
        if(!loading){
            loading = true;
            setPending(false)
            if(provinces && provinces.length > 0 ){
                return
            }
            dispatch(thunkGetListProvinces('', (response) => {
                if ( response && response.provinces && response.provinces.items && response.provinces.items.length > 0) {
                    setError(false)
                    setProvinces(response.provinces.items)
                    setRetries(0)
                } else {
                    setError(true)
                    setRetries((prev) => prev+1)
                    setTimeout(()=>{
                        setPending(true)
                    }, cooldown)
                }
                loading = true;
            }));
        }
    }

    const setParameters = (cooldownTry : number, cooldownRetryParam : number, maxRetriesParam : number) => {
        setCooldown(cooldownTry)
        setMaxRetries(maxRetriesParam)
    }

    const resetRetries = () => {
        setRetries(0)
    }

    useEffect(()=>{
        if(pending && !loading && (retries < maxRetries)){
            run();
        }
    }, [pending, loading, retries, maxRetries])


    return ({
        getProvinces: run,
        setParametersProvinces: setParameters,
        resetRetriesProvinces: resetRetries,
        loadingProvinces: loading,
        errorProvinces: error,
        provinces: provinces 
    })

}
