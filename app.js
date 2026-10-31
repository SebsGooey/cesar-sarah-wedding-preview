(() => {
  'use strict';
  const config=window.INVITATION, copy=window.INVITATION_COPY;
  const $=(selector,root=document)=>root.querySelector(selector), $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  let language='es';
  try{const saved=localStorage.getItem(config.storageKey+':language');if(saved==='en'||saved==='es')language=saved;}catch{/* Language still works without storage. */}
  const t=key=>copy[key]?.[language==='en'?1:0]??key;
  const music=$('#music'),musicButton=$('#music-toggle'),welcome=$('#welcome-screen'),modal=$('#modal'),lightbox=$('#lightbox');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let toastTimer,previousFocus,photoOpener,photoIndex=0,entered=false;
  let slideIndex=0,activeLayer=0,slideTimer,slideRequest=0,userPaused=reducedMotion.matches,heroVisible=true,heroHovered=false,heroFocused=false;
  const hero=$('#hero-slideshow'),layers=$$('.hero-slide');
  music.src=config.music;music.volume=.4;
  function translate(root=document){
    $$('[data-i18n]',root).forEach(el=>el.textContent=t(el.dataset.i18n));
    $$('[data-i18n-html]',root).forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
    $$('[data-i18n-aria]',root).forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
    $$('[data-i18n-alt]',root).forEach(el=>el.alt=t(el.dataset.i18nAlt));
  }
  function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3600);}
  function readLocal(key){try{return JSON.parse(localStorage.getItem(config.storageKey+':'+key));}catch{return null;}}
  function saveLocal(key,value){try{localStorage.setItem(config.storageKey+':'+key,JSON.stringify(value));return true;}catch{toast(t('storageError'));return false;}}
  function updateCountdown(){const seconds=Math.floor(Math.max(0,new Date(config.startTime).getTime()-Date.now())/1000);const parts={days:Math.floor(seconds/86400),hours:Math.floor(seconds/3600)%24,minutes:Math.floor(seconds/60)%60,seconds:seconds%60};Object.entries(parts).forEach(([key,value])=>$('#'+key).textContent=String(value).padStart(2,'0'));$('#countdown-label').textContent=t(seconds?'countdownLabel':'bigDay');}
  function dateLabel(value){return new Intl.DateTimeFormat(language==='es'?'es-CO':'en-US',{timeZone:config.timezone,weekday:'long',month:'long',day:'numeric'}).format(new Date(value));}
  function timeLabel(value){return new Intl.DateTimeFormat(language==='es'?'es-CO':'en-US',{timeZone:config.timezone,hour:'numeric',minute:'2-digit',hour12:language==='en'}).format(new Date(value));}

  function photoPath(photo,small=false){return 'assets/photos/'+photo.file+(small?'-small':'')+'.jpg';}
  function photoSet(photo){return `${photoPath(photo,true)} ${photo.small}w, ${photoPath(photo)} ${photo.width}w`;}
  function renderGallery(){
    $('#photo-gallery').innerHTML=config.photos.map((photo,index)=>`<button class="gallery-item ${photo.landscape?'landscape':''}" data-photo="${index}"><img src="${photoPath(photo)}" srcset="${photoSet(photo)}" sizes="(max-width:700px) 75vw, 30vw" style="object-position:${photo.position}" alt="${escape(photo.alt[language])}" loading="lazy" decoding="async"><span><span class="gallery-caption">${String(index+1).padStart(2,'0')} / ${escape(photo.caption[language])}</span><b aria-hidden="true">↗</b></span></button>`).join('');
  }
  function updateGalleryLanguage(){
    $$('.gallery-item').forEach((el,index)=>{$('img',el).alt=config.photos[index].alt[language];$('.gallery-caption',el).textContent=String(index+1).padStart(2,'0')+' / '+config.photos[index].caption[language];});
    layers.forEach((layer,index)=>{if(index===activeLayer)$('img',layer).alt=config.photos[config.heroPhotos[slideIndex]].alt[language];});
    if(lightbox.open)displayPhoto(photoIndex);
  }
  function updateMusicState(){const playing=!music.paused;musicButton.classList.toggle('is-playing',playing);musicButton.setAttribute('aria-pressed',String(playing));musicButton.setAttribute('aria-label',t(playing?'pauseMusic':'playMusic'));$('#music-label').textContent=t(playing?'playing':'music');}
  async function playMusic(){try{await music.play();}catch{toast(t('musicError'));}updateMusicState();}
  function updateSlideButton(){const button=$('#slide-toggle');button.setAttribute('aria-pressed',String(userPaused));button.setAttribute('aria-label',t(userPaused?'playSlides':'pauseSlides'));button.firstElementChild.textContent=userPaused?'▷':'Ⅱ';}
  function setLanguage(next){
    language=next;document.documentElement.lang=language;document.title='Cesar & Sarah · '+t('title');
    translate();$$('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    try{localStorage.setItem(config.storageKey+':language',language);}catch{/* Optional preference. */}
    updateGalleryLanguage();updateCountdown();updateMusicState();updateSlideButton();
    $('.menu-toggle').setAttribute('aria-label',t($('#nav').classList.contains('open')?'closeMenu':'openMenu'));
  }
  $$('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));

  const menu=$('.menu-toggle');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('openMenu'));$('#nav').classList.remove('open');}
  menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',t(expanded?'closeMenu':'openMenu'));$('#nav').classList.toggle('open',expanded);});
  $$('#nav a, #nav button').forEach(el=>el.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  // Automatic changes pause offscreen, in background tabs, and while using controls.
  function scheduleSlide(){clearTimeout(slideTimer);if(entered&&!userPaused&&!document.hidden&&heroVisible&&!heroHovered&&!heroFocused&&!modal.open&&!lightbox.open)slideTimer=setTimeout(()=>changeSlide(slideIndex+1),config.slideshowInterval);}
  async function changeSlide(next,manual=false){
    clearTimeout(slideTimer);if(manual){userPaused=true;updateSlideButton();}
    const target=(next+config.heroPhotos.length)%config.heroPhotos.length;
    if(target===slideIndex){scheduleSlide();return;}
    const request=++slideRequest,photo=config.photos[config.heroPhotos[target]],nextLayer=1-activeLayer,img=$('img',layers[nextLayer]);
    img.srcset=photoSet(photo);img.sizes='(max-width:700px) 84vw, 40vw';img.src=photoPath(photo);img.alt=photo.alt[language];img.style.objectPosition=photo.position;
    try{await img.decode();}catch{if(request===slideRequest)scheduleSlide();return;}
    if(request!==slideRequest)return;
    layers[nextLayer].classList.add('is-active');layers[nextLayer].setAttribute('aria-hidden','false');layers[activeLayer].classList.remove('is-active');layers[activeLayer].setAttribute('aria-hidden','true');
    activeLayer=nextLayer;slideIndex=target;$('#slide-counter').textContent=String(target+1).padStart(2,'0')+' / '+String(config.heroPhotos.length).padStart(2,'0');
    if(manual)$('#slide-status').textContent=photo.alt[language];scheduleSlide();
  }
  $('#slide-prev').addEventListener('click',()=>changeSlide(slideIndex-1,true));$('#slide-next').addEventListener('click',()=>changeSlide(slideIndex+1,true));
  $('#slide-toggle').addEventListener('click',()=>{userPaused=!userPaused;updateSlideButton();scheduleSlide();});
  hero.tabIndex=0;
  hero.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();changeSlide(slideIndex+(e.key==='ArrowRight'?1:-1),true);}});
  hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){heroHovered=true;scheduleSlide();}});hero.addEventListener('pointerleave',()=>{heroHovered=false;scheduleSlide();});
  $('.hero-visual').addEventListener('focusin',()=>{heroFocused=true;scheduleSlide();});$('.hero-visual').addEventListener('focusout',e=>{if(!$('.hero-visual').contains(e.relatedTarget)){heroFocused=false;scheduleSlide();}});
  let touchStart;
  hero.addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
  hero.addEventListener('touchend',e=>{if(!touchStart)return;const x=e.changedTouches[0].clientX-touchStart.x,y=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(x)>50&&Math.abs(x)>Math.abs(y)*1.5)changeSlide(slideIndex+(x<0?1:-1),true);touchStart=null;},{passive:true});
  document.addEventListener('visibilitychange',scheduleSlide);
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)userPaused=true;updateSlideButton();scheduleSlide();});
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;scheduleSlide();},{threshold:.15}).observe(hero);}

  function enterInvitation(withMusic){
    if(entered)return;entered=true;
    // Start audio directly in the click gesture so iOS permits playback.
    if(withMusic)playMusic();else{music.pause();updateMusicState();}
    welcome.close();document.body.style.overflow='';$('#hero-title').tabIndex=-1;$('#hero-title').focus({preventScroll:true});scheduleSlide();
  }
  $('#enter-music').addEventListener('click',()=>enterInvitation(true));$('#enter-silent').addEventListener('click',()=>enterInvitation(false));
  welcome.addEventListener('cancel',e=>{e.preventDefault();enterInvitation(false);});
  musicButton.addEventListener('click',()=>{if(music.paused)playMusic();else music.pause();});music.addEventListener('play',updateMusicState);music.addEventListener('pause',updateMusicState);

  const intro=(eyebrow,title,text,iconName='heart')=>`<svg class="outline-icon" aria-hidden="true"><use href="#i-${iconName}"/></svg><p class="eyebrow">${t(eyebrow)}</p><h2 id="modal-title">${t(title)}</h2><p>${t(text)}</p>`;
  const demo=key=>`<p class="form-note">${t(key)}</p>`;
  const modalTemplates={
    rsvp:()=>`${intro('formEyebrow','formTitle','formIntro')}<form id="rsvp-form"><label for="guest-name">${t('nameLabel')}</label><input id="guest-name" name="name" autocomplete="name" placeholder="${escape(t('namePlaceholder'))}" maxlength="100" required><fieldset><legend>${t('attendance')}</legend><div class="radio-options"><label><input type="radio" name="attending" value="yes" required checked>${t('attendingYes')}</label><label><input type="radio" name="attending" value="no">${t('attendingNo')}</label></div></fieldset><div id="guest-details"><label for="guest-count">${t('partySize')}</label><input id="guest-count" name="guests" type="number" min="1" max="50" step="1" value="1" inputmode="numeric" required aria-describedby="party-note"><p class="field-help" id="party-note">${t('partyNote')}</p><label for="guest-names">${t('guestNames')}</label><input id="guest-names" name="guestNames" maxlength="500" autocomplete="off"></div><label for="guest-contact">${t('contactLabel')}</label><input id="guest-contact" name="contact" maxlength="150" autocomplete="email"><label for="guest-notes">${t('messageLabel')}</label><textarea id="guest-notes" name="notes" maxlength="1000" placeholder="${escape(t('messagePlaceholder'))}"></textarea><div class="form-honeypot" aria-hidden="true"><label for="guest-website">Website</label><input id="guest-website" name="website" tabindex="-1" autocomplete="off"></div><p class="form-note">${t('rsvpPrivacy')}</p><p id="rsvp-error" class="form-error" role="alert" hidden></p><button class="button button-primary" type="submit">${t('saveResponse')}${icon('arrow')}</button></form>`,
    song:()=>`${intro('songFormEyebrow','songFormTitle','songFormIntro','music')}<form id="song-form"><label for="song-title">${t('songName')}</label><input id="song-title" name="song" required maxlength="120" placeholder="${escape(t('songPlaceholder'))}"><label for="song-artist">${t('artist')}</label><input id="song-artist" name="artist" required maxlength="120" placeholder="${escape(t('artistPlaceholder'))}"><label for="song-from">${t('songFrom')}</label><input id="song-from" name="from" maxlength="100" placeholder="${escape(t('songFromPlaceholder'))}">${demo('songDemo')}<button class="button button-primary" type="submit">${t('saveSong')}${icon('arrow')}</button></form>`,
    dress:()=>intro('dressEyebrow','dressModalTitle','dressModalIntro','dress'),
    gifts:()=>`${intro('giftEyebrow','giftModalTitle','giftModalIntro','gift')}<p>${t('giftDescription')}</p>`,
    notes:()=>`${intro('notesEyebrow','notesTitle','notesIntro','calendar')}<ul class="note-list">${['notesDate','notesArrival','notesAddress','notesDress'].map(key=>`<li>${t(key)}</li>`).join('')}</ul>`
  };
  function showSuccess(titleKey,messageKey){$('#modal-content').innerHTML=`<div class="success"><svg class="outline-icon" aria-hidden="true"><use href="#i-heart"/></svg><p class="eyebrow">${t('successEyebrow')}</p><h2 id="modal-title">${t(titleKey)}</h2><p>${t(messageKey)}</p>${titleKey==='successSong'?demo('songDemo'):demo('rsvpUpdateNote')}<button class="button button-primary" id="success-close">${t('backInvitation')}</button></div>`;$('#success-close').addEventListener('click',()=>modal.close());$('#success-close').focus();}
  function openModal(type){
    if(!modalTemplates[type])return;previousFocus=document.activeElement;$('#modal-content').innerHTML=modalTemplates[type]();modal.showModal();document.body.style.overflow='hidden';scheduleSlide();
    if(type==='rsvp'){
      const form=$('#rsvp-form'),saved=readLocal('rsvp');
      if(saved){for(const key of ['name','guestNames','contact','notes'])form.elements[key].value=saved[key]||'';form.elements.attending.value=saved.attending==='no'?'no':'yes';form.elements.guests.value=String(saved.guests||1);}
      const attendanceChanged=()=>{const no=form.elements.attending.value==='no';$('#guest-details').hidden=no;$$('input',$('#guest-details')).forEach(el=>el.disabled=no);};
      $$('input[name="attending"]',form).forEach(el=>el.addEventListener('change',attendanceChanged));attendanceChanged();
      form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
      form.addEventListener('submit',async e=>{
        e.preventDefault();const data=new FormData(form),name=String(data.get('name')).trim();
        if(!name){form.elements.name.setCustomValidity(t('emptyName'));form.elements.name.reportValidity();return;}
        const button=$('button[type="submit"]',form),error=$('#rsvp-error');
        if(button.disabled)return;
        const attending=data.get('attending');
        const previous=readLocal('rsvp-receipt')||window.rsvpReceipt;
        const receipt=previous||{id:crypto.randomUUID(),editToken:crypto.randomUUID()};
        window.rsvpReceipt=receipt;
        try{localStorage.setItem(config.storageKey+':rsvp-receipt',JSON.stringify(receipt));}catch{/* In-memory retry remains available. */}
        const payload={...receipt,name,attending,guests:attending==='yes'?Number(data.get('guests')):0,guestNames:String(data.get('guestNames')||'').trim(),contact:String(data.get('contact')||'').trim(),notes:String(data.get('notes')||'').trim(),language,website:String(data.get('website')||'')};
        button.disabled=true;button.textContent=t('rsvpSending');error.hidden=true;form.setAttribute('aria-busy','true');
        const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
        try{
          const response=await fetch(config.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit'});
          const result=await response.json();
          if(!response.ok||!result.ok)throw new Error(result.error||'network');
          try{localStorage.setItem(config.storageKey+':rsvp',JSON.stringify({...payload,editToken:undefined,savedAt:result.savedAt}));}catch{/* A confirmed server save does not depend on local storage. */}
          if(modal.open&&form.isConnected)showSuccess(attending==='yes'?'successYes':'successNo',attending==='yes'?'successYesText':'successNoText');else toast(t('rsvpSaved'));
        }catch(err){error.textContent=t(err.message==='rate'?'rsvpRateError':'rsvpError');error.hidden=false;error.tabIndex=-1;error.focus();}
        finally{clearTimeout(timeout);button.disabled=false;button.innerHTML=t('saveResponse')+icon('arrow');form.removeAttribute('aria-busy');}
      });
    }
    if(type==='song')$('#song-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget),song=String(data.get('song')).trim(),artist=String(data.get('artist')).trim();if(!song||!artist){toast(t('emptySong'));return;}const previous=readLocal('songs'),songs=Array.isArray(previous)?previous:[];songs.push({song,artist,from:String(data.get('from')||'').trim(),savedAt:new Date().toISOString()});if(saveLocal('songs',songs))showSuccess('successSong','successSongText');});
  }
  $$('[data-open]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.open)));
  $('.modal-close',modal).addEventListener('click',()=>modal.close());modal.addEventListener('close',()=>{document.body.style.overflow='';previousFocus?.focus();scheduleSlide();});
  modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-calendar]');if(!button)return;
    const selection=button.dataset.calendar,events=config.events.filter(event=>selection==='all'||(selection==='wedding'?event.group==='wedding':event.id===selection));
    if(!events.length)return;
    const data=window.buildWeddingCalendar(events,language),url=URL.createObjectURL(new Blob([data],{type:'text/calendar;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='cesar-sarah-'+selection+'.ics';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast(t('calendarReady'));
  });
  $('#copy-hashtag').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(config.hashtag);toast(t('copied'));}catch{toast(t('hashtagFallback')+config.hashtag);}});
  function displayPhoto(index){photoIndex=(index+config.photos.length)%config.photos.length;const photo=config.photos[photoIndex];$('#lightbox-image').src=photoPath(photo);$('#lightbox-image').alt=photo.alt[language];$('#lightbox-caption').textContent=String(photoIndex+1).padStart(2,'0')+' / 07 — '+photo.caption[language];}
  $('#photo-gallery').addEventListener('click',e=>{const button=e.target.closest('[data-photo]');if(!button)return;photoOpener=button;displayPhoto(Number(button.dataset.photo));lightbox.showModal();document.body.style.overflow='hidden';scheduleSlide();});
  $('.modal-close',lightbox).addEventListener('click',()=>lightbox.close());$('.lightbox-prev').addEventListener('click',()=>displayPhoto(photoIndex-1));$('.lightbox-next').addEventListener('click',()=>displayPhoto(photoIndex+1));
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();displayPhoto(photoIndex+(e.key==='ArrowRight'?1:-1));}});
  lightbox.addEventListener('close',()=>{document.body.style.overflow='';photoOpener?.focus();scheduleSlide();});
  const gallery=$('#photo-gallery');
  function moveGallery(direction){gallery.scrollBy({left:direction*(gallery.firstElementChild.getBoundingClientRect().width+24),behavior:reducedMotion.matches?'instant':'smooth'});}
  $('#gallery-prev').addEventListener('click',()=>moveGallery(-1));$('#gallery-next').addEventListener('click',()=>moveGallery(1));
  gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1);}});
  function updateGalleryButtons(){$('#gallery-prev').disabled=gallery.scrollLeft<3;$('#gallery-next').disabled=gallery.scrollLeft+gallery.clientWidth>=gallery.scrollWidth-3;}
  gallery.addEventListener('scroll',updateGalleryButtons,{passive:true});window.addEventListener('resize',updateGalleryButtons);
  renderGallery();setLanguage(language);updateGalleryButtons();setInterval(updateCountdown,1000);
  // Native dialogs provide focus trapping and make background controls inert.
  welcome.showModal();document.body.style.overflow='hidden';
  if('IntersectionObserver' in window&&!reducedMotion.matches){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.06});$$('.reveal').forEach(el=>observer.observe(el));}
})();
