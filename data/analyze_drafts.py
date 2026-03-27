"""
BSC 2026 March Monthly Finals — Draft Analysis
Parses the master draft data and outputs comprehensive statistics.
"""
import re
from collections import defaultdict, Counter

# Parse all games from the markdown file
games = []

with open(r"C:\Users\andre\OneDrive\Documents\GitHub\brawl-draft-lab\data\bsc_march_2026_drafts.md", "r", encoding="utf-8") as f:
    content = f.read()

current_region = None
current_match = None
current_global_bans = []
current_stage = None

lines = content.split("\n")
i = 0
while i < len(lines):
    line = lines[i].strip()

    # Detect region
    if line.startswith("# NORTH AMERICA"):
        current_region = "NA"
    elif line.startswith("# EMEA"):
        current_region = "EMEA"
    elif line.startswith("# SOUTH AMERICA"):
        current_region = "SA"
    elif line.startswith("# EAST ASIA"):
        current_region = "EA"
    elif line.startswith("# DATA NOTES"):
        current_region = None

    # Detect match and stage
    match_re = re.match(r"^## (QF\d|SF\d|Grand Final|QF\d:|SF\d:)?\s*(.+?) \(t1\) vs (.+?) \(t2\) — (.+)", line)
    if not match_re:
        match_re = re.match(r"^## (Quarterfinal|Semifinal|Grand Final):?\s*(.+?) \(t1\) vs (.+?) \(t2\)", line)

    if line.startswith("## ") and current_region and "vs" in line:
        # Parse match header
        if "QF" in line or "Quarterfinal" in line.split("—")[0]:
            current_stage = "Quarterfinal"
        elif "SF" in line or "Semifinal" in line.split("—")[0]:
            current_stage = "Semifinal"
        elif "Grand Final" in line:
            current_stage = "Grand Final"

        # Extract team names from (t1) vs (t2) pattern
        t_match = re.search(r":\s*(.+?)\s*\(t1\)\s*vs\s*(.+?)\s*\(t2\)", line)
        if not t_match:
            t_match = re.search(r"##\s*(?:Grand Final:\s*)?(.+?)\s*\(t1\)\s*vs\s*(.+?)\s*\(t2\)", line)
        if t_match:
            current_match = {
                "team1": t_match.group(1).strip(),
                "team2": t_match.group(2).strip(),
                "region": current_region,
                "stage": current_stage,
            }

    # Detect global bans
    if line.startswith("**Global Bans:**") and current_match:
        bans_str = line.replace("**Global Bans:**", "").strip()
        bans_str = re.sub(r"\*.*?\*", "", bans_str)  # Remove italics
        current_global_bans = [b.strip() for b in bans_str.split(",") if b.strip()]

    # Detect game header
    game_re = re.match(r"^### Game (\d+) — (.+?) \((.+?)\) — (.+?) wins (\d+)-(\d+)", line)
    if game_re and current_match and current_region:
        game_num = int(game_re.group(1))
        map_name = game_re.group(2)
        mode = game_re.group(3)
        winner_name = game_re.group(4)
        score1 = int(game_re.group(5))
        score2 = int(game_re.group(6))

        # Find the picks/bans table (next few lines)
        t1_picks = []
        t2_picks = []
        t1_bans = []
        t2_bans = []
        t1_name = ""
        t2_name = ""

        j = i + 1
        table_rows = []
        while j < len(lines) and j < i + 10:
            row = lines[j].strip()
            if row.startswith("| **"):
                table_rows.append(row)
            j += 1

        if len(table_rows) >= 2:
            # Parse team 1 row
            parts1 = [p.strip() for p in table_rows[0].split("|") if p.strip()]
            if len(parts1) >= 3:
                t1_name = re.sub(r"\*\*", "", parts1[0]).strip()
                t1_picks = [p.strip() for p in parts1[1].split(",")]
                t1_bans = [b.strip() for b in parts1[2].split(",")]

            # Parse team 2 row
            parts2 = [p.strip() for p in table_rows[1].split("|") if p.strip()]
            if len(parts2) >= 3:
                t2_name = re.sub(r"\*\*", "", parts2[0]).strip()
                t2_picks = [p.strip() for p in parts2[1].split(",")]
                t2_bans = [b.strip() for b in parts2[2].split(",")]

        # Determine winner side
        winner_side = None
        if winner_name in t1_name or t1_name in winner_name:
            winner_side = 1
        elif winner_name in t2_name or t2_name in winner_name:
            winner_side = 2

        game = {
            "region": current_region,
            "stage": current_stage,
            "match": f"{current_match['team1']} vs {current_match['team2']}",
            "team1": t1_name,
            "team2": t2_name,
            "game_num": game_num,
            "map": map_name,
            "mode": mode,
            "winner": winner_name,
            "winner_side": winner_side,
            "score": f"{score1}-{score2}",
            "t1_picks": t1_picks,
            "t2_picks": t2_picks,
            "t1_bans": t1_bans,
            "t2_bans": t2_bans,
            "global_bans": list(current_global_bans),
        }
        games.append(game)

    i += 1

