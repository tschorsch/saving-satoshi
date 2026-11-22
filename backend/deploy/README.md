# Set up the frontend and backend

> **Disclaimer:** This course adaptation and its backend are a vibe-coded project developed with AI assistance.

Use [the local course setup](#local-course-setup) to test with your own database,
or [deploy on one server](#deploy-on-one-server) for students. The separate
[demo guide](../demo/README.md) uses synthetic accounts and progress. Account
creation, CSV import, exports, and backups are in the [backend README](../README.md).

## Local course setup

You need Ruby 3.2 or later, Bundler, Node 26.11.1 (see `.nvmrc`), and Yarn 1.
Use two terminal windows. Replace `/path/to/saving-satoshi` with your project folder:
the folder containing `package.json` and `backend/`.

1. **Prepare the backend in terminal 1.**

   ```sh
   cd /path/to/saving-satoshi/backend
   bundle config set --local path vendor/bundle
   bundle install
   DATABASE_PATH=./var/course.sqlite3 bundle exec ruby bin/admin init
   ```

   Bundler installs gems under `backend/vendor/bundle`, where your user can write.
   Run the `bundle config` command once in `backend/`; its local configuration and
   installed gems are ignored by Git. The database command creates the file if it
   is missing and keeps any existing accounts.

2. **Start the backend in the same terminal.**

   ```sh
   DATABASE_PATH=./var/course.sqlite3 bundle exec puma -C puma.rb config.ru
   ```

   The API runs at `http://localhost:8000`. Keep this terminal open.

3. **Start the frontend in terminal 2.**

   ```sh
   cd /path/to/saving-satoshi
   yarn install --frozen-lockfile
   NEXT_PUBLIC_API_ENDPOINT=http://localhost:8000 NEXT_PUBLIC_WS_ENDPOINT=wss://api.savingsatoshi.com yarn dev
   ```

   These settings select the local REST API and the public runner. They override
   existing frontend environment values for this command. No `.env.local` edit is
   needed. Code execution needs an internet connection.

4. **Open the frontend and create or sign in to an account.**

   Open `http://localhost:3000/en/chapters`, then the profile at the top right.
   For a quick test, use the existing **Create account** flow. For named student
   accounts, use the [CLI or CSV import](../README.md#manage-accounts).

   Students sign in with a **64-character hexadecimal login key** in the
   **private key** field. The username is an administrative label and is not entered
   at login. Give each student their own random key; never use a real wallet key.
   Self-created accounts get names such as `self-<random ID>`.

5. **Stop or restart the services.**

   Press **Ctrl+C** in each terminal to stop. Accounts and progress remain in
   `backend/var/course.sqlite3`. Next time, repeat the start commands in steps 2 and 3.

To prevent self-registration, prefix the backend start command with
`ALLOW_REGISTRATION=false`. The original frontend registration button stays visible,
but the backend rejects registration requests.

## Deploy on one server

Use one Linux server, one domain, SQLite, two small systemd services, and Caddy
for HTTPS. Caddy automatically obtains and renews certificates
([how automatic HTTPS works](https://caddyserver.com/docs/automatic-https)).

```text
Browser -> https://satoshi.example.edu -> Caddy
                                         /v1/* -> Puma    127.0.0.1:8000 -> SQLite
                                         /*    -> Next.js 127.0.0.1:3000
Browser -> public Saving Satoshi runner
```

**Before starting:** log in to your Debian/Ubuntu server over SSH. You need sudo, systemd,
Ruby/Bundler, Node as specified in `.nvmrc`, and Yarn 1. Ruby, Bundler, Node, and
Yarn must be installed system-wide and available to the `satoshi` service user.
You also need the native build toolchain, `build-essential` on Debian/Ubuntu,
because of gems with C extensions.
The domain's DNS must point to this server, and ports **80 and 443** must be reachable.
The application ports 3000 and 8000 stay local.

Replace **`satoshi.example.edu`** with your domain in the examples below.
These steps use `/srv/saving-satoshi` for code and `/var/lib/saving-satoshi` for data.
If your frontend already uses Nginx, follow steps 1–4 and 6–7 below and use the
[existing Nginx proxy instructions](#use-an-existing-nginx-proxy)
for step 5.
For updates, refer to the section on [updating the deployment](#updating-the-deployment).

1. **Put the project on the server and prepare its folders.**

   Clone the repo into `/srv/saving-satoshi` and create the `satoshi` user:

   ```sh
   sudo git clone https://github.com/tschorsch/saving-satoshi.git /srv/saving-satoshi
   sudo useradd --system --user-group --home-dir /srv/saving-satoshi --shell /usr/sbin/nologin satoshi
   sudo chown -R satoshi:satoshi /srv/saving-satoshi
   sudo install -d -o satoshi -g satoshi -m 0700 /var/lib/saving-satoshi
   sudo install -d -o root -g satoshi -m 0750 /etc/saving-satoshi
   ```

   Skip `useradd` if that account already exists. Keep the database on a local disk.

2. **Install and configure the backend.**

   ```sh
   sudo -u satoshi sh -c 'cd /srv/saving-satoshi/backend && bundle config set --local path vendor/bundle && bundle install'
   sudo install -o root -g satoshi -m 0640 /srv/saving-satoshi/backend/deploy/backend.env.example /etc/saving-satoshi/backend.env
   sudo nano /etc/saving-satoshi/backend.env
   ```

   In this file, change these two values to your domain:

   ```dotenv
   ALLOWED_HOSTS=satoshi.example.edu,localhost,127.0.0.1
   ALLOWED_ORIGINS=https://satoshi.example.edu
   ```

   Keep `DATABASE_PATH=/var/lib/saving-satoshi/course.sqlite3` and
   `BIND=tcp://127.0.0.1:8000`. Optionally set `ALLOW_REGISTRATION=false` if you
   want only CLI-created accounts. Then initialize the database:

   ```sh
   sudo -u satoshi sh -c 'cd /srv/saving-satoshi/backend && set -a && . /etc/saving-satoshi/backend.env && set +a && bundle exec ruby bin/admin init'
   ```

3. **Install and build the frontend.**

   Change the domain in this command before running it:

   ```sh
   sudo -u satoshi sh -c 'cd /srv/saving-satoshi && yarn install --frozen-lockfile && NEXT_PUBLIC_API_ENDPOINT=https://satoshi.example.edu NEXT_PUBLIC_WS_ENDPOINT=wss://api.savingsatoshi.com yarn build'
   ```

   The REST URL is embedded into the frontend during this build. The explicit
   values override existing `.env.local` settings. Keep this command with your
   domain for future rebuilds. The public runner URL stays as shown.

4. **Keep both services running after logout and reboot.**

   Check the executable paths available to the service user:

   ```sh
   sudo -u satoshi sh -c 'command -v bundle'
   sudo -u satoshi sh -c 'command -v node'
   ```

   Install the two supplied service files:

   ```sh
   sudo install -m 0644 /srv/saving-satoshi/backend/deploy/saving-satoshi-backend.service /etc/systemd/system/
   sudo install -m 0644 /srv/saving-satoshi/backend/deploy/saving-satoshi-frontend.service /etc/systemd/system/
   sudo nano /etc/systemd/system/saving-satoshi-backend.service
   sudo nano /etc/systemd/system/saving-satoshi-frontend.service
   ```

   Set the first path in each `ExecStart=` line to the corresponding path printed
   above: `bundle` for the backend, `node` for the frontend. Keep the arguments.
   Then start the services:

   ```sh
   sudo systemctl daemon-reload
   sudo systemctl enable --now saving-satoshi-backend saving-satoshi-frontend
   ```

5. **Publish the website with HTTPS.**

   [Install Caddy](#install-caddy-on-debian-or-ubuntu) if it is missing or [use
   an existing Nginx proxy](#use-an-existing-nginx-proxy).
   Open `/etc/caddy/Caddyfile` and add the site block from
   [Caddyfile.example](Caddyfile.example), replacing `satoshi.example.edu`
   with your domain. Keep any other sites already in the file. The `/v1/`
   prefix must reach Puma unchanged.

   ```sh
   sudo nano /etc/caddy/Caddyfile
   sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
   sudo systemctl enable --now caddy
   sudo systemctl reload caddy
   ```

6. **Check the website and API.**

   ```sh
   curl --fail http://127.0.0.1:8000/health
   curl --fail https://satoshi.example.edu/v1/features
   ```

   Open `https://satoshi.example.edu/en/chapters` in your browser and sign in with
   a course account. Create or import accounts using the
   [server administration commands](#run-administrative-commands-on-the-server).

7. **Restart or inspect the services when needed.**

   ```sh
   sudo systemctl restart saving-satoshi-backend saving-satoshi-frontend
   sudo systemctl status --no-pager saving-satoshi-backend saving-satoshi-frontend caddy
   sudo journalctl -u saving-satoshi-backend -u saving-satoshi-frontend --no-pager -n 50
   ```

   Back up SQLite with the [backup command](../README.md#back-up-and-restore).
   For updates, rebuild with the same command and domain from step 3, then restart
   both services. The database remains outside the project folder.

## Install Caddy on Debian or Ubuntu

Skip this section if Caddy is already installed. These commands use the
[official stable package repository](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)
and install its `caddy` systemd service:

```sh
sudo apt install --yes debian-keyring debian-archive-keyring apt-transport-https curl gnupg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
sudo chmod o+r /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Return to [step 5 of the server setup](#deploy-on-one-server) to add your domain
and proxy routes. Your DNS must point to the server and ports 80/443 must be
reachable for [automatic HTTPS](https://caddyserver.com/docs/automatic-https).

## Use an existing Nginx proxy

Keep your existing HTTPS proxy. Follow steps 1–4 and 6–7 of the
[server setup](#deploy-on-one-server), replacing its Caddy step with this one.
Use your domain for the frontend build and backend environment; check `nginx`
instead of `caddy` in the final service status command.

In the existing HTTPS `server` block, forward `/v1/` to
`http://127.0.0.1:8000` and the frontend to `http://127.0.0.1:3000`. The
[complete Nginx example](nginx.conf.example) contains the proxy headers and
both locations. Keep its `proxy_pass` for `/v1/` without a trailing slash so the
backend receives the full request path. Update your existing frontend location
rather than adding a duplicate. Keep your server's own domain and certificate paths;
the example assumes a valid TLS certificate. Only one proxy should serve ports 80/443.

```sh
sudo nginx -t
sudo systemctl reload nginx
```

## Updating the deployment

1. Pull the latest code using `sudo -u satoshi sh -c 'cd /srv/saving-satoshi && git
pull --ff-only'`.
2. Re-run the first command in step 2 (backend bundle install) and step 3 (frontend install and rebuild with your domain).
  - **be careful not to overwrite your existing configuration file in
    `/etc/saving-satoshi/backend.env`**
3. If the update changed the service files, reinstall them per step 4.
4. Finally, restart both services and verify as shown in step 7.

## Run administrative commands on the server

Open a shell as the service user and load the same configuration as the backend:

```sh
sudo -u satoshi /bin/sh
cd /srv/saving-satoshi/backend
set -a
. /etc/saving-satoshi/backend.env
set +a
bundle exec ruby bin/admin list
```

The environment file selects `/var/lib/saving-satoshi/course.sqlite3`.
Keep it loaded when creating/importing accounts, exporting progress, or making a
backup. See the [account commands](../README.md#manage-accounts),
[CSV format](../README.md#import-accounts-from-csv), and
[backup instructions](../README.md#back-up-and-restore).

## Runtime paths

The main setup assumes system-wide Ruby/Bundler, Node, and Yarn installations that
the `satoshi` user can run. A runtime installed only in your personal home directory
is not automatically available to that user.

If using a version manager for the service user, set the absolute executable paths
and its runtime `PATH` in each systemd unit. Keep code at `/srv/saving-satoshi` and
ensure the same user can install dependencies, build the frontend, and start both
services. Service errors are available with `journalctl -u saving-satoshi-backend`
and `journalctl -u saving-satoshi-frontend`.

## Configuration reference

Backend settings come from environment variables; `backend/.env.example` is **not
loaded automatically**. Set them in the shell or the service environment file.

| Variable              | Default                      | Purpose                                                                 |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| `DATABASE_PATH`       | `backend/var/course.sqlite3` | SQLite file; explicit relative paths resolve from the working directory |
| `BIND`                | `tcp://127.0.0.1:8000`       | Backend address                                                         |
| `ALLOWED_ORIGINS`     | `http://localhost:3000`      | Allowed frontend origins, comma-separated, no trailing slash            |
| `ALLOWED_HOSTS`       | `localhost,127.0.0.1,::1`    | Allowed HTTP hostnames, without scheme or port                          |
| `ALLOW_REGISTRATION`  | `true`                       | Allow the existing frontend signup flow                                 |
| `SESSION_TTL_SECONDS` | `28800`                      | Session lifetime: eight hours                                           |
| `COURSE_CHAPTER_IDS`  | `1,2,3,8,9,10`               | Enabled chapters and progress export scope                              |

Frontend settings:

```dotenv
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8000
NEXT_PUBLIC_WS_ENDPOINT=wss://api.savingsatoshi.com
```

For persistent local settings, put these in `.env.local` in the project root.
Restart `yarn dev` after changing them. Production settings are embedded during
`yarn build`; see the [server setup](#deploy-on-one-server). Use HTTPS for the
public website. The frontend keeps credentials in tab-local session storage;
logout clears them.

## Run tests

From the project folder:

```sh
cd backend
bundle exec ruby -Itest -e 'Dir["test/*_test.rb"].sort.each { |f| require_relative f }'
cd ..
yarn test
yarn tsc --noEmit
yarn build
```

Optional browser tests need an installed Playwright browser:

```sh
yarn playwright install chromium
yarn test:student-e2e
```

Browser tests use temporary data and ports 8001/3001. For endpoints, database schema,
and frontend changes, see the [implementation analysis](../../docs/student-backend-analysis.md)
and [user management API comparison](../../docs/user-management-api.md).
