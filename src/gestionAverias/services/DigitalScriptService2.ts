import SupplyPoint from '../../common/interfaces/SupplyPoint';
import UserProfile from '../../common/interfaces/UserProfile';
import MeterService from '../../common/services/MeterService';

interface SgiNotification {
	type: number;
	scope: number;
	reason: string;
}

export interface Question {
	id: number;
	text: string;
	text_2?: string;
	text_bold?: string
	extraInfo_1?: string,
	extraInfo_2?: string,
	answer: boolean;
	disabled?: boolean;
	visible?: boolean;
}

class DigitalScriptService2 {

	private user: UserProfile;
	private supply: SupplyPoint;
	private meterStatus: number = null;
	private locatedFailure: boolean = false;
	private nextQuestion: Question = null;
	private srDependency: boolean = false;

	private srCode: string;
	private srSub: string;
	private reason: string;
	private notification: SgiNotification = null;
	private osCorte: number = 0;

	private meterService: MeterService = new MeterService('METER_RT_AVERIAS_ID');

	private hasAveria = false;
	private tipoAveria = '0';
	private hasIncidence = false;
	private securityEmergency = 0;
	private hasToSendCOR = false;
	private callMotive = '';
	private CORpetitionError = ''

	public static identifySupplyPointComparator = 'identificar_punto_suministro'
	public static contactDataComparator = 'datos_contacto'

	private questionList: Question[] = [
		{
			id: 0,
			text: 'SCRIPT_END',
			answer: null
		},
		{
			id: 1,
			text: 'averias.digitalScriptQuestions.security',
			answer: null
		},
		{
			id: 2,
			text: 'averias.digitalScriptQuestions.staircaseLight',
			answer: null
		},
		{
			id: 3,
			text: 'averias.digitalScriptQuestions.disarmedLocalIcp',
			text_2: 'averias.digitalScriptQuestions.give_info',
			answer: null
		},
		{
			id: 4,
			text: 'averias.digitalScriptQuestions.streetLight',
			answer: null
		},
		{
			id: 5,
			text: 'averias.digitalScriptQuestions.supplyRestored',
			answer: null
		},
		{
			id: 6,
			text: 'averias.digitalScriptQuestions.differentialGoneOff',
			text_2: 'averias.digitalScriptQuestions.give_info',
			answer: null
		},
		{
			id: 7,
			text: 'averias.digitalScriptQuestions.electroDependant',
			answer: null,
			disabled: null
		},
		{
			id: 8,
			text: 'averias.digitalScriptQuestions.businessHours',
			answer: null
		},
		{
			id: 9,
			text: 'averias.digitalScriptQuestions.supplyRestored',
			answer: null
		},
		{
			id: 10,
			text: 'averias.digitalScriptQuestions.stairLight',
			answer: null
		},
		{
			id: 11,
			text: 'averias.digitalScriptQuestions.liftLight',
			answer: null,
		},
		{
			id: 12,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.corMessage',
			answer: null,
			disabled: null,
			visible: true
		},
		{
			id: 13,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.urgentMessage',
			answer: null
		},
		{
			id: 14,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.cutableMessage',
			extraInfo_1: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.cutableMessage_p1',
			extraInfo_2: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.cutableMessage_p2',
			answer: null
		},
		{
			id: 15,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.newAviso',
			text_2: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.newAviso2',
			text_bold: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.newAviso2Bold',
			answer: null
		},
		{
			id: 16,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.impago',
			answer: null
		},
		{
			id: 17,
			text: 'averias.management.searchCups.comprovacionesSuministro.requestModal.questions.direction',
			answer: null
		},
		{
			id: 18,
			text: 'SCRIPT_TO_END',
			answer: null,
		}
	];

	private reasonList: string[] = [
		'SCRIPT_END',
		'serviceDown',
		'locatedFailure',
	];


	constructor(user: UserProfile, supply: SupplyPoint, callMotive: string) {
		this.user = user;
		this.supply = supply;
		this.callMotive = callMotive
	}

	public resetAllAnswers(){
		for (let index = 0; index < this.questionList.length; index++) {
			this.questionList[index].answer = null;
			if(this.questionList[index].id === 7 || this.questionList[index].id === 12){
				this.questionList[index].disabled = null
			}
		}
	}

	public setCORpetitionError(error: string) {
		this.CORpetitionError = error;
	}

	public getCORpetitionError() {
		return this.CORpetitionError;
	}

	public getNewAveriaResponse() {
		return this.questionList[15].answer
	}

	public getSrCode(): string {
		return this.srCode;
	}

	public getSrSub(): string {
		return this.srSub;
	}

