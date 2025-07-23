import BaseRestService from '../BaseRestService';
import { formatDateZeus } from '../lib/FormatLib';

class IncidenceService extends BaseRestService {

    private token: string;

    constructor() {
        super();
        this.token = sessionStorage.getItem('token') || '';
    }

    public async getIncidenceList(cups: string, dateFrom: Date, dateTo: Date): Promise<any[]> {

        const from = formatDateZeus(dateFrom) + '000000';
        const to =  formatDateZeus(dateTo) + '000000';

        let incidenceList = [];

        try {
            const response: any = await super.get(`/listPowerSupplyFacilities?filter=cups::${cups}|fromDate::${from}|toDate::${to}`, {
                'Authorization': `Bearer ${this.token}`
            });

            if (response && response.incidenceList && response.incidenceList.length > 0) {
                incidenceList = response.incidenceList;                
            }

        } catch (e) {
            console.error('Error al obtener la lista de incidencias: ', e)
        }

        return incidenceList;
    }

}

export default IncidenceService;
