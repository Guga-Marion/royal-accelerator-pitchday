/**
 * RBG · Diligência Inicial — backend
 *
 * SETUP (3 passos, ~2 minutos):
 *   1. script.google.com → Novo projeto → apague tudo e cole este arquivo.
 *   2. Troque a SENHA logo abaixo e confira o e-mail em AVISAR.
 *   3. Implantar → Nova implantação → App da Web
 *        Executar como: Eu     ·     Quem pode acessar: Qualquer pessoa
 *      Copie a URL (termina em /exec) e cole em diligencia/config.js
 *
 * Não precisa criar planilha nem pasta: o script cria tudo sozinho no
 * primeiro envio e guarda os endereços. Nada mais para configurar.
 */

// ══════════════════════════ CONFIGURE AQUI ══════════════════════════
var SENHA  = 'RoyalDD2026!';            // senha do painel (usuário é sempre "rbg")
var AVISAR = 'gmarion@deployux.com';    // quem recebe a resposta completa por e-mail
// ════════════════════════════════════════════════════════════════════

var USUARIO = 'rbg';
var COLS = ['protocolo','recebido_em','empresa','responsavel','email','telefone',
            'faturamento_12m','status','anotacao','json'];

// ─────────────────────────── entrada ───────────────────────────
function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    switch (req.acao) {
      case 'login':     return json(login(req));
      case 'submissao': return json(submissao(req));
      case 'arquivo':   return json(arquivo(req));
      case 'finalizar': return json(finalizar(req));
    }
    if (!validaToken(req.token)) return json({ ok:false, erro:'Sessão inválida ou expirada.' });
    switch (req.acao) {
      case 'listar':  return json(listar());
      case 'detalhe': return json(detalhe(req.protocolo));
      case 'status':  return json(gravarStatus(req.protocolo, req.status, req.anotacao));
    }
    return json({ ok:false, erro:'Ação desconhecida: ' + req.acao });
  } catch (err) {
    return json({ ok:false, erro:String(err && err.message || err) });
  }
}

function doGet() { return json({ ok:true, servico:'RBG Diligência', versao:2 }); }

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
                       .setMimeType(ContentService.MimeType.JSON);
}

function props() { return PropertiesService.getScriptProperties(); }

// ─────────────────────────── autenticação ───────────────────────────
function login(req) {
  if (String(req.usuario||'').trim().toLowerCase() !== USUARIO || String(req.senha||'') !== SENHA) {
    Utilities.sleep(700);
    return { ok:false, erro:'Usuário ou senha incorretos.' };
  }
  return { ok:true, token:novoToken() };
}

function segredo() {
  var s = props().getProperty('SEGREDO');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props().setProperty('SEGREDO', s); }
  return s;
}
function assina(t) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(t, segredo()));
}
function novoToken() {
  var corpo = USUARIO + '.' + (Date.now() + 12*60*60*1000);
  return corpo + '.' + assina(corpo);
}
function validaToken(t) {
  var p = String(t||'').split('.');
  return p.length === 3 && assina(p[0]+'.'+p[1]) === p[2] && Number(p[1]) > Date.now();
}

// ─────────────────────────── planilha e pasta ───────────────────────────
function planilha() {
  var id = props().getProperty('PLANILHA_ID'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) {} }
  if (!ss) {
    ss = SpreadsheetApp.create('RBG · Diligência 2026');
    props().setProperty('PLANILHA_ID', ss.getId());
  }
  if (!ss.getSheetByName('Submissoes')) {
    var ab = ss.insertSheet('Submissoes');
    ab.appendRow(COLS);
    ab.getRange(1,1,1,COLS.length).setFontWeight('bold').setBackground('#08132B').setFontColor('#F0C44D');
    ab.setFrozenRows(1);
    ab.hideColumns(COLS.indexOf('json')+1);
  }
  if (!ss.getSheetByName('Arquivos')) {
    var ar = ss.insertSheet('Arquivos');
    ar.appendRow(['protocolo','campo','nome','url','id','recebido_em']);
    ar.getRange(1,1,1,6).setFontWeight('bold').setBackground('#08132B').setFontColor('#F0C44D');
    ar.setFrozenRows(1);
  }
  var p1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Página1');
  if (p1 && ss.getSheets().length > 2) ss.deleteSheet(p1);
  return ss;
}