	public getSrSubString(): string {
		this.getTipoSR()
		switch (this.srSub) {
			case '0864I0000':
				return 'SOLICITUD DE INFORMACION GENERAL SOBRE EL PROCESO DE OPERACIONES'
			case '0864I0001':
				return 'SOLICITUD DE ALTA EN PLAZO'
			case '0864I0002':
				return 'OPERACIÓN DE CORTE DE SUMINISTRO'
			case '0864I0003':
				return 'SOLICITUD DE REENGANCHE EN PLAZO'
			case '0864I0004':
				return 'OPERACIÓN RESUELTA'
			case '0864I0005':
				return 'OTRAS OPERACIONES EN PLAZO'
			case '0864I0006':
				return 'OTRAS'
			case '0869I0701':
				return 'INFORMACION SOBRE SOLICITUDES DE ACCESO'
			case '0869I0702':
				return 'INFORMACION SOBRE EL ESTADO DEL SUMINISTRO'
			case '0869I0703':
				return 'INFORMACION DATOS TECNICOS/GENERALES DEL SUMINISTRO'
			case '0869I0704':
				return 'ASESORAMIENTO DE POTENCIAS'
			case '0869I0705':
				return 'OTROS'
			case '0869I0706':
				return 'INFORMACION TARIFAS DE ACCESO JUNIO 2021'
			case '0871A0000':
				return 'INTERRUPCION EN EL SUMINISTRO'
			case '0871A0100':
				return 'SEGURIDAD'
			case '0871A0101':
				return 'CON LLAMADA AL COR'
			case '0871A0102':
				return 'SIN LLAMADA AL COR'
			case '0871A0200':
				return 'SERVICIOS DE EMERGENCIA - FUERZAS DE SEGURIDAD'
			case '0871A0400':
				return 'CON AVISO'
			case '0871A0401':
				return 'SIN AVISO'
			case '0871A0600':
				return 'SUMINISTRO CORTADO SIN O/S DE CORTE - AVISO FH'
			case '0871I0000':
				return 'INFORMACION SOBRE AVERIAS/URGENCIAS'
			case '0871I0001':
				return 'INFO INCIDENCIA LOCALIZADA CON AVISO ANTERIOR'
			case '0871I0002':
				return 'INFO TRABAJO PLANIFICADO EN RESOLUCION CON AVISO ANTERIOR'
			case '0871I0003':
				return 'INFO AVERIA YA RESUELTA'
			case '0871I0004':
				return 'INFO PARA REARME CON EXITO'
			case '0871I0005':
				return 'OTROS'
			case '0871I0006':
				return 'INFO INCIDENCIA EN SUMINISTRO ÚNICO CON AVISO ANTERIOR'
			default:
				return ''
		}
	}

	public getSrString(): string {
		switch (this.getTipoSR()) {
			case '0871I00':
				return 'INFORMACION SOBRE AVERIAS/URGENCIAS'
			case '0871A06':
				return 'SUMINISTRO CORTADO SIN O/S DE CORTE'
			case '0871A04':
				return 'AVERIA EN INSTALACION DE CLIENTE'
			case '0871A02':
				return 'SERVICIOS DE EMERGENCIA - FUERZAS DE SEGURIDAD'
			case '0871A01':
				return 'SEGURIDAD'
			case '0871A00':
				return 'INTERRUPCION E EL SUMINISTRO'
			case '0869I07':
				return 'INFORMACION GENERAL SOBRE EL PROCESO DE CONTRATACION'
			case '0864I00':
				return 'SOLICITUD DE INFORMACION GENERAL SOBRE EL PROCESO DE OPERACIONES'
			default:
				return ''
		}

	}

	public getSgiNotification(): SgiNotification {
		return this.notification;
	}

	private setReason(reason: string): void {
		this.reason = reason;
	}

	public setSrDependency(exists: boolean): void {
		this.srDependency = exists;
	}

	public setOsCorte(osCorte: number): void {
		this.osCorte = osCorte;
	}

	public getOsCorte(): number {
		return this.osCorte;
	}

	public getReason(): string {
		return this.reason;
	}

	public getQuestionsList(): Question[] {
		return this.questionList;
	}

	public getAnswer(id: number): boolean {
		return this.questionList[id].answer
	}

	public setAnswer(id: number, resp: boolean): void {
		this.questionList[id].answer = resp;
	}

	public setLocatedFailure(status: boolean): void {
		this.locatedFailure = status;
	}

	public setMeterStatus(status: number): void {
		this.meterStatus = status;
	}

	public getMeterStatusSync() {
		return this.meterStatus
	}

	public async getMeterStatus(): Promise<number> {
		return await this.meterService.getMeterStatus(this.supply, this.user);
	}

	public getHasAveria(): boolean {
		return this.hasAveria
	}

	public setHasAveria(averia: boolean): void {
		this.hasAveria = averia;
	}

	public getTipoAveria(): string {
		return this.tipoAveria
	}

	public setTipoAveria(tipAveria: string): void {
		this.tipoAveria = tipAveria;
	}

	public getHasIncidence(): boolean {
		return this.hasIncidence
	}

	public setHasIncidence(incidence: boolean): void {
		this.hasIncidence = incidence;
	}

	public getHasToSendCOR(): boolean {
		return this.hasToSendCOR
	}

	public setHasToSendCOR(sendtoCor: boolean): void {
		this.hasToSendCOR = sendtoCor;
	}

	public getSecurityEmergency(): number {
		return this.securityEmergency
	}

	public setSecurityEmergency(emergencyValue: number): void {
		this.securityEmergency = emergencyValue;
	}

	public async getQuestion(lastQuestion: Question | null): Promise<Question> {
		// Save last question answer
		if (lastQuestion === null) {
			await this.start();
			return this.nextQuestion;
		}

		if (lastQuestion !== null) {
			this.questionList.find(q => q.id === lastQuestion.id).answer = lastQuestion.answer;
		}

		if (lastQuestion !== null) {
			if (this.callMotive === DigitalScriptService2.identifySupplyPointComparator) {
				if (lastQuestion.id === 1 && lastQuestion.answer === true) {
					this.noMoreQuestions()
				} else if (lastQuestion.id === 1 && lastQuestion.answer === false) {
					this.questionList[7].answer = this.isElectroDependant()
					return this.questionList[7]
				}
			}
		}

		// Launch the script
		await this.start();

		// Return the next question based on the script
		return this.nextQuestion;
	}

	public resetQuestions(questionsToReset: Question[]): void {
		this.questionList.forEach(q => {
			if (questionsToReset.includes(q)) {
				q.answer = null;
			}
		});
	}