print(f"Total games parsed: {len(games)}")
print(f"Regions: {set(g['region'] for g in games)}")
print()

# ==========================================
# 1. OVERALL PICK RATES
# ==========================================
pick_counts = Counter()
pick_wins = Counter()
pick_games = Counter()

for g in games:
    all_picks_t1 = set(g["t1_picks"])
    all_picks_t2 = set(g["t2_picks"])

    for brawler in g["t1_picks"]:
        pick_counts[brawler] += 1
        pick_games[brawler] += 1
        if g["winner_side"] == 1:
            pick_wins[brawler] += 1

    for brawler in g["t2_picks"]:
        pick_counts[brawler] += 1
        pick_games[brawler] += 1
        if g["winner_side"] == 2:
            pick_wins[brawler] += 1

print("=" * 70)
print("TOP 30 MOST PICKED BRAWLERS (across all 100 games)")
print("=" * 70)
print(f"{'Brawler':<20} {'Picks':>6} {'Pick%':>7} {'Wins':>6} {'WR%':>7}")
print("-" * 50)
for brawler, count in pick_counts.most_common(30):
    wr = (pick_wins[brawler] / count * 100) if count > 0 else 0
    pick_pct = count / len(games) * 100
    print(f"{brawler:<20} {count:>6} {pick_pct:>6.1f}% {pick_wins[brawler]:>6} {wr:>6.1f}%")

# ==========================================
# 2. OVERALL BAN RATES (per-game bans)
# ==========================================
ban_counts = Counter()
for g in games:
    for b in g["t1_bans"] + g["t2_bans"]:
        ban_counts[b] += 1

print()
print("=" * 70)
print("TOP 25 MOST BANNED BRAWLERS (per-game bans, across all games)")
print("=" * 70)
print(f"{'Brawler':<20} {'Bans':>6} {'Ban%':>7}")
print("-" * 35)
for brawler, count in ban_counts.most_common(25):
    ban_pct = count / len(games) * 100
    print(f"{brawler:<20} {count:>6} {ban_pct:>6.1f}%")

# ==========================================
# 3. GLOBAL BAN RATES
# ==========================================
global_ban_counts = Counter()
total_matches = len(set((g["region"], g["match"]) for g in games))
for g in games:
    pass  # global bans are per-match, need to deduplicate

# Collect unique matches
matches_seen = set()
for g in games:
    key = (g["region"], g["match"])
    if key not in matches_seen:
        matches_seen.add(key)
        for b in g["global_bans"]:
            global_ban_counts[b] += 1

print()
print("=" * 70)
print(f"TOP 20 GLOBAL BANS (across {len(matches_seen)} matches)")
print("=" * 70)
print(f"{'Brawler':<20} {'GBans':>6} {'GB%':>7}")
print("-" * 35)
for brawler, count in global_ban_counts.most_common(20):
    gb_pct = count / len(matches_seen) * 100
    print(f"{brawler:<20} {count:>6} {gb_pct:>6.1f}%")

