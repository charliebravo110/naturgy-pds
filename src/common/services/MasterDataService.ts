import BaseRestService from '../BaseRestService';
import MasterDataResult from '../interfaces/MasterDataResult';

// LCS: Importa la función - Wave 3
import { sendGAEvent } from '../../core/utils/gtm';


type Language = 'ES' | 'EN' |'GA';

class MasterDataService extends BaseRestService {

    constructor() {
        super();
    }

    //Documentation
    public async getData(master: string, key: string, language: Language = 'ES'): Promise<MasterDataResult> {
        const result: MasterDataResult = await super.get(`/masterData?filter=master::${master}|language::${language}${key ? '|key::' + key : ''}`);

        return result;
    }

    //Documentation
    public async getUniqueValue(master: string, key: string, language: Language = 'ES'): Promise<string> {
        try{
            // LCS: Registrar el tiempo inicial - Wave 3
            const startTime = performance.now();

            const dataResult: MasterDataResult = await this.getData(master, key, language);

            // LCS: Registrar el tiempo final y calcular la duración - Wave 3
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            // LCS: Enviar evento a GA para medir el tiempo - Wave 3
            sendGAEvent({
                event: 'api_response_time',
                info: {
                apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language,
                apiUrlShort: 'get /masterData',
                responseTime: responseTime, // Tiempo de respuesta en milisegundos
                }
            });
            
            if (dataResult.items != null) {
                return dataResult.items[0].value;
            }

            return '';
        } catch(e){            
            console.error('Error al obtener los datos maestros:', e)

            // LCS: Enviar evento a GA para errores - Wave 3
            sendGAEvent({
            event: 'api_error',
            info: {
                error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
                error: e,
                reactComponent: 'MasterDataService.ts - getUniqueValue',
                apiUrl: 'get /masterData?filter=master::'+master+'|language::'+language,
                apiUrlShort: 'get /masterData',
                codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
            }
            });

            return '';
        }
    }

}

export default MasterDataService;
