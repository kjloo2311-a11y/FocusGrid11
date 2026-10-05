'use strict';

(() => {
  const STORE = 'focusgrid-v2';
  const LEGACY_PREFIXES = ['focusgrid-schulte-v1', 'focusgrid-schulte-v2'];
  const TEXT = {
    zh: {
      top:'本地专注训练 · Private practice', title:'让注意力，回到此刻', description:'每天几分钟，练习视觉搜索与稳定专注。准确优先，慢慢找到自己的节奏。', subtitle:'选择网格，开始专注训练',
      settings:'设置 · Settings', sound:'声音 Sound', haptic:'触觉 Haptic', focusSetting:'焦点模式 Focus', theme:'主题 Theme',
      today:'今日训练', grid:'网格', mode:'模式', classic:'经典 Classic', reverse:'逆序 Reverse', 
      time:'用时 TIME', next:'进度 PROGRESS', errors:'错误 ERRORS', 
      start:'开始训练', resume:'继续训练', pause:'暂停训练', again:'再练一轮', restart:'重新开始', focus:'焦点模式',
      accuracy:'准确优先，保持放松', instruction:'点击「开始训练」，按顺序找到所有目标。',
      stats:'训练数据', bestToday:'今日最佳', avgToday:'今日平均', personalBest:'个人最佳', avgErrors:'平均错误', total:'总训练',
      recent:'最近 7 次 · RECENT', emptyChart:'完成几次训练后，这里会显示你的进步。', emptyHistory:'完成训练后，记录会显示在这里。',
      complete:'完成得很好！', completeKicker:'训练完成', accuracyLabel:'准确率', previous:'上次', improvement:'变化', dashboard:'返回面板', newBest:'🏆 新的个人最佳',
      newBestScoped:(size,modeName)=>`🏆 ${size}×${size} ${modeName}模式 新纪录！`,
      sparkTitle:(n)=>`最近 ${n} 次 · 本规格`,
      trendSame:'与首次持平', trendFaster:(pct)=>`比首次快 ${pct}%`, trendSlower:(pct)=>`比首次慢 ${pct}%`,
      footer:'训练数据仅保存在此浏览器。一次只找一个数字。', clear:'清除记录',
      first:'首次训练',
      modeHintNum:'按顺序找到所有数字', modeHintReverse:'从最大数字开始倒序寻找',
      taskNum:'点击数字，按顺序从 1 找到最后一个数字。', taskReverse:'点击数字，从最大数字开始倒序寻找。',
      confirmClear:'清除本设备上保存的所有训练记录吗？', clearDone:'训练记录已清除。',
      themes:['跟随系统','浅色','深色'],
      accessibilityGrid:'舒尔特训练网格', progress:'训练进度', errorsWord:'次错误', seconds:'秒',
      improvementText:(pct)=>Math.abs(pct)<0.05?'持平':`${pct > 0 ? '↓' : '↑'} ${Math.abs(pct).toFixed(1)}% ${pct > 0 ? '更快' : '较慢'}`
    },
    en: {
      top:'Private focus practice · Local only', title:'Bring your attention to the moment', description:'A few minutes a day to practice visual search and steady focus. Accuracy first; find your own pace.', subtitle:'Choose a grid and begin your focus practice',
      settings:'Settings', sound:'Sound', haptic:'Haptic', focusSetting:'Focus mode', theme:'Theme',
      today:"Today's practice", grid:'Grid', mode:'Mode', classic:'Classic', reverse:'Reverse', 
      time:'TIME', next:'PROGRESS', errors:'ERRORS', 
      start:'Start training', resume:'Resume training', pause:'Pause training', again:'Try again', restart:'Restart', focus:'Focus mode',
      accuracy:'Accuracy first. Stay relaxed.', instruction:'Press Start, then find every target in order.',
      stats:'Training stats', bestToday:"Today's best", avgToday:"Today's average", personalBest:'Personal best', avgErrors:'Average errors', total:'Total sessions',
      recent:'Last 7 sessions', emptyChart:'Complete a few sessions to see your progress.', emptyHistory:'Your sessions will appear here.',
      complete:'Well done!', completeKicker:'TRAINING COMPLETE', accuracyLabel:'Accuracy', previous:'Previous', improvement:'Change', dashboard:'Back to dashboard', newBest:'🏆 NEW PERSONAL BEST',
      newBestScoped:(size,modeName)=>`🏆 NEW ${size}×${size} ${modeName.toUpperCase()} RECORD!`,
      sparkTitle:(n)=>`Last ${n} · this grid`,
      trendSame:'Same as first', trendFaster:(pct)=>`${pct}% faster than first`, trendSlower:(pct)=>`${pct}% slower than first`,
      footer:'Training data stays in this browser. Take it one number at a time.', clear:'Clear history',
      first:'First attempt',
      modeHintNum:'Find every number in order', modeHintReverse:'Start with the highest number and work backward',
      taskNum:'Click the numbers in order, starting at 1.', taskReverse:'Click the numbers in reverse, starting at the highest number.',
      confirmClear:'Clear all training history saved on this device?', clearDone:'Training history cleared.',
      themes:['System','Light','Dark'],
      accessibilityGrid:'Schulte training grid', progress:'Training progress', errorsWord:'errors', seconds:'s',
      improvementText:(pct)=>Math.abs(pct)<0.05?'No change':`${pct > 0 ? '↓' : '↑'} ${Math.abs(pct).toFixed(1)}% ${pct > 0 ? 'faster' : 'slower'}`
    }
  };
  const $ = id => document.getElementById(id);
  const ui = {
    lang:$('language-toggle'), settings:$('settings-menu'), sound:$('sound-setting'), haptic:$('haptic-setting'), focusPref:$('focus-setting'), theme:$('theme-setting'),
    size:$('grid-size'), mode:$('training-mode'), challenge:$('challenge-tag'), timer:$('timer'), next:$('next-number'),
    errors:$('error-count'), grid:$('number-grid'), fill:$('progress-fill'), progress:$('progress-track'), hint:$('mode-hint'), instruction:$('table-instruction'),
    start:$('start-button'), startLabel:$('start-label'), restart:$('restart-button'), focusButton:$('focus-button'), focusLabel:$('focus-button-label'), overlay:$('completion-overlay'),
    finalTime:$('final-time'), newBest:$('new-record'), resultAccuracy:$('result-accuracy'), resultErrors:$('result-errors'), previous:$('previous-time'),
    improvement:$('improvement'), best:$('personal-best'),
    todayBest:$('today-best'), todayAverage:$('today-average'), personalStat:$('personal-stat'), averageErrors:$('average-errors'), total:$('total-sessions'),
    sessionCount:$('session-count'), history:$('history-list'), chart:$('progress-chart'), chartEmpty:$('chart-empty'),
    statsScope:$('stats-scope'), sparkBlock:$('sparkline-block'), sparkLabel:$('sparkline-label'), sparkTrend:$('sparkline-trend'), sparkSvg:$('result-sparkline'),
    clear:$('clear-history')
  };

  let language = safeGet('focusgrid-language') || 'zh';
  if (!['zh','en'].includes(language)) language = 'zh';
  let state = { sessions:[], settings:{sound:true,haptic:true,focusMode:false,theme:'system'} };
  let currentSequence = [];
  let cells = [];
  let found = 0;
  let errors = 0;
  let running = false;
  let paused = false;
  let startStamp = 0;
  let elapsed = 0;
  let timerHandle = 0;
  let activeFocus = false;
  let audioContext = null;
  let currentRecord = null;

  function safeGet(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function t(key) { return TEXT[language][key]; }
  function activeSize() { return Number(ui.size.value); }
  function activeMode() { return ui.mode.value; }
  function valueAt(index, mode = activeMode()) { const count=activeSize() ** 2; return String(mode === 'reverse' ? count-index : index+1); }
  function formatTime(ms) {
    const centis = Math.floor(Math.max(0, ms) / 10);
    const minutes = Math.floor(centis / 6000);
    const seconds = Math.floor((centis % 6000) / 100);
    const hundredths = centis % 100;
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(hundredths).padStart(2,'0')}`;
  }
  function formatSeconds(ms) { return `${(Math.max(0,ms) / 1000).toFixed(2)}${t('seconds')}`; }
  function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function challengeKey(item) { const mode=item.mode==='numbers'?'classic':item.mode||'classic'; return `${item.size || 5}:${mode}`; }
  function todaySessions() { const today = dateKey(); return state.sessions.filter(s => s.date === today); }

  /* ---- P0: 训练数据分层存储 ----
   * sessions[] 是唯一真相源（每条含 size / mode / duration）。
   * 这里从它派生出与需求同形状的分层索引：
   *   { "5:classic": { best, last, count, errors, history:[...] }, ... }
   * 派生而非双写，避免 best/last 与明细不一致，也无需数据迁移。
   * scopeKey 统一用 `${size}:${mode}`，与 challengeKey 保持同一口径。 */
  function scopeKey(size, mode) { return `${size}:${mode === 'numbers' ? 'classic' : (mode || 'classic')}`; }
  function activeScopeKey() { return scopeKey(activeSize(), activeMode()); }
  // 返回当前规格+模式下、按时间倒序（最近在前）的所有成绩
  function scopeSessions(key = activeScopeKey()) {
    return state.sessions.filter(s => challengeKey(s) === key)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }
  // 派生单个规格的分层聚合：best=历史最快, last=最近一次, count/errors=累计
  function scopeStats(key = activeScopeKey()) {
    const list = scopeSessions(key);
    if (!list.length) return { best: null, last: null, count: 0, errors: 0, list: [] };
    const best = list.reduce((m, s) => s.duration < m ? s.duration : m, list[0].duration);
    return {
      best,
      last: list[0].duration,
      count: list.length,
      errors: list.reduce((sum, s) => sum + (s.errors || 0), 0),
      list
    };
  }
  // 今日成绩同样限定在当前规格内（侧栏口径统一）
  function todayScopeSessions(key = activeScopeKey()) {
    const today = dateKey();
    return scopeSessions(key).filter(s => s.date === today);
  }

  function loadState() {
    let parsed = null;
    try { parsed = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (_) { parsed = null; }
    if (parsed && Array.isArray(parsed.sessions)) {
      state.sessions = parsed.sessions.filter(validSession);
      state.settings = { ...state.settings, ...(parsed.settings || {}) };
    } else {
      const imports = [];
      try {
        for (let i=0; i<localStorage.length; i+=1) {
          const key = localStorage.key(i);
          if (!key || !LEGACY_PREFIXES.some(prefix => key === prefix || key.startsWith(`${prefix}:`))) continue;
          const old = JSON.parse(localStorage.getItem(key) || '{}');
          if (Array.isArray(old.sessions)) imports.push(...old.sessions.filter(validSession));
        }
      } catch (_) { /* Keep any records that were readable. */ }
      const seen = new Set();
      state.sessions = imports.filter(item => { const id = [item.date,item.duration,item.errors,item.size,item.mode].join('|'); if (seen.has(id)) return false; seen.add(id); return true; });
    }
    state.sessions.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
    applyPreferences(); saveState();
  }

  function validSession(item) {
    if (!item || !Number.isFinite(Number(item.duration)) || Number(item.duration) < 0) return false;
    const size = Number(item.size || item.gridSize || 5);
    return size >= 3 && size <= 7 && Number.isInteger(size);
  }

  function saveState() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); }
    catch (_) { /* The game still works for this tab when storage is unavailable. */ }
  }

  function applyPreferences() {
    ui.sound.checked = state.settings.sound !== false;
    ui.haptic.checked = state.settings.haptic !== false;
    ui.focusPref.checked = state.settings.focusMode === true;
    ui.theme.value = ['system','light','dark'].includes(state.settings.theme) ? state.settings.theme : 'system';
    document.body.dataset.theme = ui.theme.value;
  }

  function savePreferences() {
    state.settings = { sound:ui.sound.checked, haptic:ui.haptic.checked, focusMode:ui.focusPref.checked, theme:ui.theme.value };
    document.body.dataset.theme = ui.theme.value;
    saveState();
    if (running) setFocus(ui.focusPref.checked);
  }

  function updateLanguage() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    ui.lang.textContent = language === 'zh' ? 'English' : '中文';
    const textMap = {
      'top-note':'top','settings-summary':'settings','sound-label':'sound','haptic-label':'haptic','focus-label':'focusSetting','theme-label':'theme',
      'page-title':'title','page-description':'description','today-label':'today','training-subtitle':'subtitle','grid-size-label':'grid','mode-label':'mode',
      'time-label':'time','next-label':'next','errors-label':'errors','stats-title':'stats',
      'today-best-label':'bestToday','today-average-label':'avgToday','personal-stat-label':'personalBest','average-errors-label':'avgErrors',
      'total-sessions-label':'total','recent-title':'recent','chart-empty':'emptyChart','footer-note':'footer',
      'accuracy-label':'accuracyLabel','previous-label':'previous','improvement-label':'improvement','personal-best-label':'personalBest',
      'complete-heading':'complete','clear-history':'clear'
    };
    for (const [id,key] of Object.entries(textMap)) {
      const node = $(id);
      if (node) {
        if (id === 'page-title') node.innerHTML = `${t(key)}<span class="title-dot">.</span>`;
        else node.textContent = t(key);
      }
    }
    $('complete-kicker').textContent = t('completeKicker');
    $('today-label').innerHTML = `${t('today')} <span>· ${language === 'zh' ? "TODAY'S PRACTICE" : '今日训练'}</span>`;
    $('theme-setting').options[0].textContent = `${TEXT[language].themes[0]} · System`;
    $('theme-setting').options[1].textContent = `${TEXT[language].themes[1]} · Light`;
    $('theme-setting').options[2].textContent = `${TEXT[language].themes[2]} · Dark`;
    updateControls(); updateChallengeLabels(); renderStats(); renderHistory(); renderChart();
  }

  function updateControls() {
    ui.startLabel.textContent = running ? t('pause') : paused ? t('resume') : currentRecord ? t('again') : t('start');
    $('restart-label').textContent = t('restart');
    ui.focusLabel.textContent = t('focus');
    $('accuracy-note').lastChild.textContent = ` ${t('accuracy')}`;
    $('try-again').textContent = t('again'); $('back-dashboard').textContent = t('dashboard');
  }

  function updateChallengeLabels() {
    const size=activeSize(), mode=activeMode();
    ui.challenge.textContent = `${size} × ${size} · ${t(mode)}`;
    ui.progress.setAttribute('aria-label',t('progress'));
    ui.hint.textContent = mode === 'reverse' ? t('modeHintReverse') : t('modeHintNum');
    ui.instruction.textContent = mode === 'reverse' ? t('taskReverse') : t('taskNum');
    ui.grid.setAttribute('aria-label', `${t('accessibilityGrid')}, ${size} by ${size}, ${t(mode)}`);
  }

  function setFocus(on) {
    activeFocus = Boolean(on);
    document.body.classList.toggle('focus-mode', activeFocus);
    ui.focusButton.setAttribute('aria-pressed', String(activeFocus));
    if (running && ui.focusPref.checked !== activeFocus) { ui.focusPref.checked = activeFocus; state.settings.focusMode = activeFocus; saveState(); }
  }

  function getSelectedChallenge() {
    return { size:activeSize(), mode:activeMode() };
  }

  function prepareGrid() {
    const challenge = getSelectedChallenge();
    const count = challenge.size ** 2;
    currentSequence = Array.from({length:count},(_,i)=>valueAt(i,challenge.mode));
    const shuffled = [...currentSequence];
    for (let i=shuffled.length-1;i>0;i-=1) { const j=Math.floor(Math.random()*(i+1)); [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]; }
    ui.grid.replaceChildren(); cells = [];
    ui.grid.style.gridTemplateColumns = `repeat(${challenge.size}, minmax(0, 1fr))`;
    ui.grid.style.setProperty('--grid-size', challenge.size);
    for (const value of shuffled) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'number-cell'; button.textContent = value; button.dataset.value = value;
      button.setAttribute('aria-label', `${language === 'zh' ? '目标' : 'Target'} ${value}`); button.disabled = true;
      button.addEventListener('click',()=>clickCell(value,button));
      button.addEventListener('keydown',event=>moveGridFocus(event,button));
      ui.grid.append(button); cells.push(button);
    }
    found = 0; errors = 0; updateProgress();
  }

  function moveGridFocus(event, button) {
    const moves = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-activeSize(),ArrowDown:activeSize()};
    if (!(event.key in moves)) return;
    event.preventDefault();
    const at = cells.indexOf(button); const next = Math.min(cells.length-1,Math.max(0,at+moves[event.key])); cells[next]?.focus();
  }

  function startTraining() {
    if (running) { pauseTraining(); return; }
    if (paused) { running=true; paused=false; startStamp=performance.now(); timerHandle=window.setInterval(tick,35); if (state.settings.focusMode) setFocus(true); updateControls(); cells.forEach(c=>c.disabled=currentSequence.slice(0,found).includes(c.dataset.value)); return; }
    currentRecord = null; elapsed=0; errors=0; found=0; ui.overlay.hidden=true;
    const challenge=getSelectedChallenge();
    updateChallengeLabels(); prepareGrid(); running=true; paused=false; startStamp=performance.now();
    ui.size.disabled=true; ui.mode.disabled=true; cells.forEach(c=>c.disabled=false);
    timerHandle=window.setInterval(tick,35); ui.timer.textContent=formatTime(0);
    if (state.settings.focusMode) setFocus(true);
    updateControls();
  }

  function pauseTraining() {
    elapsed += performance.now()-startStamp; running=false; paused=true; window.clearInterval(timerHandle); timerHandle=0;
    cells.forEach(c=>c.disabled=true); updateTimer(); updateControls();
  }

  function tick() { updateTimer(); }
  function updateTimer() { ui.timer.textContent=formatTime(elapsed+(running?performance.now()-startStamp:0)); }
  function updateProgress() {
    const percent=currentSequence.length ? Math.round(found/currentSequence.length*100) : 0;
    ui.fill.style.width=`${percent}%`; ui.progress.setAttribute('aria-valuenow',String(percent));
    ui.next.textContent=`${found} / ${currentSequence.length}`; ui.errors.textContent=String(errors);
  }

  function clickCell(value,button) {
    if (!running) return;
    if (value !== currentSequence[found]) {
      errors+=1; ui.errors.textContent=String(errors); button.classList.remove('wrong'); void button.offsetWidth; button.classList.add('wrong');
      window.setTimeout(()=>button.classList.remove('wrong'),330); sound('wrong'); vibrate([30,50,30]); return;
    }
    found+=1; button.disabled=true; button.classList.add('found');
    updateProgress(); sound('correct'); vibrate(10);
    if (found===currentSequence.length) finishTraining();
  }

  function sound(type) {
    if (!state.settings.sound) return;
    try {
      const Ctx=window.AudioContext||window.webkitAudioContext; if (!Ctx) return;
      audioContext ||= new Ctx(); if (audioContext.state==='suspended') audioContext.resume();
      const tones=type==='wrong'?[240]:type==='complete'?[523,659,784]:[690];
      tones.forEach((hz,index)=>{
        const osc=audioContext.createOscillator(); const gain=audioContext.createGain(); const start=audioContext.currentTime+index*.10;
        osc.type='sine'; osc.frequency.value=hz; gain.gain.setValueAtTime(.0001,start); gain.gain.exponentialRampToValueAtTime(type==='wrong'?.035:.045,start+.008); gain.gain.exponentialRampToValueAtTime(.0001,start+(type==='complete'?.11:.055));
        osc.connect(gain); gain.connect(audioContext.destination); osc.start(start); osc.stop(start+(type==='complete'?.12:.065));
      });
    } catch (_) { /* Audio is optional and may be blocked by device settings. */ }
  }

  function vibrate(pattern) { if (!state.settings.haptic) return; try { if (typeof navigator.vibrate==='function') navigator.vibrate(pattern); } catch (_) { /* Unsupported devices simply skip haptics. */ } }

  function finishTraining() {
    elapsed+=performance.now()-startStamp; running=false; paused=false; window.clearInterval(timerHandle); timerHandle=0;
    ui.size.disabled=false; ui.mode.disabled=false; updateTimer();
    const challenge=getSelectedChallenge();
    const previousSessions=state.sessions.filter(s=>challengeKey(s)===`${challenge.size}:${challenge.mode}`).sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
    const previous=previousSessions[0]||null; const oldBest=previousSessions.reduce((best,s)=>best===null||s.duration<best?s.duration:best,null);
    const now=new Date(); const record={duration:elapsed,errors,date:dateKey(now),timestamp:now.getTime(),size:challenge.size,mode:challenge.mode};
    currentRecord=record; state.sessions.unshift(record); state.sessions=state.sessions.slice(0,500);
    const isPersonalBest=oldBest===null||elapsed<oldBest;
    saveState();
    const accuracy=Math.round(currentSequence.length/(currentSequence.length+errors)*100);
    ui.finalTime.textContent=formatSeconds(elapsed); ui.resultAccuracy.textContent=`${accuracy}%`; ui.resultErrors.textContent=String(errors);
    ui.previous.textContent=previous?formatSeconds(previous.duration):'—';
    ui.improvement.textContent=previous?TEXT[language].improvementText(((previous.duration-elapsed)/previous.duration)*100):t('first');
    ui.best.textContent=formatSeconds(isPersonalBest?elapsed:oldBest); ui.newBest.hidden=!isPersonalBest;
    // P0: 新纪录提示明确规格与模式，如「🏆 5×5 经典模式 新纪录！」
    const modeName=challenge.mode==='reverse'?(language==='zh'?'逆序':'Reverse'):(language==='zh'?'经典':'Classic');
    ui.newBest.textContent=TEXT[language].newBestScoped(challenge.size,modeName); ui.overlay.hidden=false;
    $('complete-heading').textContent=t('complete'); $('complete-kicker').textContent=t('completeKicker');
    setFocus(false); sound('complete'); vibrate([20,30,20]); updateControls(); renderStats(); renderHistory(); renderChart(); renderSparkline();
  }

  function resetTraining() {
    running=false; paused=false; window.clearInterval(timerHandle); timerHandle=0; elapsed=0; found=0; errors=0; currentRecord=null;
    ui.size.disabled=false; ui.mode.disabled=false; ui.overlay.hidden=true; setFocus(false);
    ui.timer.textContent=formatTime(0); prepareGrid(); updateChallengeLabels(); updateControls();
  }

  function renderStats() {
    const key=activeScopeKey();
    const stats=scopeStats(key);
    const today=todayScopeSessions(key);
    ui.todayBest.textContent=today.length?formatTime(Math.min(...today.map(s=>s.duration))):'—';
    ui.todayAverage.textContent=today.length?formatTime(today.reduce((sum,s)=>sum+s.duration,0)/today.length):'—';
    ui.personalStat.textContent=stats.best===null?'—':formatTime(stats.best);
    ui.averageErrors.textContent=stats.count?(stats.errors/stats.count).toFixed(1):'—';
    ui.total.textContent=String(stats.count);
    ui.sessionCount.textContent=`${stats.count} ${language==='zh'?'次':'sessions'}`;
    // 标题旁标注当前口径，让「个人最佳/总训练」明确指代哪个规格（语言无关，避免中英混排）
    const scopeText=`${activeSize()}×${activeSize()} · ${activeMode()==='reverse'?'REVERSE':'CLASSIC'}`;
    ui.statsScope.textContent=scopeText; ui.statsScope.classList.add('is-scoped');
  }

  function renderHistory() {
    const key=activeScopeKey(); const list=scopeSessions(key);
    ui.history.replaceChildren();
    if(!list.length){const li=document.createElement('li');li.className='empty-history';li.textContent=t('emptyHistory');ui.history.append(li);return;}
    list.slice(0,5).forEach(s=>{
      const li=document.createElement('li');const label=document.createElement('span');
      label.textContent=`${s.size||5}×${s.size||5} · ${s.mode==='reverse'?(language==='zh'?'逆序':'Reverse'):(language==='zh'?'经典':'Classic')} · ${s.date||''}`;
      const result=document.createElement('strong');result.textContent=formatTime(s.duration);
      const error=document.createElement('small');error.textContent=`${s.errors||0} ${language==='zh'?'错':t('errorsWord')}`;
      li.append(label,result,error);ui.history.append(li);
    });
  }

  function svgNode(name,attrs={}) { const node=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,String(value));return node; }
  function renderChart() {
    const svg=ui.chart;svg.replaceChildren();
    // 侧栏图表同样限定当前规格：取该维度最近 7 次，正序（旧→新）绘制趋势
    const recent=scopeSessions(activeScopeKey()).slice(0,7).reverse();ui.chartEmpty.hidden=recent.length>0;
    if(!recent.length)return;
    const W=320,H=138,left=39,right=8,top=12,bottom=25,plotW=W-left-right,plotH=H-top-bottom;
    const vals=recent.map(s=>s.duration/1000);let min=Math.min(...vals),max=Math.max(...vals);if(min===max){min=Math.max(0,min-2);max+=2;}else{const pad=(max-min)*.16;min=Math.max(0,min-pad);max+=pad;}
    for(let i=0;i<4;i+=1){const y=top+plotH*i/3;svg.append(svgNode('line',{x1:left,y1:y,x2:W-right,y2:y,class:'chart-gridline'}));const label=svgNode('text',{x:left-6,y:y+3,'text-anchor':'end',class:'chart-axis-label'});label.textContent=`${(max-(max-min)*i/3).toFixed(0)}s`;svg.append(label);}
    const points=vals.map((v,i)=>({x:recent.length===1?left+plotW/2:left+plotW*i/(recent.length-1),y:top+plotH-(v-min)/(max-min)*plotH}));
    svg.append(svgNode('polyline',{points:points.map(p=>`${p.x},${p.y}`).join(' '),class:'chart-line'}));
    points.forEach((p,i)=>{svg.append(svgNode('circle',{cx:p.x,cy:p.y,r:3.5,class:'chart-point'}));const label=svgNode('text',{x:p.x,y:H-6,'text-anchor':'middle',class:'chart-axis-label'});label.textContent=String(i+1);svg.append(label);});
    const xLabel=svgNode('text',{x:W-6,y:H-6,'text-anchor':'end',class:'chart-axis-title'});xLabel.textContent=language==='zh'?'训练次数 · Attempt':'Attempt';svg.append(xLabel);
    svg.setAttribute('aria-label',`${language==='zh'?'最近训练用时':'Recent completion time'}: ${vals.map(v=>`${v.toFixed(2)} seconds`).join(', ')}`);
  }

  /* ---- P2: 结算页迷你趋势图 (Sparkline) ----
   * 纯内联 SVG，无第三方库。仅展示当前规格+模式最近 5 次用时。
   * 用柱状（越矮越快=越好），最快的一根深蓝高亮，最近一次略强调。
   * 底部给出「比首次快/慢 X%」的文字趋势，直观看进步。 */
  function renderSparkline() {
    const svg=ui.sparkSvg; if(!svg) return;
    svg.replaceChildren();
    // 取当前规格最近 5 次，反转为时间正序（左=较早，右=最近）
    const recent=scopeSessions(activeScopeKey()).slice(0,5).reverse();
    ui.sparkBlock.hidden=recent.length<2;              // 少于 2 次谈不上「趋势」，直接隐藏
    if(recent.length<2) return;

    const n=recent.length;
    const W=260,H=46,padX=8,padTop=12,padBottom=12;
    const plotW=W-padX*2, plotH=H-padTop-padBottom;
    const secs=recent.map(s=>s.duration/1000);
    let max=Math.max(...secs), min=Math.min(...secs);
    if(max===min){ max=max*1.15||1; min=min*0.85; }   // 全相等时给一点余量，避免柱高一致看不出
    const gap=6, barW=(plotW-gap*(n-1))/n;

    // 基线
    svg.append(svgNode('line',{x1:padX,y1:H-padBottom+2,x2:W-padX,y2:H-padBottom+2,class:'spark-baseline'}));

    const best=Math.min(...secs);
    secs.forEach((v,i)=>{
      // 柱高按「相对最大值」比例；用时越短柱越矮。归一化到 [0.25,1] 让最短柱也可见
      const ratio=(v-min)/(max-min||1);
      const barH=Math.max(6, plotH*(0.35+0.65*ratio));  // 慢(ratio大)柱高，快柱矮
      const x=padX+i*(barW+gap);
      const y=H-padBottom-barH;
      const cls=['spark-bar']; if(v===best) cls.push('is-best'); if(i===n-1) cls.push('is-last');
      svg.append(svgNode('rect',{x:x.toFixed(1),y:y.toFixed(1),width:barW.toFixed(1),height:barH.toFixed(1),rx:2,class:cls.join(' ')}));
      // 柱下标用时秒数（保留 1 位，省空间）
      const label=svgNode('text',{x:(x+barW/2).toFixed(1),y:H-2,class:'spark-value'+(i===n-1?' is-last':'')});
      label.textContent=v.toFixed(1); svg.append(label);
    });

    // 文字趋势：最近一次 vs 该窗口内第一次
    const first=secs[0], last=secs[n-1];
    const pct=first? Math.round((first-last)/first*100) : 0;
    ui.sparkLabel.textContent=TEXT[language].sparkTitle(n);
    let trendText, trendCls;
    if(pct>0){ trendText=TEXT[language].trendFaster(pct); trendCls=''; }
    else if(pct<0){ trendText=TEXT[language].trendSlower(Math.abs(pct)); trendCls='is-worse'; }
    else { trendText=TEXT[language].trendSame; trendCls='is-flat'; }
    ui.sparkTrend.textContent=trendText;
    ui.sparkTrend.className=trendCls;
    svg.setAttribute('aria-label',`${ui.sparkLabel.textContent}: ${secs.map(v=>`${v.toFixed(2)}s`).join(', ')}`);
  }

  // 切换规格/模式：重置训练并刷新所有「分层」视图（统计/历史/侧栏图表随口径联动）
  const refreshScope=()=>{renderStats();renderHistory();renderChart();};
  ui.lang.addEventListener('click',()=>{language=language==='zh'?'en':'zh';try{localStorage.setItem('focusgrid-language',language);}catch(_){}updateLanguage();});
  ui.size.addEventListener('change',()=>{resetTraining();updateChallengeLabels();refreshScope();});
  ui.mode.addEventListener('change',()=>{resetTraining();updateChallengeLabels();refreshScope();});
  ui.start.addEventListener('click',startTraining);ui.restart.addEventListener('click',resetTraining);
  ui.focusButton.addEventListener('click',()=>{const next=!activeFocus;setFocus(next);ui.focusPref.checked=next;state.settings.focusMode=next;saveState();});
  $('try-again').addEventListener('click',()=>{resetTraining();startTraining();});
  $('back-dashboard').addEventListener('click',()=>{ui.overlay.hidden=true;currentRecord=null;resetTraining();document.getElementById('dashboard').scrollIntoView({behavior:'smooth',block:'start'});});
  for(const control of [ui.sound,ui.haptic,ui.focusPref,ui.theme])control.addEventListener('change',savePreferences);
  ui.clear.addEventListener('click',()=>{if(!state.sessions.length)return;if(!window.confirm(t('confirmClear')))return;state.sessions=[];saveState();renderStats();renderHistory();renderChart();});
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(ui.theme.value==='system')document.body.dataset.theme='system';});

  loadState();updateLanguage();updateChallengeLabels();prepareGrid();renderStats();renderHistory();renderChart();updateControls();
})();
