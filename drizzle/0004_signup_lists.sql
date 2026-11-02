CREATE TABLE IF NOT EXISTS newsletter_signups (
  email TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS club_signups (
  email TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  mailing_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  timing TEXT NOT NULL,
  planning_for TEXT NOT NULL,
  part_of_town TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  newsletter_opt_in INTEGER NOT NULL CHECK (newsletter_opt_in IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
