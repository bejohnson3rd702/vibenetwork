-- Enable Row Level Security
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert logs (Telemetry & Auditing)
CREATE POLICY "Allow anyone to insert system logs"
ON system_logs
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read logs (for Master Admin dashboard)
CREATE POLICY "Allow anyone to read system logs"
ON system_logs
FOR SELECT
TO public
USING (true);

-- Allow anyone to delete/purge logs
CREATE POLICY "Allow anyone to delete system logs"
ON system_logs
FOR DELETE
TO public
USING (true);
