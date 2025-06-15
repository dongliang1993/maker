-- 先删除依赖的视图
DROP VIEW IF EXISTS recent_messages;

-- 将 content 列重置为空数组
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