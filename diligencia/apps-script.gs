/**
 * RBG · Diligência Inicial — backend
 * Cole este arquivo inteiro em script.google.com e publique como Web App.
 * Instruções completas em README.md.
 */

// ══════════════════════════ CONFIGURE AQUI ══════════════════════════
var CONFIG = {
  // Login do painel (painel.html). Troque a senha antes de usar de verdade.
  USUARIO: 'rbg',
  SENHA:   'RoyalDD2026!',

  // Segredo usado para assinar o token de sessão. Troque por qualquer string longa.
  SEGREDO: 'troque-esta-frase-por-algo-longo-e-aleatorio-4f9a2c',

  // Deixe vazio que o script cria tudo sozinho na primeira submissão.
  // Depois de criado, cole aqui o ID para garantir que nunca mude de lugar.
  PLANILHA_ID: '',
  PASTA_ID:    '',

  NOME_PLANILHA: 'RBG · Diligência 2026',
  NOME_PASTA:    'RBG · Diligência 2026 — Documentos',

  // Quem recebe o aviso por e-mail a cada submissão. Vazio = não envia.
  AVISAR: 'gmarion@deployux.com',

  // Domínio do formulário, usado só no corpo do e-mail.
  SITE: 'https://guga-marion.github.io/royal-accelerator-pitchday/diligencia/'
};
// ════════════════════════════════════════════════════════════════════

var COLS = ['protocolo','recebido_em','empresa','responsavel','email','telefone',
            'faturamento_12m','status','anotacao','json'];

// ─────────────────────────── entrada ───────────────────────────
function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    var acao = req.acao;

    if (acao === 'login')      return json(login(req));
    if (acao === 'submissao')  return json(submissao(req));
    if (acao === 'arquivo')    return json(arquivo(req));

    // daqui pra baixo, tudo exige token
    if (!validaToken(req.token)) return json({ ok:false, erro:'Sessão inválida ou expirada.' });

    if (acao === 'listar')  return json(listar());
    if (acao === 'detalhe') return json(detalhe(req.protocolo));
    if (acao === 'status')  return json(gravarStatus(req.protocolo, req.status, req.anotacao));

    return json({ ok:false, erro:'Ação desconhecida: ' + acao });
  } catch (err) {
    return json({ ok:false, erro:String(err && err.message || err) });
  }
}

function doGet() {
  return json({ ok:true, servico:'RBG Diligência', versao:1 });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────── autenticação ───────────────────────────
function login(req) {
  var u = String(req.usuario || '').trim().toLowerCase();
  var s = String(req.senha || '');
  if (u !== CONFIG.USUARIO.toLowerCase() || s !== CONFIG.SENHA) {
    Utilities.sleep(700); // desestimula força bruta
    return { ok:false, erro:'Usuário ou senha incorretos.' };
  }
  return { ok:true, token:novoToken() };
}

function novoToken() {
  var exp = Date.now() + 12 * 60 * 60 * 1000; // 12 horas
  var corpo = CONFIG.USUARIO + '.' + exp;
  return corpo + '.' + assina(corpo);
}

function assina(txt) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(txt, CONFIG.SEGREDO));
}

function validaToken(t) {
  if (!t) return false;
  var p = String(t).split('.');
  if (p.length !== 3) return false;
  if (assina(p[0] + '.' + p[1]) !== p[2]) return false;
  return Number(p[1]) > Date.now();
}

// ─────────────────────────── planilha e pasta ───────────────────────────
function planilha() {
  var props = PropertiesService.getScriptProperties();
  var id = CONFIG.PLANILHA_ID || props.getProperty('PLANILHA_ID');
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.NOME_PLANILHA);
    props.setProperty('PLANILHA_ID', ss.getId());
  }
  var ab = ss.getSheetByName('Submissoes');
  if (!ab) {
    ab = ss.insertSheet('Submissoes');
    ab.appendRow(COLS);
    ab.getRange(1, 1, 1, COLS.length).setFontWeight('bold').setBackground('#08132B').setFontColor('#F0C44D');
    ab.setFrozenRows(1);
    ab.hideColumns(COLS.indexOf('json') + 1);
  }
  var ar = ss.getSheetByName('Arquivos');
  if (!ar) {
    ar = ss.insertSheet('Arquivos');
    ar.appendRow(['protocolo','campo','nome','url','id','recebido_em']);
    ar.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#08132B').setFontColor('#F0C44D');
    ar.setFrozenRows(1);
  }
  var p1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Página1');
  if (p1 && ss.getSheets().length > 2) ss.deleteSheet(p1);
  return ss;
}

