CESAR & SARAH — CARTAGENA WEDDING INVITATION

Responsive, buildless HTML/CSS/JavaScript. No packages or build step.

RUN LOCALLY
  python3 -m http.server 4173 --directory dist
  Open http://localhost:4173

PERSONALIZE
- dist/config.js: event data, Colombia timezone, photo list, slideshow interval, music.
- dist/i18n.js: complete Spanish and English copy. Each pair is [Spanish, English].
- dist/index.html: structure, fixed location cards, verified map/hotel links.
- dist/styles.css and dist/updates.css: original visual design and responsive updates.
- dist/app.js: welcome, language switching, music, slideshows, galleries and forms.
- dist/calendar.js: timezone-safe calendar downloads, including the overnight reception.

VERIFIED INFORMATION (October 30, 2026)
https://www.zola.com/wedding/sarahycesar
https://www.zola.com/wedding/sarahycesar/event
https://www.zola.com/wedding/sarahycesar/travel
https://www.zola.com/wedding/sarahycesar/faq
https://www.zola.com/wedding/sarahycesar/registry

The wedding is Friday, January 29, 2027 in Cartagena, Colombia.
All times are America/Bogota (UTC-5), not the visitor's computer timezone.
- January 28: welcome drinks, 21:00-23:30. Venue not announced.
- January 29: ceremony, 15:00-16:00, Catedral de Santa Catalina de Alejandria.
  Guests should arrive by 14:45. Afterward, a 10-minute walk with musicians and dancers.
- January 29: cocktails, 16:30, Institucion Universitaria Bellas Artes y Ciencias de Bolivar.
- January 29-30: reception at the same venue, 18:00-02:00.
- January 30: optional pool day, 12:00-17:00. The source also calls it a beach day;
  the location and final details remain unannounced.
- January 30: optional chiva and night out, 22:00. End time and location not announced.
No end time is invented for cocktails or the chiva in calendar files.

Photos: seven photographs of the couple plus the Cartagena travel photograph were
retrieved from their Zola site at the user's request. PHOTO-SOURCES.json records URLs.
Full photographs are preserved, with smaller versions for mobile. The seven originals
are available in the lightbox; five portraits rotate in the arched hero. The previous
AI-generated and stock placeholder photos are no longer included.

Music: original 36-second placeholder instrumental, Our Little Waltz.
No audio starts before the visitor chooses “with music” or presses the music button.
The welcome screen appears on each page load. Language preference is remembered;
music is never automatically resumed on a new load. ES/EN remains in the header.

SLIDESHOW
Crossfades every 6.5 seconds. Previous/next, pause/resume, keyboard arrows and horizontal
swipe are supported. Rotation pauses offscreen, in background tabs, in open dialogs,
and while hovered or keyboard-focused. Manual navigation pauses automatic rotation.
Reduced-motion preference disables autoplay initially and removes transitions.
The gallery scrolls natively on phones; all seven photos can open full-size.

FORMS AND REMAINING DEMO FEATURES
RSVP and song suggestions save only to this browser's localStorage. They are not sent
to the couple or synchronized. This is stated beside the forms and after saving.
Connect a backend before collecting real responses. No RSVP deadline is invented.
The hashtag #CesarYSarah is a retained design suggestion, not a verified Zola detail.
Gift, hotel-block and map links point to the actual destinations from Zola.

VALIDATION
JavaScript syntax, bilingual key coverage, photo assets, all six calendar events,
Colombia-to-UTC conversion, overnight reception, and UTF-8 ICS escaping/line folding.
Browser checks cover language selection, both music choices, slideshow controls,
forms, gallery and narrow-screen layouts.

HOSTING
Serve dist/ on any static host. The local .openai/hosting.json identifies this existing
private Sites project. Do not reuse its project_id for an unrelated Site.
