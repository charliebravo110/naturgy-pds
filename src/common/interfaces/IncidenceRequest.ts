interface IncidenceRequest {
    abonableType: string;
    affectedPower: string;
    incidenceCode: string;
    incidenceDate: string;
    incidenceTime: string;
    installationRef: string;
    installationType: string;
    interruptionCount: string;
    interruptionDuration: string;
    powerUnit: string;
    programmed: string;
    id: number;
    previsionDate: string;
    previsionTime: string;
    incidenceState: string;
    cor: string;
    corCod: string;
    //Avisos de incidencia
    tecnicalCenter: string;
    type: string;
    reach: string;
    corState: string;
    detectionDate: string;
    resolutionDate: string;
    cups: string;
    address: string;
}

export default IncidenceRequest;
