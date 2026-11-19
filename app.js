/* Forge Gym Planner — no build tools, no tracking, no external dependencies. */
(() => {
  'use strict';
  const STORAGE_KEY = 'forge-gym-planner-v1';
  const DAYS = [
    { id:'monday', label:'Mon', full:'Monday', kind:'Chest + Triceps', title:'Chest & Triceps', subtitle:'Upper-body push · chest, shoulders, and triceps', tag:'PUSH DAY' },
    { id:'tuesday', label:'Tue', full:'Tuesday', kind:'Back + Biceps', title:'Back & Biceps', subtitle:'Upper-body pull · back, rear shoulders, and biceps', tag:'PULL DAY' },
    { id:'wednesday', label:'Wed', full:'Wednesday', kind:'Recovery', title:'Recovery day', subtitle:'Rest, gentle mobility, or comfortable walking', tag:'RECOVERY' },
    { id:'thursday', label:'Thu', full:'Thursday', kind:'Shoulders + Hip', title:'Shoulders & Hip Stability', subtitle:'Shoulders, quads, hamstrings, and supported glute work', tag:'BALANCE DAY' },
    { id:'friday', label:'Fri', full:'Friday', kind:'Recovery', title:'Recovery day', subtitle:'Rest, gentle mobility, or comfortable walking', tag:'RECOVERY' },
    { id:'saturday', label:'Sat', full:'Saturday', kind:'Upper + Glutes', title:'Upper Body & Glutes', subtitle:'A second upper-body stimulus plus gentle glute strength', tag:'FULL BODY' },
    { id:'sunday', label:'Sun', full:'Sunday', kind:'Rest', title:'Rest day', subtitle:'Allow your body to recover', tag:'RECOVERY' }
  ];
  const EXERCISES = {
    machine_chest_press: {name:'Machine chest press',muscle:'CHEST',cue:'Keep both feet comfortably supported; avoid a cramped hip angle.',type:'Machine'},
    dumbbell_bench_press:{name:'Flat dumbbell press',muscle:'CHEST',cue:'Set up on a bench without excessive leg drive or hip arch.',type:'Dumbbells'},
    smith_chest_press:{name:'Smith machine chest press',muscle:'CHEST',cue:'Use a stable bench position and comfortable foot placement.',type:'Smith'},
    incline_dumbbell:{name:'Incline dumbbell press',muscle:'UPPER CHEST',cue:'Choose a moderate bench incline and controlled motion.',type:'Dumbbells'},
    incline_machine:{name:'Incline chest press machine',muscle:'UPPER CHEST',cue:'Adjust seat height so the hips remain comfortable.',type:'Machine'},
    cable_chest_fly:{name:'Cable chest fly',muscle:'CHEST',cue:'Use a balanced stance without twisting through the hips.',type:'Cable'},
    pec_deck:{name:'Pec deck / chest fly',muscle:'CHEST',cue:'Sit comfortably and avoid pushing shoulders too far back.',type:'Machine'},
    shoulder_press:{name:'Seated machine shoulder press',muscle:'SHOULDERS',cue:'Use back support and keep both hips comfortably positioned.',type:'Machine'},
    db_shoulder_press:{name:'Seated dumbbell shoulder press',muscle:'SHOULDERS',cue:'Bench supported; keep feet planted in a pain-free position.',type:'Dumbbells'},
    lateral_raises:{name:'Dumbbell lateral raises',muscle:'SIDE DELTS',cue:'Soft elbows; lift to a comfortable shoulder height.',type:'Dumbbells'},
    cable_lateral:{name:'Cable lateral raises',muscle:'SIDE DELTS',cue:'Use light weight and keep your pelvis level.',type:'Cable'},
    rope_pushdown:{name:'Rope triceps pushdown',muscle:'TRICEPS',cue:'Elbows by your sides; avoid leaning through your hips.',type:'Cable'},
    overhead_triceps:{name:'Seated overhead triceps extension',muscle:'TRICEPS',cue:'Choose a stable seated position and light weight.',type:'Dumbbells'},
    lat_pulldown:{name:'Neutral-grip lat pulldown',muscle:'LATS',cue:'Pull toward upper chest without rocking the torso.',type:'Machine'},
    assisted_pullup:{name:'Assisted pull-up machine',muscle:'LATS',cue:'Only if mounting the machine does not aggravate your hip.',type:'Machine'},
    chest_row:{name:'Chest-supported row',muscle:'UPPER BACK',cue:'Support your chest instead of bending deeply at the hips.',type:'Machine'},
    cable_row:{name:'Seated cable row',muscle:'MID BACK',cue:'Sit tall, maintain a comfortable hip angle, and avoid rocking.',type:'Cable'},
    single_arm_row:{name:'Single-arm supported dumbbell row',muscle:'BACK',cue:'Support one hand on a high bench, keep your hip comfortable.',type:'Dumbbells'},
    reverse_pec:{name:'Reverse pec deck',muscle:'REAR DELTS',cue:'Keep chest against support and arms moving slowly.',type:'Machine'},
    face_pull:{name:'Cable face pulls',muscle:'REAR DELTS',cue:'Pull toward the face with a steady, neutral stance.',type:'Cable'},
    preacher_curl:{name:'Preacher curl machine',muscle:'BICEPS',cue:'Keep shoulder and elbow position controlled.',type:'Machine'},
    cable_curl:{name:'Standing cable curl',muscle:'BICEPS',cue:'Keep your trunk stable, without rocking.',type:'Cable'},
    hammer_curl:{name:'Dumbbell hammer curls',muscle:'BICEPS',cue:'Palms in; avoid swinging or using momentum.',type:'Dumbbells'},
    standing_abduction:{name:'Standing cable hip abduction',muscle:'HIP STABILIZERS',cue:'Small, slow, pain-free outward leg motion; keep pelvis level.',type:'Cable',hip:true},
    side_lying_abduction:{name:'Side-lying hip abduction',muscle:'HIP STABILIZERS',cue:'Use a small range without rolling your pelvis backward.',type:'Bodyweight',hip:true},
    standing_ham_curl:{name:'Standing hamstring curl',muscle:'HAMSTRINGS',cue:'Bend the knee gently without shifting your pelvis.',type:'Machine',hip:true},
    prone_ham_curl:{name:'Lying hamstring curl machine',muscle:'HAMSTRINGS',cue:'Use only if lying on the machine is comfortable.',type:'Machine',hip:true},
    high_box_squat:{name:'High-box sit-to-stand',muscle:'QUADS + GLUTES',cue:'Use a tall box; stop well before any deep hip pinch.',type:'Bodyweight',hip:true},
    shallow_squat:{name:'Shallow supported squat',muscle:'QUADS + GLUTES',cue:'Hold a rail and use a small comfortable depth.',type:'Bodyweight',hip:true},
    glute_kickback:{name:'Standing cable glute kickback',muscle:'GLUTES',cue:'Small backward leg movement; do not arch your back.',type:'Cable',hip:true},
    standing_extension:{name:'Standing bodyweight hip extension',muscle:'GLUTES',cue:'Move leg slightly backward without twisting the pelvis.',type:'Bodyweight',hip:true},
    calf_raise:{name:'Standing calf raises',muscle:'CALVES',cue:'Rise slowly; keep hip and knees in a comfortable position.',type:'Machine',hip:true}
  };
  // Base slots appear at 30 min. First extra appears at 40 min; remaining extras at 50 min.
  const DEFAULT_PLAN = {
    monday:[
      {id:'m1',ex:'machine_chest_press',options:['machine_chest_press','dumbbell_bench_press','smith_chest_press'],sets:3,reps:'8–12',extra:0},
      {id:'m2',ex:'incline_dumbbell',options:['incline_dumbbell','incline_machine'],sets:2,reps:'8–12',extra:0},
      {id:'m3',ex:'shoulder_press',options:['shoulder_press','db_shoulder_press'],sets:2,reps:'8–12',extra:0},
      {id:'m4',ex:'rope_pushdown',options:['rope_pushdown','overhead_triceps'],sets:2,reps:'10–15',extra:0},
      {id:'m5',ex:'lateral_raises',options:['lateral_raises','cable_lateral'],sets:2,reps:'12–15',extra:1},
      {id:'m6',ex:'pec_deck',options:['pec_deck','cable_chest_fly'],sets:2,reps:'10–15',extra:2}
    ],
    tuesday:[
      {id:'t1',ex:'lat_pulldown',options:['lat_pulldown','assisted_pullup'],sets:3,reps:'8–12',extra:0},
      {id:'t2',ex:'chest_row',options:['chest_row','cable_row','single_arm_row'],sets:3,reps:'8–12',extra:0},
      {id:'t3',ex:'reverse_pec',options:['reverse_pec','face_pull'],sets:2,reps:'12–15',extra:0},
      {id:'t4',ex:'preacher_curl',options:['preacher_curl','cable_curl','hammer_curl'],sets:2,reps:'10–12',extra:0},
      {id:'t5',ex:'face_pull',options:['face_pull','reverse_pec'],sets:2,reps:'12–15',extra:1},
      {id:'t6',ex:'hammer_curl',options:['hammer_curl','cable_curl'],sets:2,reps:'10–12',extra:2}
    ],
    thursday:[
      {id:'h1',ex:'shoulder_press',options:['shoulder_press','db_shoulder_press'],sets:3,reps:'8–12',extra:0},
      {id:'h2',ex:'standing_abduction',options:['standing_abduction','side_lying_abduction'],sets:2,reps:'12 / side',extra:0},
      {id:'h3',ex:'standing_ham_curl',options:['standing_ham_curl','prone_ham_curl'],sets:2,reps:'10–15 / side',extra:0},
      {id:'h4',ex:'high_box_squat',options:['high_box_squat','shallow_squat'],sets:2,reps:'8–10',extra:0},
      {id:'h5',ex:'cable_lateral',options:['cable_lateral','lateral_raises'],sets:2,reps:'12–15',extra:1},
      {id:'h6',ex:'calf_raise',options:['calf_raise'],sets:2,reps:'12–15',extra:2},
      {id:'h7',ex:'reverse_pec',options:['reverse_pec','face_pull'],sets:2,reps:'12–15',extra:2}
    ],
    saturday:[
      {id:'s1',ex:'incline_machine',options:['incline_machine','incline_dumbbell','machine_chest_press'],sets:3,reps:'8–12',extra:0},
      {id:'s2',ex:'cable_row',options:['cable_row','chest_row','single_arm_row'],sets:3,reps:'8–12',extra:0},
      {id:'s3',ex:'glute_kickback',options:['glute_kickback','standing_extension'],sets:2,reps:'12 / side',extra:0},
      {id:'s4',ex:'hammer_curl',options:['hammer_curl','preacher_curl','cable_curl'],sets:2,reps:'10–12',extra:0},
      {id:'s5',ex:'rope_pushdown',options:['rope_pushdown','overhead_triceps'],sets:2,reps:'10–15',extra:1},
      {id:'s6',ex:'face_pull',options:['face_pull','reverse_pec'],sets:2,reps:'12–15',extra:2},
      {id:'s7',ex:'calf_raise',options:['calf_raise'],sets:2,reps:'12–15',extra:2}
    ]
  };
  const TRAINING_DAYS=Object.keys(DEFAULT_PLAN);
  const $=id=>document.getElementById(id);
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const deepCopy=x=>JSON.parse(JSON.stringify(x));
  const num=(x,min,max,fallback)=>{const n=Number(x);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
  const initialDay=()=>{const d=new Date().getDay();return ({1:'monday',2:'tuesday',4:'thursday',6:'saturday'})[d]||'monday'};
  function defaults(){return {schema:1,day:initialDay(),duration:40,plans:deepCopy(DEFAULT_PLAN),completed:{},presets:[],history:[]};}
  function normalized(data){
    if(!data || typeof data!=='object' || data.schema!==1) throw new Error('This is not a compatible Forge backup.');
    const next=defaults();
    next.day=DAYS.some(d=>d.id===data.day)?data.day:next.day;
    next.duration=[30,40,50].includes(data.duration)?data.duration:40;
    for(const day of TRAINING_DAYS){
      const source=Array.isArray(data.plans?.[day])?data.plans[day]:[];
      for(const slot of next.plans[day]){
        const found=source.find(s=>s&&s.id===slot.id);
        if(!found)continue;
        if(slot.options.includes(found.ex))slot.ex=found.ex;
        slot.sets=num(found.sets,1,6,slot.sets);
        if(typeof found.reps==='string'&&found.reps.length<=30)slot.reps=found.reps.replace(/[<>]/g,'');
        slot.weight=num(found.weight??0,0,2000,0);
      }
    }
    if(data.completed && typeof data.completed==='object'){
      for(const day of TRAINING_DAYS){next.completed[day]={};for(const slot of next.plans[day])next.completed[day][slot.id]=data.completed?.[day]?.[slot.id]===true;}
    }
    if(Array.isArray(data.presets)) next.presets=data.presets.slice(0,50).flatMap(p=>{
      if(!p||!TRAINING_DAYS.includes(p.day)||!Array.isArray(p.slots))return [];
      return [{id:String(p.id||Date.now()).slice(0,60),name:String(p.name||'Routine').slice(0,60),day:p.day,duration:[30,40,50].includes(p.duration)?p.duration:40,slots:p.slots}];
    });
    if(Array.isArray(data.history)) next.history=data.history.slice(0,200).flatMap(item=>{
      if(!item||!TRAINING_DAYS.includes(item.day)||!Array.isArray(item.exercises)||!Number.isFinite(Date.parse(item.date)))return [];
      return [{id:String(item.id||Date.now()).slice(0,60),date:item.date,day:item.day,exercises:item.exercises.slice(0,20).flatMap(e=> EXERCISES[e?.ex]?[{ex:e.ex,sets:num(e.sets,1,6,2),reps:String(e.reps||'').slice(0,30),weight:num(e.weight,0,2000,0)}]:[])}];
    });
    return next;
  }
  let state;
  try{const stored=localStorage.getItem(STORAGE_KEY);state=stored?normalized(JSON.parse(stored)):defaults();}catch{state=defaults();}
  const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{notify('Browser storage unavailable. Export a backup to keep changes.');}};
  let toastTimeout;
  function notify(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),3100);}
  function activeSlots(day){return !TRAINING_DAYS.includes(day)?[]:state.plans[day].filter(x=>x.extra===0 || (state.duration===40&&x.extra===1) || state.duration===50);}
  function slotControl(slot,idx){
    const e=EXERCISES[slot.ex],done=state.completed?.[state.day]?.[slot.id]===true;
    return `<article class="exercise-row ${done?'done':''}">
      <div class="exercise-number">${done?'✓':String(idx+1).padStart(2,'0')}</div>
      <div class="exercise-body">
        <div class="exercise-topline"><div><div class="exercise-title">${safe(e.name)}</div><span class="muscle-tag">${safe(e.muscle)}${e.hip?' · HIP-AWARE':''}</span></div><label class="check-label"><input type="checkbox" data-field="completed" data-slot="${slot.id}" ${done?'checked':''}><span>Done</span></label></div>
        <p class="exercise-cue">${safe(e.cue)}</p>
        <div class="exercise-fields">
          <div class="control-group"><label for="ex-${slot.id}">Swap exercise</label><select id="ex-${slot.id}" data-field="ex" data-slot="${slot.id}">${slot.options.map(id=>`<option value="${id}" ${id===slot.ex?'selected':''}>${safe(EXERCISES[id].name)}</option>`).join('')}</select></div>
          <div class="control-group"><label for="sets-${slot.id}">Sets</label><input id="sets-${slot.id}" data-field="sets" data-slot="${slot.id}" type="number" min="1" max="6" step="1" inputmode="numeric" value="${slot.sets}"></div>
          <div class="control-group"><label for="reps-${slot.id}">Reps</label><input id="reps-${slot.id}" data-field="reps" data-slot="${slot.id}" type="text" maxlength="30" value="${safe(slot.reps)}"></div>
          <div class="control-group"><label for="weight-${slot.id}">Weight (lb)</label><input id="weight-${slot.id}" data-field="weight" data-slot="${slot.id}" type="number" min="0" max="2000" step="0.5" inputmode="decimal" value="${slot.weight??0}"></div>
        </div>
      </div>
    </article>`;
  }
  function renderDays(){
    $('day-picker').innerHTML=DAYS.map(d=>`<button type="button" class="day-button ${state.day===d.id?'active':''} ${!TRAINING_DAYS.includes(d.id)?'rest':''}" data-day="${d.id}" aria-pressed="${state.day===d.id}"><span class="day-label">${d.label}.</span><span class="day-kind">${safe(d.kind)}</span></button>`).join('');
  }
  function renderWorkout(){
    const d=DAYS.find(x=>x.id===state.day);
    $('day-kicker').textContent=d.full.toUpperCase()+' / '+(TRAINING_DAYS.includes(d.id)?'TRAINING':'RECOVERY');
    $('workout-title').textContent=d.title;
    $('workout-subtitle').textContent=d.subtitle;
    $('workout-type').textContent=d.tag;
    if(!TRAINING_DAYS.includes(d.id)){
      $('workout-main').innerHTML=`<div class="rest-panel"><span class="rest-icon">☘</span><h3>Recovery is part of the plan.</h3><p>Enjoy a rest day or gentle movement that feels good. You don't need to force hip stretches or train through pain.</p><p class="small">If you want to train today, you can choose another day above.</p><button type="button" data-day="monday" class="button button-outline">View Monday's workout</button></div>`;
      return;
    }
    const slots=activeSlots(state.day),base=slots.filter(s=>s.extra===0),extras=slots.filter(s=>s.extra>0);
    $('workout-main').innerHTML=`<div class="section-note">FOUNDATION / Aim for 2–3 repetitions in reserve, and rest ~60–120 seconds</div><div class="exercise-list">${base.map((s,i)=>slotControl(s,i)).join('')}</div>${extras.length?`<div class="extra-label">ADDITIONAL EXERCISES · ${state.duration} MIN SESSION</div><div class="exercise-list">${extras.map((s,i)=>slotControl(s,base.length+i)).join('')}</div>`:''}<div class="training-actions"><span class="muted small">Exercises are suggestions, not a pain test.</span><button type="button" data-action="reset-day" class="reset-action">↺ Reset this day's exercises</button></div>`;
  }
  function renderDuration(){
    $('duration-buttons').innerHTML=[30,40,50].map(n=>`<button type="button" data-duration="${n}" class="duration-button ${state.duration===n?'active':''}" aria-pressed="${state.duration===n}">${n} min</button>`).join('');
    $('time-lifting-bar').style.flex=String(state.duration);
    $('strength-label').textContent=state.duration+'m weights';
  }
  function renderSummary(){
    const slots=activeSlots(state.day),completed=slots.filter(s=>state.completed?.[state.day]?.[s.id]).length;
    if(!TRAINING_DAYS.includes(state.day)){$('summary-section').innerHTML='<span class="eyebrow subdued">TODAY’S FOCUS</span><h3 style="margin-top:10px">Recharge & recover</h3><p class="muted small">No sets to log today. Good recovery can make your next workout better.</p>';return;}
    const pct=slots.length?Math.round(100*completed/slots.length):0;
    $('summary-section').innerHTML=`<div class="summary-head"><span class="eyebrow subdued">SESSION PROGRESS</span><span class="muted small">${pct}%</span></div><div class="progress-number">${completed}<span> / ${slots.length}</span></div><div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${pct}%"></div></div><div class="summary-note">Exercises checked off today</div><div class="summary-facts"><div><strong>${slots.reduce((a,s)=>a+s.sets,0)}</strong><span>PLANNED SETS</span></div><div><strong>${state.duration+30}m</strong><span>TOTAL SESSION</span></div></div><button type="button" class="button button-lime" data-action="finish" ${completed===0?'disabled':''}>✓ Finish & save workout</button>`;
  }
  function renderPresets(){
    const select=$('preset-select'),selection=select.value;
    select.innerHTML='<option value="">Choose a saved routine</option>'+state.presets.map(p=>`<option value="${safe(p.id)}">${safe(p.name)} · ${safe(DAYS.find(d=>d.id===p.day)?.label||'')}</option>`).join('');
    if(state.presets.some(p=>p.id===selection))select.value=selection;
  }
  function renderHistory(){
    $('history-count').textContent=`${state.history.length} session${state.history.length===1?'':'s'} recorded`;
    $('history-list').innerHTML=state.history.length?`<div class="history-items">${[...state.history].reverse().slice(0,8).map(h=>`<div class="history-item"><div><strong>${safe(DAYS.find(d=>d.id===h.day)?.title||h.day)}</strong><span>${safe(new Date(h.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}))}</span></div><span class="history-count">${h.exercises.length} exercise${h.exercises.length===1?'':'s'} logged</span></div>`).join('')}</div>`:'<div class="empty-history"><span>↗</span>Your workout history starts here. Tick completed exercises and save your first session.</div>';
  }
  function render(){renderDays();renderWorkout();renderDuration();renderSummary();renderPresets();renderHistory();}
  function savePreset(){
    const name=$('preset-name').value.trim();if(!name){notify('Enter a routine name first.');$('preset-name').focus();return;}
    if(!TRAINING_DAYS.includes(state.day)){notify('Choose a training day to save a routine.');return;}
    if(state.presets.length>=50){notify('Maximum of 50 saved routines reached.');return;}
    const id=(globalThis.crypto?.randomUUID?.()||'preset-'+Date.now()+'-'+Math.random().toString(36).slice(2));
    state.presets.push({id,name:name.slice(0,60),day:state.day,duration:state.duration,slots:deepCopy(state.plans[state.day])});save();renderPresets();$('preset-select').value=id;$('preset-name').value='';notify('Routine saved!');
  }
  function loadPreset(){
    const preset=state.presets.find(x=>x.id===$('preset-select').value);
    if(!preset){notify('Select a saved routine first.');return;}
    const test=normalized({schema:1,plans:{[preset.day]:preset.slots}});
    state.plans[preset.day]=test.plans[preset.day];state.day=preset.day;state.duration=preset.duration;state.completed[preset.day]={};save();render();$('preset-select').value=preset.id;notify('Routine loaded.');
  }
  function deletePreset(){
    const id=$('preset-select').value,preset=state.presets.find(x=>x.id===id);
    if(!preset){notify('Select a saved routine first.');return;}
    if(!confirm(`Delete saved routine “${preset.name}”?`))return;
    state.presets=state.presets.filter(x=>x.id!==id);save();renderPresets();notify('Saved routine deleted.');
  }
  function exportBackup(){
    const json=JSON.stringify(state,null,2),blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='forge-gym-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Backup downloaded.');
  }
  function finish(){
    if(!TRAINING_DAYS.includes(state.day))return;
    const slots=activeSlots(state.day).filter(s=>state.completed?.[state.day]?.[s.id]);
    if(!slots.length){notify('Check off at least one exercise first.');return;}
    const historyItem={id:Date.now()+'-'+Math.random().toString(36).slice(2),date:new Date().toISOString(),day:state.day,exercises:slots.map(s=>({ex:s.ex,sets:s.sets,reps:s.reps,weight:s.weight??0}))};
    state.history.push(historyItem);state.history=state.history.slice(-200);state.completed[state.day]={};save();render();notify(`Saved ${slots.length} completed exercises to your history!`);
  }
  document.addEventListener('click',event=>{
    const d=event.target.closest('[data-day]');if(d){state.day=d.dataset.day;save();render();return;}
    const duration=event.target.closest('[data-duration]');if(duration){state.duration=Number(duration.dataset.duration);save();render();return;}
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(!action)return;
    if(action==='save-preset')savePreset();else if(action==='load-preset')loadPreset();else if(action==='delete-preset')deletePreset();else if(action==='export')exportBackup();else if(action==='import')$('import-file').click();else if(action==='finish')finish();
    else if(action==='reset-day'&&confirm('Reset exercises, sets, reps, and weights for this day?')){state.plans[state.day]=deepCopy(DEFAULT_PLAN[state.day]);state.completed[state.day]={};save();render();notify('Day restored to the starter plan.');}
  });
  document.addEventListener('change',event=>{
    const input=event.target,field=input?.dataset?.field,slotId=input?.dataset?.slot;
    if(!field||!slotId||!TRAINING_DAYS.includes(state.day))return;
    const slot=state.plans[state.day].find(s=>s.id===slotId);if(!slot)return;
    if(field==='ex'&&slot.options.includes(input.value))slot.ex=input.value;
    if(field==='sets')slot.sets=num(input.value,1,6,slot.sets);
    if(field==='reps')slot.reps=String(input.value).slice(0,30).replace(/[<>]/g,'');
    if(field==='weight')slot.weight=num(input.value,0,2000,0);
    if(field==='completed'){state.completed[state.day]??={};state.completed[state.day][slotId]=input.checked;}
    save();renderWorkout();renderSummary();
  });
  $('import-file').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error('Backup file is too large.');
      const imported=normalized(JSON.parse(await file.text()));
      if(!confirm('Restore this backup? It will replace routines and history saved in this browser.'))return;
      state=imported;save();render();notify('Backup restored successfully.');
    }catch(e){notify(e instanceof Error?e.message:'Unable to read backup file.');}
    finally{event.target.value='';}
  });
  render();
})();