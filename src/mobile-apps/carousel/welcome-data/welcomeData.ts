import { CarouselWelcome } from '../interfaces'

export const welcomeData: CarouselWelcome = {
  type: 'welcome', // cannot be changed
  enabled: true, // if false, the carousel will not be shown, use it while the data is not ready yet
  slides: [
    /*
     * All four properties must have string values, enclose each string in `` (backticks, recommended) or '' (single quotes)
     * To add line breaks use `` (backticks) and enter line breaks where needed.
     * Title will not take space in the slide if empty ('' or ``), as requested by designer.
     */
    {
      title: 'Te damos la bienvenida a la app de UFD',
      description: 'Descubre todas las novedades que hemos incorporado para mejorar tu experiencia en los procesos.',
      imageFileName: '1.png',
      alt: 'Hola!',
    },
    {
      title: 'Accede con biometría',
      description: 'Puedes acceder con tu huella o reconocimiento facial.',
      imageFileName: '2.png',
      alt: 'first slide Welcome',
    },
    {
      title: 'Consultas y gestiones',
      description: 'Realiza todas tus consultas y gestiones de tus suministros y expedientes con el móvil.',
      imageFileName: '3.png',
      alt: 'second slide Welcome',
    },
    {
      title: 'Activa y recibe notificaciones',
      description: 'Puedes recibir notificaciones relacionadas con tus suministros y expedientes.',
      imageFileName: '4.png',
      alt: 'third slide Welcome',
    },
  ],
}
