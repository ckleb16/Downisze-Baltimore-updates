CREATE TABLE IF NOT EXISTS constant_contact_auth (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,
  oauth_state TEXT,
  state_expires_at INTEGER
);