function pastaRaiz() {
  var props = PropertiesService.getScriptProperties();
  var id = CONFIG.PASTA_ID || props.getProperty('PASTA_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder(CONFIG.NOME_PASTA);
  props.setProperty('PASTA_ID', f.getId());
  return f;
}

function pastaDo(protocolo, empresa) {
  var raiz = pastaRaiz();
  var nome = protocolo + (empresa ? ' — ' + empresa : '');
  var it = raiz.getFoldersByName(nome);
  return it.hasNext() ? it.next() : raiz.createFolder(nome);
}

// ─────────────────────────── submissão ───────────────────────────
function submissao(req) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var d = req.dados || {};
    var proto = String(req.protocolo || ('RBG-' + Date.now()));
    var empresa = d.razao_social || d.nome_comercial || 'Empresa não informada';
    var ss = planilha();
    var ab = ss.getSheetByName('Submissoes');

    // idempotência: se o protocolo já existe, atualiza em vez de duplicar
    var linha = achaLinha(ab, proto);
    var pacote = JSON.stringify({ dados:d, socios:req.socios || [], agente:req.agente || '' });
    var valores = [
      proto,
      Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm'),
      empresa,
      d.responsavel_nome || '',
      d.responsavel_email || d.email_corp || '',
      d.responsavel_telefone || d.telefone_corp || '',
      d.fat_12m ? 'US$ ' + d.fat_12m : '',
      'Recebida',
      '',
      pacote
    ];
    if (linha > 0) ab.getRange(linha, 1, 1, COLS.length).setValues([valores]);
    else ab.appendRow(valores);

    // assinatura como PNG na pasta do protocolo
    if (req.assinatura && req.assinatura.indexOf('base64,') > 0) {
      var pasta = pastaDo(proto, empresa);
      var já = pasta.getFilesByName('assinatura.png');
      while (já.hasNext()) já.next().setTrashed(true);
      var b = Utilities.newBlob(
        Utilities.base64Decode(req.assinatura.split('base64,')[1]), 'image/png', 'assinatura.png');
      pasta.createFile(b);
    }

    avisar(proto, empresa, d);
    return { ok:true, protocolo:proto };
  } finally {
    lock.releaseLock();
  }
}

function arquivo(req) {
  var proto = String(req.protocolo || '');
  var ss = planilha();
  var ab = ss.getSheetByName('Submissoes');
  var linha = achaLinha(ab, proto);
  var empresa = linha > 0 ? ab.getRange(linha, 3).getValue() : '';
  var pasta = pastaDo(proto, empresa);

  var limpo = String(req.nome || 'documento').replace(/[\/\\:*?"<>|]/g, '-');
  var nome = req.campo + ' — ' + limpo;
  var já = pasta.getFilesByName(nome);
  while (já.hasNext()) já.next().setTrashed(true);

  var blob = Utilities.newBlob(
    Utilities.base64Decode(req.b64), req.tipo || 'application/octet-stream', nome);
  var f = pasta.createFile(blob);

  ss.getSheetByName('Arquivos').appendRow([
    proto, req.campo, limpo, f.getUrl(), f.getId(),
    Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm')
  ]);
  return { ok:true, url:f.getUrl() };
}

function achaLinha(ab, proto) {
  var n = ab.getLastRow();
  if (n < 2) return 0;
  var col = ab.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]) === proto) return i + 2;
  return 0;
}

