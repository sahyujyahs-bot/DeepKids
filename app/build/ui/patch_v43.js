/* DeepKids Science is its own subject now (it used to ride inside EVS): move a family's DeepKids topics across once */
function dksMigrate(){if(!S||!S.setup||S.dksMig)return;S.dksMig=1;const mv=o=>{if(!o||!o.sci)return o;const dk=o.sci.filter(k=>String(k).startsWith("dk|"));if(!dk.length)return o;return {...o,sci:o.sci.filter(k=>!String(k).startsWith("dk|")),dks:[...new Set([...(o.dks||[]),...dk])]}};
  S.extra=mv(S.extra);S.next=mv(S.next);S.later=mv(S.later);S.levels={...S.levels,dks:S.levels?.dks||S.levels?.sci||1};
  if(modeOf()!=="books"&&!S.subjects.includes("dks"))S.subjects=[...S.subjects,"dks"];save()}
