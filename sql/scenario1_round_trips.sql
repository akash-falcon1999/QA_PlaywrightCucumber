-- Round-trip transfers: A->B then B->A within 24h, amount within 10% of the original.
SELECT t1.txn_id AS out_txn, t2.txn_id AS back_txn, t1.from_account AS acct_a, t1.to_account AS acct_b,
       t1.amount AS sent, t2.amount AS returned, t1.txn_time AS sent_at, t2.txn_time AS returned_at
FROM transactions t1
JOIN transactions t2
  ON  t2.from_account = t1.to_account AND t2.to_account = t1.from_account
  AND t2.txn_time > t1.txn_time
  AND t2.txn_time <= datetime(t1.txn_time, '+24 hours')   -- Postgres: t1.txn_time + INTERVAL '24 hours'
  AND t2.amount BETWEEN t1.amount * 0.9 AND t1.amount * 1.1;
