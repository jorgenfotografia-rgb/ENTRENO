(()=>{
  const RESET_MARKER='pitbull-academy-training-reset-2026-09-13-01';
  try{
    if(localStorage.getItem(RESET_MARKER)==='1')return;
    if(typeof resetModule==='function'){
      resetModule();
      localStorage.setItem(RESET_MARKER,'1');
    }
  }catch(e){}
})();
