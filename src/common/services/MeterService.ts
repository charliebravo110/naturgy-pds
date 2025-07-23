import SuppliesService from '../../supplies/SuppliesService';

import SupplyPoint from '../interfaces/SupplyPoint';
import UserProfile from '../interfaces/UserProfile';
import MasterDataService from './MasterDataService';

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../core/utils/gtm';

class MeterService {

    private masterData = new MasterDataService();
    private suppliesService = new SuppliesService();
    private masterDataService: MasterDataService = new MasterDataService();

    private masterDataMaster = 'METER_READING_TYPE_ID'
    
    constructor(masterDataMasterParam) {
        this.masterDataMaster = masterDataMasterParam
    }



    /**
     * @param supply The supply associated to the meter
     * 
     * @returns 0 | Inactive
     * @returns 1 | Active
     * @returns 2 | Rearmament
     * @returns 3 | Timeout or request failure
     */
    public async getMeterStatus(supply: SupplyPoint, user: UserProfile): Promise<number> {
        
        // Request returns 500 if a correct document number is informed
        const documentNumber = user.documentNumber;
        const readingTypeIds = await this.getReadingTypeIds(supply);
        const token = sessionStorage.getItem('token').toString() || '';
        const cups = (supply.cups.length > 20) ? supply.cups.substr(0, (supply.cups.length -2)) : supply.cups;
        const requestTimeout = Number.parseInt(await this.masterDataService.getUniqueValue('API_TIMEOUT', 'METER_'));

        let meterStatus: string;

        try {
            const response = await this.timeoutPromise(this.suppliesService.doGetMeterReadings(documentNumber, cups, supply.measurementSystem, supply.measurementEquipments.meters[0].meter, readingTypeIds, token), requestTimeout);

            if (response.readings != null && response.readings[0].readingsMeter != null) {
                meterStatus = response.readings[0].readingsMeter.find(item => supply.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537').meterReadings[0].value;
            } else {
                meterStatus = '3';
            }

        } catch (error) {
            meterStatus = '3';
        }

        switch (meterStatus) {

            case '0':
                return 0;

            case '1':
                return 1;

            case '2':
                return 2;

            default:
                return 3;
        }
    }


    public async getReadingTypeIds(supply: SupplyPoint): Promise<string> {
        try{
            let readingTypeIds = '';

            // LCS: Registrar el tiempo inicial - Wave 3
            const startTime = performance.now();

            const masterDataResponse = await this.masterData.getData(this.masterDataMaster, this.getReadingTypeKey(supply));

            // LCS: Registrar el tiempo final y calcular la duración - Wave 3
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            // LCS: Enviar evento a GA para medir el tiempo
            sendGAEvent({
            event: 'api_response_time',
            info: {
                apiUrl: 'get /masterData?filter=master::METER_READING_TYPE_ID|language::ES',
                apiUrlShort: 'get /masterData',
                responseTime: responseTime, // Tiempo de respuesta en milisegundos
            }
            });

            masterDataResponse.items.forEach(e => {
                readingTypeIds = (readingTypeIds === '') ? e.value : readingTypeIds + ',' + e.value;
            });
            return readingTypeIds;
        } catch(e){            
            console.error('Error al obtener los datos maestros:', e)

            // LCS: Enviar evento a GA para errores - Wave 3
            sendGAEvent({
            event: 'api_error',
            info: {
                error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                error: e,
                reactComponent: 'MeterService.ts - getReadingTypeIds',
                apiUrl: 'get /masterData?filter=master::METER_READING_TYPE_ID|language::ES',
                apiUrlShort: 'get /masterData',
                codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
            });
        }
    }


    private getReadingTypeKey(supply: SupplyPoint) {
        return supply.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA';
    }

    private timeoutPromise(promise, time: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('timeout'));
            }, time);

            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    resolve(res);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                }
            );
        });
    }
}

export default MeterService;
