import { CarouselWhatIsNew } from '../interfaces'

export const whatIsNewData: CarouselWhatIsNew = {
  type: 'what-is-new', // cannot be changed
  version: '0.1.101', // version of the app that this slides are for (X.X.X)
  enabled: false, // if false, the carousel will not be shown, use it while the data is not ready yet
  slides: [
    /*
     * All four properties must have string values, enclose each string in `` (backticks, recommended) or '' (single quotes)
     * To add line breaks use `` (backticks) and enter line breaks where needed.
     * Title will not take space in the slide if empty ('' or ``), as requested by designer.
     */
    {
      title: `Estes es el carrusel de versionado`,
      description: `Se muestra después de una actualización.
        No se muestra en la primera instalación.
        No se muestra si se desinstala la app y se vuelve a instalar.`,
      imageFileName: '1.png',
      alt: 'describe img 1',
    },
    {
      title: `Title supports
        multiple lines`,
      description: `Both description 
        and title
        can include 
        line breaks`,
      imageFileName: '2.png',
      alt: 'describe img 2',
    },
    {
      title: '',
      description: `Description without title      
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit adiplicitic sit enim it aiculits tristequen.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit adiplicitic sit enim it aiculits tristequen.`,
      imageFileName: '3.png',
      alt: 'describe img 3',
    },
    {
      title: `Title 4`,
      description: `Description 4 lorem ipsum dolor sit amet`,
      imageFileName: '4.png',
      alt: 'describe img 4',
    },
    {
      title: `Title 5`,
      description: `Description 5 lorem ipsum dolor sit amet`,
      imageFileName: '5.png',
      alt: 'describe img 5',
    },
  ],
}