function pastaRaiz() {
  var id = props().getProperty('PASTA_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder('RBG · Diligência 2026 — Documentos');
  props().setProperty('PASTA_ID', f.getId());
  return f;
}

function pastaDo(proto, empresa) {
  var raiz = pastaRaiz(), nome = proto + (empresa ? ' — ' + empresa : '');
  var it = raiz.getFoldersByName(nome);
  return it.hasNext() ? it.next() : raiz.createFolder(nome);
}

function agora() { return Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm'); }

// ─────────────────────────── gravação ───────────────────────────
function submissao(req) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var d = req.dados || {};
    var proto = String(req.protocolo || ('RBG-' + Date.now()));
    var empresa = d.razao_social || d.nome_comercial || 'Empresa não informada';
    var ab = planilha().getSheetByName('Submissoes');
    var linha = achaLinha(ab, proto);
    var valores = [
      proto, agora(), empresa,
      d.responsavel_nome || '',
      d.responsavel_email || d.email_corp || '',
      d.responsavel_telefone || d.telefone_corp || '',
      d.fat_12m ? 'US$ ' + d.fat_12m : '',
      'Recebida', '',
      JSON.stringify({ dados:d, socios:req.socios||[], resumo:req.resumo||[], agente:req.agente||'' })
    ];
    if (linha) ab.getRange(linha,1,1,COLS.length).setValues([valores]);
    else ab.appendRow(valores);

    if (req.assinatura && req.assinatura.indexOf('base64,') > 0) {
      var pasta = pastaDo(proto, empresa);
      var velhas = pasta.getFilesByName('assinatura.png');
      while (velhas.hasNext()) velhas.next().setTrashed(true);
      pasta.createFile(Utilities.newBlob(
        Utilities.base64Decode(req.assinatura.split('base64,')[1]), 'image/png', 'assinatura.png'));
    }
    return { ok:true, protocolo:proto };
  } finally { lock.releaseLock(); }
}

function arquivo(req) {
  var proto = String(req.protocolo||'');
  var ss = planilha(), ab = ss.getSheetByName('Submissoes');
  var linha = achaLinha(ab, proto);
  var pasta = pastaDo(proto, linha ? ab.getRange(linha,3).getValue() : '');

  var limpo = String(req.nome||'documento').replace(/[\/\\:*?"<>|]/g,'-');
  var nome = req.campo + ' — ' + limpo;
  var velhas = pasta.getFilesByName(nome);
  while (velhas.hasNext()) velhas.next().setTrashed(true);

  var f = pasta.createFile(Utilities.newBlob(
    Utilities.base64Decode(req.b64), req.tipo || 'application/octet-stream', nome));

  ss.getSheetByName('Arquivos').appendRow([proto, req.campo, limpo, f.getUrl(), f.getId(), agora()]);
  return { ok:true, url:f.getUrl() };
}

/** Último passo do envio: manda a resposta completa por e-mail. */
function finalizar(req) {
  var proto = String(req.protocolo||'');
  var ss = planilha(), ab = ss.getSheetByName('Submissoes');
  var linha = achaLinha(ab, proto);
  if (!linha) return { ok:false, erro:'Protocolo não encontrado.' };

  var pacote = {};
  try { pacote = JSON.parse(ab.getRange(linha, COLS.indexOf('json')+1).getValue() || '{}'); } catch (e) {}
  var empresa = ab.getRange(linha,3).getValue();
  var arqs = (arquivosPorProtocolo(ss)[proto] || []);
  var pasta = pastaDo(proto, empresa);

  enviarEmail(proto, empresa, pacote, arqs, pasta.getUrl(), ss.getUrl());
  return { ok:true };
}

function achaLinha(ab, proto) {
  var n = ab.getLastRow();
  if (n < 2) return 0;
  var col = ab.getRange(2,1,n-1,1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]) === proto) return i+2;
  return 0;
}

