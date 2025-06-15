-- 先删除依赖的视图
DROP VIEW IF EXISTS recent_messages;

-- 1. 添加新的 text 列
ALTER TABLE messages ADD COLUMN IF NOT EXISTS text TEXT;

-- 2. 将现有的 content 列的 text 字段值复制到 text 列
UPDATE messages SET text = content->>'text';

-- 3. 添加 imageList 和 styleList 列
ALTER TABLE messages ADD COLUMN image_list JSONB DEFAULT '[]'::jsonb;
ALTER TABLE messages ADD COLUMN style_list JSONB DEFAULT '[]'::jsonb;

-- 4. 转换 image_url 数据为新格式
UPDATE messages 
SET image_list = CASE 
    WHEN image_url IS NOT NULL AND image_url != '' THEN 
        jsonb_build_array(jsonb_build_object('imageUrl', image_url))
    ELSE 
        '[]'::jsonb 
    END;

-- 5. 更新 content 中的图片信息
UPDATE messages 
SET content = jsonb_set(
    content,
    '{images}',
    CASE 
        WHEN image_url IS NOT NULL AND image_url != '' THEN 
            jsonb_build_array(jsonb_build_object('imageUrl', image_url))
        ELSE 
            '[]'::jsonb 
    END
)
WHERE image_url IS NOT NULL AND image_url != '';

UPDATE messages 
SET content = jsonb_set(
    content,
    '{type}',
    '"image"'::jsonb
)
WHERE image_url IS NOT NULL AND image_url != '';

-- 删除 image_url 列（因为数据已经迁移到 image_list 中）
ALTER TABLE messages DROP COLUMN image_url;

-- 添加非空约束
ALTER TABLE messages ALTER COLUMN content SET NOT NULL;
ALTER TABLE messages ALTER COLUMN text SET NOT NULL;
ALTER TABLE messages ALTER COLUMN image_list SET NOT NULL;
ALTER TABLE messages ALTER COLUMN style_list SET NOT NULL;

-- 更新注释
COMMENT ON COLUMN messages.content IS '消息内容（JSON格式）';
COMMENT ON COLUMN messages.text IS '消息的纯文本内容';
COMMENT ON COLUMN messages.image_list IS '图片列表，格式：[{imageUrl: string}]';
COMMENT ON COLUMN messages.style_list IS '样式列表，JSON格式';

-- 重新创建视图：获取最近的消息
CREATE OR REPLACE VIEW recent_messages AS
SELECT 
    m.*,
    p.name as project_name
FROM messages m
JOIN projects p ON m.project_id = p.id
WHERE m.created_at > now() - interval '7 days'
ORDER BY m.created_at DESC; 