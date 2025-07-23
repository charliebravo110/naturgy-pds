import ProvisionsService from '../../provisions/ProvisionsService';
import BaseRestService from '../BaseRestService';

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../core/utils/gtm';

class RequestService extends BaseRestService {

    private token: string;
    private provisionsService: ProvisionsService = new ProvisionsService();

    constructor() {
        super();

        this.token = sessionStorage.getItem('token') || '';
    }

    public async getRequestList(filter?: string): Promise<any[]> {

        let auxList = [] as any;

        try {
            const response: any = super.get(`/serviceRequests?filter=${filter}`, {
                'Authorization': `Bearer ${this.token}`
            });

            if (response && response.serviceRequests && response.serviceRequests.items && response.serviceRequests.items.length > 0) {

                const items = [] as any;

                response.serviceRequests.items.filter(item => item.status === 'EN CURSO' || item.status === 'CERRADA').map(item => {
                    const date = item.createDate && item.createDate.split('/');
                    const dateClose = item.closingDate && item.closingDate.split('/');

                    const formattedDate = date && (date[2] + '' + date[1] + '' + date[0] + '000000');
                    const formattedDateClose = dateClose && (dateClose[2] + '' + dateClose[1] + '' + dateClose[0] + '000000');

                    const auxItem = {
                        type: 'REQUEST',
                        code: item.codSR,
                        date: formattedDate || '00000000000000',
                        dateClose: formattedDateClose || '00000000000000'
                    }

                    return items.push(auxItem);
                });


                try {

                    // LCS: Registrar el tiempo inicial - Wave 2
                    const startTime = performance.now();

                    const notificationsResponse = await this.provisionsService.doGetCommunicationNotifications(items, this.token)

                    // LCS: Registrar el tiempo final y calcular la duración - Wave 2
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    // LCS: Enviar evento a GA para errores - Wave 2
                    sendGAEvent({
                    event: 'api_response_time',
                    info: {
                        apiUrl: 'post /notifications',
                        apiUrlShort: 'post /notifications',
                        responseTime: responseTime, // Tiempo de respuesta en milisegundos
                    }
                    });

                    if (notificationsResponse && notificationsResponse.notifications) {
                        response.serviceRequests && response.serviceRequests.items && response.serviceRequests.items.map(item => {
                            const sendDate = item.createDate && item.createDate.split('/')
                            const closeDate = item.closingDate && item.closingDate.split('/')

                            // formateamos la fecha de mm/dd/yyyy a yyyymmddhhmmss
                            const formattedDate = sendDate && (sendDate[2] + '' + sendDate[1] + '' + sendDate[0] + '000000')
                            const formattedDateClose = closeDate && (closeDate[2] + '' + closeDate[1] + '' + closeDate[0] + '000000')

                            let auxItem = {
                                ...item,
                                createDate: (sendDate[0] + '/' + sendDate[1] + '/' + sendDate[2]),
                                closingDate: (closeDate[0] + '/' + closeDate[1] + '/' + closeDate[2])
                            }

                            const notification = notificationsResponse.notifications.filter(i => i.date === formattedDate && i.code === item.codSR)[0]

                            if (item.status !== 'EN CURSO' && item.status !== 'CERRADA') {
                                auxItem = {
                                    ...auxItem,
                                    indRead: 1
                                }
                            } else {
                                if (notification) {
                                    auxItem = {
                                        ...auxItem,
                                        indRead: notificationsResponse.notifications.filter(i => i.date === formattedDate && i.code === item.codSR)[0].indRead
                                    }
                                } else {
                                    auxItem = {
                                        ...auxItem,
                                        indRead: 0
                                    }
                                }
                            }

                            return auxList.push(auxItem);
                        })
                    }

                    auxList.sort(function (a, b) {
                        let aa = a.createDate.split('/')
                        aa = aa[2] + '-' + aa[1] + '-' + aa[0]

                        let bb = b.createDate.split('/')
                        bb = bb[2] + '-' + bb[1] + '-' + bb[0]

                        return new Date(bb).getTime() - new Date(aa).getTime()
                    });

                } catch (e) {
                    console.error('Error al obtener las notificaciones de las peticiones: ', e);

                    // LCS: Enviar evento a GA para errores - Wave 2
                    sendGAEvent({
                        event: 'api_error',
                        info: {
                        error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al obtener las notificaciones de la provisión'),
                        error: e,
                        reactComponent: 'RequestService.ts - getRequestList',
                        apiUrl: 'post /notifications',
                        codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
                        }
                    });

                    response.serviceRequests.items.map(item => {
                        const auxItem = {
                            ...item,
                            indRead: 0
                        }

                        return auxList.push(auxItem);
                    });
                }
            }
        } catch (e) {
            console.error('Error al obtener la lista de peticiones de servicio: ', e)
        }

        return auxList;
    }


    public async checkIfRequestExist(filter: string, tipology: string, state?: string): Promise<boolean> {

        const requestList: any[] = await (await this.getRequestList(filter)).filter(item => item.tipology === tipology);

        if (state == null) {

            if (requestList.length > 0) {
                return true;
            } else {
                return false;
            }

        } else {

            const filteredList = requestList.filter(item => item.status === state);

            if (filteredList.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

}

export default RequestService;