	private start(): void {

		this.setReason('');
		this.notification = null;
		if (this.callMotive === DigitalScriptService2.identifySupplyPointComparator) {
			if (this.tipoAveria === '3' && this.questionList[12].answer === null) {
				this.checkCOR()
			} else if (this.tipoAveria === '3') {
				this.questionList[12].answer = false
				this.openSr('0871I00')
			} else if (this.hasAveria) {
				this.checkNewAveria()
			} else {
				this.checkIsSave()
			}
		} else if (this.callMotive === DigitalScriptService2.contactDataComparator) {
			this.checkIsSave()
		}

	}

	private checkNewAveria() {
		if (this.questionList[15].answer) {
			this.checkElectroDependant()
		} else if (this.questionList[15].answer === false) {
			this.checkCOR()
		} else {
			this.nextQuestion = this.questionList[15]
		}
	}


	private getServiceDownJustification(): boolean {
		if (this.supply.osCorte === '1' || this.osCorte === 1) {
			return true;
		} else {
			return false;
		}
	}
	public getIsFlujoFinal() {
		const estadoContador = this.meterStatus;
		const luzEnCalleContestada = this.getAnswer(4) != null;
		let diferencialContestada = this.getAnswer(6) != null;
		let noSaltadoDiferencial = diferencialContestada && !this.getAnswer(6);
		const electrodependienteContestada = this.getAnswer(7) != null;
		const situacionPeligroContestada = this.getAnswer(15) != null;
		const impagoContestada = this.getAnswer(16) != null;

		const electrodependiente = electrodependienteContestada && this.getAnswer(7);
		const enviarNuevoAviso = this.getAnswer(1) != null && this.getAnswer(1);
		const situacionPeligro = situacionPeligroContestada && this.getAnswer(15);
		const situacionPeligroOEnviarNuevoAviso = enviarNuevoAviso || situacionPeligro;
		const avoidEnviarNuevoAviso = this.getAnswer(1) != null && !this.getAnswer(1);
		const corteErroneo = this.getAnswer(14) != null && this.getAnswer(14);
		const notCorteErroneo = this.getAnswer(14) != null && this.getAnswer(14) === false;
		const corteJustificado = this.supply?.osCorte ? this.supply?.osCorte === '1' : '';
		const newAviso = this.getAnswer(15) !== null && this.getAnswer(15) === false

		if (

			// Si se ha elegido enviar nuevo aviso o situación de peligro y se ha contestado electrodependiente y se ha elegido seguridad o servicios de emergencia (H32-H46)
			(electrodependienteContestada && situacionPeligroOEnviarNuevoAviso && this.securityEmergency !== 0) ||
			// O si es electrodependiente y no se da situacion de peligro o enviar nuevo aviso (H03, H27, H28)
			(electrodependiente && !situacionPeligroOEnviarNuevoAviso) ||
			// O si tiene avería y ha contestado que no tiene que enviar nuevo aviso (H02) o no ha contestado esa pregunta (H01 tipo 3)
			(this.hasAveria && (avoidEnviarNuevoAviso || (this.tipoAveria == '3' && !(enviarNuevoAviso || avoidEnviarNuevoAviso)))) ||
			// O si tiene incidencia y ha contestado a electrodependencia (H03, H04)
			(this.hasIncidence && electrodependienteContestada) ||
			// O ha contestado la pregunta de luz en la calle H05, H06, H07, H08  
			luzEnCalleContestada ||
			// O ha contestado que se ha reestablecido el suministro H09, H10, H11, H12, H13, H14, H15, H16, H17, H18, H19, H20, H23, H24, H25
			// O no ha saltado el diferencial (H21, H22)
			this.isSupplyRestoredAnswered() || noSaltadoDiferencial ||
			// O si no tiene incidencia y ha contestado no a electrodependencia y el estado del contador es 0 (H26)
			(!this.hasIncidence && electrodependienteContestada && !electrodependiente && estadoContador !== null && estadoContador === 0) ||
			// O tiene un corte justificado y ha contestado corte erróneo (H29) o ya ha contestado al impago (H30, H31)
			(corteJustificado && (corteErroneo || impagoContestada)) ||
			// O no tiene avería ni incidencia y ha contestado a la situación de peligro pero no a la de electrodependiente
			(newAviso) ||
			// TODO Porque creo que este flujo va por otro lado
			//  || (!this.hasAveria && !this.hasIncidence && situacionPeligroContestada && !electrodependienteContestada)
			(corteErroneo) ||
			(notCorteErroneo && impagoContestada)
		) {
			return true;
		}

		return false;
	}

	public getCalculatedHasToSendCor() {
		let hasToSendCorCalculated = false;
		let estadoContador = this.meterStatus;
		let diferencialContestada = this.getAnswer(6) != null;
		let noSaltadoDiferencial = this.getAnswer(6) != null && !this.getAnswer(6);
		let enviarNuevoAviso = this.getAnswer(15) != null && this.getAnswer(15);
		let impagoContestada = this.getAnswer(16) != null;
		let suministroRestablecido = this.isSupplyRestored();
		let avoidsSendingCor = this.getAnswer(12) != null && !this.getAnswer(12);
		let flujoDatosContacto = this.getAnswer(1) != null && this.getAnswer(7);
		// Para enviar aviso al Cor (la mayoría de casos)
		// No se puede cumplir que tenga avería o diga que no quiera enviar avería T03A,
		if ((!avoidsSendingCor && (!this.hasAveria || enviarNuevoAviso) &&
			// ni suministro restablecido T13Sí/T15Sí,T16Sí, ni tampoco impago T19
			!suministroRestablecido && !impagoContestada &&
			// enviará si la del diferencial está contestada T14 con NO y el estado de contador es distinto a 1 (activo)
			(!diferencialContestada || (noSaltadoDiferencial && estadoContador != 1))) ||
			// Si va por el flujo de datos de contacto siempre envía SR (T23)
			flujoDatosContacto ||
			// Valida si el flujo H18, H19, H20, H21, H22 y H23
			(this.getAnswer(12) && diferencialContestada && suministroRestablecido === false)
		) {
			hasToSendCorCalculated = true;
		}

		if (this.CORpetitionError === '1001') {
			hasToSendCorCalculated = false;
		}
		return hasToSendCorCalculated;
	}

