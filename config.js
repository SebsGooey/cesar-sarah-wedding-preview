// Verified against the couple's live Zola website on October 30, 2026.
// All event times use Cartagena, Colombia (America/Bogota, UTC−5).
window.INVITATION = {
  names: ['Cesar', 'Sarah'],
  fullNames: ['Cesar Fernandez', 'Sarah Williamson'],
  date: '2027-01-29T15:00:00-05:00',
  end: '2027-01-30T02:00:00-05:00',
  timezone: 'America/Bogota',
  source: 'https://www.zola.com/wedding/sarahycesar',
  hashtag: '#CesarYSarah', // Retained design suggestion; not listed on Zola.
  music: 'assets/our-little-waltz.mp3', // Original placeholder instrumental.
  storageKey: 'cesar-sarah-invitation-v2',
  slideshowInterval: 6500,
  // Portraits in the hero; every photograph is available in the gallery.
  heroPhotos: [0, 3, 5, 1, 4],
  photos: [
    {file:'photo-01',width:699,small:447,position:'50% 58%',alt:{es:'Cesar y Sarah en su graduación',en:'Cesar and Sarah celebrating their graduation'},caption:{es:'Un capítulo más, juntos',en:'Another chapter, together'}},
    {file:'photo-02',width:750,small:480,position:'50% 50%',alt:{es:'Cesar y Sarah sonriendo junto al agua de noche',en:'Cesar and Sarah smiling by the water at night'},caption:{es:'Las noches contigo',en:'Nights with you'}},
    {file:'photo-03',width:1000,small:640,position:'50% 50%',landscape:true,alt:{es:'Cesar y Sarah en un carrusel',en:'Cesar and Sarah on a carousel'},caption:{es:'Nuestra aventura favorita',en:'Our favorite adventure'}},
    {file:'photo-04',width:769,small:492,position:'50% 50%',alt:{es:'Sarah y Cesar juntos en un día soleado',en:'Sarah and Cesar together on a sunny day'},caption:{es:'Los días bonitos',en:'The beautiful days'}},
    {file:'photo-05',width:677,small:433,position:'50% 48%',alt:{es:'Cesar y Sarah en un partido de Florida State',en:'Cesar and Sarah at a Florida State game'},caption:{es:'Siempre en el mismo equipo',en:'Always on the same team'}},
    {file:'photo-06',width:750,small:480,position:'50% 50%',alt:{es:'Sarah y Cesar en un mirador al aire libre',en:'Sarah and Cesar at a scenic outdoor overlook'},caption:{es:'Explorando la vida',en:'Exploring life together'}},
    {file:'photo-07',width:1000,small:640,position:'50% 50%',landscape:true,alt:{es:'Cesar y Sarah celebrando su compromiso frente al mar',en:'Cesar and Sarah celebrating their engagement by the sea'},caption:{es:'El comienzo de nuestro siempre',en:'The beginning of our forever'}}
  ],
  events: [
    {id:'welcome',group:'extra',icon:'glass',start:'2027-01-28T21:00:00-05:00',end:'2027-01-28T23:30:00-05:00',title:{es:'Bebidas de bienvenida',en:'Welcome drinks'},description:{es:'Cena por tu cuenta y después acompáñanos para brindar. Lugar por confirmar.',en:'Enjoy dinner on your own, then join us for a toast. Location to be announced.'}},
    {id:'ceremony',group:'wedding',start:'2027-01-29T15:00:00-05:00',end:'2027-01-29T16:00:00-05:00',title:{es:'Ceremonia de Cesar y Sarah',en:'Cesar & Sarah’s wedding ceremony'},location:'Catedral de Santa Catalina de Alejandría, Carrera 4, El Centro, Cartagena, Bolívar 130001, Colombia',description:{es:'Llega a las 14:45 y toma asiento antes de las 15:00. Al finalizar, caminaremos 10 minutos hacia la recepción con músicos y bailarines.',en:'Arrive by 2:45 p.m. and be seated by 3:00 p.m. Afterwards, join a 10-minute walk to the reception with musicians and dancers.'}},
    {id:'cocktails',group:'wedding',start:'2027-01-29T16:30:00-05:00',title:{es:'Hora del cóctel',en:'Cocktail hour'},location:'Institución Universitaria Bellas Artes y Ciencias de Bolívar, 39-12 Carrera 9, Cartagena de Indias, Bolívar 130001, Colombia'},
    {id:'reception',group:'wedding',start:'2027-01-29T18:00:00-05:00',end:'2027-01-30T02:00:00-05:00',title:{es:'Recepción de Cesar y Sarah',en:'Cesar & Sarah’s wedding reception'},location:'Institución Universitaria Bellas Artes y Ciencias de Bolívar, 39-12 Carrera 9, Cartagena de Indias, Bolívar 130001, Colombia',description:{es:'Recepción al aire libre. Vestimenta de cóctel colorido.',en:'Outdoor reception. Colorful cocktail attire.'}},
    {id:'pool',group:'extra',icon:'spark',start:'2027-01-30T12:00:00-05:00',end:'2027-01-30T17:00:00-05:00',title:{es:'Día de piscina',en:'Pool day'},description:{es:'Un día opcional de piscina o playa después de la boda. Lugar y detalles por confirmar.',en:'An optional pool or beach day after the wedding. Location and details are still to come.'}},
    {id:'chiva',group:'extra',icon:'music',start:'2027-01-30T22:00:00-05:00',title:{es:'Chiva + noche por Cartagena',en:'Chiva + night out'},description:{es:'Recorrido opcional en chiva y salida por los bares del centro. Próximamente, más detalles.',en:'An optional party bus followed by a night exploring downtown Cartagena’s bars. More details to come.'}}
  ]
};
