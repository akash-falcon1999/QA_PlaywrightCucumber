-- Gaps-and-islands. A streak is 3+ CONSECUTIVE matches (by the player's own match order) with 30+ runs.
WITH numbered AS (
  SELECT player, match_date, runs,
         ROW_NUMBER() OVER (PARTITION BY player ORDER BY match_date) AS rn_all
  FROM ipl_scores
), qualifying AS (
  SELECT *, rn_all - ROW_NUMBER() OVER (PARTITION BY player ORDER BY match_date) AS island
  FROM numbered WHERE runs >= 30            -- same island id => no skipped/failed match in between
)
SELECT player, MIN(match_date) AS streak_start, COUNT(*) AS streak_length
FROM qualifying GROUP BY player, island HAVING COUNT(*) >= 3
ORDER BY player, streak_start;
