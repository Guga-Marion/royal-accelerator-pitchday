/* RBG · Diligência Inicial — schema único.
   Consumido pelo formulário (index.html) e pelo painel (painel.html).
   Tipos: text, email, tel, url, num, money, pct, date, area, radio, check, ssn4, socios, arquivo */

const UF = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR"];

const SECOES = [
  {
    id:"empresa", n:"01", t:"Identificação da empresa",
    sub:"Os dados cadastrais da entidade nos Estados Unidos.",
    campos:[
      {k:"razao_social", l:"Razão social", tipo:"text", req:1, ph:"Como consta no Articles of Organization", w:6},
      {k:"nome_comercial", l:"Nome comercial / DBA", tipo:"text", ph:"O nome que o mercado conhece", w:6},
      {k:"ein", l:"EIN", tipo:"text", req:1, ph:"00-0000000", mask:"ein", w:4},
      {k:"tipo_entidade", l:"Tipo de entidade", tipo:"radio", req:1, w:8,
       op:["LLC","Corporation","Partnership","Sole Proprietorship"], outro:1},
      {k:"estado_registro", l:"Estado de registro", tipo:"radio", req:1, w:6, sel:1, op:UF},
      {k:"ano_fundacao", l:"Ano de fundação", tipo:"num", req:1, ph:"2021", w:6},
      {k:"endereco_legal", l:"Endereço legal", tipo:"area", req:1, ph:"Rua, número, sala, cidade, estado e ZIP", w:6},
      {k:"endereco_operacional", l:"Endereço operacional", tipo:"area", ph:"Só se for diferente do legal", w:6},
      {k:"website", l:"Website", tipo:"url", ph:"https://", w:4},
      {k:"telefone_corp", l:"Telefone corporativo", tipo:"tel", req:1, ph:"+1 (000) 000-0000", w:4},
      {k:"email_corp", l:"E-mail corporativo", tipo:"email", req:1, ph:"contato@empresa.com", w:4},
      {k:"__div", l:"Responsável pelo relacionamento com o RBG", tipo:"div",
       hint:"É com essa pessoa que o RBG vai falar no dia a dia."},
      {k:"responsavel_nome", l:"Nome completo", tipo:"text", req:1, w:6},
      {k:"responsavel_cargo", l:"Cargo", tipo:"text", req:1, w:6},
      {k:"responsavel_telefone", l:"Telefone", tipo:"tel", req:1, w:6},
      {k:"responsavel_email", l:"E-mail", tipo:"email", req:1, w:6}
    ]
  },
  {
    id:"socios", n:"02", t:"Quadro societário",
    sub:"Todos os sócios da empresa, com participação e dados cadastrais.",
    campos:[
      {k:"socios", l:"Sócios", tipo:"socios", req:1},
      {k:"__div", l:"Governança", tipo:"div"},
      {k:"operating_agreement", l:"Existe Operating Agreement ou Shareholders Agreement atualizado?",
       tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"operating_agreement_obs", l:"Se sim, descreva resumidamente", tipo:"area", w:6,
       dep:{k:"operating_agreement", v:"Sim"}},
      {k:"conflito", l:"Existe conflito societário, processo judicial ou situação relevante que possa impactar a empresa?",
       tipo:"radio", req:1, w:6, op:["Não","Sim"]},
      {k:"conflito_obs", l:"Descreva a situação", tipo:"area", w:6, req:1,
       dep:{k:"conflito", v:"Sim"}}
    ]
  },
  {
    id:"negocio", n:"03", t:"Negócio e posicionamento",
    sub:"O que a empresa vende, para quem, e por que ganham dela.",
    campos:[
      {k:"produto_servico", l:"Principal produto ou serviço", tipo:"area", req:1, w:6,
       ph:"Descreva em duas ou três linhas"},
      {k:"perfil_cliente", l:"Principal perfil de cliente", tipo:"area", req:1, w:6,
       ph:"Quem compra, porte, setor, momento"},
      {k:"diferencial", l:"Principal diferencial competitivo", tipo:"area", req:1, w:6,
       ph:"Por que o cliente escolhe vocês e não o concorrente"},
      {k:"mercados", l:"Mercados, cidades ou regiões atendidas", tipo:"area", req:1, w:6},
      {k:"top3", l:"3 principais produtos ou serviços em faturamento", tipo:"lista3", req:1,
       ph:["Maior faturamento","Segundo","Terceiro"]}
    ]
  },
  {
    id:"financeiro", n:"04", t:"Informações financeiras",
    sub:"Os números que ancoram o diagnóstico. Valores em dólar.",
    campos:[
      {k:"fat_12m", l:"Faturamento bruto · últimos 12 meses", tipo:"money", req:1, w:6},
      {k:"fat_mensal", l:"Faturamento médio mensal atual", tipo:"money", req:1, w:6},
      {k:"fat_2025", l:"Faturamento bruto 2025", tipo:"money", w:6},
      {k:"fat_2024", l:"Faturamento bruto 2024", tipo:"money", w:6},
      {k:"margem_bruta", l:"Margem bruta aproximada", tipo:"pct", w:6},
      {k:"resultado_liquido", l:"Resultado líquido médio", tipo:"radio", req:1, w:6,
       op:["Prejuízo","Break-even","Até 5%","5% a 10%","10% a 20%","Acima de 20%"]},
      {k:"dividas", l:"Dívidas, empréstimos ou financiamentos relevantes?", tipo:"radio", req:1, w:6,
       op:["Não","Sim"]},
      {k:"dividas_valor", l:"Total aproximado", tipo:"money", w:6, req:1, dep:{k:"dividas", v:"Sim"}},
      {k:"capital_disponivel", l:"Capital disponível para investimento em crescimento", tipo:"money", w:6}
    ]
  },
  {
    id:"comercial", n:"05", t:"Vendas e comercial",
    sub:"Como a receita entra hoje.",
    campos:[
      {k:"novos_clientes_mes", l:"Média de novos clientes por mês", tipo:"num", req:1, w:6},
      {k:"ticket_medio", l:"Ticket médio", tipo:"money", req:1, w:6},
      {k:"canais_aquisicao", l:"Principais canais de aquisição", tipo:"check", req:1, outro:1,
       op:["Indicação","Prospecção","Google","Redes sociais","Tráfego pago","Parceiros","Eventos","Marketplaces"]},
      {k:"equipe_comercial", l:"Equipe comercial estruturada?", tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"equipe_comercial_qtd", l:"Quantidade de profissionais", tipo:"num", w:6,
       dep:{k:"equipe_comercial", v:"Sim"}},
      {k:"crm", l:"Utiliza CRM?", tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"crm_qual", l:"Qual CRM?", tipo:"text", w:6, dep:{k:"crm", v:"Sim"}},
      {k:"meta_comercial", l:"Meta comercial mensal definida?", tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"meta_comercial_valor", l:"Meta mensal", tipo:"money", w:6, suf:"/ mês",
       dep:{k:"meta_comercial", v:"Sim"}}
    ]
  },
  {
    id:"marketing", n:"06", t:"Marketing",
    sub:"Estrutura, orçamento e canais.",
    campos:[
      {k:"orcamento_mkt", l:"Existe orçamento mensal de marketing?", tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"orcamento_mkt_valor", l:"Valor mensal", tipo:"money", w:6, dep:{k:"orcamento_mkt", v:"Sim"}},
      {k:"gestao_mkt", l:"Gestão de marketing", tipo:"radio", req:1,
       op:["Equipe interna","Agência","Freelancer","Sócios / Diretoria","Sem estrutura definida"]},
      {k:"canais_mkt", l:"Canais de marketing ativos", tipo:"area",
       ph:"Instagram, LinkedIn, Google Ads, e-mail, eventos…"}
    ]
  },
  {
    id:"operacao", n:"07", t:"Operação e equipe",
    sub:"O tamanho e a maturidade da máquina.",
    campos:[
      {k:"colab_total", l:"Número total de colaboradores", tipo:"num", req:1, w:4},
      {k:"colab_diretos", l:"Colaboradores diretos", tipo:"num", w:4},
      {k:"colab_terceiros", l:"Terceiros / contractors", tipo:"num", w:4},
      {k:"areas", l:"Principais áreas ou departamentos", tipo:"area", w:6},
      {k:"organograma", l:"Organograma definido?", tipo:"radio", req:1, w:6, op:["Sim","Não"]},
      {k:"processos_doc", l:"Processos operacionais documentados?", tipo:"radio", req:1, w:6,
       op:["Sim","Parcialmente","Não"]},
      {k:"sistemas", l:"Principais sistemas e plataformas utilizados", tipo:"area", w:6,
       ph:"ERP, CRM, financeiro, agenda, atendimento…"}
    ]
  },
  {
    id:"desafios", n:"08", t:"Principais desafios",
    sub:"Onde dói. Escolha até cinco.",
    campos:[
      {k:"desafios", l:"Desafios prioritários", tipo:"check", req:1, max:5, outro:1,
       op:["Aumentar faturamento","Aumentar margem / lucro","Estruturar vendas",
           "Melhorar geração de leads","Posicionamento de mercado","Marketing",
           "Organização financeira","Processos internos","Gestão de equipe",
           "Contratação de profissionais","Tecnologia e automação","Expansão geográfica",
           "Novos produtos / serviços","Captação de investimento","Governança"]},
      {k:"gargalo", l:"Maior gargalo que impede a empresa de crescer", tipo:"area", req:1,
       ph:"Seja específico. Essa resposta orienta o primeiro encontro."}
    ]
  },
  {
    id:"objetivos", n:"09", t:"Objetivos",
    sub:"Para onde vamos nos próximos doze meses.",
    campos:[
      {k:"visao_12m", l:"Onde pretende levar a empresa nos próximos 12 meses?", tipo:"area", req:1, w:6},
      {k:"meta_fat_12m", l:"Meta de faturamento · próximos 12 meses", tipo:"money", req:1, w:6},
      {k:"resultados_esperados", l:"3 principais resultados esperados com o RBG", tipo:"lista3", req:1,
       ph:["Resultado 1","Resultado 2","Resultado 3"]}
    ]
  },
  {
    id:"documentos", n:"10", t:"Documentos para diligência",
    sub:"Anexe o que existir. O que não existir ou não se aplicar, basta marcar.",
    campos:[
      {k:"doc_articles", l:"Articles of Organization / Incorporation", tipo:"arquivo", req:1},
      {k:"doc_ein", l:"EIN Confirmation Letter", tipo:"arquivo", req:1},
      {k:"doc_operating", l:"Operating Agreement / Shareholders Agreement", tipo:"arquivo"},
      {k:"doc_socios", l:"Relação atualizada dos sócios e percentuais", tipo:"arquivo"},
      {k:"doc_licencas", l:"Licenças profissionais ou operacionais", tipo:"arquivo",
       hint:"Quando aplicável ao setor."},
      {k:"doc_seguro", l:"Certificate of Insurance", tipo:"arquivo",
       hint:"Comprovante das principais coberturas, quando aplicável."},
      {k:"__div", l:"Demonstrativos financeiros", tipo:"div",
       hint:"Profit and Loss dos últimos três anos e o Balance Sheet mais recente. Assinados pelo contador ou pelo responsável."},
      {k:"doc_pl_2025", l:"Profit and Loss · 2025", tipo:"arquivo", req:1, tag:"assinado"},
      {k:"doc_pl_2024", l:"Profit and Loss · 2024", tipo:"arquivo", tag:"assinado"},
      {k:"doc_pl_2023", l:"Profit and Loss · 2023", tipo:"arquivo", tag:"assinado"},
      {k:"doc_balance", l:"Balance Sheet · mais recente", tipo:"arquivo", req:1, tag:"assinado"}
    ]
  },
  {
    id:"declaracao", n:"11", t:"Declaração",
    sub:"A última etapa.",
    campos:[
      {k:"decl_responsavel", l:"Nome do responsável", tipo:"text", req:1, w:6},
      {k:"decl_cargo", l:"Cargo", tipo:"text", req:1, w:6},
      {k:"assinatura", l:"Assinatura", tipo:"assinatura", req:1},
      {k:"aceite", l:"Declaro que as informações fornecidas são verdadeiras e refletem, de acordo com meu conhecimento, a situação atual da empresa. Autorizo o Royal Business Growth a utilizá-las exclusivamente para fins de diligência, diagnóstico, planejamento e desenvolvimento da empresa no âmbito do programa.",
       tipo:"aceite", req:1}
    ]
  }
];

const CAMPOS_SOCIO = [
  {k:"nome", l:"Nome legal completo", tipo:"text", req:1, w:6},
  {k:"cargo", l:"Cargo / função", tipo:"text", req:1, w:6},
  {k:"percentual", l:"Participação", tipo:"pct", req:1, w:6},
  {k:"nascimento", l:"Data de nascimento", tipo:"date", req:1, w:6},
  {k:"endereco", l:"Endereço residencial completo", tipo:"area", req:1, w:6},
  {k:"cidade_zip", l:"Cidade / Estado / ZIP", tipo:"text", req:1, w:6},
  {k:"telefone", l:"Telefone", tipo:"tel", req:1, w:4},
  {k:"email", l:"E-mail", tipo:"email", req:1, w:4},
  {k:"ssn4", l:"Últimos 4 dígitos do SSN", tipo:"ssn4", req:1, w:4}
];

if (typeof window !== "undefined") { window.SECOES = SECOES; window.CAMPOS_SOCIO = CAMPOS_SOCIO; }