	public getTipoSR() {
		// Por defecto la más común
		// 0871A00: H04, H05, H06, H07, H08, H21, H22, H25, H26
		this.srCode = '';
		let tipologiaSR = '0871A00';
		if (this.questionList[1].answer === false) {
			this.securityEmergency = 0;
		}
		if (this.CORpetitionError === '1001') {
			tipologiaSR = '0871I00';
		}
		let estadoContador = this.meterStatus;
		let suministroRestablecidoContestado = this.isSupplyRestoredAnswered();
		let suministroRestablecido = this.isSupplyRestored();
		let icpLocalDesarmado = this.getAnswer(3) != null && this.getAnswer(3);
		let saltadoDiferencialContestado = this.getAnswer(6) != null;
		let noSaltadoDiferencial = saltadoDiferencialContestado && !this.getAnswer(6);
		let electrodependiente = this.getAnswer(7) != null && this.getAnswer(7);		
		let enviarAvisoAlCor = this.getAnswer(12) != null && this.getAnswer(12);
		let seguridadOEmergencia = this.getAnswer(13) != null && this.getAnswer(13);
		let corteErroneo = this.getAnswer(14) != null && this.getAnswer(14);
		let corteNoErroneo = this.getAnswer(14) != null && !this.getAnswer(14);
		let corteImpago = this.getAnswer(16) != null && this.getAnswer(16);
		const enviarNuevoAviso = this.getAnswer(1) != null && this.getAnswer(1);
		const situacionPeligro = this.getAnswer(15) != null && this.getAnswer(15);
		const situacionPeligroOEnviarNuevoAviso = enviarNuevoAviso || situacionPeligro;
		this.srSub = '';
		if (this.callMotive === DigitalScriptService2.identifySupplyPointComparator) {
			// Si tiene avería T03A (H01, H02) o El suministro está restablecido T13 (H09, H10, H11), T15 (H15, H16, H17), H24
			if (!situacionPeligroOEnviarNuevoAviso && (this.hasAveria || suministroRestablecido)) {
				tipologiaSR = '0871I00';
				this.srSub = '0871I0001';
				// El suministro está restablecido T13 (H09, H10, H11), T15 (H15, H16, H17), H24
				if (suministroRestablecido) {
					this.srSub = '0871I0004';
				}
			}
			// 0871A01 o 0871A02
			else if (electrodependiente || this.securityEmergency != 0 || (icpLocalDesarmado && !suministroRestablecido)) {
				if (this.CORpetitionError === '1001') {
					tipologiaSR = '0871I01';
				} else {
					tipologiaSR = '0871A01';
				}
				// 0871A0102: Si es electrodependiente T09 (H03), 
				// H12, H13, H14, 
				// H27, H28, 
				// H37, H38, H39, H40, H41 o H47
				if (electrodependiente || icpLocalDesarmado || this.securityEmergency == 2) {
					if (electrodependiente && this.securityEmergency == 1) {
						// Flujo H32 - H36 electrodependiente
						this.srSub = '';
					} else if (electrodependiente && this.securityEmergency == 3) {
						// Flujo H42 - H46 electrodependiente
						if (this.CORpetitionError === '1001') {
							this.srSub = '0871I0101';
						} else {
							this.srSub = '0871A0101';
						}
					} else {
						if (this.CORpetitionError === '1001') {
							this.srSub = '0871I0101';
						} else {
							this.srSub = '0871A0102';
						}
					}
				}
				// 0871A02: Si va por H32, H33, H34, H35, H36
				else if (this.securityEmergency == 1) {
					if (this.CORpetitionError === '1001') {
						tipologiaSR = '0871I02';
					} else {
						tipologiaSR = '0871A02';
					}
				}
				else { // 0871A0101: Si es H42, H43, H44, H45, H46
					if (this.CORpetitionError === '1001') {
						this.srSub = '0871I0101';
					} else {
						this.srSub = '0871A0101';
					}
				}
			}
			// Si hay corte erróneo es la 0871A06 H29
			else if (corteErroneo) {
				if (this.CORpetitionError === '1001') {
					tipologiaSR = '0871I01';
					this.srSub = '0871I0101';
				} else {
					tipologiaSR = '0871A06';
				}
			}
			// Si contesta la pregunta de corte no erróneo pero contesta no estamos en H30 o H31
			else if (corteNoErroneo) {
				// H30
				if (corteImpago) {
					tipologiaSR = '0864I00';
					this.srSub = '0864I0002';
				}
				// H31
				else {
					tipologiaSR = '0869I07';
					this.srSub = '0869I0702';
				}
			}
			// Si el suministro no está reestablecido es el factor común para '0871A04' y '0871I01'
			// 0871A04: Si ha saltado el diferencial pero no está reestablecido, o se ha preguntado, no ha saltado pero es telegestionado activo
			//  H18, H19, H20, H23
			else if (saltadoDiferencialContestado && (suministroRestablecidoContestado || (noSaltadoDiferencial && estadoContador == 1))) {
				if (this.CORpetitionError === '1001') {
					tipologiaSR = '0871I01';
					this.srSub = '0871I0101';
				} else if(!enviarAvisoAlCor) {
					tipologiaSR = '0871A04';
					this.srSub = '0871A0401';
					this.srCode = '0871A04';
				}
				// Si se ha seleccionado mandar manualmente al COR se selecciona la 0871A0102
				else {
					tipologiaSR = '0871A01';
					this.srSub = '0871A0102';
				}
			}
		} else if (this.callMotive === DigitalScriptService2.contactDataComparator) {

			//if (this.callMotive === DigitalScriptService2.contactDataComparator) {
			if (this.CORpetitionError === '1001') {
				tipologiaSR = '0871I01';
			} else {
				tipologiaSR = '0871A01';
			}
			// 0871A0102: Si es electrodependiente T09 (H03), 
			// H12, H13, H14, 
			// H27, H28, 
			// H37, H38, H39, H40, H41 o H47
			if (enviarNuevoAviso) {
				if (this.securityEmergency == 1) {
					// Flujo H32 a H36
					if (this.CORpetitionError === '1001') {
						tipologiaSR = '0871I02'
					} else {
						tipologiaSR = '0871A02'
					}
				} else if (this.securityEmergency == 2) {
					// Flujo H37 a H41
					this.srSub = '0871A0102';
				} else if (this.securityEmergency == 3) {
					if (this.CORpetitionError === '1001') {
						this.srSub = '0871I0101';
					} else {
						this.srSub = '0871A0101';
					}
				}
			} else {
				if (this.CORpetitionError === '1001') {
					this.srSub = '0871I0101'
				} else {
					this.srSub = '0871A0102'
				}
			}
		}
		return tipologiaSR;
	}

