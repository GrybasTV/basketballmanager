-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_login_at" DATETIME,
    "vacation_mode_end" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "country_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leagues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "prestige" INTEGER NOT NULL DEFAULT 50,
    "wage_budget" INTEGER NOT NULL DEFAULT 100000,
    "transfer_budget" INTEGER NOT NULL DEFAULT 500000,
    "is_ai_controlled" BOOLEAN NOT NULL DEFAULT false,
    "local_league_id" TEXT NOT NULL,
    "european_league_id" TEXT,
    "user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "teams_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teams_local_league_id_fkey" FOREIGN KEY ("local_league_id") REFERENCES "leagues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teams_european_league_id_fkey" FOREIGN KEY ("european_league_id") REFERENCES "leagues" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birth_country_id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "ovr" INTEGER NOT NULL DEFAULT 50,
    "pot" INTEGER NOT NULL DEFAULT 60,
    "loyalty" INTEGER NOT NULL DEFAULT 50,
    "morale" INTEGER NOT NULL DEFAULT 70,
    "rhythm" INTEGER NOT NULL DEFAULT 70,
    "close_range" INTEGER NOT NULL DEFAULT 50,
    "mid_range" INTEGER NOT NULL DEFAULT 50,
    "three_point" INTEGER NOT NULL DEFAULT 50,
    "free_throw" INTEGER NOT NULL DEFAULT 50,
    "ball_handling" INTEGER NOT NULL DEFAULT 50,
    "passing" INTEGER NOT NULL DEFAULT 50,
    "offensive_reb" INTEGER NOT NULL DEFAULT 50,
    "perimeter_def" INTEGER NOT NULL DEFAULT 50,
    "interior_def" INTEGER NOT NULL DEFAULT 50,
    "steal" INTEGER NOT NULL DEFAULT 50,
    "block" INTEGER NOT NULL DEFAULT 50,
    "defensive_reb" INTEGER NOT NULL DEFAULT 50,
    "speed" INTEGER NOT NULL DEFAULT 50,
    "strength" INTEGER NOT NULL DEFAULT 50,
    "vertical" INTEGER NOT NULL DEFAULT 50,
    "stamina" INTEGER NOT NULL DEFAULT 70,
    "injury_prone" INTEGER NOT NULL DEFAULT 30,
    "basketball_iq" INTEGER NOT NULL DEFAULT 50,
    "clutch" INTEGER NOT NULL DEFAULT 50,
    "injury_status" TEXT NOT NULL DEFAULT 'HEALTHY',
    "fatigue_season" INTEGER NOT NULL DEFAULT 0,
    "form" INTEGER NOT NULL DEFAULT 70,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "players_birth_country_id_fkey" FOREIGN KEY ("birth_country_id") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "weekly_wage" INTEGER NOT NULL,
    "expires_at_season" INTEGER NOT NULL,
    "effective_at_season" INTEGER NOT NULL,
    "release_clause" INTEGER,
    "is_loan" BOOLEAN NOT NULL DEFAULT false,
    "loan_min_guarantee" INTEGER,
    "is_renewable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contracts_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contracts_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "greed" INTEGER NOT NULL DEFAULT 50,
    "reputation" INTEGER NOT NULL DEFAULT 50,
    "negotiation" INTEGER NOT NULL DEFAULT 50,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "wage_offered" INTEGER NOT NULL,
    "role_offered" TEXT NOT NULL,
    "minutes_offered" INTEGER NOT NULL,
    "offer_category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "offers_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "league_id" TEXT NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "home_score" INTEGER NOT NULL DEFAULT 0,
    "away_score" INTEGER NOT NULL DEFAULT 0,
    "is_played" BOOLEAN NOT NULL DEFAULT false,
    "is_playoff" BOOLEAN NOT NULL DEFAULT false,
    "series_id" TEXT,
    "match_day" INTEGER NOT NULL,
    "played_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "match_player_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "match_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "fg_made" INTEGER NOT NULL DEFAULT 0,
    "fg_attempted" INTEGER NOT NULL DEFAULT 0,
    "three_pt_made" INTEGER NOT NULL DEFAULT 0,
    "three_pt_att" INTEGER NOT NULL DEFAULT 0,
    "ft_made" INTEGER NOT NULL DEFAULT 0,
    "ft_attempted" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "match_player_stats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "match_player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "player_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player_id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "games_started" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "points" REAL NOT NULL DEFAULT 0,
    "rebounds" REAL NOT NULL DEFAULT 0,
    "assists" REAL NOT NULL DEFAULT 0,
    "steals" REAL NOT NULL DEFAULT 0,
    "blocks" REAL NOT NULL DEFAULT 0,
    "turnovers" REAL NOT NULL DEFAULT 0,
    "fg_percent" REAL,
    "three_pt_percent" REAL,
    "ft_percent" REAL,
    CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "playoff_series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "league_id" TEXT NOT NULL,
    "team1_id" TEXT NOT NULL,
    "team2_id" TEXT NOT NULL,
    "team1_wins" INTEGER NOT NULL DEFAULT 0,
    "team2_wins" INTEGER NOT NULL DEFAULT 0,
    "best_of" INTEGER NOT NULL DEFAULT 3,
    "winner_team_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rotation" INTEGER NOT NULL DEFAULT 50,
    "tactics" INTEGER NOT NULL DEFAULT 50,
    "development" INTEGER NOT NULL DEFAULT 50,
    "motivation" INTEGER NOT NULL DEFAULT 50,
    "salary" INTEGER NOT NULL DEFAULT 5000,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coaches_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "season_state" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "season" INTEGER NOT NULL DEFAULT 1,
    "match_day" INTEGER NOT NULL DEFAULT 1,
    "phase" TEXT NOT NULL DEFAULT 'REGULAR_SEASON',
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "teams_user_id_key" ON "teams"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_stats_player_id_season_key" ON "player_stats"("player_id", "season");
