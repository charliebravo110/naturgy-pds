
interface FailureRequest {
    codSR: string;
    tipology: string;
    tipologyDescription: string;
    createDate: Date;
    status: string;
    resolution: string;
    closingDate: string;
    createComment: string;
    cups: string;
    codExpedient: string;
    address: string;
    channel: string;
    documentList: any; //To do create new interface
    indRead: boolean;
    id: number;
}

export default FailureRequest;