# ==========================================
# 4. COMBINED PRESENCE (pick + ban + global ban)
# ==========================================
# Presence = picked OR banned (per-game) OR globally banned in that match
presence = Counter()
for g in games:
    seen_this_game = set()
    for b in g["t1_picks"] + g["t2_picks"] + g["t1_bans"] + g["t2_bans"] + g["global_bans"]:
        seen_this_game.add(b)
    for b in seen_this_game:
        presence[b] += 1

print()
print("=" * 70)
print("TOP 30 BRAWLER PRESENCE (picked OR banned OR globally banned)")
print("=" * 70)
print(f"{'Brawler':<20} {'Present':>8} {'Pres%':>7}")
print("-" * 40)
for brawler, count in presence.most_common(30):
    pres_pct = count / len(games) * 100
    print(f"{brawler:<20} {count:>8} {pres_pct:>6.1f}%")

# ==========================================
# 5. MAP-MODE BREAKDOWN
# ==========================================
map_mode_games = defaultdict(list)
for g in games:
    map_mode_games[(g["map"], g["mode"])].append(g)

print()
print("=" * 70)
print("MAP + MODE BREAKDOWN")
print("=" * 70)

# Sort by number of games played
for (map_name, mode), map_games in sorted(map_mode_games.items(), key=lambda x: -len(x[1])):
    print(f"\n{'='*60}")
    print(f"  {map_name} ({mode}) — {len(map_games)} games")
    print(f"{'='*60}")

    # Top picks on this map
    map_picks = Counter()
    map_pick_wins = Counter()
    map_bans = Counter()

    for g in map_games:
        for b in g["t1_picks"]:
            map_picks[b] += 1
            if g["winner_side"] == 1:
                map_pick_wins[b] += 1
        for b in g["t2_picks"]:
            map_picks[b] += 1
            if g["winner_side"] == 2:
                map_pick_wins[b] += 1
        for b in g["t1_bans"] + g["t2_bans"]:
            map_bans[b] += 1

    print(f"\n  Top Picks:")
    print(f"  {'Brawler':<18} {'Picks':>5} {'WR':>7}")
    for brawler, count in map_picks.most_common(10):
        wr = (map_pick_wins[brawler] / count * 100) if count > 0 else 0
        print(f"  {brawler:<18} {count:>5} {wr:>6.1f}%")

    print(f"\n  Top Bans:")
    for brawler, count in map_bans.most_common(8):
        print(f"  {brawler:<18} {count:>5}")

# ==========================================
# 6. MODE-LEVEL ANALYSIS
# ==========================================
mode_games = defaultdict(list)
for g in games:
    mode_games[g["mode"]].append(g)

print()
print("=" * 70)
print("MODE-LEVEL META SUMMARY")
print("=" * 70)

for mode, m_games in sorted(mode_games.items(), key=lambda x: -len(x[1])):
    mode_picks = Counter()
    mode_pick_wins = Counter()
    mode_bans = Counter()

    for g in m_games:
        for b in g["t1_picks"]:
            mode_picks[b] += 1
            if g["winner_side"] == 1:
                mode_pick_wins[b] += 1
        for b in g["t2_picks"]:
            mode_picks[b] += 1
            if g["winner_side"] == 2:
                mode_pick_wins[b] += 1
        for b in g["t1_bans"] + g["t2_bans"]:
            mode_bans[b] += 1

    print(f"\n{'='*50}")
    print(f"  {mode} — {len(m_games)} games")
    print(f"{'='*50}")
    print(f"  Top 8 Picks (2+ picks):")
    print(f"  {'Brawler':<18} {'Picks':>5} {'WR':>7}")
    for brawler, count in mode_picks.most_common(8):
        if count >= 2:
            wr = (mode_pick_wins[brawler] / count * 100) if count > 0 else 0
            print(f"  {brawler:<18} {count:>5} {wr:>6.1f}%")
    print(f"  Top 5 Bans:")
    for brawler, count in mode_bans.most_common(5):
        print(f"  {brawler:<18} {count:>5}")

