CREATE TABLE IF NOT EXISTS audience_profiles (
  project_id uuid PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_size integer NOT NULL,
  difficulty text NOT NULL,
  audience_type text NOT NULL,
  psychology_profile text NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  asset_type text NOT NULL,
  asset_name text NOT NULL,
  status text NOT NULL,
  attempt integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 2,
  output_url text,
  error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generation_jobs_project_id_idx ON generation_jobs(project_id);
