CREATE TABLE IF NOT EXISTS puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  difficulty text NOT NULL,
  estimated_minutes integer NOT NULL,
  description text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS puzzles_project_id_idx ON puzzles(project_id);

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL,
  unit_cost integer NOT NULL,
  vendor_url text,
  alternatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  three_d_printable boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS materials_project_id_idx ON materials(project_id);