# ==========================================
# 7. REGION-LEVEL META DIFFERENCES
# ==========================================
print()
print("=" * 70)
print("REGIONAL META DIFFERENCES")
print("=" * 70)

for region in ["NA", "EMEA", "SA", "EA"]:
    r_games = [g for g in games if g["region"] == region]
    r_picks = Counter()
    r_bans = Counter()

    for g in r_games:
        for b in g["t1_picks"] + g["t2_picks"]:
            r_picks[b] += 1
        for b in g["t1_bans"] + g["t2_bans"]:
            r_bans[b] += 1

    print(f"\n  {region} ({len(r_games)} games)")
    print(f"  Top 5 Picks: {', '.join(f'{b}({c})' for b, c in r_picks.most_common(5))}")
    print(f"  Top 5 Bans:  {', '.join(f'{b}({c})' for b, c in r_bans.most_common(5))}")

# ==========================================
# 8. STAGE-LEVEL META (QF vs SF vs GF)
# ==========================================
print()
print("=" * 70)
print("STAGE-LEVEL META (does meta shift in later rounds?)")
print("=" * 70)

for stage in ["Quarterfinal", "Semifinal", "Grand Final"]:
    s_games = [g for g in games if g["stage"] == stage]
    s_picks = Counter()

    for g in s_games:
        for b in g["t1_picks"] + g["t2_picks"]:
            s_picks[b] += 1

    print(f"\n  {stage} ({len(s_games)} games)")
    print(f"  Top 8: {', '.join(f'{b}({c})' for b, c in s_picks.most_common(8))}")

# ==========================================
# 9. HIGH WIN-RATE BRAWLERS (min 5 picks)
# ==========================================
print()
print("=" * 70)
print("HIGH WIN-RATE BRAWLERS (minimum 5 picks)")
print("=" * 70)
print(f"{'Brawler':<20} {'Picks':>6} {'Wins':>6} {'WR%':>7}")
print("-" * 45)
qualified = [(b, pick_counts[b], pick_wins[b]) for b in pick_counts if pick_counts[b] >= 5]
qualified.sort(key=lambda x: -(x[2] / x[1]))
for brawler, picks, wins in qualified[:20]:
    wr = wins / picks * 100
    print(f"{brawler:<20} {picks:>6} {wins:>6} {wr:>6.1f}%")

# ==========================================
# 10. BRAWLER PAIR SYNERGIES (same team)
# ==========================================
print()
print("=" * 70)
print("TOP BRAWLER PAIR SYNERGIES (picked together on same team)")
print("=" * 70)

pair_count = Counter()
pair_wins = Counter()

for g in games:
    for team_picks, win_side, side in [(g["t1_picks"], g["winner_side"], 1), (g["t2_picks"], g["winner_side"], 2)]:
        if len(team_picks) >= 2:
            for a_idx in range(len(team_picks)):
                for b_idx in range(a_idx + 1, len(team_picks)):
                    pair = tuple(sorted([team_picks[a_idx], team_picks[b_idx]]))
                    pair_count[pair] += 1
                    if win_side == side:
                        pair_wins[pair] += 1

print(f"{'Pair':<35} {'Times':>6} {'Wins':>6} {'WR%':>7}")
print("-" * 58)
for pair, count in pair_count.most_common(25):
    if count >= 3:
        wr = pair_wins[pair] / count * 100
        print(f"{pair[0] + ' + ' + pair[1]:<35} {count:>6} {pair_wins[pair]:>6} {wr:>6.1f}%")

# ==========================================
# 11. NEVER PICKED / RARELY SEEN
# ==========================================
print()
print("=" * 70)
print("BRAWLERS PICKED ONLY ONCE")
print("=" * 70)
for brawler, count in pick_counts.most_common():
    if count == 1:
        # Find which game
        for g in games:
            if brawler in g["t1_picks"] or brawler in g["t2_picks"]:
                print(f"  {brawler}: {g['map']} ({g['mode']}) — {g['region']} {g['stage']}")
                break

print()
print("DONE. Total brawlers seen in picks:", len(pick_counts))
print("Total unique brawlers banned (per-game):", len(ban_counts))
