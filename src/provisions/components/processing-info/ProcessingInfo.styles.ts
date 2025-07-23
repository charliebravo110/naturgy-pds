import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',    
  },
  estimatedDateCont: {
    marginTop: 15
  },
  estimatedDateTitle: {
    color: '#004571',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 20
  },
  estimatedDateDate: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#E97000',
    fontSize: 25,
    fontWeight: 'bold'
  },
  estimatedDateInfo: {
    textAlign: 'center',
    color: '#BFBFBF',
    fontSize: 20
  },
  formalitiesCont: {
    marginTop: 15
  },
  formalitiesTitle: {
    color: '#004571',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
  },
  formalitiesSubtitle: {
    color: '#004571',
    fontSize: 18,
    marginTop: 10,
  },
  tableTitlesContiner: {
    backgroundColor: '#eceae7',
    marginTop: '10px',
  },
  titleFromTable: {
    width: '33.33%',
    color: '#004571',
    fontWeight: 'bold',
    padding: '10px 0 10px 20px',    
  },
  rightBorder: {
    borderRight: '1px solid #d8d3cd',
  },
  formalitiesInfoCont: {
    backgroundColor: '#f9f8f7',
    marginTop: '1px',
  },
  formalitiesInfoText: {
    width: '33.33%',
    padding: '10px 10px 10px 20px',
  },
  formalitiesOrganismoCont: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',    
  },
  alertIcon: {
    height: 16,
    marginLeft: 5,
  },
  statusCont: {
    alignItems: 'center'
  },
  statusIcon: {
    marginRight: '15px',
  },
}))

export default useStyles