	public getAlcance() {
		let alcance = 1;
		let corteJustificado = this.supply?.osCorte ? this.supply.osCorte === '1' : '';
		let situacionPeligro = this.getAnswer(1) != null && this.getAnswer(1);
		let luzEnEscalera = this.getAnswer(2) != null && this.getAnswer(2);
		let luzEnCalleOEdificiosCercanos = this.getAnswer(4) != null && this.getAnswer(4);
		// Si no es una situación de peligro, el corte no está justificado, no hay incidencia en curso y no es electrodependiente
		// No hay suministro en el ascensor o en su defecto en la escalera...
		if (!situacionPeligro &&
			!corteJustificado &&
			!this.getHasIncidence() &&
			!luzEnEscalera) {
			// Si se ha contestado la pregunta de "¿Hay suministro en la calle?"
			if (this.getAnswer(4) != null) {
				// Si hay luz en la calle H05, H06
				if (!luzEnCalleOEdificiosCercanos) {
					alcance = 4;
				}
				// Si no H07, H08
				else {
					alcance = 2;
				}
			}
		}
		return alcance;
	}

	public getTipoAviso = () => {
		let tipo = 1;
		const corteJustificado = this.supply?.osCorte === '1' || this.osCorte === 1;
		const estadoContador = this.meterStatus;
		const telegestionado = this.supply?.tipoDeLectura === 'TELEGESTIONADO';
		const enviarNuevoAviso = this.getAnswer(1) != null && this.getAnswer(1);
		const situacionPeligro = this.getAnswer(15) != null && this.getAnswer(15);
		const icpLocalDesarmado = this.getAnswer(3) != null && this.getAnswer(3);
		const electrodependiente = this.getAnswer(7) != null && this.getAnswer(7);
		const corteErroneo = this.getAnswer(14) != null && this.getAnswer(14);
		const hayLuz = this.isSupplyRestored();
		// Si situación de peligro o enviar nuevo aviso H32-H46
		if (enviarNuevoAviso || situacionPeligro ||
			// ICP local desarmado y no hay luz H12, H13, H14
			(icpLocalDesarmado && !hayLuz) ||
			// Si es electrodependiente se contesta SI con incidencia en curso, o SI con situación de peligro, pero no SI con Corte justificado H03, H27
			// Cambio de tipo o caracteristicas del aviso a COR como resultado de la atención  GDC NU-08
			(electrodependiente && corteJustificado) ||
			// H28
			(electrodependiente && !corteJustificado)
		) {
			tipo = 3;
		}
		// Si es electrodependiente y el corte está justificado H29
		else if ((corteJustificado && corteErroneo) ||
			// No es electrodependiente, no hay incidencia, es Telegestionado y Contador estado 0, Además el suministro no estaba reestablecido H26
			(telegestionado && estadoContador === 0 && !electrodependiente && !this.getHasIncidence() && !hayLuz)) {
			tipo = 4;
		}
		// Flujo H18 - H23
		else if (
			// Flujo por la pregunta ¿Ha sataldo diferencial U otros interroptores?
			(this.getAnswer(6) !== null && this.getAnswer(6) && ((this.getAnswer(5) !== null && !this.getAnswer(5)) || (this.getAnswer(9) !== null && !this.getAnswer(9)))) ||
			// Flujo por telegestionado
			(this.getAnswer(6) !== null && !this.getAnswer(6) && telegestionado && estadoContador === 1) || 
			//
			(this.callMotive === DigitalScriptService2.contactDataComparator)) {
			tipo = 3
		}
		return tipo;
	}


	public getMotivo = () => {
		let motivo = '';
		let corteJustificado = this.supply?.osCorte === '1' || this.osCorte === 1;
		let electrodependiente = this.getAnswer(7) != null && this.getAnswer(7);
		let corteErroneo = this.getAnswer(14) != null && this.getAnswer(14);
		// Si es electrodependiente H03, H27, H28, T20 (H32-H46)
		if (electrodependiente) {
			motivo = 'M2';
		}
		// Si es corte justficado y no electrodependiente y corte erróneo H29
		else if (corteJustificado && corteErroneo) {
			motivo = 'M3';
		}
		return motivo;
	}

