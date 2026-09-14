CREATE DATABASE DOCSenai;
GO

USE DOCSenai;
GO

CREATE TABLE Usuarios (
    id_usuario INTEGER IDENTITY PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(50),
    senha VARCHAR(50),
    cargo VARCHAR(50)
);

CREATE TABLE Turmas (
    id_turma INTEGER IDENTITY PRIMARY KEY,
    nome_turma VARCHAR(50),
    curso VARCHAR(100),
    periodo DATE,
    turno VARCHAR(50)
);

CREATE TABLE Atividades (
    id_atividade INTEGER IDENTITY PRIMARY KEY,
    descricao_atividade VARCHAR(1000),
    observacao VARCHAR(1000),
    data_atividade DATE,
    fk_Usuario_id_usuario INTEGER,
    fk_Turma_id_turma INTEGER
);

CREATE TABLE Fotos (
    id_foto INTEGER IDENTITY PRIMARY KEY,
    nome_arquivo VARCHAR(100),
    data_envio DATE,
    fk_Atividade_id_atividade INTEGER
);

CREATE TABLE Relatorios (
    id_relatorio INTEGER IDENTITY PRIMARY KEY,
    titulo_pdf VARCHAR(100),
    periodo_inicio DATE,
    periodo_fim DATE,
    data_criacao DATE,
    descricao VARCHAR(1000),
    fk_Usuario_id_usuario INTEGER
);

CREATE TABLE Relatorios_Atividades (
    fk_Atividade_id_atividade INTEGER,
    fk_Relatorio_id_relatorio INTEGER
);
 
 ALTER TABLE Fotos ADD CONSTRAINT FK_Fotos_2
    FOREIGN KEY (fk_Atividade_id_atividade)
    REFERENCES Atividade (id_atividade)
    ON DELETE NO ACTION;


ALTER TABLE Relatorios ADD CONSTRAINT FK_Relatorio_2
    FOREIGN KEY (fk_Usuario_id_usuario)
    REFERENCES Usuario (id_usuario);


ALTER TABLE Relatorios_Atividades ADD CONSTRAINT FK_Relatorio_Atividade_1
    FOREIGN KEY (fk_Atividade_id_atividade)
    REFERENCES Atividade (id_atividade)
    ON DELETE NO ACTION;


ALTER TABLE Relatorios_Atividades ADD CONSTRAINT FK_Relatorio_Atividade_2
    FOREIGN KEY (fk_Relatorio_id_relatorio)
    REFERENCES Relatorio (id_relatorio)
    ON DELETE NO ACTION;


    /* =========================================================
   DADOS FICTÍCIOS - DOC SENAI
   ========================================================= */


/* =========================
   USUÁRIOS
   ========================= */

INSERT INTO Usuarios (nome, email, senha, cargo)
VALUES
('Ana Paula Souza', 'ana.souza@senai.br', '123456', 'Professora'),
('Carlos Eduardo Lima', 'carlos.lima@senai.br', '123456', 'Professor'),
('Mariana Alves', 'mariana.alves@senai.br', '123456', 'Professora'),
('João Pedro Santos', 'joao.santos@senai.br', '123456', 'Professor'),
('Fernanda Oliveira', 'fernanda.oliveira@senai.br', '123456', 'Supervisora');


/* =========================
   TURMAS
   ========================= */

INSERT INTO Turmas (nome_turma, curso, periodo, turno)
VALUES
('Técnico em Informática 2026.1', 'Técnico em Informática para Internet', '2026-01-01', 'Matutino'),
('Técnico em Administração 2026.1', 'Técnico em Administração', '2026-01-01', 'Vespertino'),
('Técnico em Segurança do Trabalho 2026.1', 'Técnico em Segurança do Trabalho', '2026-01-01', 'Noturno'),
('Aprendizagem Industrial TI 2026', 'Aprendizagem Industrial em Tecnologia da Informação', '2026-02-01', 'Matutino'),
('Técnico em Eletrotécnica 2026.1', 'Técnico em Eletrotécnica', '2026-01-01', 'Noturno');


/* =========================
   ATIVIDADES
   ========================= */

INSERT INTO Atividades 
(descricao_atividade, observacao, data_atividade, fk_Usuario_id_usuario, fk_Turma_id_turma)
VALUES

