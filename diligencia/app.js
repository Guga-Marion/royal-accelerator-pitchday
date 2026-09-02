/* RBG · Diligência Inicial — motor do formulário */
(function(){
"use strict";

var CFG = window.RBG_CONFIG || {};
var LIM = (CFG.limiteArquivoMB || 18) * 1024 * 1024;
var CHAVE = "rbg-dd-v1";

var dados = {};      // respostas
var arquivos = {};   // {campo: {nome, tipo, b64, tam}}
var socios = [];     // [{...}]
var atual = 0;
var enviado = false;

var $ = function(s,r){return (r||document).querySelector(s)};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc = function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};

/* ─────────────────── util de formato ─────────────────── */
function moeda(v){
  var n = String(v||"").replace(/[^\d]/g,"");
  if(!n) return "";
  return n.replace(/\B(?=(\d{3})+(?!\d))/g,",");
}
function fmtEIN(v){
  var n = String(v||"").replace(/[^\d]/g,"").slice(0,9);
  return n.length > 2 ? n.slice(0,2)+"-"+n.slice(2) : n;
}
function icon(n){
  var m = {
    ck:'<path d="M2 7l3.5 3.5L12 3"/>',
    lock:'<rect x="3" y="7" width="10" height="7" rx="1.4"/><path d="M5.2 7V4.8a2.8 2.8 0 015.6 0V7"/>',
    doc:'<path d="M9 2H4.5A1.5 1.5 0 003 3.5v11A1.5 1.5 0 004.5 16h9a1.5 1.5 0 001.5-1.5V8z"/><path d="M9 2v6h6"/>',
    alert:'<circle cx="8" cy="8" r="6.4"/><path d="M8 5v3.6M8 11h.01"/>'
  };
  return '<svg viewBox="0 0 16 16" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(m[n]||"")+'</svg>';
}

/* ─────────────────── render de campo ─────────────────── */
function campoHTML(c, pre, val){
  pre = pre || "";
  var id = pre + c.k;
  var v  = val != null ? val : (dados[id] || "");
  var w  = c.w ? " w"+c.w : "";
  var dep = c.dep ? ' data-dep="'+esc(pre+c.dep.k)+'" data-dep-v="'+esc(c.dep.v)+'"' : "";
  var lbl = '<label class="lb" for="'+esc(id)+'">'+esc(c.l)
          + (c.req ? ' <span class="rq">*</span>' : "")
          + (c.tag ? ' <span class="tag">'+esc(c.tag)+'</span>' : "")
          + '</label>';
  var h = '<div class="f'+w+' anim" data-k="'+esc(id)+'"'+dep+'>';

  if(c.tipo === "div"){
    return '<div class="div anim"><h3>'+esc(c.l)+'</h3>'
      + (c.hint ? '<p>'+esc(c.hint)+'</p>' : "") + '</div>';
  }

  if(c.tipo !== "arquivo") h += lbl;   // o cartão de upload já mostra o nome

  switch(c.tipo){
    case "area":
      h += '<textarea class="in" id="'+esc(id)+'" placeholder="'+esc(c.ph||"")+'"'
        +  (c.req?' data-req="1"':'')+'>'+esc(v)+'</textarea>';
      break;

    case "money":
      h += '<div class="wrap"><span class="pfx">US$</span>'
        +  '<input class="in" id="'+esc(id)+'" inputmode="numeric" data-mask="money" value="'+esc(v)+'" placeholder="0"'
        +  (c.req?' data-req="1"':'')+'>'
        +  (c.suf?'<span class="sfx">'+esc(c.suf)+'</span>':'')+'</div>';
      break;

    case "pct":
      h += '<div class="wrap"><input class="in" id="'+esc(id)+'" inputmode="decimal" data-mask="pct" value="'+esc(v)+'" placeholder="0"'
        +  (c.req?' data-req="1"':'')+'><span class="sfx">%</span></div>';
      break;

    case "num":
      h += '<input class="in" id="'+esc(id)+'" inputmode="numeric" data-mask="num" value="'+esc(v)+'" placeholder="'+esc(c.ph||"0")+'"'
        +  (c.req?' data-req="1"':'')+'>';
      break;

    case "ssn4":
      h += '<div class="wrap"><span class="pfx">XXX-XX</span>'
        +  '<input class="in" id="'+esc(id)+'" inputmode="numeric" maxlength="4" data-mask="d4" value="'+esc(v)+'" placeholder="0000"'
        +  (c.req?' data-req="1"':'')+'></div>';
      break;

    case "date":
      h += '<input class="in" type="date" id="'+esc(id)+'" value="'+esc(v)+'"'+(c.req?' data-req="1"':'')+'>';
      break;

    case "radio":
      if(c.sel){
        h += '<select class="in" id="'+esc(id)+'"'+(c.req?' data-req="1"':'')+'>'
          +  '<option value="">Selecione…</option>';
        c.op.forEach(function(o){ h += '<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>' });
        h += '</select>';
      } else {
        h += '<div class="ops" data-grp="'+esc(id)+'">';
        c.op.forEach(function(o){
          h += '<label class="op"><input type="radio" name="'+esc(id)+'" value="'+esc(o)+'"'
            +  (v===o?' checked':'')+(c.req?' data-req="1"':'')+'><span class="mk"></span>'+esc(o)+'</label>';
        });
        if(c.outro){
          var eOutro = v && c.op.indexOf(v) < 0;
          h += '<label class="op"><input type="radio" name="'+esc(id)+'" value="__outro"'
            +  (eOutro?' checked':'')+'><span class="mk"></span>Outro</label>';
          h += '</div><input class="in outro-in'+(eOutro?' on':'')+'" data-outro="'+esc(id)+'" placeholder="Qual?" value="'+esc(eOutro?v:"")+'">';
        } else h += '</div>';
      }
      break;

    case "check":
      var arr = Array.isArray(v) ? v : (v ? String(v).split("|") : []);
      var extras = arr.filter(function(x){return c.op.indexOf(x)<0});
      h += '<div class="ops" data-grp="'+esc(id)+'"'+(c.max?' data-max="'+c.max+'"':'')+'>';
      c.op.forEach(function(o){
        h += '<label class="op sq"><input type="checkbox" name="'+esc(id)+'" value="'+esc(o)+'"'
          +  (arr.indexOf(o)>=0?' checked':'')+(c.req?' data-req="1"':'')+'><span class="mk"></span>'+esc(o)+'</label>';
      });
      if(c.outro){
        h += '<label class="op sq"><input type="checkbox" name="'+esc(id)+'" value="__outro"'
          +  (extras.length?' checked':'')+'><span class="mk"></span>Outro</label>';
      }
      h += '</div>';
      if(c.outro) h += '<input class="in outro-in'+(extras.length?' on':'')+'" data-outro="'+esc(id)+'" placeholder="Qual?" value="'+esc(extras.join(", "))+'">';
      if(c.max) h += '<div class="ops-cnt" data-cnt="'+esc(id)+'"><b>'+arr.length+'</b> de '+c.max+' selecionados</div>';
      break;

    case "lista3":
      for(var i=0;i<3;i++){
        h += '<input class="in" id="'+esc(id)+"_"+i+'" style="margin-bottom:9px" placeholder="'
          +  esc((c.ph&&c.ph[i])||("Item "+(i+1)))+'" value="'+esc(dados[id+"_"+i]||"")+'"'
          +  (c.req&&i===0?' data-req="1"':'')+'>';
      }
      break;

    case "arquivo":
      var a = arquivos[id], na = dados[id+"__na"] === "1";
      h += '<div class="drop'+(a?' has':'')+(na?' na':'')+'" data-drop="'+esc(id)+'">'
        +  '<div class="ic">'+icon(a?"ck":"doc")+'</div>'
        +  '<div class="info"><div class="nm">'+esc(c.l)+(c.req?' <span class="rq" style="color:var(--gold-dp)">*</span>':'')+'</div>'
        +  '<div class="st">'+(a ? esc(a.nome)+' · '+(a.tam/1024/1024).toFixed(1)+' MB'
                                 : (na ? 'Marcado como não aplicável' : 'PDF, JPG ou PNG · até '+(LIM/1024/1024)+' MB'))+'</div></div>'
        +  '<div class="act">'
        +  '<label class="na-tog" title="Não existe ou não se aplica"><input type="checkbox" data-na="'+esc(id)+'"'+(na?' checked':'')+'><span class="sw"></span>N/A</label>'
        +  '<button type="button" class="pick" data-pick="'+esc(id)+'">'+(a?'Trocar':'Anexar')+'</button>'
        +  '</div><div class="bar-up"></div>'
        +  '<input type="file" hidden data-file="'+esc(id)+'" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx">'
        +  '</div>';
      if(c.hint) h += '<div class="hint">'+esc(c.hint)+'</div>';
      break;

    case "assinatura":
      h += '<div class="sign" id="sign-box"><canvas id="sign"></canvas>'
        +  '<div class="ln"></div><div class="ph">Assine com o mouse ou o dedo</div>'
        +  '<button type="button" class="clr" id="sign-clr">Limpar</button></div>';
      break;

    case "aceite":
      h = '<div class="f anim" data-k="'+esc(id)+'"><label class="aceite">'
        +  '<input type="checkbox" id="'+esc(id)+'" data-req="1"'+(v==="1"?' checked':'')+'>'
        +  '<span class="mk"></span><p>'+esc(c.l)+'</p></label>'
        +  '<div class="msg">'+icon("alert")+'<span>É preciso aceitar para enviar.</span></div></div>';
      return h;

    default:
      var t = c.tipo === "email" ? "email" : c.tipo === "tel" ? "tel" : c.tipo === "url" ? "url" : "text";
      h += '<input class="in" type="'+t+'" id="'+esc(id)+'" value="'+esc(v)+'" placeholder="'+esc(c.ph||"")+'"'
        +  (c.mask?' data-mask="'+esc(c.mask)+'"':'')+(c.req?' data-req="1"':'')+'>';
  }

  if(c.hint && c.tipo !== "arquivo") h += '<div class="hint">'+esc(c.hint)+'</div>';
  h += '<div class="msg">'+icon("alert")+'<span>Campo obrigatório.</span></div>';
  return h + '</div>';
}

/* ─────────────────── sócios ─────────────────── */
function socioHTML(s, i){
  var h = '<div class="socio" data-socio="'+i+'"><div class="socio-h"><div class="t">'
    + '<span class="n">'+(i+1)+'</span><h4>'+(i===0?'Sócio principal':'Sócio '+(i+1))+'</h4></div>'
    + (i>0 ? '<button type="button" class="rm" data-rm="'+i+'">Remover</button>' : '')
    + '</div><div class="grid">';
  CAMPOS_SOCIO.forEach(function(c){ h += campoHTML(c, "socio"+i+"_", s[c.k]) });
  return h + '</div></div>';
}

function renderSocios(){
  var box = $("#socios-box"); if(!box) return;
  if(!socios.length) socios = [{}];
  var soma = socios.reduce(function(a,s){return a + (parseFloat(String(s.percentual||"").replace(",","."))||0)},0);
  var cls = Math.abs(soma-100) < 0.01 ? "ok" : (soma > 100 ? "no" : "");
  box.innerHTML = socios.map(socioHTML).join("")
    + '<div class="soma '+cls+'"><span>Soma das participações — precisa fechar em 100%</span><b>'
    + (Math.round(soma*100)/100) + '%</b></div>'
    + '<button type="button" class="add" id="add-socio">+ Adicionar sócio</button>';
  ligar(box);
}

function lerSocios(){
  socios = socios.map(function(s,i){
    var o = {};
    CAMPOS_SOCIO.forEach(function(c){
      var el = document.getElementById("socio"+i+"_"+c.k);
      o[c.k] = el ? el.value : (s[c.k]||"");
    });
    return o;
  });
}

/* ─────────────────── montagem ─────────────────── */
function montar(){
  var palco = $("#palco"), steps = $("#steps");
  palco.innerHTML = SECOES.map(function(s,i){
    var corpo = "";
    if(s.id === "socios"){
      corpo = '<div class="lock anim">'+icon("lock")
        + '<span>Os dados pessoais dos sócios, inclusive os quatro dígitos do SSN, são armazenados em pasta restrita '
        + 'e usados apenas na diligência do RBG. Não são compartilhados com terceiros.</span></div>'
        + '<div id="socios-box"></div><div class="grid">'
        + s.campos.filter(function(c){return c.tipo!=="socios"}).map(function(c){return campoHTML(c)}).join("")
        + '</div>';
    } else {
      corpo = '<div class="grid">' + s.campos.map(function(c){return campoHTML(c)}).join("") + '</div>';
    }
    return '<section class="sec'+(i===0?' on':'')+'" data-sec="'+i+'" id="sec-'+s.id+'">'
      + '<div class="sec-h"><span class="eb mono">'+s.n+' · Diligência</span><h2>'+esc(s.t)+'</h2>'
      + '<p>'+esc(s.sub)+'</p><i class="bar"></i></div>' + corpo + '</section>';
  }).join("");

  steps.innerHTML = SECOES.map(function(s,i){
    return '<div class="stp'+(i===0?' on':'')+'" data-go="'+i+'">'
      + '<span class="dot"><span>'+s.n+'</span>'+icon("ck")+'</span>'
      + '<span class="lb">'+esc(s.t)+'</span></div>';
  }).join("");

  renderSocios();
  ligar(palco);
  deps();
  stagger();
}

/* atraso escalonado na entrada dos campos */
function stagger(){
  var sec = $(".sec.on"); if(!sec) return;
  $$(".anim", sec).forEach(function(el,i){
    el.style.animationDelay = Math.min(i*38, 480) + "ms";
  });
}

/* ─────────────────── eventos ─────────────────── */
function ligar(raiz){
  $$("input,textarea,select", raiz).forEach(function(el){
    if(el.__lig) return; el.__lig = 1;

    if(el.dataset.mask){
      el.addEventListener("input", function(){
        var p = el.selectionStart, antes = el.value.length;
        if(el.dataset.mask==="money") el.value = moeda(el.value);
        else if(el.dataset.mask==="ein") el.value = fmtEIN(el.value);
        else if(el.dataset.mask==="num") el.value = el.value.replace(/[^\d]/g,"");
        else if(el.dataset.mask==="d4") el.value = el.value.replace(/[^\d]/g,"").slice(0,4);
        else if(el.dataset.mask==="pct"){
          el.value = el.value.replace(/[^\d.,]/g,"").replace(",",".");
          if(parseFloat(el.value) > 100) el.value = "100";
        }
        if(el.selectionStart != null) try{ el.setSelectionRange(p + (el.value.length-antes), p + (el.value.length-antes)) }catch(e){}
      });
    }

    el.addEventListener("input", agendarSave);
    el.addEventListener("change", function(){
      agendarSave(); deps();
      var g = el.closest("[data-grp]");
      if(g) limites(g);
      if(el.type==="radio" || el.type==="checkbox"){
        var alvo = $('[data-outro="'+(el.name||"")+'"]');
        if(alvo){
          var mostra = el.name && $$('input[name="'+CSS.escape(el.name)+'"]:checked').some(function(x){return x.value==="__outro"});
          alvo.classList.toggle("on", !!mostra);
          if(mostra) setTimeout(function(){alvo.focus()},60);
        }
      }
      if(el.id && el.id.indexOf("socio")===0 && el.id.indexOf("_percentual")>0){ lerSocios(); renderSocios(); }
    });
    el.addEventListener("blur", function(){ if(el.dataset.req) valida(el) });
    el.addEventListener("focus", function(){
      var f = el.closest(".f"); if(f) $(".msg",f) && $(".msg",f).classList.remove("on");
      el.classList.remove("bad");
    });
  });

  $$("[data-pick]", raiz).forEach(function(b){
    if(b.__lig) return; b.__lig=1;
    b.addEventListener("click", function(){ $('[data-file="'+b.dataset.pick+'"]').click() });
  });
  $$("[data-file]", raiz).forEach(function(inp){
    if(inp.__lig) return; inp.__lig=1;
    inp.addEventListener("change", function(){ if(inp.files[0]) lerArquivo(inp.dataset.file, inp.files[0]) });
  });
  $$("[data-na]", raiz).forEach(function(cb){
    if(cb.__lig) return; cb.__lig=1;
    cb.addEventListener("change", function(){
      var k = cb.dataset.na;
      dados[k+"__na"] = cb.checked ? "1" : "";
      if(cb.checked){ delete arquivos[k]; }
      var d = $('[data-drop="'+k+'"]');
      d.classList.toggle("na", cb.checked);
      if(cb.checked){ d.classList.remove("has"); $(".ic",d).innerHTML = icon("doc");
        $(".st",d).textContent = "Marcado como não aplicável"; $(".pick",d).textContent = "Anexar"; }
      else $(".st",d).textContent = "PDF, JPG ou PNG · até "+(LIM/1024/1024)+" MB";
      salvar();
    });
  });
  $$("[data-drop]", raiz).forEach(function(d){
    if(d.__dnd) return; d.__dnd=1;
    ["dragenter","dragover"].forEach(function(ev){
      d.addEventListener(ev,function(e){e.preventDefault();d.classList.add("over")});
    });
    ["dragleave","drop"].forEach(function(ev){
      d.addEventListener(ev,function(e){e.preventDefault();d.classList.remove("over")});
    });
    d.addEventListener("drop",function(e){
      var f = e.dataTransfer.files[0]; if(f) lerArquivo(d.dataset.drop, f);
    });
  });

  var add = $("#add-socio", raiz);
  if(add && !add.__lig){ add.__lig=1; add.addEventListener("click", function(){
    lerSocios(); socios.push({}); renderSocios(); salvar();
    setTimeout(function(){
      var els = $$(".socio"); var ul = els[els.length-1];
      ul && ul.scrollIntoView({behavior:"smooth",block:"center"});
      var pr = $(".in", ul); pr && pr.focus();
    }, 80);
  })}
  $$("[data-rm]", raiz).forEach(function(b){
    if(b.__lig) return; b.__lig=1;
    b.addEventListener("click", function(){
      lerSocios(); socios.splice(+b.dataset.rm,1); renderSocios(); salvar();
    });
  });
}

function limites(g){
  var max = +g.dataset.max; if(!max) return;
  var ins = $$('input',g), sel = ins.filter(function(i){return i.checked});
  ins.forEach(function(i){ i.disabled = !i.checked && sel.length >= max });
  var c = $('[data-cnt="'+g.dataset.grp+'"]');
  if(c) c.innerHTML = '<b>'+sel.length+'</b> de '+max+' selecionados';
}

function deps(){
  $$("[data-dep]").forEach(function(f){
    var k = f.dataset.dep, v = f.dataset.depV, atualV = "";
    var r = $$('input[name="'+CSS.escape(k)+'"]:checked');
    if(r.length) atualV = r[0].value;
    else { var e = document.getElementById(k); if(e) atualV = e.value }
    f.classList.toggle("on", atualV === v);
  });
}

/* ─────────────────── arquivos ─────────────────── */
function lerArquivo(k, file){
  if(file.size > LIM){ toast("Arquivo maior que "+(LIM/1024/1024)+" MB. Comprima ou envie por e-mail.", 1); return }
  var d = $('[data-drop="'+k+'"]'), bar = $(".bar-up", d);
  var fr = new FileReader();
  fr.onprogress = function(e){ if(e.lengthComputable) bar.style.width = (e.loaded/e.total*100)+"%" };
  fr.onload = function(){
    arquivos[k] = { nome:file.name, tipo:file.type||"application/octet-stream",
                    tam:file.size, b64:String(fr.result).split(",")[1] };
    bar.style.width = "100%";
    setTimeout(function(){ bar.style.width = "0" }, 400);
    d.classList.add("has"); d.classList.remove("na");
    var na = $('[data-na="'+k+'"]'); if(na){ na.checked = false; dados[k+"__na"] = "" }
    $(".ic",d).innerHTML = icon("ck");
    $(".st",d).textContent = file.name + " · " + (file.size/1024/1024).toFixed(1) + " MB";
    $(".pick",d).textContent = "Trocar";
    salvar();
  };
  fr.onerror = function(){ toast("Não consegui ler esse arquivo.", 1) };
  fr.readAsDataURL(file);
}

/* ─────────────────── assinatura ─────────────────── */
var assinatura = "";
function initSign(){
  var cv = $("#sign"); if(!cv || cv.__init) return; cv.__init = 1;
  var box = $("#sign-box"), ctx = cv.getContext("2d"), desenhando = false, tocou = false;
  function tam(){
    var r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio||1;
    var img = tocou ? cv.toDataURL() : null;
    cv.width = r.width*dpr; cv.height = r.height*dpr;
    ctx.scale(dpr,dpr); ctx.lineWidth = 1.9; ctx.lineCap="round"; ctx.lineJoin="round";
    ctx.strokeStyle = "#0E1730";
    if(img){ var im = new Image(); im.onload=function(){ctx.drawImage(im,0,0,r.width,r.height)}; im.src=img }
  }
  tam(); window.addEventListener("resize", tam);
  function pos(e){
    var r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e;
    return [t.clientX-r.left, t.clientY-r.top];
  }
  function ini(e){ e.preventDefault(); desenhando=true; var p=pos(e); ctx.beginPath(); ctx.moveTo(p[0],p[1]) }
  function mov(e){ if(!desenhando)return; e.preventDefault(); var p=pos(e); ctx.lineTo(p[0],p[1]); ctx.stroke();
    if(!tocou){ tocou=true; box.classList.add("has") } }
  function fim(){ if(!desenhando)return; desenhando=false; if(tocou){ assinatura = cv.toDataURL("image/png"); salvar() } }
  ["mousedown","touchstart"].forEach(function(v){cv.addEventListener(v,ini,{passive:false})});
  ["mousemove","touchmove"].forEach(function(v){cv.addEventListener(v,mov,{passive:false})});
  ["mouseup","mouseleave","touchend","touchcancel"].forEach(function(v){cv.addEventListener(v,fim)});
  $("#sign-clr").addEventListener("click", function(){
    ctx.clearRect(0,0,cv.width,cv.height); tocou=false; assinatura=""; box.classList.remove("has"); salvar();
  });
  if(assinatura){ var im=new Image(); im.onload=function(){
    var r=cv.getBoundingClientRect(); ctx.drawImage(im,0,0,r.width,r.height); tocou=true; box.classList.add("has");
  }; im.src=assinatura }
}

/* ─────────────────── validação ─────────────────── */
/* documentos obrigatórios que não foram anexados nem marcados como N/A */
function docsPendentes(i){
  var s = SECOES[i];
  if(!s || s.id !== "documentos") return [];
  return s.campos.filter(function(c){
    return c.tipo === "arquivo" && c.req && !arquivos[c.k] && dados[c.k+"__na"] !== "1";
  });
}

function valida(el){
  var f = el.closest(".f"); if(!f) return true;
  if(f.hasAttribute("data-dep") && !f.classList.contains("on")) return true;
  var ok = true, msg = "Campo obrigatório.";
  if(el.type==="radio" || el.type==="checkbox"){
    ok = $$('input[name="'+CSS.escape(el.name)+'"]:checked').length > 0;
    msg = "Escolha uma opção.";
  } else {
    ok = String(el.value||"").trim() !== "";
    if(ok && el.type==="email" && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(el.value)){ ok=false; msg="E-mail inválido." }
    if(ok && el.dataset.mask==="ein" && el.value.replace(/\D/g,"").length !== 9){ ok=false; msg="O EIN tem 9 dígitos." }
    if(ok && el.dataset.mask==="d4" && el.value.length !== 4){ ok=false; msg="Informe os 4 dígitos." }
  }
  var m = $(".msg", f);
  if(m){ $("span", m).textContent = msg; m.classList.toggle("on", !ok) }
  if(el.type!=="radio" && el.type!=="checkbox") el.classList.toggle("bad", !ok);
  return ok;
}

function validaSecao(i){
  var sec = $('[data-sec="'+i+'"]'); if(!sec) return true;
  var vistos = {}, ok = true, primeiro = null;
  $$('[data-req]', sec).forEach(function(el){
    if(el.type==="radio" || el.type==="checkbox"){
      if(vistos[el.name]) return; vistos[el.name] = 1;
    }
    if(!valida(el) && ok){ ok = false; primeiro = el }
    else if(!valida(el) && !primeiro) primeiro = el;
  });
  if(SECOES[i].id === "socios"){
    lerSocios();
    var soma = socios.reduce(function(a,s){return a+(parseFloat(String(s.percentual||"").replace(",","."))||0)},0);
    if(Math.abs(soma-100) > 0.01){
      toast("A soma das participações está em "+(Math.round(soma*100)/100)+"%. Precisa fechar em 100%.", 1);
      ok = false;
    }
  }
  if(SECOES[i].id === "declaracao" && !assinatura){
    toast("Falta a assinatura.", 1); ok = false;
  }
  var pend = docsPendentes(i);
  if(pend.length){
    toast("Faltam documentos obrigatórios: " + pend.map(function(c){return c.l}).join(", ")
        + ". Anexe ou marque N/A se não existir.", 1);
    ok = false;
    var d0 = $('[data-drop="'+pend[0].k+'"]');
    if(d0) d0.scrollIntoView({behavior:"smooth", block:"center"});
  }
  if(!ok && primeiro){
    var f = primeiro.closest(".f") || primeiro.closest(".socio");
    if(f) f.scrollIntoView({behavior:"smooth", block:"center"});
    setTimeout(function(){ try{primeiro.focus({preventScroll:true})}catch(e){} }, 350);
  }
  return ok;
}

function completa(i){
  var sec = $('[data-sec="'+i+'"]'); if(!sec) return false;
  var vistos = {}, ok = true;
  $$('[data-req]', sec).forEach(function(el){
    if(!ok) return;
    var f = el.closest(".f");
    if(f && f.hasAttribute("data-dep") && !f.classList.contains("on")) return;
    if(el.type==="radio" || el.type==="checkbox"){
      if(vistos[el.name]) return; vistos[el.name]=1;
      if(!$$('input[name="'+CSS.escape(el.name)+'"]:checked').length) ok = false;
    } else if(!String(el.value||"").trim()) ok = false;
  });
  if(SECOES[i].id==="declaracao" && !assinatura) ok = false;
  if(docsPendentes(i).length) ok = false;
  return ok;
}

/* ─────────────────── navegação ─────────────────── */
function ir(i, checar){
  if(i === atual) return;
  if(checar && i > atual){
    for(var j=atual; j<i; j++) if(!validaSecao(j)){ ir(j, false); return }
  }
  lerSocios();
  $$(".sec").forEach(function(s){ s.classList.remove("on") });
  $('[data-sec="'+i+'"]').classList.add("on");
  atual = i;
  $$(".stp").forEach(function(s,k){
    s.classList.toggle("on", k===i);
    s.classList.toggle("done", k!==i && completa(k));
  });
  var passo = $$(".stp")[i];
  if(passo) passo.scrollIntoView({block:"nearest", inline:"center", behavior:"smooth"});
  window.scrollTo({top:0, behavior:"smooth"});
  atualizaNav(); progresso(); stagger(); deps();
  if(SECOES[i].id === "declaracao") setTimeout(initSign, 60);
  $$("[data-grp][data-max]").forEach(limites);
  salvar();
}

function atualizaNav(){
  var ult = atual === SECOES.length-1;
  $("#prev").style.visibility = atual === 0 ? "hidden" : "visible";
  $("#next").innerHTML = ult ? 'Enviar diligência <span style="font-size:14px;line-height:0">&rarr;</span>'
                             : 'Continuar <span style="font-size:14px;line-height:0">&rarr;</span>';
  $("#nav-st").innerHTML = 'Etapa <b>'+(atual+1)+'</b> de <b>'+SECOES.length+'</b> &nbsp;·&nbsp; '+esc(SECOES[atual].t);
}

function progresso(){
  var n = 0;
  for(var i=0;i<SECOES.length;i++) if(completa(i)) n++;
  var p = Math.round(n/SECOES.length*100);
  var C = 2*Math.PI*20;
  $("#ring-fg").style.strokeDasharray = C;
  $("#ring-fg").style.strokeDashoffset = C*(1-p/100);
  $("#ring-n").textContent = p;
  var falta = Math.max(1, Math.round((SECOES.length-n)*2.2));
  $("#prog-t").innerHTML = '<b>'+n+' de '+SECOES.length+' etapas</b>' + (n===SECOES.length ? 'Tudo pronto para enviar' : '~'+falta+' min restantes');
}

/* ─────────────────── persistência local ─────────────────── */
var tmr;
function agendarSave(){ clearTimeout(tmr); pulso(); tmr = setTimeout(salvar, 700) }
function pulso(){ var s = $("#save"); s.classList.add("pulse"); $("#save-t").textContent = "Salvando…" }

function coletar(){
  var d = {};
  $$("#palco input,#palco textarea,#palco select").forEach(function(el){
    if(!el.id && !el.name) return;
    if(el.type==="radio"){ if(el.checked) d[el.name] = el.value }
    else if(el.type==="checkbox"){
      if(el.dataset.na != null) return;
      if(el.name){ d[el.name] = d[el.name] || []; if(el.checked) d[el.name].push(el.value) }
      else if(el.id) d[el.id] = el.checked ? "1" : "";
    }
    else if(el.id && !el.dataset.outro) d[el.id] = el.value;
  });
  $$("[data-outro]").forEach(function(el){
    var k = el.dataset.outro, v = d[k];
    if(Array.isArray(v)){
      var i = v.indexOf("__outro");
      if(i>=0){ v.splice(i,1); if(el.value.trim()) v.push(el.value.trim()) }
    } else if(v === "__outro") d[k] = el.value.trim();
  });
  Object.keys(d).forEach(function(k){ if(Array.isArray(d[k])) d[k] = d[k].join(" | ") });
  Object.keys(dados).forEach(function(k){ if(/__na$/.test(k)) d[k] = dados[k] });
  return d;
}

function salvar(){
  lerSocios();
  dados = coletar();
  try{
    localStorage.setItem(CHAVE, JSON.stringify({
      dados:dados, socios:socios, atual:atual, assinatura:assinatura,
      arquivos:Object.keys(arquivos).reduce(function(a,k){
        a[k] = {nome:arquivos[k].nome, tam:arquivos[k].tam, tipo:arquivos[k].tipo}; return a
      },{}),
      quando:new Date().toISOString()
    }));
  }catch(e){}
  var s = $("#save");
  s.classList.remove("pulse");
  $("#save-t").textContent = "Salvo neste navegador";
  progresso();
  $$(".stp").forEach(function(el,k){ el.classList.toggle("done", k!==atual && completa(k)) });
}

function restaurar(){
  try{
    var r = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if(!r) return false;
    dados = r.dados || {}; socios = r.socios || []; assinatura = r.assinatura || "";
    return Object.keys(dados).length > 3 ? r : false;
  }catch(e){ return false }
}

/* ─────────────────── envio ─────────────────── */
function envia(){
  if(enviado) return;
  for(var i=0;i<SECOES.length;i++){
    if(!validaSecao(i)){ ir(i,false); toast("Faltam campos na etapa "+SECOES[i].n+" — "+SECOES[i].t, 1); return }
  }
  if(!CFG.endpoint || CFG.endpoint.indexOf("script.google.com") < 0){
    toast("O endereço de recebimento ainda não foi configurado em config.js.", 1); return;
  }
  salvar();
  enviado = true;
  var load = $("#load"), pb = $("#load-pb"), txt = $("#load-t");
  load.classList.add("on");

  var ks = Object.keys(arquivos);
  var total = 1 + ks.length, feito = 0;
  var proto = "RBG-" + (CFG.ano||"2026") + "-" + Math.random().toString(36).slice(2,7).toUpperCase();

  function passo(){ feito++; pb.style.width = (feito/total*100)+"%" }

  function post(payload){
    return fetch(CFG.endpoint, {
      method:"POST", mode:"cors", redirect:"follow",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    }).then(function(r){ return r.json() }).then(function(j){
      if(!j || !j.ok) throw new Error((j && j.erro) || "Falha no servidor");
      return j;
    });
  }

  txt.textContent = "Registrando as respostas…";
  post({ acao:"submissao", protocolo:proto, dados:dados, socios:socios,
         assinatura:assinatura, agente:navigator.userAgent })
  .then(function(){
    passo();
    return ks.reduce(function(cad, k, idx){
      return cad.then(function(){
        txt.textContent = "Enviando documento " + (idx+1) + " de " + ks.length + "…";
        return post({ acao:"arquivo", protocolo:proto, campo:k,
                      nome:arquivos[k].nome, tipo:arquivos[k].tipo, b64:arquivos[k].b64 })
               .then(passo);
      });
    }, Promise.resolve());
  })
  .then(function(){
    txt.textContent = "Concluído.";
    try{ localStorage.removeItem(CHAVE) }catch(e){}
    setTimeout(function(){
      load.classList.remove("on");
      $("#proto-n").textContent = proto;
      $("#fim").classList.add("on");
      faiscas();
    }, 500);
  })
  .catch(function(e){
    enviado = false;
    load.classList.remove("on");
    toast("Não consegui enviar: " + (e.message||"erro de rede") + ". Tente de novo — nada foi perdido.", 1);
  });
}

/* ─────────────────── enfeites ─────────────────── */
function toast(msg, erro){
  var t = $("#toast");
  $("#toast-t").textContent = msg;
  t.classList.toggle("err", !!erro);
  t.classList.add("on");
  clearTimeout(t.__t);
  t.__t = setTimeout(function(){ t.classList.remove("on") }, erro ? 6000 : 3200);
}

function faiscas(){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var cores = ["#F0C44D","#D4A437","#C2922A","#F5F2E8"];
  for(var i=0;i<70;i++)(function(i){
    setTimeout(function(){
      var s = document.createElement("i");
      s.className = "spark";
      s.style.background = cores[i%4];
      s.style.left = (48+Math.random()*4) + "vw";
      s.style.top = "42vh";
      s.style.opacity = "1";
      document.body.appendChild(s);
      var ang = Math.random()*Math.PI*2, d = 120 + Math.random()*380;
      s.animate([
        {transform:"translate(0,0) scale(1)", opacity:1},
        {transform:"translate("+Math.cos(ang)*d+"px,"+(Math.sin(ang)*d+260)+"px) scale(0)", opacity:0}
      ], {duration:1400+Math.random()*900, easing:"cubic-bezier(.2,.6,.3,1)"})
      .onfinish = function(){ s.remove() };
    }, i*11);
  })(i);
}

/* ─────────────────── início ─────────────────── */
function iniciar(){
  montar();

  var q = new URLSearchParams(location.search);
  var nome = q.get("e");
  if(nome){
    var bonito = nome.charAt(0).toUpperCase() + nome.slice(1);
    $("#capa-nome").textContent = bonito + ",";
    $("#capa-nome").style.display = "block";
  }

  var salvo = restaurar();
  if(salvo){
    $("#capa-cta").textContent = "Continuar de onde parei";
    $("#capa-retomar").style.display = "block";
    montar();
    Object.keys(salvo.arquivos||{}).forEach(function(k){
      var d = $('[data-drop="'+k+'"]');
      if(d){ $(".st",d).innerHTML = '<span style="color:var(--gold-dp)">'+esc(salvo.arquivos[k].nome)+' — anexe de novo, o arquivo não fica salvo no navegador</span>' }
    });
    deps(); $$("[data-grp][data-max]").forEach(limites); progresso();
  }

  $("#capa-cta").addEventListener("click", function(){
    $("#capa").classList.add("off");
    if(salvo && salvo.atual) ir(salvo.atual, false);
    setTimeout(stagger, 60);
  });
  $("#next").addEventListener("click", function(){
    if(atual === SECOES.length-1){ if(validaSecao(atual)) envia() }
    else if(validaSecao(atual)) ir(atual+1, false);
  });
  $("#prev").addEventListener("click", function(){ if(atual>0) ir(atual-1, false) });
  $("#steps").addEventListener("click", function(e){
    var s = e.target.closest("[data-go]"); if(s) ir(+s.dataset.go, true);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Enter" && (e.metaKey || e.ctrlKey)){ e.preventDefault(); $("#next").click() }
  });
  window.addEventListener("beforeunload", function(e){
    if(!enviado && Object.keys(dados).length > 3){ e.preventDefault(); e.returnValue = "" }
  });

  atualizaNav(); progresso();
}

document.addEventListener("DOMContentLoaded", iniciar);
})();
