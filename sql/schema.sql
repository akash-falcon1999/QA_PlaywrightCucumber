CREATE TABLE transactions (txn_id INTEGER PRIMARY KEY, from_account TEXT, to_account TEXT, amount REAL, txn_time TEXT);
INSERT INTO transactions VALUES
 (1,'A','B',1000,'2024-05-01 10:00:00'),(2,'B','A',950,'2024-05-01 18:00:00'),   -- round trip (5% diff, 8h)
 (3,'C','D',500,'2024-05-02 09:00:00'),(4,'D','C',300,'2024-05-02 12:00:00'),   -- amount too different
 (5,'E','F',2000,'2024-05-03 08:00:00'),(6,'F','E',2100,'2024-05-04 09:00:00'), -- 25h apart
 (7,'G','H',800,'2024-05-05 07:00:00'),(8,'H','G',860,'2024-05-06 06:30:00');   -- 7.5%, 23.5h
CREATE TABLE ipl_scores (player TEXT, match_date TEXT, runs INTEGER);
INSERT INTO ipl_scores VALUES
 ('Kohli','2024-03-22',45),('Kohli','2024-03-25',77),('Kohli','2024-03-29',61),('Kohli','2024-04-02',12),('Kohli','2024-04-06',50),
 ('Gill','2024-03-24',31),('Gill','2024-03-29',8),('Gill','2024-04-04',44),('Gill','2024-04-07',35),('Gill','2024-04-10',60),('Gill','2024-04-14',33),
 ('Rohit','2024-03-24',30),('Rohit','2024-03-27',29),('Rohit','2024-03-31',55),('Rohit','2024-04-03',40);
