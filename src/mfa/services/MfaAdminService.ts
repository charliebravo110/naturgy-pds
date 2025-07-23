import BaseRestService from '../../common/BaseRestService';

class MfaAdminService extends BaseRestService {
    getData(token: string) {
        return super.get(`/mfa/force`, {
            'Authorization': `Bearer ${token}`
        })
    }
    postData(token: string, external: boolean, internal: boolean) {
        return super.post(`/mfa/force`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                force_mfa_external: external,
                force_mfa_internal: internal
            }
        });
    }
}

export default MfaAdminService;