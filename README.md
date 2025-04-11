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

```