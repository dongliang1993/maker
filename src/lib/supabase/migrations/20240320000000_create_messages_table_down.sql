-- 删除视图
DROP VIEW IF EXISTS recent_messages;

-- 删除触发器和函数
DROP TRIGGER IF EXISTS messages_notify_changes ON messages;
DROP FUNCTION IF EXISTS notify_message_changes();

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 删除表
DROP TABLE IF EXISTS messages;

-- 删除类型
DROP TYPE IF EXISTS message_role; 