-- 🔹 1. Total de ingressos vendidos e disponíveis (baseado na capacidade do evento)
select 
    sum(str.capacidade_atual) as ingressos_vendidos,
    (evt.capacidade_max - sum(str.capacidade_atual)) as ingressos_disponiveis,
    round((sum(str.capacidade_atual) / evt.capacidade_max ) * 100, 2) as perc_vendidos,
    round(((evt.capacidade_max - sum(str.capacidade_atual)) / evt.capacidade_max) * 100, 2) as perc_disponiveis
from setores str
inner join eventos evt on evt.id_evento = str.id_evento
where str.id_evento = 1;

-- 🔹 2. Validação de ingressos (percentual baseado nos ingressos vendidos)
select 
    sum(case when ing.status = 'Validado' then 1 else 0 end) as validados,
    sum(case when ing.status = 'Não validado' then 1 else 0 end) as nao_validados,
    round((sum(case when ing.status = 'Validado' then 1 else 0 end) / count(*)) * 100, 2) as perc_validados,
    round((sum(case when ing.status = 'Não validado' then 1 else 0 end) / count(*)) * 100, 2) as perc_nao_validados
from ingressos ing
where ing.id_evento = 1;

-- 🔹 3. Vendas por setor (vendidos x disponíveis baseado na capacidade do setor)
select 
    str.nome as setor,
    str.capacidade_atual as vendidos,
    (str.capacidade_max - str.capacidade_atual) as disponiveis,
    round((str.capacidade_atual / str.capacidade_max) * 100, 2) as perc_vendidos,
    round(((str.capacidade_max - str.capacidade_atual) / str.capacidade_max) * 100, 2) as perc_disponiveis
from setores str
where str.id_evento = 1;

-- 🔹 4. Ocupação por setor (baseado apenas nos ingressos validados)
select 
    str.nome as setor,
    sum(case when ing.status = 'Validado' then 1 else 0 end) as ocupado,
    (str.capacidade_max - sum(case when ing.status = 'Validado' then 1 else 0 end)) as livre,
    round((sum(case when ing.status = 'Validado' then 1 else 0 end) / str.capacidade_max) * 100, 2) as perc_ocupado,
    round(((str.capacidade_max - sum(case when ing.status = 'Validado' then 1 else 0 end)) / str.capacidade_max) * 100, 2) as perc_livre
from setores str
left join ingressos ing on ing.id_setor = str.id_setor
where str.id_evento = 1
group by str.id_setor, str.nome, str.capacidade_max;
