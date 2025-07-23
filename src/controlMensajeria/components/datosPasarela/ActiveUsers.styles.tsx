
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

    inputsAreaWrapper: {
        marginBottom: '4%',
        [theme.breakpoints.up('sm')]: {
            padding: '20px',
            // '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
            // '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
            // boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)'
        }
    },
    inputsArea: {
        background: 'white',
        '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
        '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
        boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
        [theme.breakpoints.up('sm')]: {
            backgroundColor: 'rgb(247, 247, 247)',
            '-webkit-box-shadow': 'none',
            '-moz-box-shadow': 'none',
            boxShadow: 'none'
        }
    },
    listContainer: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        }
    },
    inputTitle: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '20px',
        marginBottom: '10px',
        [theme.breakpoints.up('sm')]: {
            height: '28px',
            display: 'flex',
            alignItems: 'flex-end'
        }
    },
    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
          width: '650px',
          heigth: '250px',
          border: '2px solid rgb(61, 114, 147)'
        }
      },
      container: {
        padding: 36,
        overflow: 'hidden'
      },
      closeButton: {
        position: 'absolute',
        top: 18,
        right: 18,
        cursor: 'pointer'
      },
      text: {
        fontSize: 17,
        textAlign:'center',
        color: ' #004571',
        padding: '20px 0'
      },
      alertBlock: {
        [theme.breakpoints.only('xs')]: {
          textAlign: 'center'
        }
      },
      alertIcon: {
        height: '100%'
      },
      button: {
        marginTop: 25
      }


}));

export default useStyles