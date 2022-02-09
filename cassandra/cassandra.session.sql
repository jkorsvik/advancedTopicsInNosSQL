COPY publications(art_id,type,year,title,pages_start,pages_end,booktitle,journal_series,
journal_editor,journal_volume,journal_isbn,url)
FROM 'DBLP/DBLP_publis.csv' WITH HEADER = true AND DELIMITER=';';
