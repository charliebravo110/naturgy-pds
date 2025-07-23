class AveriasUtils {
    static formatCurrency(amount, currency) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    }
  
    static formatPercentage(value, decimals = 2) {
      return `${(value * 100).toFixed(decimals)}%`;
    }
    

	static FormatDateAverias=(fecha: string)=>
    {
        var regex = /^ (\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;
        if(regex.test(fecha)){
            const fechaSeparada = fecha.replace(' ', '');
            fecha = fechaSeparada;
        }
        regex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;
        if(regex.test(fecha)){
            const fechaSeparada = fecha.replace('_', ' ');
            fecha = fechaSeparada;			
        }
        return fecha;
    }

  static FormatDateAveriasPantalla=(fecha: string)=>
    {
        if (fecha.charAt(0) === '_' || fecha.charAt(0) === ' ') {
            // Extract substring from the 1st position to the end
            fecha = fecha.substring(1); // or str.slice(1)
        } 
        var formattedDate = fecha.replace('\\','').replace(' ','_')
        var regexGuion = /\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}/;
        var regexBarra = /\d{4}\/\d{2}\/\d{2}_\d{2}:\d{2}:\d{2}/;
        var caracterSeparador = '-';
        const barAsSeparator = regexBarra.test(formattedDate);
        if(regexGuion.test(formattedDate) || barAsSeparator){
          formattedDate = formattedDate.replace('_',' ')
          if(barAsSeparator) caracterSeparador = '/';
          const dateParts = formattedDate.split(' ')[0].split(caracterSeparador);
          const timeParts = formattedDate.split(' ')[1].split(':');
  
          // Create a new date object
          formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
        }
        else{
          return fecha;
        }
        return formattedDate;
    }
    
	static FormatDateAveriasIncidenceList=(fecha: string)=>
    {
      var regex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;
      if(regex.test(fecha)){
        return fecha;
      }
      return fecha.substring(0, 4)+ '-'+ fecha.substring(4, 6)+ '-'+ fecha.substring(6, 8)+ '_'+ fecha.substring(8, 10)+':'+fecha.substring(10, 12)+':'+fecha.substring(12, 14);
    }
    
  static FormatTextField=(textField: string)=>
    {
      let sReturn = ''
      if(textField){
        sReturn = textField
      }
      return sReturn;
    }
  
	static FormatCodDescField=(cod: string, desc: string)=>
    {
      let sReturn = ''
      if(cod){
        sReturn = cod
        if(desc){
          sReturn += ' - '
        }
      }
      if(desc){
        sReturn += desc
      }
      return sReturn;
    }
}
  
  export default AveriasUtils;
  