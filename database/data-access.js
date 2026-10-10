/* Local IndexedDB repository. It never contacts an external database. */
(function(global){
  const DB_NAME='hewan_ai_local';
  const DB_VERSION=1;
  const GUIDE_VERSION='2026-10-09-v5';
  const FALLBACK_KEY='hewanLocalRecords';
  let dbPromise;
  function openDb(){
    if(!('indexedDB' in global))return Promise.resolve(null);
    if(dbPromise)return dbPromise;
    dbPromise=new Promise(resolve=>{
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains('animals'))db.createObjectStore('animals',{keyPath:'id'});
        if(!db.objectStoreNames.contains('knowledge'))db.createObjectStore('knowledge',{keyPath:'id'});
        if(!db.objectStoreNames.contains('user_records'))db.createObjectStore('user_records',{keyPath:'id'});
        if(!db.objectStoreNames.contains('feedback'))db.createObjectStore('feedback',{keyPath:'id'});
        if(!db.objectStoreNames.contains('metadata'))db.createObjectStore('metadata',{keyPath:'key'});
      };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>resolve(null);
      request.onblocked=()=>resolve(null);
    });
    return dbPromise;
  }
  function requestValue(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
  function transactionDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Transaksi database lokal dibatalkan.'));});}
  const DOMAIN_LABELS={information:'Informasi',diet:'Makanan',habitat:'Habitat',care:'Perawatan',behavior:'Perilaku',welfare:'Kesejahteraan',fact:'Fakta',taxonomy:'Klasifikasi'};
  function buildKnowledge(animals){
    const guides=global.HEWAN_ANIMAL_GUIDES||{};
    const topicEntries=animals.flatMap(animal=>Object.entries(guides[animal.id]?.topics||{}).map(([type,answer])=>({
      id:`guide-${animal.id}-${type}`,question:`${DOMAIN_LABELS[type]||'Informasi'} ${animal.name}?`,answer,
      triggers:[animal.name,animal.scientific,DOMAIN_LABELS[type]||type,`${DOMAIN_LABELS[type]||type} ${animal.name}`],
      animalId:animal.id,type,typeLabel:DOMAIN_LABELS[type]||type,priority:0.75,active:true,
      sourceNote:(guides[animal.id]?.sources||[]).join(' · '),verificationStatus:'curated_local'
    })));
    const classificationEntries=animals.filter(animal=>animal.dietGroup&&animal.reproductionGroup&&animal.biologicalClass).map(animal=>({
      id:`guide-${animal.id}-taxonomy`,question:`Klasifikasi ${animal.name}?`,
      answer:`${animal.name} termasuk kelompok ${animal.biologicalClass}, pola makan ${animal.dietGroup.toLowerCase()}, dan berkembang biak secara ${animal.reproductionGroup.toLowerCase()}. Klasifikasi diet menjelaskan makanan, kelompok biologis menjelaskan kelas hewan, sedangkan pola reproduksi adalah kategori terpisah.`,
      triggers:[animal.name,animal.scientific,'klasifikasi','taksonomi','mamalia',animal.biologicalClass.toLowerCase(),animal.dietGroup.toLowerCase(),animal.reproductionGroup.toLowerCase()],
      animalId:animal.id,type:'taxonomy',typeLabel:DOMAIN_LABELS.taxonomy,priority:0.82,active:true,
      sourceNote:(global.HEWAN_CLASSIFICATION_SOURCES||[]).join(' · '),verificationStatus:'curated_local'
    }));
    return [...topicEntries,...classificationEntries];
  }
  async function load(seed){
    const guides=global.HEWAN_ANIMAL_GUIDES||{};
    const classifications=global.HEWAN_ANIMAL_CLASSIFICATIONS||{};
    const animals=seed.map(animal=>{const guide=guides[animal.id]||{};return {...animal,...(classifications[animal.id]||{}),
      habitatNotes:guide.topics?.habitat||animal.habitatNotes||'',
      behaviorNotes:guide.topics?.behavior||animal.behaviorNotes||'',
      welfareNotes:guide.topics?.welfare||animal.welfareNotes||'',
      careNotes:guide.topics?.care||animal.careNotes||'',
      food:guide.topics?.diet||animal.food||'',
      sources:guide.sources||[]
    };});
    const knowledge=buildKnowledge(animals),db=await openDb();
    if(!db)return {animals,knowledge,rules:[],records:await loadRecords(),connected:false,storage:'localStorage'};
    try{
      const metaRead=db.transaction('metadata','readonly');
      const version=await requestValue(metaRead.objectStore('metadata').get('guideVersion'));
      const tx=db.transaction(['animals','knowledge','metadata'],'readwrite');
      animals.forEach(animal=>tx.objectStore('animals').put(animal));
      if(version?.value!==GUIDE_VERSION){const store=tx.objectStore('knowledge');store.clear();knowledge.forEach(item=>store.put(item));tx.objectStore('metadata').put({key:'guideVersion',value:GUIDE_VERSION});}
      await transactionDone(tx);
      const read=db.transaction(['animals','knowledge'],'readonly');
      const [savedAnimals,savedKnowledge]=await Promise.all([requestValue(read.objectStore('animals').getAll()),requestValue(read.objectStore('knowledge').getAll())]);
      const records=await loadRecords();
      return {animals:savedAnimals.length?savedAnimals:animals,knowledge:savedKnowledge.length?savedKnowledge:knowledge,rules:[],records,connected:true,storage:'IndexedDB'};
    }catch(error){console.warn('IndexedDB tidak tersedia; menggunakan penyimpanan lokal cadangan.',error);return {animals,knowledge,rules:[],records:await loadRecords(),connected:false,storage:'localStorage'};}
  }
  async function loadRecords(){
    const db=await openDb();
    if(!db){try{return JSON.parse(localStorage.getItem(FALLBACK_KEY)||'[]');}catch(_){return [];}}
    try{const tx=db.transaction('user_records','readonly');return await requestValue(tx.objectStore('user_records').getAll());}
    catch(_){try{return JSON.parse(localStorage.getItem(FALLBACK_KEY)||'[]');}catch(__){return [];}}
  }
  async function saveRecords(records){
    const rows=records.map(item=>({id:`${item.type}:${item.key}`,type:item.type,key:String(item.key),payload:item.payload,updatedAt:item.updatedAt||new Date().toISOString()}));
    const db=await openDb();
    if(!db){let existing=[];try{existing=JSON.parse(localStorage.getItem(FALLBACK_KEY)||'[]');}catch(_){}const byId=new Map(existing.map(x=>[x.id,x]));rows.forEach(row=>byId.set(row.id,row));localStorage.setItem(FALLBACK_KEY,JSON.stringify([...byId.values()]));return {stored:'localStorage'};}
    const tx=db.transaction('user_records','readwrite');rows.forEach(row=>tx.objectStore('user_records').put(row));await transactionDone(tx);
    localStorage.setItem(FALLBACK_KEY,JSON.stringify(await loadRecords()));
    return {stored:'IndexedDB'};
  }
  async function saveFeedback(item){
    const record={...item,id:`${item.session_id||'local'}:${Date.now()}`,created_at:new Date().toISOString()};
    const db=await openDb();
    if(db){try{const tx=db.transaction('feedback','readwrite');tx.objectStore('feedback').put(record);await transactionDone(tx);return {stored:'IndexedDB'};}catch(error){console.warn('Feedback disimpan pada fallback lokal.',error);}}
    let list=[];try{list=JSON.parse(localStorage.getItem('hewanFeedback')||'[]');}catch(_){}list.push(record);localStorage.setItem('hewanFeedback',JSON.stringify(list));return {stored:'localStorage'};
  }
  global.HewanRepository={load,loadRecords,saveRecords,saveFeedback,storageName:()=>openDb().then(db=>db?'IndexedDB':'localStorage')};
})(window);
