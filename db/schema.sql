-- Community recipes (Neon / any Postgres). Also created automatically on first use.
CREATE TABLE IF NOT EXISTS community_recipes (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe      JSONB       NOT NULL,
  likes       INTEGER     NOT NULL DEFAULT 0,
  hidden      BOOLEAN     NOT NULL DEFAULT FALSE,   -- set TRUE to moderate a post away
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_recipes_created_idx ON community_recipes (created_at DESC) WHERE NOT hidden;
CREATE INDEX IF NOT EXISTS community_recipes_likes_idx   ON community_recipes (likes DESC)      WHERE NOT hidden;