	private checkIsLocatedFailure(): void {
		this.hasToSendCOR = false;
		if (this.locatedFailure) {

			// Aviso SGI | tipo 1 | alcance 1
			this.hasToSendCOR = true;

			// SR 0871A00 CERRADA
			this.openSr('0871A00');

			this.setReason(this.reasonList[2]);

		} else {
			this.checkIsRemoteManaged();
		}
	}

	private checkIsRemoteManaged(): void {
		if (this.isRemoteManaged()) {
			this.checkStatusActuationPoint();
		} else {
			this.checkStaircaseLight();
		}
	}

	public getMotive() {
		if (this.isElectroDependant) {
			return 'M2'
		} else if (this.isRemoteManaged) {
			return 'M3'
		} else {
			return ''
		}
	}

	private checkStatusActuationPoint(): void {
		switch (this.meterStatus) {

			case 0:
				if (this.questionList[7].answer == null) {
					this.questionList[7].answer = this.isElectroDependant();
					this.nextQuestion = this.questionList[7];

				} else if (this.questionList[7].answer) {
					this.checkCOR();
					//this.openSr('0871A01');

				} else {
					this.checkCOR();
					//this.openSr('0871A06');
				}

				break;

			case 1:
				if (this.questionList[3].answer == null) {
					this.nextQuestion = this.questionList[3];

				} else if (this.questionList[3].answer) {
					// INSTRUCCIONES DE REARME MANUAL

					this.checkSupplyRestored(this.checkCOR);

				} else {
					this.messageClient();
				}
				break;

			case 2:
				// INSTRUCCIONES DE REARME MANUAL

				this.checkSupplyRestored(this.icpRearmament.bind(this));

				break;

			default:
				this.checkIsSave();
				break;
		}
	}

	private checkIsSave(): void {
		if (this.callMotive === DigitalScriptService2.identifySupplyPointComparator) {
			if (this.questionList[1].answer == null) {
				this.nextQuestion = this.questionList[1];
			} else if (this.questionList[1].answer) {
				this.noMoreQuestions()
				this.checkElectroDependant()
			} else {
				if (this.getServiceDownJustification()) {
					this.checkElectroDependant()
				} else if (this.hasIncidence) {
					this.checkElectroDependant()
				} else {
					if (this.questionList[7].answer) {
						this.checkElectroDependant()
					} else {
						if (this.meterStatus === 1) {
							if (this.questionList[3].answer == null) {
								this.nextQuestion = this.questionList[3];
							} else if (this.questionList[3].answer) {
								// INSTUCCIONES DEL REARME 
								this.checkSupplyRestored(this.checkElectroDependant.bind(this));
							} else if (this.questionList[3].answer === false) {
								this.checkDifferential()
							}
						} else if (this.meterStatus === 0) {
							this.checkCOR()
						} else if (this.meterStatus === 2) {
							this.icpRearmament()
						} else {
							this.checkStaircaseLight();
						}
					}
				}
			}
		} else if (this.callMotive === DigitalScriptService2.contactDataComparator) {
			if (this.questionList[1].answer == null) {
				this.nextQuestion = this.questionList[1];
			} else {
				this.checkInfoDirection()
			}
		}
	}

	private checkInfoDirection() {
		if (this.questionList[17].answer == null) {
			this.nextQuestion = this.questionList[17];
		} else {
			this.noMoreQuestions()
		}
	}

	public whantsInfo(): boolean {
		return this.questionList[17].answer
	}

	private checkStaircaseLight(): void {
		// Pregunta: Hay suministro en ascensor o escalera?
		if (this.questionList[2].answer == null) {
			this.nextQuestion = this.questionList[2];

		} else if (this.questionList[2].answer) {

			if (this.questionList[3].answer == null) {
				this.nextQuestion = this.questionList[3];

			} else if (this.questionList[3].answer) {
				// INSTUCCIONES DEL REARME 

				this.checkSupplyRestored(this.checkElectroDependant.bind(this));

			} else {
				this.checkDifferential();
			}

		} else {
			this.checkStreetLight();
		}
	}

	private checkDifferential(): void {
		this.hasToSendCOR = false;
		// Pregunta: Ha saltado differencial u otors interruptores
		if (this.questionList[6].answer == null) {
			this.nextQuestion = this.questionList[6];
		} else if (this.questionList[6].answer) {
			// INSTRUCCIONES DE REARME MANUAL
			// this.questionList[this.questionList.length - 3].answer = true
			this.checkSupplyRestoredNoCallback()

		} else {

			if (this.questionList[7].answer == null) {
				this.questionList[7].answer = this.isElectroDependant();
				this.nextQuestion = this.questionList[7];

			} else {
				this.hasToSendCOR = true;
				this.checkCOR()
			}
		}
	}

