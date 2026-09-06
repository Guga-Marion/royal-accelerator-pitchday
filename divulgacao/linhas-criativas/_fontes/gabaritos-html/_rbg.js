/* Injeta o lockup (selo + wordmark) em todo .lock vazio e expõe os parâmetros da URL. */
window.EMB='<svg class="emb" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" stroke="#D4A437" stroke-width="1.6"/><circle cx="50" cy="50" r="39" stroke="#D4A437" stroke-width=".8" opacity=".55"/><path d="M29 60 V51 L38 43 L44 49 L53 38 L59 44 L71 29 V60 Z" stroke="#F0C44D" stroke-width="1.8" stroke-linejoin="round"/><rect x="29" y="63.5" width="42" height="3" rx="1.5" fill="#F0C44D"/></svg>';
window.ROUTE_PTS=[[29,51],[38,43],[44,49],[53,38],[71,29]]; /* 5 etapas sobre o perfil do emblema */
window.route=function(active,w,h){ /* active: índice 0..4 ou -1 (nenhum). Estica só no eixo X; os pontos ficam redondos. */
  var H=42,W=H*w/h,sx=W/52,X=function(x){return ((x-24)*sx).toFixed(2)},Y=function(y){return (y-24).toFixed(2)};
  var raw=[[29,60],[29,51],[38,43],[44,49],[53,38],[59,44],[71,29],[71,60]];
  var d='M'+raw.map(function(p){return X(p[0])+' '+Y(p[1])}).join(' L');
  var dots=active<-1?'':ROUTE_PTS.map(function(p,i){var c=i===active?'on':(active>i?'done':'');return '<circle class="'+c+'" cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="'+(i===active?2.4:1.5)+'"/>'}).join('');
  return '<svg class="route" viewBox="0 0 '+W.toFixed(2)+' '+H+'" width="'+w+'" height="'+h+'"><path d="'+d+'"/><rect class="floor" x="'+X(29)+'" y="'+Y(63.5)+'" width="'+(42*sx).toFixed(2)+'" height="1.4" rx=".7"/>'+dots+'</svg>';
};
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.lock').forEach(function(l){ if(!l.innerHTML.trim()){
    l.innerHTML=EMB+(l.classList.contains('inline')?'<div><span class="lk1">Royal Business</span> <span class="lk2">Growth</span></div>':'<div><div class="lk1">Royal Business</div><div class="lk2">Growth</div></div>'); } });
});
window.P=new URLSearchParams(location.search);
window.p=function(k,d){var v=P.get(k);return v===null?d:v};
window.fill=function(map){for(var k in map){var el=document.querySelector('[data-f="'+k+'"]');if(el)el.innerHTML=map[k]}};
