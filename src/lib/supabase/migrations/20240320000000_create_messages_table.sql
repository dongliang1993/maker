-- 删除现有对象
DROP VIEW IF EXISTS recent_messages;
DROP TRIGGER IF EXISTS messages_notify_changes ON messages;
DROP FUNCTION IF EXISTS notify_message_changes();
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP TABLE IF EXISTS messages CASCADE;
DROP TYPE IF EXISTS message_role;

-- 创建消息类型枚举
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    role message_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- 添加 RLS 策略
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许已认证用户查看自己的项目的消息
CREATE POLICY "Users can view project messages"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id::uuid = messages.project_id::uuid
        AND p.user_id = auth.uid()::text
    )
);

-- 创建策略：允许已认证用户创建消息
CREATE POLICY "Users can create messages"
ON messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id::uuid = messages.project_id::uuid
        AND p.user_id = auth.uid()::text
    )
);

-- 创建策略：允许已认证用户更新自己的消息
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- 创建策略：允许已认证用户删除自己的消息
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (auth.uid()::text = user_id);

-- 如果更新时间触发器函数不存在，则创建
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建更新时间触发器
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 创建通知触发器（可选，用于实时更新）
CREATE OR REPLACE FUNCTION notify_message_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'message_changes',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'project_id', NEW.project_id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_notify_changes
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_message_changes();

-- 创建视图：获取最近的消息（可选）
CREATE OR REPLACE VIEW recent_messages AS
SELECT 
    m.*,
    p.name as project_name
FROM messages m
JOIN projects p ON m.project_id = p.id
WHERE m.created_at > now() - interval '7 days'
ORDER BY m.created_at DESC;

-- 添加注释
COMMENT ON TABLE messages IS '存储项目相关的所有消息';
COMMENT ON COLUMN messages.id IS '消息的唯一标识符';
COMMENT ON COLUMN messages.project_id IS '关联的项目ID';
COMMENT ON COLUMN messages.user_id IS '发送消息的用户ID（Clerk ID）';
COMMENT ON COLUMN messages.content IS '消息内容';
COMMENT ON COLUMN messages.image_url IS '可选的图片URL';
COMMENT ON COLUMN messages.role IS '消息发送者的角色（用户/助手/系统）';
COMMENT ON COLUMN messages.created_at IS '消息创建时间';
COMMENT ON COLUMN messages.updated_at IS '消息最后更新时间'; 