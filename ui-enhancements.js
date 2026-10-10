/* Conversation-first training, photo catalog, and local chat history. */
(function () {
  const PHOTO_SPECIES = {
    cat:{query:'Felis catus domestic cat',match:['felis catus','domestic cat','house cat'],wiki:'Cat'},
    dog:{query:'Canis familiaris domestic dog',match:['canis familiaris','canis lupus familiaris','domestic dog'],wiki:'Dog'},
    hamster:{query:'Mesocricetus auratus golden hamster',match:['mesocricetus auratus','golden hamster','syrian hamster'],wiki:'Golden hamster'},
    rabbit:{query:'Oryctolagus cuniculus rabbit',match:['oryctolagus cuniculus','domestic rabbit'],wiki:'Domestic rabbit'},
    betta:{query:'Betta splendens Siamese fighting fish',match:['betta splendens','siamese fighting fish'],wiki:'Siamese fighting fish'},
    goldfish:{query:'Carassius auratus goldfish',match:['carassius auratus','goldfish'],wiki:'Goldfish'},
    guppy:{query:'Poecilia reticulata guppy',match:['poecilia reticulata','guppy'],wiki:'Guppy'},
    tetra:{query:'Paracheirodon innesi neon tetra',match:['paracheirodon innesi','neon tetra'],wiki:'Neon tetra'},
    molly:{query:'Poecilia sphenops molly fish',match:['poecilia sphenops','molly fish'],wiki:'Molly (fish)'},
    corydoras:{query:'Corydoras catfish',match:['corydoras'],wiki:'Corydoras'},
    canary:{query:'Serinus canaria canary',match:['serinus canaria','canary'],wiki:'Domestic canary'},
    lovebird:{query:'Agapornis lovebird',match:['agapornis','lovebird'],wiki:'Lovebird'},
    budgie:{query:'Melopsittacus undulatus budgerigar',match:['melopsittacus undulatus','budgerigar','budgie'],wiki:'Budgerigar'},
    finch:{query:'Estrildidae finch',match:['estrildidae','finch'],wiki:'Estrildidae'},
    turtle:{query:'turtle Testudines',match:['testudines','turtle','tortoise'],wiki:'Turtle'},
    gecko:{query:'Eublepharis macularius leopard gecko',match:['eublepharis macularius','leopard gecko'],wiki:'Common leopard gecko'},
    iguana:{query:'Iguana iguana green iguana',match:['iguana iguana','green iguana'],wiki:'Green iguana'},
    cornsnake:{query:'Pantherophis guttatus corn snake',match:['pantherophis guttatus','corn snake'],wiki:'Corn snake'},
    guineapig:{query:'Cavia porcellus guinea pig',match:['cavia porcellus','guinea pig'],wiki:'Guinea pig'},
    chinchilla:{query:'Chinchilla lanigera chinchilla',match:['chinchilla lanigera','chinchilla'],wiki:'Chinchilla'},
    sugarglider:{query:'Petaurus breviceps sugar glider',match:['petaurus breviceps','sugar glider'],wiki:'Sugar glider'},
    ferret:{query:'Mustela putorius furo ferret',match:['mustela putorius furo','ferret'],wiki:'Ferret'},
    rat:{query:'Rattus norvegicus domestic rat',match:['rattus norvegicus','domestic rat','fancy rat'],wiki:'Brown rat'},
    mouse:{query:'Mus musculus house mouse',match:['mus musculus','house mouse'],wiki:'House mouse'},
    hedgehog:{query:'Atelerix albiventris African pygmy hedgehog',match:['atelerix albiventris','african pygmy hedgehog'],wiki:'Four-toed hedgehog'},
    pigeon:{query:'Columba livia domestic pigeon',match:['columba livia','domestic pigeon','rock pigeon'],wiki:'Rock dove'},
    chicken:{query:'Gallus gallus domestic chicken',match:['gallus gallus','domestic chicken'],wiki:'Chicken'},
    axolotl:{query:'Ambystoma mexicanum axolotl',match:['ambystoma mexicanum','axolotl'],wiki:'Axolotl'},
    cockatiel:{query:'Nymphicus hollandicus cockatiel',match:['nymphicus hollandicus','cockatiel'],wiki:'Cockatiel'},
    africangrey:{query:'Psittacus erithacus African grey parrot',match:['psittacus erithacus','african grey parrot'],wiki:'Grey parrot'},
    macaw:{query:'Ara macaw parrot',match:['macaw','ara macaw'],wiki:'Macaw'},
    beardeddragon:{query:'Pogona vitticeps bearded dragon',match:['pogona vitticeps','bearded dragon'],wiki:'Central bearded dragon'},
    ballpython:{query:'Python regius ball python',match:['python regius','ball python','royal python'],wiki:'Ball python'},
    crestedgecko:{query:'Correlophus ciliatus crested gecko',match:['correlophus ciliatus','crested gecko'],wiki:'Crested gecko'},
    redslider:{query:'Trachemys scripta elegans red eared slider',match:['trachemys scripta elegans','red-eared slider','red eared slider'],wiki:'Red-eared slider'},
    bluetongueskink:{query:'Tiliqua scincoides blue tongued skink',match:['tiliqua scincoides','blue-tongued skink','blue tongue skink'],wiki:'Blue-tongued skink'},
    angelfish:{query:'Pterophyllum scalare freshwater angelfish',match:['pterophyllum scalare','freshwater angelfish'],wiki:'Freshwater angelfish'},
    koi:{query:'Cyprinus rubrofuscus koi fish',match:['cyprinus rubrofuscus','koi carp'],wiki:'Koi'},
    platy:{query:'Xiphophorus maculatus platy fish',match:['xiphophorus maculatus','platy fish'],wiki:'Southern platyfish'},
    zebradanio:{query:'Danio rerio zebra danio',match:['danio rerio','zebra danio'],wiki:'Zebrafish'},
    discus:{query:'Symphysodon discus fish',match:['symphysodon','discus fish'],wiki:'Discus (fish)'},
    cherryshrimp:{query:'Neocaridina davidi cherry shrimp',match:['neocaridina davidi','cherry shrimp'],wiki:'Neocaridina davidi'},
    neritesnail:{query:'Neritina natalensis nerite snail',match:['neritina','nerite snail'],wiki:'Neritina natalensis'},
    whitetreefrog:{query:'Litoria caerulea white tree frog',match:['litoria caerulea','white tree frog'],wiki:'Australian green tree frog'},
    pacmanfrog:{query:'Ceratophrys pacman horned frog',match:['ceratophrys','pacman frog'],wiki:'Ceratophrys'},
    gerbil:{query:'Meriones unguiculatus Mongolian gerbil',match:['meriones unguiculatus','mongolian gerbil'],wiki:'Mongolian gerbil'},
    degu:{query:'Octodon degus common degu',match:['octodon degus','common degu'],wiki:'Common degu'},
    potbelliedpig:{query:'Sus scrofa domesticus pot bellied pig',match:['pot-bellied pig','pot bellied pig','sus scrofa domesticus'],wiki:'Pot-bellied pig'},
    horse:{query:'Equus ferus caballus domestic horse',match:['equus ferus caballus','domestic horse'],wiki:'Horse'},
    goat:{query:'Capra hircus domestic goat',match:['capra hircus','domestic goat'],wiki:'Domestic goat'},
    sheep:{query:'Ovis aries domestic sheep',match:['ovis aries','domestic sheep'],wiki:'Domestic sheep'},
    duck:{query:'Anas platyrhynchos domestic duck',match:['anas platyrhynchos domesticus','domestic duck'],wiki:'Domestic duck'},
    parrotlet:{query:'Forpus parrotlet bird',match:['forpus','parrotlet'],wiki:'Parrotlet'},
    sunconure:{query:'Aratinga solstitialis sun conure',match:['aratinga solstitialis','sun conure'],wiki:'Sun conure'},
    cockatoo:{query:'Cacatuidae cockatoo',match:['cacatuidae','cockatoo'],wiki:'Cockatoo'},
    quail:{query:'Coturnix japonica Japanese quail',match:['coturnix japonica','japanese quail'],wiki:'Japanese quail'},
    turkey:{query:'Meleagris gallopavo domestic turkey',match:['meleagris gallopavo','domestic turkey'],wiki:'Turkey (bird)'},
    russiantortoise:{query:'Testudo horsfieldii Russian tortoise',match:['testudo horsfieldii','russian tortoise'],wiki:'Russian tortoise'},
    kingsnake:{query:'Lampropeltis kingsnake',match:['lampropeltis','kingsnake'],wiki:'Kingsnake'},
    gargoylegecko:{query:'Rhacodactylus auriculatus gargoyle gecko',match:['rhacodactylus auriculatus','gargoyle gecko'],wiki:'Gargoyle gecko'},
    dwarfgourami:{query:'Trichogaster lalius dwarf gourami',match:['trichogaster lalius','dwarf gourami'],wiki:'Dwarf gourami'},
    swordtail:{query:'Xiphophorus hellerii swordtail fish',match:['xiphophorus hellerii','swordtail fish'],wiki:'Swordtail'},
    harlequinrasbora:{query:'Trigonostigma heteromorpha harlequin rasbora',match:['trigonostigma heteromorpha','harlequin rasbora'],wiki:'Harlequin rasbora'},
    bristlenosepleco:{query:'Ancistrus bristlenose pleco fish',match:['ancistrus','bristlenose pleco'],wiki:'Ancistrus'},
    kuhliloach:{query:'Pangio kuhlii kuhli loach fish',match:['pangio kuhlii','kuhli loach'],wiki:'Kuhli loach'},
    clownfish:{query:'Amphiprion clownfish',match:['amphiprion','clownfish'],wiki:'Amphiprioninae'},
    africandwarffrog:{query:'Hymenochirus African dwarf frog',match:['hymenochirus','african dwarf frog'],wiki:'African dwarf frog'},
    tarantula:{query:'Theraphosidae tarantula spider',match:['theraphosidae','tarantula'],wiki:'Tarantula'},
    stickinsect:{query:'Phasmatodea stick insect',match:['phasmatodea','stick insect'],wiki:'Phasmatodea'},
    hermitcrab:{query:'Coenobita hermit crab',match:['coenobita','land hermit crab'],wiki:'Coenobita'},
    alpaca:{query:'Vicugna pacos alpaca',match:['vicugna pacos','alpaca'],wiki:'Alpaca'},
    llama:{query:'Lama glama llama',match:['lama glama','llama'],wiki:'Llama'},
    zebrafinch:{query:'Taeniopygia guttata zebra finch',match:['taeniopygia guttata','zebra finch'],wiki:'Zebra finch'},
    eclectus:{query:'Eclectus roratus eclectus parrot',match:['eclectus roratus','eclectus parrot'],wiki:'Eclectus parrot'},
    greencheekconure:{query:'Pyrrhura molinae green cheek conure',match:['pyrrhura molinae','green cheek conure'],wiki:'Green-cheeked parakeet'},
    amazonparrot:{query:'Amazona parrot',match:['amazona','amazon parrot'],wiki:'Amazon parrot'},
    cow:{query:'Bos taurus cow',match:['bos taurus','domestic cattle','cow'],wiki:'Cattle'},
    donkey:{query:'Equus africanus asinus donkey',match:['equus africanus asinus','domestic donkey'],wiki:'Donkey'},
    cardinaltetra:{query:'Paracheirodon axelrodi cardinal tetra',match:['paracheirodon axelrodi','cardinal tetra'],wiki:'Cardinal tetra'},
    tigerbarb:{query:'Puntigrus tetrazona tiger barb',match:['puntigrus tetrazona','tiger barb'],wiki:'Tiger barb'},
    pearlgourami:{query:'Trichopodus leerii pearl gourami',match:['trichopodus leerii','pearl gourami'],wiki:'Pearl gourami'},
    siamesealgaeeater:{query:'Crossocheilus oblongus siamese algae eater',match:['crossocheilus oblongus','siamese algae eater'],wiki:'Siamese algae eater'},
    bluetang:{query:'Paracanthurus hepatus blue tang',match:['paracanthurus hepatus','blue tang'],wiki:'Paracanthurus hepatus'},
    royalgramma:{query:'Gramma loreto royal gramma',match:['gramma loreto','royal gramma'],wiki:'Royal gramma'},
    veiledchameleon:{query:'Chamaeleo calyptratus veiled chameleon',match:['chamaeleo calyptratus','veiled chameleon'],wiki:'Veiled chameleon'},
    redfoottortoise:{query:'Chelonoidis carbonarius red footed tortoise',match:['chelonoidis carbonarius','red-footed tortoise','red footed tortoise'],wiki:'Red-footed tortoise'},
    uromastyx:{query:'Uromastyx lizard',match:['uromastyx'],wiki:'Uromastyx'},
    firebelliedtoad:{query:'Bombina fire-bellied toad',match:['bombina','fire-bellied toad','fire bellied toad'],wiki:'Bombina'},
    africanclawedfrog:{query:'Xenopus laevis African clawed frog',match:['xenopus laevis','african clawed frog'],wiki:'African clawed frog'},
    tomatofrog:{query:'Dyscophus antongilii tomato frog',match:['dyscophus','tomato frog'],wiki:'Tomato frog'},
    jumpingspider:{query:'Salticidae jumping spider',match:['salticidae','jumping spider'],wiki:'Jumping spider'},
    millipede:{query:'Diplopoda millipede',match:['diplopoda','millipede'],wiki:'Millipede'},
    zebrafish:{query:'Danio rerio zebrafish',match:['danio rerio','zebrafish'],wiki:'Zebrafish'}
  };
  const detectIntentBase = detectIntent;
  detectIntent = function (text) {
    const normalized = tokenize(text);
    if (/\b(karnivora|herbivora|omnivora|ovipar|ovovivipar|vivipar|mamalia|bertelur|melahirkan|berkembang biak|reproduksi|kelompok biologis)\b/.test(normalized)) return 'taxonomy';
    return detectIntentBase(text);
  };
  window.HEWAN_ANIMAL_GUIDES = window.HEWAN_ANIMAL_GUIDES || {};
  const transparentPixel='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  function photoSources(a) { return PHOTO_SPECIES[a.id] || {query:a.scientific+' '+a.name,match:[a.scientific.toLowerCase(),a.name.toLowerCase()],wiki:a.scientific}; }
  function chooseCommonsResult(pages, species) {
    const excluded=/\b(illustration|drawing|diagram|map|logo|icon|painting|print|sculpture|model|skeleton|fossil)\b/i;
    const candidates=Object.values(pages||{}).filter(p=>p.imageinfo?.[0]?.thumburl&&/\.(jpe?g|png|webp)$/i.test(p.title)&&!excluded.test(p.title));
    const aliases=species.match.map(x=>x.toLowerCase());
    const relevant=candidates.map(p=>({page:p,score:aliases.reduce((n,alias)=>n+(p.title.toLowerCase().replace(/^file:/,'').includes(alias)?(alias.includes(' ')?4:1):0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return relevant[0]?.page||null;
  }
  async function loadWikiPhoto(image,species,credit) {
    if(image.dataset.photoFallbackTried==='1') { image.classList.remove('photo-pending'); image.classList.add('photo-failed'); if(credit){credit.removeAttribute('href');credit.textContent='Foto cocok belum tersedia';} return; }
    image.dataset.photoFallbackTried='1';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
    try {
      const response=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(species.wiki),{signal:controller.signal});
      if(!response.ok) throw new Error('Wikipedia image not found');
      const article=await response.json(),thumbnail=article.thumbnail?.source;
      if(!thumbnail) throw new Error('No article thumbnail');
      image.src=thumbnail; image.dataset.photoLoaded='1'; image.classList.remove('photo-pending');
      if(credit){credit.href=article.content_urls?.desktop?.page||'https://en.wikipedia.org/';credit.textContent='Foto Wikipedia · artikel spesies';}
      sessionStorage.setItem('hewanPhoto:'+species.wiki,JSON.stringify({src:thumbnail,href:article.content_urls?.desktop?.page||'https://en.wikipedia.org/',label:'Foto Wikipedia · artikel spesies',expires:Date.now()+604800000}));
    } catch (_) { image.classList.remove('photo-pending'); image.classList.add('photo-failed'); if(credit){credit.removeAttribute('href');credit.textContent='Foto cocok belum tersedia';} }
    finally { clearTimeout(timer); }
  }
  window.loadAnimalPhoto = async function(image) {
    let species; try { species=JSON.parse(image.dataset.photoSources||'{}'); } catch (_) { species=null; }
    if(!species) { image.classList.add('photo-failed'); return; }
    const credit=image.parentElement.querySelector('.photo-source');
    image.onerror=()=>loadWikiPhoto(image,species,credit);
    try { const cached=JSON.parse(sessionStorage.getItem('hewanPhoto:'+species.wiki)||'null'); if(cached?.expires>Date.now()&&cached.src){image.src=cached.src;image.classList.remove('photo-pending');if(credit){credit.href=cached.href;credit.textContent=cached.label;}return;} } catch (_) {}
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),7000);
    try {
      const api=new URL('https://commons.wikimedia.org/w/api.php');
      const params={action:'query',generator:'search',gsrsearch:'filetype:bitmap '+species.query,gsrnamespace:'6',gsrlimit:'16',prop:'imageinfo',iiprop:'url',iiurlwidth:'760',format:'json',origin:'*'};
      Object.entries(params).forEach(([key,value])=>api.searchParams.set(key,value));
      const response=await fetch(api,{signal:controller.signal}); if(!response.ok) throw new Error('Commons unavailable');
      const data=await response.json(), found=chooseCommonsResult(data.query?.pages,species);
      if(found) { const src=found.imageinfo[0].thumburl,href=found.imageinfo[0].descriptionurl||'https://commons.wikimedia.org/',label='Foto Wikimedia Commons · lisensi';image.src=src; image.dataset.photoLoaded='1'; image.classList.remove('photo-pending'); if(credit){credit.href=href;credit.textContent=label;} sessionStorage.setItem('hewanPhoto:'+species.wiki,JSON.stringify({src,href,label,expires:Date.now()+604800000})); return; }
    } catch (_) { /* Try the species article below. */ }
    finally { clearTimeout(timer); }
    await loadWikiPhoto(image,species,credit);
  };

  renderAnimals = function () {
    const q = tokenize(document.getElementById('animal-search').value), cat = document.getElementById('animal-category').value;
    const diet = document.getElementById('animal-diet').value, reproduction = document.getElementById('animal-reproduction').value;
    const filtered = animals.filter(a => (cat === 'all' || (a.biologicalClass || a.category).toLowerCase() === cat) && (diet === 'all' || a.dietGroup === diet) && (reproduction === 'all' || a.reproductionGroup === reproduction) && (!q || tokenize([a.name, a.scientific, a.description, a.dietGroup, a.biologicalClass, a.reproductionGroup, ...a.keywords].join(' ')).includes(q)));
    document.getElementById('animal-count').textContent = filtered.length + ' hewan';
    document.getElementById('animal-grid').innerHTML = filtered.length ? filtered.map(a => { const photos = photoSources(a); return '<article class="animal-card" data-detail="' + a.id + '"><div class="animal-card-art"><img class="photo-pending" src="' + transparentPixel + '" data-photo-sources="' + escapeHtml(JSON.stringify(photos)) + '" alt="Foto ' + escapeHtml(a.name) + '" loading="lazy"><span class="photo-fallback">' + a.emoji + '</span><small>' + escapeHtml(a.biologicalClass || a.category) + '</small><a class="photo-source" href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Mencari foto spesies…</a></div><div class="animal-card-body"><h3>' + escapeHtml(a.name) + '</h3><span class="scientific">' + escapeHtml(a.scientific) + '</span><p>' + escapeHtml(a.description.slice(0, 95)) + '…</p><div class="animal-tags"><span>' + escapeHtml(a.dietGroup || 'Diet belum dicatat') + '</span><span>' + escapeHtml(a.reproductionGroup || 'Reproduksi belum dicatat') + '</span></div><div class="card-foot"><span>Perkiraan umur</span><b>' + escapeHtml(a.lifespan) + '</b></div></div></article>'; }).join('') : '<div class="empty-state">Tidak ada hewan yang cocok dengan filter. Coba pilihan lain.</div>';
    document.querySelectorAll('#animal-grid img[data-photo-sources]').forEach(window.loadAnimalPhoto);
  };
  ['animal-search','animal-category','animal-diet','animal-reproduction'].forEach(id => {
    const control = document.getElementById(id);
    control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', renderAnimals);
  });
  const openAnimalBase = openAnimal;
  openAnimal = function (id) {
    openAnimalBase(id);
    const animal = animals.find(item => item.id === id), body = document.getElementById('modal-body');
    if (!animal || !animal.dietGroup || !animal.reproductionGroup || !animal.biologicalClass) return;
    const section = document.createElement('section');
    section.className = 'modal-section';
    const sources = (window.HEWAN_CLASSIFICATION_SOURCES || []).filter(url => /^https:\/\//.test(url));
    section.innerHTML = '<h4>KLASIFIKASI</h4><p>Kelompok biologis: <b>' + escapeHtml(animal.biologicalClass) + '</b><br>Jenis makanan: <b>' + escapeHtml(animal.dietGroup) + '</b><br>Cara berkembang biak: <b>' + escapeHtml(animal.reproductionGroup) + '</b></p><p class="classification-note">Kategori diet, kelompok biologis, dan cara reproduksi menjelaskan hal yang berbeda. Diet adalah ringkasan umum dan kebutuhan spesies dapat berbeda; istilah reproduksi juga bervariasi antar sumber.</p>' + (sources.length ? '<small>Rujukan klasifikasi dan reproduksi: ' + sources.map(url => '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(new URL(url).hostname) + '</a>').join(' · ') + '</small>' : '');
    body.querySelector('.modal-hero').after(section);
  };

  function readStoredArray(key) { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } }
  function readStoredNumber(key) { try { const value = Number(localStorage.getItem(key) || 0); return Number.isFinite(value) ? value : 0; } catch (_) { return 0; } }
  state.chats = readStoredArray('hewanChats');
  state.activeChatId = null;
  state.pendingTraining = null;
  const store = {
    sources: readStoredArray('hewanSources'),
    documents: readStoredArray('hewanDocuments'),
    proposals: readStoredArray('hewanProposals'),
    history: readStoredArray('hewanKnowledgeHistory'),
    failures: readStoredNumber('hewanCollectorFailures')
  };
  const saveChats = () => localStorage.setItem('hewanChats', JSON.stringify(state.chats));
  let localSaveTimer = null;
  let applyingLocalRecords = false;
  function collectLocalRecords() {
    const out = [];
    const add = (type, items, keyField = 'id') => items.forEach(item => out.push({ type, key: String(item[keyField]), payload: item, updatedAt: item.updatedAt || item.createdAt || item.collectedAt || item.at || new Date().toISOString() }));
    add('chat', state.chats); add('training', state.training);
    add('source', store.sources); add('document', store.documents); add('proposal', store.proposals); add('knowledge_history', store.history);
    add('tombstone', readStoredArray('hewanLocalDeletes'));
    return out;
  }
  function applyLocalRecords(records) {
    const tombstones = records.filter(x => x.type === 'tombstone');
    const byType = type => records.filter(x => x.type === type && !tombstones.some(t => t.payload.targetType === type && t.payload.targetKey === x.key && Date.parse(t.updatedAt||0) >= Date.parse(x.updatedAt||0))).map(x => x.payload);
    applyingLocalRecords = true;
    state.chats = byType('chat').sort((a,b) => Date.parse(b.updatedAt||0)-Date.parse(a.updatedAt||0)).slice(0,40);
    state.training = byType('training'); store.sources = byType('source'); store.documents = byType('document');
    store.proposals = byType('proposal'); store.history = byType('knowledge_history').sort((a,b) => Date.parse(b.at||0)-Date.parse(a.at||0)).slice(0,300);
    localStorage.setItem('hewanChats', JSON.stringify(state.chats)); localStorage.setItem('hewanTraining', JSON.stringify(state.training));
    localStorage.setItem('hewanLocalDeletes', JSON.stringify(tombstones.map(x=>x.payload)));
    saveStore(); renderHistory(); renderTraining(); renderCollector();
    applyingLocalRecords = false;
  }
  function scheduleLocalSave() {
    if (applyingLocalRecords) return;
    clearTimeout(localSaveTimer); localSaveTimer = setTimeout(async () => {
      try { await HewanRepository.saveRecords(collectLocalRecords()); }
      catch (error) { console.warn('Penyimpanan database lokal tertunda.', error); }
    }, 250);
  }
  function markDeleted(type, key) {
    const deletes = readStoredArray('hewanLocalDeletes');
    deletes.unshift({ id: type + ':' + key + ':' + Date.now(), targetType: type, targetKey: String(key), at: new Date().toISOString() });
    localStorage.setItem('hewanLocalDeletes', JSON.stringify(deletes.slice(0,300))); scheduleLocalSave();
  }
  async function restoreLocalData() {
    try {
      const saved=await HewanRepository.loadRecords(),merged=new Map(saved.map(item=>[`${item.type}:${item.key}`,item]));
      for(const item of collectLocalRecords()){const key=`${item.type}:${item.key}`,old=merged.get(key);if(!old||(Date.parse(item.updatedAt||'')||0)>=(Date.parse(old.updatedAt||'')||0))merged.set(key,item);}
      applyLocalRecords([...merged.values()]); scheduleLocalSave();
    } catch(error) { console.warn('Data lokal dipakai dari cache browser.',error); }
  }
  function saveChat() {
    if (!state.activeChatId || !state.messages.some(m => m.who === 'user')) return;
    const first = state.messages.find(m => m.who === 'user').text;
    const chat = { id: state.activeChatId, title: first.replace(/\s+/g, ' ').slice(0, 42), updatedAt: new Date().toISOString(), messages: state.messages, recommendations: state.lastRecommendations, preferences: state.preferences };
    state.chats = [chat, ...state.chats.filter(c => c.id !== chat.id)].slice(0, 40);
    saveChats(); renderHistory(); scheduleLocalSave();
  }
  function renderHistory() {
    const root = document.getElementById('history-list');
    if (!root) return;
    root.innerHTML = state.chats.length ? state.chats.map(c => '<div class="history-item"><button class="history-open" type="button" data-open-chat="' + escapeHtml(c.id) + '"><b>' + escapeHtml(c.title || 'Obrolan') + '</b><small>' + new Date(c.updatedAt).toLocaleString('id-ID') + '</small></button><button class="history-delete" type="button" data-delete-chat="' + escapeHtml(c.id) + '" aria-label="Hapus obrolan">×</button></div>').join('') : '<p class="history-empty">Belum ada obrolan tersimpan.</p>';
  }
  pushMessage = function (text, who) {
    if (who === 'user' && !state.activeChatId) state.activeChatId = String(Date.now());
    state.messages.push({ text, who, at: new Date().toISOString() });
    renderMessages();
  };
  function renderBotContent(message) {
    const html = message.html || escapeHtml(message.text).replace(/\n/g, '<br>');
    return html.replace(/Sumber yang dicatat: (https:\/\/[^\s<]+)/gi, (_, rawUrl) => {
      try { const source = new URL(rawUrl.replace(/&amp;/g, '&')); if (source.protocol !== 'https:') return 'Sumber: ' + escapeHtml(rawUrl); return 'Sumber: <a href="' + escapeHtml(source.href) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.hostname) + '</a>'; }
      catch (_) { return 'Sumber: ' + escapeHtml(rawUrl); }
    });
  }
  renderMessages = function () {
    const box = document.getElementById('messages');
    box.innerHTML = state.messages.map(m => m.who === 'user'
      ? '<div class="message-row user-row"><div class="bubble user-bubble">' + escapeHtml(m.text).replace(/\n/g, '<br>') + '<div class="bubble-time">Kamu · ' + (m.at ? new Date(m.at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'sekarang') + '</div></div></div>'
      : '<div class="message-row bot-row"><div class="mini-avatar">h</div><div class="bubble bot-bubble">' + renderBotContent(m) + '<div class="bubble-time">HEWAN.AI · ' + (m.at ? new Date(m.at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'sekarang') + '</div></div></div>').join('') + (state.messages.length === 1 ? '<div class="suggestions"><button class="suggestion">Aku tinggal di kos, cari yang gampang dirawat</button><button class="suggestion">Berikan fakta menarik tentang axolotl</button><button class="suggestion">Bandingkan makanan kelinci dan guinea pig</button></div>' : '') + (state.lastRecommendations.length ? recommendationCard() : '');
    box.scrollTop = box.scrollHeight;
    try { saveChat(); } catch (error) { console.warn('Riwayat chat tidak dapat disimpan, tetapi percakapan tetap berjalan.', error); }
  };
  function startNewChat() {
    state.activeChatId = null; state.preferences = {}; state.sessionParameters = {}; state.lastRecommendations = []; state.contextAnimal = null; state.lastAnimal = null;
    state.messages = [{ who: 'bot', text: 'Halo! Senang kamu mampir. Ceritakan, kamu ingin tahu apa tentang hewan?', at: new Date().toISOString() }];
    document.getElementById('history-panel').hidden = true; document.getElementById('training-drawer').open = false; renderMessages();
  }
  function draftFrom(raw) {
    const pair = raw.match(/^Pertanyaan:\s*([\s\S]*?)\s*Jawaban:\s*([\s\S]+)$/i);
    const question = pair ? pair[1].trim() : '';
    const answer = pair ? pair[2].trim() : raw.replace(/^ajarkan(?:\s+ai)?[:,]?\s*/i, '').trim();
    const basis = question + ' ' + answer, animal = findAnimals(basis)[0] || null;
    // Classify from the question first so words in a long answer cannot mislabel the lesson.
    const found = detectIntent(question || raw);
    const inferred = /makan|pakan|diet|hay|pelet|sayur/i.test(basis) ? 'diet' : /habitat|kandang|akuarium|suhu|lingkungan/i.test(basis) ? 'habitat' : /rawat|perawatan|bersih|grooming/i.test(basis) ? 'care' : /perilaku|kebiasaan|karakter/i.test(basis) ? 'behavior' : 'information';
    const type = ['diet', 'habitat', 'care', 'behavior', 'welfare', 'fact', 'taxonomy'].includes(found) ? found : inferred;
    const labels = { diet: 'Makanan', habitat: 'Habitat', care: 'Perawatan', behavior: 'Perilaku', welfare: 'Kesejahteraan', fact: 'Fakta', taxonomy: 'Klasifikasi', information: 'Informasi umum' };
    const learnedQuestion = question || labels[type] + (animal ? ' ' + animal.name : '') + '?';
    const subject = animal ? animal.name : 'hewan ini';
    const questionVariants = {
      diet: ['apa makanan ' + subject, subject + ' makan apa', 'pakan untuk ' + subject, 'bolehkah ' + subject + ' makan'],
      habitat: ['dimana habitat ' + subject, 'kandang yang cocok untuk ' + subject, 'lingkungan hidup ' + subject],
      care: ['bagaimana merawat ' + subject, 'cara memelihara ' + subject, 'perawatan harian ' + subject],
      behavior: ['bagaimana perilaku ' + subject, 'kebiasaan ' + subject, 'karakter ' + subject],
      welfare: ['apa kebutuhan ' + subject, 'cara membuat ' + subject + ' nyaman', 'kesejahteraan ' + subject],
      fact: ['fakta tentang ' + subject, 'hal unik tentang ' + subject, 'apa yang menarik dari ' + subject],
      taxonomy: ['' + subject + ' termasuk kelompok apa', 'klasifikasi ' + subject, 'bagaimana ' + subject + ' berkembang biak'],
      information: ['jelaskan tentang ' + subject, 'apa itu ' + subject, 'ceritakan tentang ' + subject]
    }[type] || [];
    const animalAliases = animal && Array.isArray(animal.keywords) ? animal.keywords : [];
    const triggers = [...new Set([learnedQuestion, ...questionVariants, ...animalAliases, ...tokenize(basis).split(' ').filter(x => x.length > 2).slice(0, 12)])];
    return { id: String(Date.now()), question: learnedQuestion, answer, triggers: [...new Set(triggers)], animalId: animal ? animal.id : null, type, typeLabel: labels[type], sourceNote: '', priority: 0.5, active: true };
  }
  function showDraft(d) {
    state.pendingTraining = d;
    const subject = d.animalId ? ' tentang <b>' + escapeHtml(animals.find(a => a.id === d.animalId).name) + '</b>' : ' sebagai materi umum';
    sendBotHtml('Aku memilah pesanmu sebagai <b>' + escapeHtml(d.typeLabel) + '</b>' + subject + '. Pertanyaan yang akan dikenali: <b>' + escapeHtml(d.question) + '</b><br>Jawaban: “' + escapeHtml(d.answer) + '”<div class="training-confirm"><button class="mini-action" type="button" data-save-training="1">Simpan sebagai materi</button><button class="mini-action" type="button" data-cancel-training="1">Batal</button></div><small>Periksa sebelum disimpan. Materi belum diverifikasi otomatis.</small>');
  }
  renderTraining = function () {
    const entries = [...state.knowledge, ...state.training];
    document.getElementById('training-count').textContent = String(entries.length);
    document.getElementById('training-list').innerHTML = entries.length ? '<details class="training-saved"><summary>Materi tersimpan (' + entries.length + ')</summary><div>' + entries.map(x => '<article class="training-item"><div><small>' + (x.builtIn ? 'Materi dasar lokal · ' + escapeHtml(x.typeLabel) : 'Materi diajarkan · ' + escapeHtml(x.typeLabel)) + '</small><b>' + escapeHtml(x.question) + '</b><p>' + escapeHtml(x.answer).slice(0, 180) + '</p><small>' + escapeHtml(x.sourceNote || 'Belum dicatat sumbernya') + '</small></div>' + (x.builtIn ? '<span class="verified-badge">Lokal</span>' : '<button class="mini-action" type="button" data-delete-training="' + escapeHtml(x.id) + '">Hapus</button>') + '</article>').join('') + '</div></details>' : '<small>Belum ada materi diajarkan.</small>';
  };
  initTraining = function () {
    const category = document.getElementById('animal-category');
    if (![...category.options].some(o => o.value === 'amfibi')) category.insertAdjacentHTML('beforeend', '<option value="amfibi">Amfibi</option>');
    const form = document.getElementById('training-form');
    form.addEventListener('submit', e => {
      e.preventDefault(); e.stopImmediatePropagation();
      const input = document.getElementById('training-message'), raw = input.value.trim();
      if (!raw) return;
      pushMessage(raw, 'user'); input.value = ''; storeLesson(raw);
    }, true);
    document.getElementById('messages').addEventListener('click', e => {
      const save = e.target.closest('[data-save-training]'), cancel = e.target.closest('[data-cancel-training]'), teach = e.target.closest('[data-teach-question]'), source = e.target.closest('[data-open-source-collector]');
      if (!save && !cancel && !teach && !source) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (teach) { document.getElementById('training-message').value = 'Pertanyaan: ' + state.lastUnknownQuestion + '\nJawaban: '; document.getElementById('training-drawer').open = true; document.getElementById('training-message').focus(); }
      if (source) { const drawer=document.getElementById('training-drawer'),collector=document.querySelector('.collector-panel');drawer.open=true;collector.open=true;drawer.scrollIntoView({behavior:'smooth',block:'nearest'});setTimeout(()=>document.getElementById('collector-url').focus(),200); }
      if (cancel) { state.pendingTraining = null; sendBotHtml('Baik, materi belum disimpan.'); }
      if (save && state.pendingTraining) { state.training.unshift(state.pendingTraining); localStorage.setItem('hewanTraining', JSON.stringify(state.training)); state.pendingTraining = null; renderTraining(); sendBotHtml('Materi tersimpan dan siap digunakan saat ada pertanyaan yang cocok.'); }
    }, true);
    document.getElementById('training-list').addEventListener('click', e => {
      const del = e.target.closest('[data-delete-training]'); if (!del) return;
      state.training = state.training.filter(x => x.id !== del.dataset.deleteTraining); localStorage.setItem('hewanTraining', JSON.stringify(state.training)); markDeleted('training', del.dataset.deleteTraining); renderTraining();
    });
    document.getElementById('open-history').onclick = () => { const panel = document.getElementById('history-panel'); panel.hidden = !panel.hidden; renderHistory(); };
    document.getElementById('close-history').onclick = () => document.getElementById('history-panel').hidden = true;
    document.getElementById('history-list').onclick = e => {
      const del = e.target.closest('[data-delete-chat]');
      if (del) { state.chats = state.chats.filter(c => c.id !== del.dataset.deleteChat); saveChats(); markDeleted('chat', del.dataset.deleteChat); renderHistory(); return; }
      const open = e.target.closest('[data-open-chat]'), chat = open && state.chats.find(c => c.id === open.dataset.openChat);
      if (chat) { state.activeChatId = chat.id; state.messages = chat.messages; state.preferences = chat.preferences || {}; state.sessionParameters = { ...state.preferences }; state.lastRecommendations = chat.recommendations || []; state.lastAnimal = recentConversationAnimals()[0] || null; state.contextAnimal = state.lastAnimal; document.getElementById('history-panel').hidden = true; renderMessages(); }
    };
    document.getElementById('reset-chat').addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); startNewChat(); }, true);
    document.getElementById('collector-form').addEventListener('submit', collectSource);
    renderHistory();
    renderCollector();
    restoreLocalData();
    if (!state.messages.length) state.messages = [{ who: 'bot', text: 'Halo! Senang kamu mampir. Ceritakan, kamu ingin tahu apa tentang hewan?', at: new Date().toISOString() }];
    renderMessages();
  };

  function storeLesson(raw) {
    const lesson = draftFrom(raw);
    if (!lesson.answer || lesson.answer.length < 8) {
      sendBotHtml('Boleh jelaskan materinya sedikit lebih lengkap? Contohnya: <b>Ajarkan AI: makanan utama kelinci adalah hay yang selalu tersedia.</b>');
      return;
    }
    lesson.sourceNote = 'Diajarkan langsung oleh pengguna';
    lesson.verificationStatus = 'user_training';
    state.training.unshift(lesson);
    localStorage.setItem('hewanTraining', JSON.stringify(state.training));
    renderTraining();
    scheduleLocalSave();
    sendBotHtml('Makasih sudah mengajariku! Materi <b>' + escapeHtml(lesson.typeLabel) + '</b>' + (lesson.animalId ? ' tentang <b>' + escapeHtml(animals.find(a => a.id === lesson.animalId).name) + '</b>' : '') + ' sudah otomatis tersimpan dan akan kupakai saat ada pertanyaan yang cocok. <small>Periksa faktanya kembali sebelum dijadikan panduan perawatan.</small>');
  }

  const saveStore = () => {
    localStorage.setItem('hewanSources', JSON.stringify(store.sources));
    localStorage.setItem('hewanDocuments', JSON.stringify(store.documents));
    localStorage.setItem('hewanProposals', JSON.stringify(store.proposals));
    localStorage.setItem('hewanKnowledgeHistory', JSON.stringify(store.history.slice(0, 300)));
    localStorage.setItem('hewanCollectorFailures', String(store.failures));
    scheduleLocalSave();
  };
  const allowedDomains = ['merckvetmanual.com', 'vcahospitals.com', 'rspca.org.uk', 'bluecross.org.uk', 'avma.org', 'nationalgeographic.com', 'britannica.com', 'wikipedia.org', 'worldwildlife.org'];
  const sourceAllowed = host => allowedDomains.some(domain => host === domain || host.endsWith('.' + domain));
  const hashText = text => { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
  function extractText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,noscript,nav,header,footer,form,iframe,svg,canvas').forEach(el => el.remove());
    return { title: (doc.querySelector('title')?.textContent || '').trim().slice(0, 240), text: (doc.body?.innerText || doc.body?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24000) };
  }
  function candidateFrom(documentRecord) {
    const combined = documentRecord.title + ' ' + documentRecord.text;
    const animal = findAnimals(combined)[0] || null;
    const found = detectIntent(combined);
    const intent = ['diet', 'habitat', 'care', 'behavior', 'welfare', 'fact', 'taxonomy'].includes(found) ? found : (/habitat|kandang|akuarium|suhu|lingkungan/i.test(combined) ? 'habitat' : /makan|pakan|diet|hay|pelet/i.test(combined) ? 'diet' : 'information');
    const label = { diet: 'Makanan', habitat: 'Habitat', care: 'Perawatan', behavior: 'Perilaku', welfare: 'Kesejahteraan', fact: 'Fakta', taxonomy: 'Klasifikasi', information: 'Informasi umum' }[intent];
    const terms = { diet: /makan|pakan|diet|hay|pelet/i, habitat: /habitat|kandang|akuarium|lingkungan|suhu/i, care: /rawat|perawatan|bersih|grooming/i, behavior: /perilaku|kebiasaan|aktivitas|sosial/i, welfare: /kesejahteraan|welfare|stres|kebutuhan/i, fact: /fakta|menarik|keunikan/i, taxonomy: /spesies|famili|genus|taksonomi/i }[intent];
    const sentences = documentRecord.text.split(/(?<=[.!?])\s+/).filter(s => s.length > 35);
    const evidence = (sentences.find(s => terms && terms.test(s)) || sentences.find(s => animal && s.toLowerCase().includes(animal.name.toLowerCase())) || sentences[0] || documentRecord.text).slice(0, 700);
    const animalName = animal?.name || 'hewan';
    return { id: 'candidate-' + documentRecord.id, documentId: documentRecord.id, sourceId: documentRecord.sourceId, animalId: animal?.id || null, type: intent, typeLabel: label, question: label + ' ' + animalName + ' menurut sumber ini?', answer: evidence, evidence, triggers: [...new Set([animal?.name, label.toLowerCase(), ...tokenize(evidence).split(' ').filter(x => x.length > 3).slice(0, 10)].filter(Boolean))], status: 'pending_review', sourceNote: documentRecord.url, createdAt: new Date().toISOString() };
  }
  function renderCollector() {
    const list = document.getElementById('proposal-list');
    if (!list) return;
    const pending = store.proposals.filter(p => p.status === 'pending_review');
    document.getElementById('knowledge-stats').textContent = 'Sumber ' + store.sources.length + ' · Dokumen ' + store.documents.length + ' · Menunggu tinjauan ' + pending.length + ' · Disetujui ' + store.proposals.filter(p => p.status === 'approved').length + ' · Ditolak ' + store.proposals.filter(p => p.status === 'rejected').length + ' · Gagal ' + store.failures;
    list.innerHTML = (pending.length ? pending.map(p => '<article class="proposal-card" data-proposal="' + escapeHtml(p.id) + '"><div class="proposal-meta">Menunggu tinjauan · ' + escapeHtml(p.typeLabel) + ' · ' + escapeHtml(p.animalId ? animals.find(a => a.id === p.animalId)?.name || 'Hewan' : 'Umum') + '</div><label>Pertanyaan<input data-proposal-question value="' + escapeHtml(p.question) + '"></label><label>Jawaban dari kutipan sumber<textarea data-proposal-answer rows="4">' + escapeHtml(p.answer) + '</textarea></label><details><summary>Lihat bukti sumber</summary><blockquote>' + escapeHtml(p.evidence) + '</blockquote><a href="' + escapeHtml(p.sourceNote) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(p.sourceNote) + '</a></details><div class="proposal-actions"><button class="mini-action" data-approve-proposal="' + escapeHtml(p.id) + '">Setujui & simpan</button><button class="mini-action" data-reject-proposal="' + escapeHtml(p.id) + '">Tolak</button></div></article>').join('') : '<small>Tidak ada kandidat yang menunggu tinjauan.</small>') + '<details class="knowledge-history"><summary>Riwayat sumber dan keputusan (' + store.history.length + ')</summary><div>' + store.history.slice(0, 8).map(h => '<p>' + escapeHtml(new Date(h.at).toLocaleString('id-ID')) + ' · ' + escapeHtml(h.action) + (h.url ? ' · <a href="' + escapeHtml(h.url) + '" target="_blank" rel="noopener noreferrer">sumber</a>' : '') + '</p>').join('') + '</div></details>';
  }
  async function collectSource(event) {
    event.preventDefault();
    const urlField = document.getElementById('collector-url'), textField = document.getElementById('collector-text'), status = document.getElementById('collector-status');
    let sourceUrl;
    try { sourceUrl = new URL(urlField.value.trim()); } catch (_) { status.textContent = 'Masukkan alamat URL yang valid.'; return; }
    if (sourceUrl.protocol !== 'https:' || !sourceAllowed(sourceUrl.hostname)) { status.textContent = 'Untuk pengambilan langsung, gunakan HTTPS dari sumber yang diizinkan: Merck Vet Manual, VCA, RSPCA, Blue Cross, AVMA, National Geographic, Britannica, Wikipedia, atau WWF.'; return; }
    status.textContent = 'Mengambil sumber dan memilah teks…';
    let page = null, accessStatus = 'manual_excerpt';
    if (!textField.value.trim()) {
      const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 9000);
      try {
        const response = await fetch(sourceUrl.href, { signal: controller.signal, credentials: 'omit', redirect: 'follow', headers: { Accept: 'text/html,text/plain' } });
        if (!sourceAllowed(new URL(response.url || sourceUrl.href).hostname)) throw new Error('Pengalihan menuju domain yang tidak diizinkan.');
        const kind = response.headers.get('content-type') || '';
        if (!response.ok || !/text\/html|text\/plain/i.test(kind)) throw new Error('Sumber tidak mengembalikan halaman teks yang didukung.');
        const html = await response.text(); if (html.length > 2000000) throw new Error('Halaman terlalu besar (maksimal 2 MB).');
        page = extractText(html); accessStatus = 'fetched';
      } catch (err) { store.failures++; saveStore(); status.textContent = 'Halaman tidak dapat diambil langsung (' + (err.name === 'AbortError' ? 'waktu habis' : err.message || 'CORS / akses situs') + '). Tempel kutipan teks dari halaman itu di kolom di atas, lalu coba lagi.'; return; }
      finally { clearTimeout(timer); }
    } else page = { title: '', text: textField.value.trim().slice(0, 20000) };
    if (page.text.length < 80) { status.textContent = 'Teks sumber terlalu singkat. Tambahkan kutipan yang lebih lengkap.'; return; }
    const normalized = page.text.toLowerCase().replace(/\s+/g, ' '), hash = hashText(normalized);
    if (store.documents.some(d => d.contentHash === hash)) { status.textContent = 'Konten ini sudah pernah dikumpulkan. Duplikasi tidak ditambahkan.'; return; }
    const source = { id: 'source-' + hash, url: sourceUrl.href, title: page.title || sourceUrl.hostname, domain: sourceUrl.hostname, fetchedAt: new Date().toISOString(), accessStatus, verificationStatus: 'unverified', trustLevel: 'unreviewed' };
    const doc = { id: 'doc-' + hash, sourceId: source.id, url: sourceUrl.href, title: source.title, text: page.text, contentHash: hash, collectedAt: source.fetchedAt, language: 'id-or-en' };
    const proposal = candidateFrom(doc);
    store.sources = [source, ...store.sources.filter(x => x.id !== source.id)].slice(0, 50);
    store.documents = [doc, ...store.documents].slice(0, 30);
    store.proposals.unshift(proposal); store.history.unshift({ at: source.fetchedAt, action: 'candidate_created', proposalId: proposal.id, url: source.url });
    saveStore(); renderCollector(); status.textContent = 'Sumber tercatat. Kandidat dibuat sebagai menunggu tinjauan; belum dipakai chatbot.'; textField.value = '';
  }
  function reviewProposal(event) {
    const approve = event.target.closest('[data-approve-proposal]'), reject = event.target.closest('[data-reject-proposal]');
    if (!approve && !reject) return;
    const id = (approve || reject).dataset[approve ? 'approveProposal' : 'rejectProposal'];
    const proposal = store.proposals.find(p => p.id === id), card = (approve || reject).closest('[data-proposal]');
    if (!proposal || !card) return;
    if (reject) { proposal.status = 'rejected'; store.history.unshift({ at: new Date().toISOString(), action: 'rejected', proposalId: id, url: proposal.sourceNote }); }
    else {
      const question = card.querySelector('[data-proposal-question]').value.trim(), answer = card.querySelector('[data-proposal-answer]').value.trim();
      if (!question || !answer) { document.getElementById('collector-status').textContent = 'Pertanyaan dan jawaban perlu diisi sebelum menyimpan.'; return; }
      const original = { question: proposal.question, answer: proposal.answer };
      proposal.question = question; proposal.answer = answer; proposal.status = 'approved'; proposal.version = 1;
      state.training.unshift({ id: proposal.id, question, answer, triggers: proposal.triggers, animalId: proposal.animalId, type: proposal.type, typeLabel: proposal.typeLabel, sourceNote: proposal.sourceNote, priority: .5, active: true, verificationStatus: 'reviewed', collectedAt: proposal.createdAt });
      localStorage.setItem('hewanTraining', JSON.stringify(state.training));
      const source = store.sources.find(s => s.id === proposal.sourceId); if (source) { source.verificationStatus = 'reviewed'; source.trustLevel = 'reviewed_by_user'; }
      store.history.unshift({ at: new Date().toISOString(), action: 'approved', proposalId: id, url: proposal.sourceNote, oldData: original, newData: { question, answer }, version: proposal.version });
    }
    saveStore(); renderCollector(); renderTraining();
  }
  document.getElementById('proposal-list').addEventListener('click', reviewProposal);
  const normalSubmitMessage = submitMessage;
  submitMessage = function (text) {
    const raw = String(text ?? '').trim();
    if (/^(ajarkan(?:\s+ai)?|ajar ai|latih ai)(?:\s*[:,]|\s+)/i.test(raw)) {
      try { pushMessage(raw, 'user'); storeLesson(raw); }
      catch (error) { console.error('Gagal menyimpan materi dari chat:', error); sendBotHtml('Maaf, pesan ajar tadi belum berhasil diproses. Coba kirim ulang dengan format “Ajarkan AI: …”.'); }
      return;
    }
    normalSubmitMessage(raw);
  };
})();
