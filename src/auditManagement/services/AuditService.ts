import BaseRestService from '../../common/BaseRestService';

class AuditService extends BaseRestService {
    getAuditData(token: string, params: string, type) {
        return super.get(`/audit?${params}`, {
            'Authorization': `Bearer ${token}`,
            ...(type !== '' && { 'Content-Type': type })
        });
    }
}

export default AuditService;