(
'Introdução ao desenvolvimento de páginas web utilizando HTML e conceitos básicos de estrutura de documentos.',
'Os alunos participaram da atividade prática e desenvolveram uma página simples.',
'2026-08-03',
1,
1
),

(
'Atividade prática de criação de páginas utilizando HTML e CSS.',
'A turma apresentou bom desempenho durante a atividade.',
'2026-08-05',
1,
1
),

(
'Desenvolvimento de exercícios sobre organização financeira e planejamento administrativo.',
'Foram realizados exercícios individuais e em grupo.',
'2026-08-04',
2,
2
),

(
'Simulação de elaboração de documentos administrativos e organização de arquivos.',
'Os alunos concluíram a atividade dentro do prazo.',
'2026-08-06',
2,
2
),

(
'Aula sobre identificação de riscos ocupacionais presentes no ambiente de trabalho.',
'Foi realizada uma atividade prática de identificação dos principais riscos.',
'2026-08-10',
3,
3
),

(
'Atividade prática de elaboração de um mapa de riscos para um ambiente profissional.',
'Os alunos trabalharam em grupos para desenvolver o mapa.',
'2026-08-12',
3,
3
),

(
'Introdução à lógica de programação utilizando algoritmos e estruturas condicionais.',
'Foram utilizados exercícios práticos para facilitar a compreensão do conteúdo.',
'2026-08-07',
4,
4
),

(
'Exercícios práticos de lógica de programação e resolução de problemas.',
'A turma apresentou evolução na resolução dos exercícios.',
'2026-08-11',
4,
4
),

(
'Aula prática sobre circuitos elétricos e componentes utilizados em instalações.',
'Foram realizadas demonstrações práticas em laboratório.',
'2026-08-13',
4,
5
);


/* =========================
   FOTOS
   ========================= */

INSERT INTO Fotos 
(nome_arquivo, data_envio, fk_Atividade_id_atividade)
VALUES

('aula_html_01.jpg', '2026-08-03', 1),
('aula_html_02.jpg', '2026-08-03', 1),

('atividade_css_01.jpg', '2026-08-05', 2),
('atividade_css_02.jpg', '2026-08-05', 2),
('atividade_css_03.jpg', '2026-08-05', 2),

('atividade_administracao_01.jpg', '2026-08-04', 3),
('atividade_administracao_02.jpg', '2026-08-04', 3),

('documentos_01.jpg', '2026-08-06', 4),

('mapa_risco_01.jpg', '2026-08-10', 5),
('mapa_risco_02.jpg', '2026-08-10', 5),

('mapa_risco_final.jpg', '2026-08-12', 6),
('mapa_risco_grupo.jpg', '2026-08-12', 6),

('logica_programacao_01.jpg', '2026-08-07', 7),
('logica_programacao_02.jpg', '2026-08-11', 8),

('laboratorio_eletrica_01.jpg', '2026-08-13', 9),
('laboratorio_eletrica_02.jpg', '2026-08-13', 9);


/* =========================
   RELATÓRIOS
   ========================= */

INSERT INTO Relatorios 
(titulo_pdf, periodo_inicio, periodo_fim, data_criacao, descricao, fk_Usuario_id_usuario)
VALUES

(
'Relatório de Atividades - Informática - Agosto 2026',
'2026-08-01',
'2026-08-31',
'2026-08-31',
'Relatório das atividades desenvolvidas pela turma de Técnico em Informática para Internet durante o mês de agosto de 2026.',
1
),

(
'Relatório de Atividades - Administração - Agosto 2026',
'2026-08-01',
'2026-08-31',
'2026-08-31',
'Relatório das atividades realizadas pelos alunos do curso Técnico em Administração durante o período.',
2
),

(
'Relatório de Segurança do Trabalho - Agosto 2026',
'2026-08-01',
'2026-08-31',

'2026-08-31',
'Registro das atividades práticas realizadas pela turma de Técnico em Segurança do Trabalho.',
3
);


/* =========================
   RELATÓRIO_ATIVIDADE
   ========================= */

INSERT INTO Relatorios_Atividades 
(fk_Atividade_id_atividade, fk_Relatorio_id_relatorio)
VALUES

-- Relatório de Informática
(1, 1),
(2, 1),

-- Relatório de Administração
(3, 2),
(4, 2),

-- Relatório de Segurança do Trabalho
(5, 3),
(6, 3);
