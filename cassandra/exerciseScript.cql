USE dblp;
DROP TABLE IF EXISTS publications;


CREATE TABLE publications (
art_id TEXT, type TEXT, title text, pages_start INT, pages_end int, booktitle text,
journal_series text, journal_editor text, journal_volume int, journal_isbn text,
url text, year int,
PRIMARY KEY (art_id)
);
ALTER TABLE publications WITH GC_GRACE_SECONDS = 0;
CREATE INDEX btree_publi_type on publications(type);

CREATE TABLE authors (
art_id TEXT, author TEXT, pos INT,
PRIMARY KEY ((author), art_id)
);
ALTER TABLE authors WITH GC_GRACE_SECONDS = 0;
CREATE INDEX btree_authors_art_id on authors(art_id);
CREATE INDEX btree_authors_pos on authors(pos);

CREATE TABLE authors_publis (
art_id TEXT, author TEXT, type TEXT, title text, pages_start INT, pages_end int,
booktitle text, journal_series text, journal_editor text, journal_volume int,
journal_isbn text, url text, year int, pos int,
PRIMARY KEY ((author), art_id)
);
ALTER TABLE authors_publis WITH GC_GRACE_SECONDS = 0;
CREATE INDEX btree_authors_publi_type on authors_publis(type);
CREATE INDEX btree_authors_publi_title on authors_publis(title);


select * from publications;

select title from publications;

select title from publications where art_id='series/sci/2008-156';
select count(*) from publications where type='Book';

select count(*) from publications where booktitle='HICSS';
select count(*) from publications where booktitle='HICSS' ALLOW FILTERING;

CREATE INDEX btree_publi_booktitle on publications(booktitle);
select count(*) from publications where booktitle='HICSS';

select count(*) from publications where type='Article' AND booktitle='HICSS' ALLOW FILTERING;


select count(*) from authors where pos=3;
select count(*) from authors where pos>3 ALLOW FILTERING;

select count(*) from publications where token(art_id)<0;
select count(*) from publications where token(art_id)>0;
select art_id, token(art_id) as token_number from publications;

-- COMPLEX

select author, count(*) as n_pubs from authors_publis group by author;

select author, count(*) as n_pubs from authors_publis where pos=3 group by author ALLOW FILTERING ;


drop table if exists temp;
create table temp(
art_id text,
author text,
pos int,
PRIMARY KEY ((pos), author)
);
ALTER TABLE temp with Gc_grace_Seconds=0;
create index btree_temp_author on temp(author);
create index btree_temp_pos on temp(pos);

-- COPY IN TERMINAL
COPY temp(art_id, author, pos)
FROM 'DBLP/authors.csv' WITH HEADER = true AND DELIMITER=';';

select pos, count(*) as n_authors from temp GROUP BY pos;
-- insert into temp (pos, author) values (select pos, author from authors_publis);


select pos, author, count(*) from temp where author='Oscar Castillo' GROUP BY pos;

select count(*) from temp;


-- COMPLEX Joins and Aggregates
select author from author join publications where title='Medical imaging archiving: A comparison between several NoSQL solutions.';

select author from authors_publis where title='Medical imaging archiving: A comparison between several NoSQL solutions.';

select author, title, pos from authors_publis where author='Oscar Castillo';

select distinct(author) from author_publis inner join (select author, title, pos from authors_publis where author='Oscar Castillo') using(title);
-- Does not work

create type journal (
series text,
editor text,
volume int,
isbn list<text>
);

create table publicationsNorm (
id text,
type text,
year int,
title text,
authors set<text>,
pages map<text, int>,
booktitle text,
journal FROZEN<journal>,
url text,
cites set<text>,
PRIMARY KEY ((id), title)
);

INSERT INTO publicationsNorm JSON
'{"id":"series/cogtech/BrandhermSNL13", "type":"Article", "year":2013,
"title":"A SemProM Use Case: Health Care and Compliance.",
"authors":["Boris Brandherm","Michael Schmitz","Robert Ne?elrath","Frank Lehmann"],
"pages":{"start":349, "end":361}, "booktitle":"SemProM",
"journal":{"series":"", "editor":"", "volume":0, "isbn":[ "" ]},
"url":"db/series/cogtech/364237376.html#BrandhermSNL13", "cites":[ "" ]}';

create index btree_pubnorm_title on publicationsNorm(title);

select authors from publicationsNorm where title='Data Quality';

select journal.series from publicationsNorm where title='Data Quality';
select pages['end'] from publicationsNorm where title='Data Quality';
select authors[0] from publicationsNorm where title='Data Quality'; -- doesnt work yet

select title, authors from publicationsNorm where authors contains 'Oscar Castillo' ALLOW FILTERING;

create index btree_pubnorm_pages_end on publicationsNorm(pages);

select title, pages['start'] from publicationsNorm where pages['end'] = 99 ALLOW FILTERING;

select title, journal.series from publicationsNorm where journal CONTAINS 'Advances in Database Systems';

alter table publicationsNorm rename column




