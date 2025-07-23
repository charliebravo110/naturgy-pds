import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    },
    '&.without-margin': {
      marginTop: -46
    },
    '&.with-margin': {
      marginTop: 128
    }
  },
  container: {
    padding: '20px 0',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    marginTop: 26,
    textAlign: 'center',
    marginBottom: 50,
    '&.without-margin': {
      marginTop: 0
    }
  },
  outerContainer: {
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
  },
  infoText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  detailText: {
    color: 'rgba(0, 69, 113, 1)',
  },
  detailCod: {
    color: '#E57000'
  },
  link: {
    color: '#6AA1D8',
    textDecoration: 'underline',
    cursor: 'pointer',
    '& a:visited': {
      color: '#6AA1D8'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 10
    }
  },
  requestContainer: {
    padding: 32,
    backgroundColor: '#F8F7F5',
    borderRadius: 4,
    margin: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 16
    }
  },
  responseContainer: {
    padding: '100px 32px 100px 32px',
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    margin: 30,
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      padding: '100px 16px 100px 16px',
    }
  },
  userContainer: {
    marginBottom: 20
  },
  userImage: {
    width: 40
  },
  userText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)'
  },
  userSkeleton: {
    width: 150,
    height: 35,
    backgroundColor: '#d4cece',
    borderRadius: 5
  },
  messageText: {
    color: '#868686'
  },
  documents: {
    marginTop: 20
  },
  documentContainer: {
    marginBottom: 15,
    '& a': {
      textDecoration: 'none',
      color: '#5193bd',
      cursor: 'pointer',
    }
  },
  documentIcon: {
    marginRight: 10
  },
  separator: {
    width: '100%',
    height: 2,
    margin: '40px 0',
    backgroundColor: '#dad4c885',
    alignSelf: 'center'
  },
  ufdContainer: {
    marginBottom: 40
  },
  ufdIcon: {
    width: 40
  },
  closedTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)'
  },
  closedSubtitle: {
    fontSize: 17,
    color: 'rgba(0, 69, 113, 1)'
  },
  closedText: {
    color: '#868686'
  },
  inCourse: {
    color: '#E57000'
  },
  inCourseIcon: {
    width: 50
  },
  inCourseText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  statusContainer: {
    margin: '0 20px 30px 20px'
  },
  statusBold: {
    color: '#868686',
    fontWeight: 'bold'
  },
  statusText: {
    color: '#868686'
  },
  containerFooter: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    textAlign: 'center',
    gap: '30px',
    marginBottom:'20px'
  },
  itemFooter: {
    display: 'grid',
    height: '50px',
    alignContent: 'center',
    color: '#868686',
    background: '#F8F7F5',
    cursor: 'pointer',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10
  },
  containerChat: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    textAlign: 'center',
    gap: '30px',
    marginBottom:'20px',
    height:'80px'
  },
  itemChat: {
    display: 'grid',
    height: '50px',
    alignContent: 'center',
    color: '#868686',
    background: '#F8F7F5',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10
  },
  itemChat1: {
    display: 'grid',
    textAlign: 'right',
    cursor: 'pointer',
    marginRight:'20px'
  },
  documentInfo: {
    marginLeft: 10,
    color: '#868686'
  },
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  }
}))

export default useStyles
