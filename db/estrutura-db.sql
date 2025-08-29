drop schema if exists grandeshowdb;
create schema grandeshowdb;

use grandeshowdb;

create table perfis
(
id_perfil int not null auto_increment primary key,
descricao varchar(50) not null
);


create table clientes (
id_cliente int not null auto_increment primary key,
nome varchar(100) not null,
email varchar(255) not null unique,
cpf varchar(11) not null,
telefone varchar(11) ,
ativo boolean not null default true
);

create table eventos(
id_evento int not null auto_increment primary key,
nome varchar(100) not null,
descricao varchar(255) not null,
local varchar(255) not null,
dt_inicio datetime default current_timestamp(),
dt_fim datetime,
capacidade_max int not null default 5000
);



create table usuarios
(
id_usuario int not null auto_increment primary key,
nome varchar(100) not null,
email varchar(255) not null unique,
senha varchar(255) not null,
cpf varchar(11) not null,
ativo boolean not null default true,
id_perfil int not null,
constraint fk_usuarios_perfil
foreign key (id_perfil)
references perfis(id_perfil)
on delete restrict
);


create table setores (
id_setor int not null auto_increment primary key,
nome varchar(100) not null,
descricao varchar(255) not null,
capacidade_max int not null default 5000,
capacidade_atual int not null default 0,
id_evento int not null,
constraint fk_setores_eventos
foreign key (id_evento)
references eventos(id_evento)
on delete cascade
);

create table ingressos(
id_ingresso varchar(50) not null primary key,
id_cliente int not null,
id_usuario int not null,
id_evento int not null,
id_setor int not null,
status varchar(20) default 'Não validado',
dt_criacao datetime default current_timestamp(),
dt_validacao datetime,
constraint fk_ingressos_clientes
foreign key (id_cliente)
references clientes(id_cliente)
on delete restrict,
constraint fk_ingressos_usuarios
foreign key (id_usuario)
references usuarios(id_usuario)
on delete restrict,
constraint fk_ingressos_eventos
foreign key (id_evento)
references eventos(id_evento)
on delete restrict,
constraint fk_ingressos_setores
foreign key (id_setor)
references setores(id_setor)
on delete restrict
);

create table ingressos_auditoria
(
id_auditoria int not null auto_increment primary key,
id_evento int not null,
id_setor int not null,
id_usuario int not null,
id_cliente int not null,
operacao varchar(10) not null,
ingresso_status varchar(20) default 'Não validado',
dt_registro datetime default current_timestamp()
);

DELIMITER //
create trigger trg_ins_pk_ingressos
before insert on ingressos
for each row
begin
	declare proximo_id int;
    
    select count(*) 
    into proximo_id
    from ingressos
    where id_evento = new.id_evento
    AND id_setor = new.id_setor
    AND id_cliente = new.id_cliente;
    
    set new.id_ingresso = concat('EVT',new.id_evento,'-S',new.id_setor,'-C',new.id_cliente,'-',proximo_id);
    
end //
DELIMITER ;

DELIMITER //
create trigger trg_upd_status_ingresso
before update on ingressos
for each row
begin
	if old.status = 'Não validado' AND new.status = 'Validado' then
		set new.dt_validacao = current_timestamp();
		
        update setores set capacidade_atual = capacidade_atual + 1
        where id_setor =  new.id_setor;

	elseif old.status <> 'Validado' AND new.status = 'Não validado' then
        set new.dt_validacao = null;
		
        update setores set capacidade_atual = capacidade_atual - 1
        where id_setor =  new.id_setor;

	end if;
    
		insert into ingressos_auditoria
		(id_evento,id_setor ,id_usuario ,id_cliente ,operacao ,ingresso_status)
		values(new.id_evento,new.id_setor,new.id_usuario,new.id_cliente,'UPDATE',new.status);
end//
DELIMITER ;

DELIMITER //
create trigger trg_dlt_ingressos
before delete on ingressos
for each row
begin
	update setores set capacidade_atual = capacidade_atual - 1
    where id_setor = old.id_setor;
    
    insert into ingressos_auditoria
	(id_evento,id_setor ,id_usuario ,id_cliente ,operacao ,ingresso_status)
	values(old.id_evento,old.id_setor,old.id_usuario,old.id_cliente,'DELETE',old.status);
    
end//
DELIMITER ;


DELIMITER //
create trigger trg_ins_ingressos
after insert on ingressos
for each row
begin

	insert into ingressos_auditoria
	(id_evento,id_setor ,id_usuario ,id_cliente ,operacao ,ingresso_status)
	values(new.id_evento,new.id_setor,new.id_usuario,new.id_cliente,'INSERT',new.status);
end//
DELIMITER ;

