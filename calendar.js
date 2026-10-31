// Calendar timestamps are explicit UTC offsets, independent of the guest's timezone.
// Kept separate so event dates and midnight crossings can be verified without a browser.
(function (root) {
  'use strict';
  function escapeICS(value) { return String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
  function utc(value) { return new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''); }
  function fold(line) {
    const encoder = new TextEncoder(); let part='', bytes=0, lines=[];
    for (const char of line) { const size=encoder.encode(char).length; if(bytes+size>75){lines.push(part);part=' ';bytes=1;}part+=char;bytes+=size; }
    lines.push(part);return lines.join('\r\n');
  }
  function buildCalendar(events, language='es', now=new Date()) {
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Cesar and Sarah//Wedding//'+language.toUpperCase(),'CALSCALE:GREGORIAN','METHOD:PUBLISH'];
    for(const event of events){
      lines.push('BEGIN:VEVENT','UID:cesar-sarah-'+event.id+'-'+event.start.slice(0,10).replace(/-/g,'')+'@invitation.local','DTSTAMP:'+utc(now));
      if(event.allDay){
        lines.push('DTSTART;VALUE=DATE:'+event.start.replace(/-/g,''));
        if(event.end)lines.push('DTEND;VALUE=DATE:'+event.end.replace(/-/g,''));
      }else{
        lines.push('DTSTART:'+utc(event.start));
        if(event.end) lines.push('DTEND:'+utc(event.end));
      }
      lines.push('SUMMARY:'+escapeICS(event.title[language]));
      if(event.location)lines.push('LOCATION:'+escapeICS(event.location));
      if(event.description)lines.push('DESCRIPTION:'+escapeICS(event.description[language]));
      if(event.url)lines.push('URL:'+escapeICS(event.url));
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
  }
  if(typeof module !== 'undefined' && module.exports)module.exports={buildCalendar};
  else root.buildWeddingCalendar=buildCalendar;
})(typeof window !== 'undefined' ? window : globalThis);
