/* Today always opens on today: leaving the tab, or the app, resets a day you browsed to */
let hiddenAt=0;
document.addEventListener("visibilitychange",()=>{if(document.hidden){hiddenAt=Date.now();return}if(hiddenAt&&Date.now()-hiddenAt>20000&&ui.tday){ui.tday=null;render()}hiddenAt=0});
