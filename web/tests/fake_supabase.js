// A tiny in-browser stand-in for supabase-js, covering only the calls platform.js makes.
// State lives in localStorage so a page reload behaves like a real backend.
(function(){
  const K="fake-sb",load=()=>{try{return JSON.parse(localStorage.getItem(K))||{docs:{},shared:{},files:{}}}catch(e){return {docs:{},shared:{},files:{}}}},save=d=>localStorage.setItem(K,JSON.stringify(d));
  const uid="11111111-2222-3333-4444-555555555555";
  function q(table){const st={f:[],op:"select",row:null,lim:1e9};const api={
    select(){return api},eq(c,v){st.f.push([c,v]);return api},order(){return api},limit(n){st.lim=n;return api},
    upsert(row){st.op="upsert";st.row=row;return api},insert(row){st.op="insert";st.row=row;return api},delete(){st.op="delete";return api},
    maybeSingle(){st.single=true;return api},
    then(res,rej){try{res(run())}catch(e){rej(e)}}};
    const T2=table==="content_edits"||table==="editors",pk=table==="editors"?"email":"k";
    function rows(d){if(T2)return Object.values((d.t||{})[table]||{});return table==="docs"?Object.values(d.docs):Object.values(d.shared)}
    function key(r){return T2?r[pk]:table==="docs"?r.path:r.coll+"|"+r.id}
    function run(){const d=load();
      if(T2&&(st.op==="upsert"||st.op==="insert")){const ed=Object.values((d.t||{}).editors||{}).some(e=>e.email===window.DK_TEST.session.user.email);if(table==="content_edits"&&!ed)return {error:{message:"RLS: not an editor"}};d.t=d.t||{};d.t[table]=d.t[table]||{};d.t[table][st.row[pk]]={...st.row};save(d);return {error:null}}
      if(st.op==="upsert"||st.op==="insert"){const r={...st.row};if(table==="docs"){if(!r.path.startsWith("data/users/"+uid+"/"))return {error:{message:"RLS: not your path"}};r.owner=uid;r.updated_at=r.updated_at||new Date().toISOString();d.docs[r.path]=r}else{if(st.op==="insert"&&d.shared[key(r)])return {error:{message:"duplicate"}};r.created_at=new Date().toISOString();d.shared[key(r)]=r}save(d);return {error:null}}
      let R=rows(d).filter(r=>st.f.every(([c,v])=>r[c]===v));
      if(st.op==="delete"){R.forEach(r=>{delete (T2?d.t[table]:table==="docs"?d.docs:d.shared)[key(r)]});save(d);return {error:null}}
      R=R.slice(0,st.lim);return st.single?{data:R[0]||null,error:null}:{data:R,error:null}}
    return api}
  const storage={from(){return {
    async upload(path,blob){if(!path.startsWith(uid+"/"))return {error:{message:"RLS"}};const b64=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(blob)});const d=load();d.files[path]={type:blob.type,size:blob.size,url:b64};save(d);return {data:{path},error:null}},
    async list(){const d=load();return {data:Object.keys(d.files).map(p=>({name:p.split("/").pop(),metadata:{size:d.files[p].size,mimetype:d.files[p].type}}))}},
    async remove(ps){const d=load();ps.forEach(p=>delete d.files[p]);save(d);return {error:null}}}}};
  window.DK_TEST={uid,supabase:{from:q,storage,auth:{getSession:async()=>({data:{session:window.DK_TEST.session}}),onAuthStateChange(){},signOut:async()=>{}}},
    session:{access_token:"test",user:{id:uid,email:"parent@example.in",user_metadata:{full_name:"Sahyujyah P"}}}};
})();
