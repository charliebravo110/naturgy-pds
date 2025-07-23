import useStyles from './SignUp.styles'
import React from 'react'
import ErrorIcon from '../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import Tick from '../../../assets/icons/Interfaz_22_check_tick_validar_completo.svg'

interface TDossierItemProps {
    empty: boolean,
    condition: boolean,
    text: string,
}

const DossierItem: React.FC<TDossierItemProps> = ({ empty, condition, text }) => {
    const classes = useStyles({})

    const getTickSrc = () => {
        if (!empty && !condition) {
            return ErrorIcon;
        }
        return null; 
    }

    const getTickClass = () => {
        if (!empty && !condition) {
            return classes.erroricon;
        }
        return ''; 
    }

    return (
        <div className={`${classes.dossierDateAdviseItem} ${empty || condition ? classes.dossierDateAdviseRed : classes.dossierDateAdviseBlue}`}>
            {(!empty && !condition) && (
                <>
                    <img className={`${classes.dossierDateAdviseIcon} ${getTickClass()}`} src={getTickSrc()} alt='' />
                    <span style={{color: 'red'}}>{text}</span>
                </>
            )}
        </div>
    );
}

export default DossierItem