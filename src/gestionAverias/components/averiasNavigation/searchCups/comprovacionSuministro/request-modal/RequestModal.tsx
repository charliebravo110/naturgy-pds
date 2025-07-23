import React, { useEffect } from 'react'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import SupplyPanel from '../../../../supplyPointPanel/SupplyPointPanel2'

const RequestModal = (props: any) => {
	const {
		isRequestModalVisible,
		closeDialog,
		address,
		user,
		error,
		setError,
		supply,
		incidenceList,
		warningList,
		isElectroSR,
		estadoContador,
		warningInfo,
		estadoZero,
		estadoPrimero,
		estadoSegundo,
		crearAvisoFromIncidence,
		maxTry,
		closedSRTipo,
		typeList,
		scopeList,
		motiveList,
		name,
		surName1,
		surName2,
		email,
		phone,
		remark,
		extraInfo,
		currentQuestion,
		answeredQuestionList,
		digitalScript,
		manualChangedCor,
		questionPendingValue,
		setName,
		setSurName1,
		setSurName2,
		setEmail,
		setPhone,
		setRemark,
		setExtraInfo,
		setCurrentQuestion,
		setAnsweredQuestionList,
		setManualChangedCor,
		setQuestionPendingValue
	} = props

	const handleCloseDialog = () => {
		closeDialog(false)
	}

	return (
		<Dialog open={isRequestModalVisible} onClose={handleCloseDialog} {...props}>
			{/*<Content
				handleCloseDialog={handleCloseDialog}
				handleAcceptDialog={handleAcceptRequestDialog}
				cups={cups}
				address={address}
				name={name}
				document={document}
				user={user}
				setCreated={setCreated}
				setError={setError}
				supply={supply}
	/>*/}
			<SupplyPanel
				user={user}
				supply={supply}
				incidenceList={incidenceList}
				warningList={warningList}
				isElectrodependantSR={isElectroSR}
				estadoContador={estadoContador}
				address={address}
				handleCloseDialog={handleCloseDialog}
				warningInfo={warningInfo}
				estadoZero={estadoZero}
				estadoPrimero={estadoPrimero}
				estadoSegundo={estadoSegundo}
				crearAvisoFromIncidence={crearAvisoFromIncidence}
				error={error}
				setError={setError}
				maxTry={maxTry}
				closedSRTipo={closedSRTipo}
				typeList={typeList}
				scopeList={scopeList}
				motiveList={motiveList}
				name={name}
				surName1={surName1}
				surName2={surName2}
				email={email}
				phone={phone}
				remarkParent={remark.current}
				extraInfo={extraInfo}
				currentQuestion={currentQuestion}
				answeredQuestionList={answeredQuestionList}
				digitalScript={digitalScript}
				manualChangedCor={manualChangedCor}	
				questionPendingValue={questionPendingValue}
				setName={setName}
				setSurName1={setSurName1}
				setSurName2={setSurName2}
				setEmail={setEmail}
				setPhone={setPhone}
				setRemarkParent={setRemark}
				setExtraInfo={setExtraInfo}
				setCurrentQuestion={setCurrentQuestion}
				setAnsweredQuestionList={setAnsweredQuestionList}
				setManualChangedCor={setManualChangedCor}		
				setQuestionPendingValue={setQuestionPendingValue}	
			/>
		</Dialog>
	)
}

export default RequestModal