	private checkElectroDependant(): void {
		// Si no está asignado electrodependiente, asignar electrodependiente y la siguiente pregunta es la de electrodependiente
		if(this.isElectroDependant()){
			this.questionList[7].disabled = true
		}
		if (this.questionList[7].answer == null) {
			this.questionList[7].answer = this.isElectroDependant();
			this.nextQuestion = this.questionList[7];
			// Si la pregunta no era null y la respuesta a "¿Es electrodependiente?" es "Sí"
		} else if (this.questionList[7].answer) {
			this.checkCOR()
			// La siguiente pregunta es "¿Enviar aviso al COR?"
			// this.nextQuestion = this.questionList[12];
			// // Si no se ha contestado no hacemos nada
			// if (this.questionList[12].answer === null) {
			// } else {
			// 	// Si se contesta pero no ha contestado a "¿Hay luz en la calle?" hay que revisar el COR (Significa que no hemos pasado por T10), estamos en T06, T09, T17 o T20
			// 	if (this.questionList[4].answer === null) {
			// 		this.checkCOR();
			// 		// Si hay respuesta a esa pregunta significa que hemos pasado por T10
			// 	} else {
			// 		this.checkCORStreet();
			// 	}
			// }
			// Si no es electrodependiente significa que estamos en T06, T09 (H04), T18 (H29, H30 o H31) o T20 (H32 a H46)
		} else {

			// Si tiene un corte
			if (!this.questionList[7].answer && !this.questionList[1].answer && this.getServiceDownJustification() && !this.hasAveria) {
				this.checkCutError()
			} else {
				if (this.meterStatus === 1) {
					if (this.questionList[3].answer == null) {
						this.nextQuestion = this.questionList[3];
					} else if (this.questionList[3].answer) {
						// INSTUCCIONES DEL REARME 
						this.checkSupplyRestoredNoCallback();
					} else {
						this.checkDifferential();
					}
				}
				
					this.checkCOR();
				
			}

		}
	}

	private checkCutError(): void {
		if (this.questionList[14].answer == null) {
			this.nextQuestion = this.questionList[14]
		} else if (this.questionList[14].answer) {
			this.checkCOR()
		} else {
			this.checkImpago()
		}
	}

	private checkImpago(): void {
		if (this.questionList[16].answer == null) {
			this.nextQuestion = this.questionList[16]
		} else {
			this.checkCOR()
		}
	}

	private checkStreetLight(): void {
		// Pregunta: Hay Suministro en la calle?
		this.hasToSendCOR = false;
		if (this.questionList[4].answer == null) {
			this.nextQuestion = this.questionList[4];

		} else {
			this.hasToSendCOR = true;
			this.checkElectroDependant();
		}
	}

	private checkCORfromIncidence(): void {
		this.hasToSendCOR = false;
		if (this.questionList[12].answer == null) {
			this.nextQuestion = this.questionList[12];
		} else {
			if (this.questionList[12].answer) {
				this.hasToSendCOR = true;
			}
			this.openSr('0871A00');
		}
	}

	private checkCOR(): void {
		this.hasToSendCOR = false;
		// Pregunta: ¿Enviar aviso al COR?

		const newAviso = this.getAnswer(15)

		const security = this.getAnswer(1)
		const electrodependant = this.getAnswer(7)
		const staircaseLight = this.getAnswer(2)
		const streetLight = this.getAnswer(4)
		const disarmedICP = this.getAnswer(3)
		const supplyRestored = this.getAnswer(5)
		const diferential = this.getAnswer(6)
		const osCuttable = this.getAnswer(14)
		const impago = this.getAnswer(16)
		let diferencialContestada = this.getAnswer(6) != null;
		let suministroRestablecidoContestada = this.isSupplyRestoredAnswered();
		let suministroNoRestablecido = !this.isSupplyRestored();
		const estadoContador = this.meterStatus;

		if (this.questionList[12].answer == null) {
			this.questionList[12].answer = false
			this.questionList[12].disabled = true
			this.nextQuestion = this.questionList[12];
		} else {
			if (this.CORpetitionError === '1001') {
				this.questionList[12].answer = false
				this.questionList[12].disabled = true
			} else {
				// H01 y H02
				if (newAviso !== null && !newAviso) {
					this.questionList[12].answer = false
					this.questionList[12].disabled = true
				}

				// H05 - H06 - H07 - H08
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (staircaseLight !== null && !staircaseLight)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H09 - H10 - H11
				if (((security !== null && !security) && (electrodependant !== null && !electrodependant) && (staircaseLight !== null && staircaseLight) && (disarmedICP !== null && disarmedICP) && (supplyRestored !== null && supplyRestored)) || ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (disarmedICP !== null && disarmedICP) && (supplyRestored !== null && supplyRestored))) {
					this.questionList[12].answer = false
					this.questionList[12].disabled = true
					this.questionList[12].visible = false;
				}

				// H12 - H13 - H14
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (staircaseLight !== null && staircaseLight) && (disarmedICP !== null && disarmedICP) && (supplyRestored !== null && !supplyRestored)) {
					this.questionList[12].answer = true;
					this.questionList[12].disabled = true;
					this.questionList[12].visible = true;
				}

				// H15 - H16 - H17
				if (((security !== null && !security) && (electrodependant !== null && !electrodependant) && (staircaseLight !== null && staircaseLight) && (disarmedICP !== null && !disarmedICP) && (diferential !== null && diferential) && (supplyRestored !== null && supplyRestored)) || (security !== null && !security) && (electrodependant !== null && !electrodependant) && (disarmedICP !== null && !disarmedICP) && (diferential !== null && diferential) && (supplyRestored !== null && supplyRestored)) {
					this.questionList[12].answer = false;
					this.questionList[12].disabled = true;
					this.questionList[12].visible = false;
				}

				// H18 - H19 - H20
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && ((staircaseLight !== null && staircaseLight) || (staircaseLight === null && this.meterStatus === 1)) && (disarmedICP !== null && !disarmedICP) && (diferential !== null && diferential) && (supplyRestored !== null && !supplyRestored)) {
					if (!this.questionList[12].answer) {
						this.questionList[12].answer = false
						this.questionList[12].disabled = false
						this.questionList[12].visible = true;
					} else if (this.questionList[12].answer) {
						this.questionList[12].answer = true
						this.questionList[12].disabled = false
						this.questionList[12].visible = true;
					}
				}

