import Address from './Address';

interface SupplyPoint {
    /** The name of the Supply point */
    name: string;
    cups: string;
    remoteManagementDate: Date;
    ownership: string;
    isGenerator: boolean;
    isMigrated: boolean;
    contractCode: number;
    measurementSystem: string;
    contractStartDate: string;
    address: Address;
    power: number;
    rate: string;
    hasHourlyDiscrimination: string;
    hasICP?: any; //create new Interface
    inService: string;
    marketer: string;
    voltage: string;
    installationType: string;
    measurementEquipments: any;
    maxAuthorizedVoltage: number;
    CIEApprovalDate: string;
    maxAvalaibleVoltage?: number;
    validExtentRights: number;
    expirationDate: string;
    validAccessRights: number;
    holderName: string;
    holderDocumentNumber: string;
    holderContactPhone: number;
    holderContactEmail: string;
    icon: string;
    tipoDeLectura: string;
    notCuttable: string;
    notCuttableMotive: string;
    osCorte: string;
    error?: any;
}

export default SupplyPoint;
