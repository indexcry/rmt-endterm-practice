(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const screens = ['home','quiz','results'];
  let session = [], index = 0, correct = 0, mistakes = [], locked = false, mode = '';
  const shuffle = arr => { const a = [...arr]; for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  function show(id) { screens.forEach(s => $(s).classList.toggle('hidden',s!==id)); window.scrollTo(0,0); }
  function start(kind) { mode=kind; const pool=kind==='review' ? mistakes : kind==='essentials' ? window.ESSENTIAL_QUESTIONS : window.QUESTIONS; session=shuffle(pool).slice(0,kind==='exam'?30:pool.length); index=0; correct=0; mistakes=[]; show('quiz'); render(); }
  function render() {
    locked=false; const item=session[index]; $('mode-label').textContent=mode==='exam'?'MOCK ENDTERM':mode==='review'?'PRACTICE MISTAKES':mode==='essentials'?'THE CORE 50':'FULL PRACTICE';
    $('progress-text').textContent=`QUESTION ${index+1} OF ${session.length}`; $('score-text').textContent=`${correct} CORRECT`; $('progress-fill').style.width=`${index/session.length*100}%`;
    $('topic').textContent=item.topic.toUpperCase(); $('question-count').textContent=String(index+1).padStart(2,'0')+' / '+String(session.length).padStart(2,'0'); $('question').textContent=item.q;
    $('answers').replaceChildren(); $('feedback').className='feedback hidden'; $('hint').textContent='Select one answer'; $('next').classList.add('hidden');
    shuffle(item.a.map((text,i)=>({text,isCorrect:i===0}))).forEach((option,i)=>{
      const button=document.createElement('button');button.className='answer';const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+i);const label=document.createElement('span');label.textContent=option.text;button.append(letter,label);
      button.addEventListener('click',()=>{if(locked)return;locked=true;document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;if(b.dataset.correct==='true')b.classList.add('correct')});
        if(option.isCorrect){correct++;$('feedback').textContent='Correct — nice work. Source: '+item.source+'.'}else{mistakes.push(item);button.classList.add('incorrect');$('feedback').classList.add('wrong');$('feedback').textContent='Not quite. Correct answer: '+item.a[0]+'. Source: '+item.source+'.';}if(item.excerpt)$('feedback').textContent+=' Original lecture wording: '+item.excerpt;
        $('score-text').textContent=`${correct} CORRECT`;$('feedback').classList.remove('hidden');$('hint').textContent='';$('next').textContent=index===session.length-1?'See results →':'Next question →';$('next').classList.remove('hidden');});
      button.dataset.correct=String(option.isCorrect);$('answers').append(button);
    });
  }
  function finish(){ $('result-score').textContent=Math.round(correct/session.length*100)+'%';$('result-correct').textContent=correct+'/'+session.length;$('result-wrong').textContent=mistakes.length;$('result-summary').textContent='You completed '+session.length+' questions. Review the ones you missed or start a fresh session.';$('review').classList.toggle('hidden',mistakes.length===0);show('results'); }
  document.querySelectorAll('[data-bank-count]').forEach(e=>{e.textContent=window.QUESTIONS.length});document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
  $('next').addEventListener('click',()=>{index++;if(index===session.length)finish();else render()});$('exit').addEventListener('click',()=>show('home'));$('retry').addEventListener('click',()=>show('home'));$('review').addEventListener('click',()=>start('review'));
})();