				// H21 - H22
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (staircaseLight !== null && staircaseLight) && (disarmedICP !== null && !disarmedICP) && (diferential !== null && !diferential) && this.meterStatus !== 1) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H23 ----- pdt. fix you can not change and you have to change
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (disarmedICP !== null && !disarmedICP) && (diferential !== null && !diferential) && this.meterStatus === 1) {
					if (!this.questionList[12].answer) {
						this.questionList[12].answer = false
						this.questionList[12].disabled = false
						this.questionList[12].visible = true;
					} else if (this.questionList[12].answer) {
						this.questionList[12].answer = true
						this.questionList[12].disabled = false
						this.questionList[12].visible = true;
					}
				}

				// H24
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (this.meterStatus === 2) && (supplyRestored !== null && supplyRestored)) {
					this.questionList[12].answer = false
					this.questionList[12].disabled = true
					this.questionList[12].visible = false;
				}

				// H25
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (this.meterStatus === 2) && (supplyRestored !== null && !supplyRestored)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H26
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (this.meterStatus === 0)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H27
				if ((security !== null && !security) && (electrodependant)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H28
				if ((security !== null && !security) && (electrodependant)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H30
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (osCuttable !== null && !osCuttable) && (impago !== null && impago === true)) {
					this.questionList[12].answer = false
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				// H31
				if ((security !== null && !security) && (electrodependant !== null && !electrodependant) && (osCuttable !== null && !osCuttable) && (impago !== null && !impago)) {
					this.questionList[12].answer = false
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}

				if ((security !== null && security === true)) {
					this.questionList[12].answer = true
					this.questionList[12].disabled = true
					this.questionList[12].visible = true;
				}
				// Si estamos en el escenario H18-H23, la siguiente pregunta es la 12.
				if(diferencialContestada && 
					((suministroRestablecidoContestada && suministroNoRestablecido) || estadoContador === 1)){
					this.nextQuestion = this.questionList[12];
				}
				else{

					if (this.questionList[7].answer) {
						this.openSr('0871A01');
					} else {
						this.openSr('0871A00');
					}
				}
			}
		}
	}

	private isSupplyRestoredAnswered() {
		return (this.questionList[5].answer != null) || (this.questionList[9].answer != null)
	}

	public isSupplyRestored() {
		return (this.questionList[5].answer != null && this.questionList[5].answer) || (this.questionList[9].answer != null && this.questionList[9].answer)
	}

	private checkSupplyRestored(callback: Function): void {

		if (this.meterStatus != null && this.meterStatus === 2) {
			if (this.questionList[5].answer == null) {
				this.nextQuestion = this.questionList[5];
			} else if (this.isSupplyRestored()) {
				this.checkCOR()
			}

		} else {
			if (this.questionList[5].answer == null) {
				this.nextQuestion = this.questionList[5];

			} else if (this.questionList[5].answer) {
				this.checkCOR()
			} else {
				this.checkElectroDependant()
			}
		}
	}

	private checkSupplyRestoredNoCallback(): void {
		if (this.questionList[5].answer == null) {
			this.nextQuestion = this.questionList[5];
		} else {
			if (this.questionList[12].answer == null) {
				this.nextQuestion = this.questionList[12];
			} else {
				this.checkCOR()
			}
		}
	}

	private messageClient(): void {
		// MENSAJE A CLIENTE
		this.openSr('0871A04');
	}

	private icpRearmament(): void {
		// REARME ICP AUTOMÁTICO

		if (this.questionList[5].answer == null) {
			this.nextQuestion = this.questionList[5];

		} else if (this.questionList[5].answer) {
			this.checkCOR()
		} else {
			if (this.questionList[7].answer == null) {
				this.questionList[7].answer = this.isElectroDependant();
				this.nextQuestion = this.questionList[7];

			} else if (this.questionList[7].answer) {
				this.checkCOR()
			} else {
				this.checkCOR()
			}
		}
	}

	private openSr(code: string): void {
		this.srCode = code;

		switch (code) {
			case '0871A01':
				this.srSub = '0871A0102';
				break;

			case '0864I00':
				this.srSub = '0864I0002';
				break;

			case '0871I00':
				this.srSub = '0871I0004';
				break;

			default:
				this.srSub = '';
				break;
		}
		this.srCode = this.getTipoSR();

		this.noMoreQuestions();
	}

	public noticeSgi(_type: number, _scope: number, _reason: string = ''): void {
		this.notification = {
			type: _type,
			scope: _scope,
			reason: _reason
		}
	}

	private isRemoteManaged(): boolean {
		if (this.supply.tipoDeLectura === 'TELEGESTIONADO') {
			return true;
		} else {
			return false;
		}
	}

	private noMoreQuestions(): void {
		this.setReason(this.reasonList[0]);
		this.nextQuestion = this.questionList[0];
		this.nextQuestion.answer = true
	}

	public fromIncidence(): void {
		//this.openSr('0871A00');
		this.setReason(this.reasonList[0]);
		this.nextQuestion = this.questionList[0];
		this.checkCORfromIncidence();
	}

	private isElectroDependant(): boolean {
		if (this.callMotive === DigitalScriptService2.identifySupplyPointComparator) {
			if (this.supply.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDECIA' || this.supply.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDENCIA' || this.supply.notCuttableMotive === '02 - ESENCIAL POR REAL DECRETO') {
				return true;
			} else {
				// Buscar SR0869A09 IDENTIFICACIÓN CLIENTE ESENCIAL en estado EN CURSO
				if (this.srDependency) {
					return true;
				} else {
					return false;
				}
			}
		}
	}

}

export default DigitalScriptService2;