// ─────────────────────────── e-mail com a resposta inteira ───────────────────────────
function enviarEmail(proto, empresa, pacote, arqs, urlPasta, urlPlanilha) {
  if (!AVISAR) return;
  try {
    var esc = function (s) {
      return String(s==null?'':s).replace(/[&<>]/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; });
    };
    var h = [];
    h.push('<div style="font-family:-apple-system,Segoe UI,Helvetica,sans-serif;color:#0E1730;max-width:660px;margin:0 auto">');
    h.push('<div style="background:#08132B;padding:26px 28px;border-radius:3px 3px 0 0">');
    h.push('<div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#D4A437;margin-bottom:8px">Royal Business Growth</div>');
    h.push('<div style="font-size:26px;color:#F5F2E8">' + esc(empresa) + '</div>');
    h.push('<div style="font-size:12px;color:#6E7CA2;margin-top:6px">Diligência inicial · ' + esc(proto) + ' · ' + agora() + '</div>');
    h.push('</div><div style="border:1px solid #E2D9C4;border-top:0;padding:26px 28px;border-radius:0 0 3px 3px">');

    // documentos
    h.push('<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#A87C18;margin-bottom:10px">Documentos</div>');
    if (arqs.length) {
      h.push('<table style="border-collapse:collapse;width:100%;font-size:13.5px;margin-bottom:8px">');
      arqs.forEach(function (a) {
        h.push('<tr><td style="padding:6px 14px 6px 0;color:#6B7591;white-space:nowrap">' + esc(a.campo) + '</td>' +
               '<td style="padding:6px 0"><a href="' + a.url + '" style="color:#A87C18">' + esc(a.nome) + '</a></td></tr>');
      });
      h.push('</table>');
    } else {
      h.push('<p style="font-size:13.5px;color:#9AA4BD;margin:0 0 8px">Nenhum documento anexado.</p>');
    }
    h.push('<p style="margin:0 0 22px"><a href="' + urlPasta + '" style="font-size:12px;color:#A87C18">Abrir a pasta no Drive &rarr;</a></p>');

    // sócios
    var socios = pacote.socios || [];
    if (socios.length) {
      h.push('<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#A87C18;margin:26px 0 10px;padding-top:18px;border-top:1px solid #EFE8D8">Quadro societário</div>');
      socios.forEach(function (s, i) {
        h.push('<div style="font-size:14px;margin-bottom:6px"><b>' + esc(s.nome || ('Sócio '+(i+1))) +
               '</b> — ' + esc(s.percentual||'—') + '% · ' + esc(s.cargo||'') +
               '<div style="font-size:12px;color:#6B7591">' + esc(s.email||'') + ' · ' + esc(s.telefone||'') + '</div></div>');
      });
    }

    // todas as respostas, seção por seção
    (pacote.resumo || []).forEach(function (sec) {
      if (!sec.itens || !sec.itens.length) return;
      h.push('<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#A87C18;margin:26px 0 10px;padding-top:18px;border-top:1px solid #EFE8D8">' +
             esc(sec.n + ' · ' + sec.t) + '</div>');
      h.push('<table style="border-collapse:collapse;width:100%;font-size:13.5px">');
      sec.itens.forEach(function (it) {
        h.push('<tr><td style="padding:6px 16px 6px 0;color:#6B7591;vertical-align:top;width:42%">' + esc(it.k) + '</td>' +
               '<td style="padding:6px 0;white-space:pre-wrap"><b>' + esc(it.v) + '</b></td></tr>');
      });
      h.push('</table>');
    });

    h.push('<div style="margin-top:30px;padding-top:20px;border-top:1px solid #EFE8D8">');
    h.push('<a href="' + urlPlanilha + '" style="font-size:12px;color:#A87C18">Planilha completa &rarr;</a></div>');
    h.push('</div></div>');

    MailApp.sendEmail({
      to: AVISAR,
      subject: 'RBG · Diligência recebida — ' + empresa,
      htmlBody: h.join('')
    });
  } catch (e) {}
}

// ─────────────────────────── leitura pelo painel ───────────────────────────
function listar() {
  var ss = planilha(), ab = ss.getSheetByName('Submissoes'), n = ab.getLastRow();
  if (n < 2) return { ok:true, itens:[] };
  var arqs = arquivosPorProtocolo(ss);
  var itens = ab.getRange(2,1,n-1,COLS.length).getValues().map(function (r) {
    var o = {};
    COLS.forEach(function (c,i) { o[c] = r[i]; });
    o.recebido_em = String(o.recebido_em);
    var p = {};
    try { p = JSON.parse(o.json||'{}'); } catch (e) {}
    o.dados = p.dados||{}; o.socios = p.socios||[];
    o.arquivos = arqs[o.protocolo]||[];
    delete o.json;
    return o;
  }).reverse();
  return { ok:true, itens:itens };
}

function detalhe(proto) {
  var r = listar();
  var it = r.itens.filter(function (x) { return x.protocolo === proto; })[0];
  return it ? { ok:true, item:it } : { ok:false, erro:'Protocolo não encontrado.' };
}

function arquivosPorProtocolo(ss) {
  var ar = ss.getSheetByName('Arquivos'), n = ar.getLastRow(), m = {};
  if (n < 2) return m;
  ar.getRange(2,1,n-1,6).getValues().forEach(function (r) {
    var p = String(r[0]);
    m[p] = (m[p]||[]).filter(function (x) { return x.campo !== r[1]; });
    m[p].push({ campo:r[1], nome:r[2], url:r[3], id:r[4] });
  });
  return m;
}

function gravarStatus(proto, status, anotacao) {
  var ab = planilha().getSheetByName('Submissoes');
  var linha = achaLinha(ab, proto);
  if (!linha) return { ok:false, erro:'Protocolo não encontrado.' };
  if (status   != null) ab.getRange(linha, COLS.indexOf('status')+1).setValue(status);
  if (anotacao != null) ab.getRange(linha, COLS.indexOf('anotacao')+1).setValue(anotacao);
  return { ok:true };
}

/** Opcional: rode no editor para ver onde a planilha e a pasta foram criadas. */
function ondeEstá() {
  Logger.log('Planilha: ' + planilha().getUrl());
  Logger.log('Pasta:    ' + pastaRaiz().getUrl());
}
