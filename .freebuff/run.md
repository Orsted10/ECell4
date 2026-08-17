# E-Cell CUUP — run guide

## Reproduce the uncommitted artifacts a fresh checkout needs

- No `.env*` files exist in this project; nothing to copy.
- Install dependencies: `npm install` (generates `node_modules` and `package-lock.json`).
- The dev server needs no build step; `next dev` compiles on demand.
- Optional production build check: `npm run build`.

## Run the server

- Default port 3000 is frequently occupied by other worktrees, so this project runs on **3100**.
- Start detached (Windows), stdout and stderr to separate files:

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--port','3100' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- Confirm it survived: `powershell -NoProfile -Command "Get-Process -Id <pid>"`.
- Wait until `http://localhost:3100` answers before registering a preview.
