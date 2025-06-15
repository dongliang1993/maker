-- 先删除依赖的视图
DROP VIEW IF EXISTS recent_messages;

-- 1. 临时删除 text 列的非空约束
ALTER TABLE messages ALTER COLUMN text DROP NOT NULL;

-- 2. 从 content 中提取文本并更新 text 列
UPDATE messages 
SET text = COALESCE(
    (content->>'text')::text,
    ''
)
WHERE text IS NULL;

-- 3. 重新添加 text 列的非空约束
ALTER TABLE messages ALTER COLUMN text SET NOT NULL;

-- 4. 将 content 列重置为空数组
UPDATE messages 
SET content = '[]'::jsonb;

-- 重新创建视图
CREATE OR REPLACE VIEW recent_messages AS
SELECT 
    m.*,
    p.name as project_name
FROM messages m
JOIN projects p ON m.project_id = p.id
WHERE m.created_at > now() - interval '7 days'
ORDER BY m.created_at DESC; 