function avisar(proto, empresa, d) {
  if (!CONFIG.AVISAR) return;
  try {
    MailApp.sendEmail({
      to: CONFIG.AVISAR,
      subject: 'RBG · Diligência recebida — ' + empresa,
      htmlBody:
        '<div style="font-family:-apple-system,Segoe UI,sans-serif;color:#0E1730;max-width:520px">' +
        '<p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#A87C18;margin:0 0 6px">' +
        'Royal Business Growth</p>' +
        '<h2 style="margin:0 0 14px;font-weight:500">Nova diligência recebida</h2>' +
        '<table style="border-collapse:collapse;font-size:14px">' +
        linhaMail('Empresa', empresa) +
        linhaMail('Responsável', d.responsavel_nome) +
        linhaMail('E-mail', d.responsavel_email || d.email_corp) +
        linhaMail('Faturamento 12m', d.fat_12m ? 'US$ ' + d.fat_12m : '—') +
        linhaMail('Protocolo', proto) +
        '</table>' +
        '<p style="margin-top:18px"><a href="' + CONFIG.SITE + 'painel.html" ' +
        'style="background:#08132B;color:#F0C44D;padding:11px 20px;text-decoration:none;' +
        'border-radius:2px;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Abrir o painel</a></p>' +
        '</div>'
    });
  } catch (e) {}
}

function linhaMail(k, v) {
  return '<tr><td style="padding:5px 18px 5px 0;color:#6B7591">' + k +
         '</td><td style="padding:5px 0"><b>' + (v || '—') + '</b></td></tr>';
}

// ─────────────────────────── leitura pelo painel ───────────────────────────
function listar() {
  var ss = planilha();
  var ab = ss.getSheetByName('Submissoes');
  var n = ab.getLastRow();
  if (n < 2) return { ok:true, itens:[] };

  var linhas = ab.getRange(2, 1, n - 1, COLS.length).getValues();
  var arqs = arquivosPorProtocolo(ss);

  var itens = linhas.map(function (r) {
    var o = {};
    COLS.forEach(function (c, i) { o[c] = r[i]; });
    o.recebido_em = String(o.recebido_em);
    var p;
    try { p = JSON.parse(o.json || '{}'); } catch (e) { p = {}; }
    o.dados  = p.dados  || {};
    o.socios = p.socios || [];
    o.arquivos = arqs[o.protocolo] || [];
    delete o.json;
    return o;
  }).reverse();

  return { ok:true, itens:itens };
}

function detalhe(proto) {
  var r = listar();
  if (!r.ok) return r;
  var it = r.itens.filter(function (x) { return x.protocolo === proto; })[0];
  return it ? { ok:true, item:it } : { ok:false, erro:'Protocolo não encontrado.' };
}

function arquivosPorProtocolo(ss) {
  var ar = ss.getSheetByName('Arquivos');
  var n = ar.getLastRow();
  var m = {};
  if (n < 2) return m;
  ar.getRange(2, 1, n - 1, 6).getValues().forEach(function (r) {
    var p = String(r[0]);
    m[p] = m[p] || [];
    m[p] = m[p].filter(function (x) { return x.campo !== r[1]; }); // fica só o mais recente
    m[p].push({ campo:r[1], nome:r[2], url:r[3], id:r[4] });
  });
  return m;
}

function gravarStatus(proto, status, anotacao) {
  var ss = planilha();
  var ab = ss.getSheetByName('Submissoes');
  var linha = achaLinha(ab, proto);
  if (!linha) return { ok:false, erro:'Protocolo não encontrado.' };
  if (status != null)   ab.getRange(linha, COLS.indexOf('status') + 1).setValue(status);
  if (anotacao != null) ab.getRange(linha, COLS.indexOf('anotacao') + 1).setValue(anotacao);
  return { ok:true };
}

// ─────────────── rode uma vez no editor para autorizar e criar tudo ───────────────
function preparar() {
  var ss = planilha();
  var pf = pastaRaiz();
  Logger.log('Planilha: ' + ss.getUrl());
  Logger.log('Pasta:    ' + pf.getUrl());
  Logger.log('Cole no CONFIG →  PLANILHA_ID: "' + ss.getId() + '"  ·  PASTA_ID: "' + pf.getId() + '"');
}
