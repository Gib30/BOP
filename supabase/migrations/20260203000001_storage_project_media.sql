-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read files
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-media');

-- Allow anonymous users to insert files
CREATE POLICY "Anonymous insert access"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'project-media');
