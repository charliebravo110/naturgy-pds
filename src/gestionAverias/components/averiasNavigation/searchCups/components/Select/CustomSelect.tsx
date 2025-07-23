import useStyles from '../../SearchCups.styles'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';


interface TSelectProps<T> {
    options: OptionsOrGroups<T, GroupBase<T>>,
    placeholder?: string,
    onSelect: (item: T) => void,
    onInputChange: (string) => void,
    onClear?: ()=>void,
    value?: T,
    loading?: boolean,
    error?: boolean,
    isClearable: boolean,
    onClick?: ()=>void,
    disabled?: boolean,
    noData?: boolean
}

export function CustomSelect<T>({ options, placeholder, onSelect, onInputChange, value, onClear, isClearable, loading, error, onClick, disabled, noData }: TSelectProps<T>) {

    const styles = useStyles();
    const minCaracteres = 3
    const {t} = useTranslation()

    const getPlaceHolder = useMemo(()=>{
        if(error){
            return  'Algo ha ido mal...'
        }
        if(noData){
            return 'Sin datos'
        }
        return t('averias.management.searchCups.address.select')
    }, [noData, error])

    return <Select
        isClearable={isClearable}
        options={options}
        className={styles.select}
        closeMenuOnSelect
        placeholder={getPlaceHolder}
        noOptionsMessage={(input)=>{return input.inputValue && input.inputValue.length < minCaracteres? `Introduce ${minCaracteres - input.inputValue.length} letra/s más`: 'Sin datos'}}
        loadingMessage={(input) => 'Buscando'}
        isLoading={loading}
        onChange={(val, actionMeta) => {
            actionMeta.action === 'clear' && onClear && isClearable && onClear()
            val && actionMeta.action === 'select-option' && onSelect(val)
        }
        }
        onInputChange={(newValue, actionMeta) => {
            actionMeta.action !== 'menu-close' && actionMeta.action !== 'input-blur' && actionMeta.action !== 'set-value' && onInputChange(newValue)
        }
        }
        styles={{
            input: (base) => ({
                ...base,
                height: 41
            }),
            control: (base, {isDisabled}) => ({
                ...base,
                borderColor: error? 'red' : 'rgba(0, 69, 113, 0.5)',
                backgroundColor: isDisabled ? 'rgba(239, 239, 239, 0.3)' : 'white'
            })
        }}
        onMenuOpen={onClick}
        isDisabled={disabled || noData}

        value={value}
    />
}