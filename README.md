# Take note



```
# Check database
yarn rw prisma studio
```


```sql
-- Tìm thẻ trùng
SELECT front, back, COUNT(*)
FROM "AnkiCard"
GROUP BY front, back
HAVING COUNT(*) > 1;

-- Xóa thẻ trùng
DELETE FROM "AnkiCard" a
USING "AnkiCard" b
WHERE
  a.id < b.id
  AND a.front = b.front
  AND a.back = b.back;

-- Chỉnh tag
UPDATE "_AnkiCardToAnkiTag" AS act
SET "B" = 3
FROM "AnkiCard" AS ac
WHERE act."A" = ac."id"
  AND act."B" = 2
  AND ac."front" LIKE '%～%';
```