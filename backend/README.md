# Saving Satoshi course backend

> **Disclaimer:** This backend is a vibe-coded project developed with AI assistance.

This Ruby/Sinatra service stores student accounts and progress in SQLite.
The frontend uses the public Saving Satoshi runner for code execution.

Choose your setup:

- [Try the demo locally](demo/README.md): four synthetic accounts and sample progress.
- [Start a local course database](deploy/README.md#local-course-setup): test with your own accounts.
- [Deploy frontend and backend on one server](deploy/README.md#deploy-on-one-server): HTTPS with Caddy, or an existing Nginx proxy.

The rest of this README covers student administration. The
[user management API comparison](../docs/user-management-api.md) documents
the HTTP calls and the original backend.

## Manage accounts

After following a setup guide, open another terminal in `backend/` and select
**the same database** as the running service. For a local course database:

```sh
cd /path/to/saving-satoshi/backend
export DATABASE_PATH=./var/course.sqlite3
```

For the demo, use `export DATABASE_PATH=./var/demo.sqlite3` instead. On the server,
[load the service environment](deploy/README.md#run-administrative-commands-on-the-server).
The username is an administrative label; students sign in using their 64-character
hexadecimal key in the frontend **private key** field.

| Action                             | Command                                                |
| ---------------------------------- | ------------------------------------------------------ |
| Create an account                  | `bundle exec ruby bin/admin create student001`         |
| List accounts                      | `bundle exec ruby bin/admin list`                      |
| Deactivate an account              | `bundle exec ruby bin/admin deactivate student001`     |
| Reactivate an account              | `bundle exec ruby bin/admin activate student001`       |
| Reset a login key                  | `bundle exec ruby bin/admin reset-password student001` |
| Delete an account and its progress | `bundle exec ruby bin/admin delete student001`         |

`list` shows each student's active status (`1` or `0`), creation time, and last
login. Use the progress export below to see their course status.

`create` and `reset-password` ask twice for a new login key, hiding your input.
To generate one, run `ruby -rsecurerandom -e 'puts SecureRandom.hex(32)'`, then copy
it into the prompts. Keep it private. Do not put keys in command arguments or
shell history. For scripted input, `--password-stdin` reads one line from stdin.
Deactivation and password resets revoke existing sessions.

## Import accounts from CSV

The [demo CSV](demo/accounts.csv) shows the exact format. Use **UTF-8**, a **comma**
separator, and the header **`username,password`**. Include one account per row:

```csv
username,password
student001,5a492ffc15c7885d454956913d10640a452a30a17984d39bec9a0721bc951da2
student002,c492c58d1713945ebfa5ad8562a37997f0c59a9b624166cd7400572235682df0
```

These published keys are examples only. Generate fresh keys for real students.

- **`username`:** 1–64 ASCII characters. Start with a letter or digit; remaining
  characters may also include `.`, `_`, and `-`. No spaces or umlauts. Names are
  converted to lowercase and must be unique.
- **`password`:** a different random 64-character hexadecimal key for each account.
  Use `0–9` and `a–f`/`A–F`, without `0x`, spaces, or hyphens. It must be a
  cryptographically secure 256-bit (32-byte) number, represented as a
  64-character hex string. Ordinary text passwords are not supported.
  Students enter this value in the frontend's **private key** field.
- Include 1–2000 accounts. Do not add extra columns, comments, or blank rows.
  Both LF and CRLF line endings work; a UTF-8 BOM is accepted.
- In Excel, choose comma-separated UTF-8 CSV and keep keys as text.
  Semicolon-separated CSV is rejected.

With the database selected as above, import the file:

```sh
bundle exec ruby bin/admin import-csv /private/course-users.csv
bundle exec ruby bin/admin list
```

Replace `/private/course-users.csv` with your file path. Import creates active
accounts with no saved progress. Invalid rows, duplicate names or keys, and existing
accounts cancel the entire import. Import never silently resets passwords.
SQLite stores bcrypt hashes and a lookup hash; it does not store plaintext keys.

### Generate a CSV for a whole class

The following creates 150 accounts, `student001` through `student150`, with fresh
random keys. Replace `/private/course-users.csv` with a new file path in an existing
private folder outside the repository. Change `150` to the number of students:

```sh
ruby -rcsv -rsecurerandom - 150 /private/course-users.csv <<'RUBY'
count = Integer(ARGV.fetch(0))
raise 'Count must be 1–2000' unless count.between?(1, 2000)
File.open(ARGV.fetch(1), File::WRONLY | File::CREAT | File::EXCL, 0o600) do |file|
  csv = CSV.new(file)
  csv << %w[username password]
  count.times { |i| csv << [format('student%03d', i + 1), SecureRandom.hex(32)] }
end
RUBY
bundle exec ruby bin/admin import-csv /private/course-users.csv
```

Existing files are not overwritten. You can edit the usernames before importing.
Give each student only their own key. Keep the CSV private; do not commit it to the
repository or share it with the class.

## Check student progress and export CSV

Run from `backend/` with the same `DATABASE_PATH` selected:

```sh
bundle exec ruby bin/admin export-progress
bundle exec ruby bin/admin export-progress ./var/progress.csv
```

The first command prints every student's status as CSV; find a username to
inspect one student. The second writes a **new** file; choose another filename
if it already exists. The export includes username,
active status, current chapter and lesson, completed and total lessons, completion
percentage, last progress update, and last login. Times are UTC.

Intro and outro pages count as lessons. The count uses enabled chapters and the
selected difficulty; accounts without saved progress have no lesson total yet.
Progress is reported by the frontend, so use it to monitor learning rather than
as tamper-resistant grading.

## Back up and restore

From `backend/`, with the same database selected:

```sh
bundle exec ruby bin/admin backup ./var/course-backup.sqlite3
```

Choose a new destination filename. This command safely backs up a running database,
including committed changes in SQLite's WAL. Do not copy only the live `.sqlite3`
file. Keep backups private and copy them to a separate location.

To restore:

1. Stop the backend.
2. Move the current database and any matching `-wal` and `-shm` files aside.
3. Copy the backup to the configured database path. Set its owner to the backend
   service user and its file permissions to `0600`.
4. Restart the backend. Frontend sessions may need a new login. A backup can contain
   old sessions; remove them before restarting if needed:
   `sqlite3 "$DATABASE_PATH" 'DELETE FROM sessions;'`.
