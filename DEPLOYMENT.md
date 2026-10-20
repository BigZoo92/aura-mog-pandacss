# Déploiement — Aura Battle

Application 100 % statique : **GitHub → Dokploy → Nixpacks → `pnpm run build` → `./dist` → nginx (port 80) → HTTPS**.
Pas de serveur Node en production, pas de variable d'environnement, pas de secret.

| Outil | Version | Déclarée dans |
| --- | --- | --- |
| Node.js | 24.x (LTS) | `package.json` → `engines.node` (lu par Nixpacks et par la CI) |
| pnpm | 9.10.0 | `package.json` → `packageManager` (Corepack) |

Node ≥ 22 est obligatoire (Panda CSS 2) ; on fixe 24 pour rester sur la LTS active.

## 1. Développement local

```bash
corepack enable                   # une fois, pour utiliser le pnpm déclaré
pnpm install --frozen-lockfile    # lance aussi `panda codegen` (script prepare)
pnpm dev                          # http://localhost:5173
pnpm build                        # panda codegen + tsc -b + vite build → dist/
pnpm preview                      # sert dist/ sur http://localhost:4173
pnpm test && pnpm verify:css      # tests + contrôle des @keyframes du CSS de prod (après build)
```

`styled-system/` et `dist/` sont générés : ne pas les versionner.

## 2. GitHub

Le dépôt est déjà relié : `origin` → `https://github.com/BigZoo92/aura-mog-pandacss.git`, branche `main`.

Pour un nouveau clone ou un autre remote :

```bash
git remote add origin https://github.com/<user>/<repo>.git   # ou: git remote set-url origin …
git push -u origin main
```

Avec GitHub CLI : `gh repo create <repo> --private --source . --remote origin --push`.

La CI (`.github/workflows/ci.yml`) lance lint, build, tests et `verify:css` à chaque push ou PR. Elle ne déploie rien : Dokploy déploie même si la CI échoue, donc regardez l'onglet **Actions** en cas de doute.

## 3. Dokploy

### Connecter GitHub (une seule fois)
**Settings → Git → GitHub → Create GitHub App**, puis installer l'app sur le compte et autoriser le dépôt `aura-mog-pandacss`. Si le dépôt est privé, c'est indispensable.

### Créer l'application
**Projects → (projet) → Create Service → Application**, nom `aura-battle`.

Onglet **General** :

| Champ | Valeur |
| --- | --- |
| Provider | GitHub |
| Repository | `aura-mog-pandacss` |
| Branch | `main` |
| Build Path | `/` |
| Build Type | **Nixpacks** |
| Publish Directory | `./dist` |

Cliquer **Save**, puis **Deploy**.

Aucune variable d'environnement n'est nécessaire. Le mode SPA n'est pas utile : l'app n'a qu'une page et ses liens profonds sont des query strings (`/?seek=…`, `/?mode=playground…`, `/?lab…`), toujours servies par `index.html`.

### Domaine et HTTPS
1. Chez votre registrar : un enregistrement **A** `aura.mondomaine.fr` → IP du VPS (et **AAAA** si IPv6).
2. Onglet **Domains → Add Domain** : Host `aura.mondomaine.fr`, Path `/`, **Container Port `80`**, **HTTPS activé**, Certificate **Let's Encrypt**.
3. Pour tester sans DNS : bouton **Generate** (domaine `*.traefik.me`, en HTTP uniquement).

### Déploiement automatique
Avec le provider GitHub (GitHub App), **Auto Deploy** est activé par défaut : chaque push sur `main` relance un build. Vérifiez que l'option est cochée dans **General**.

### Logs
- **Deployments** → cliquer sur un déploiement → logs du build Nixpacks (install, codegen, tsc, vite).
- **Logs** → logs du conteneur nginx (requêtes, 404).

## 4. Déploiements suivants

```bash
git add -A
git commit -m "…"
git push            # Dokploy reçoit le webhook GitHub et redéploie main
```

## 5. Debug

| Symptôme | Cause probable / correctif |
| --- | --- |
| `Node.js v18…` dans les logs, ou `@pandacss/dev` / Vite refuse de démarrer | Nixpacks trop ancien : Node 24 n'existe qu'à partir de **Nixpacks 1.41.0**, et une version non supportée retombe sur Node 18 sans erreur. Vérifier sur le VPS avec `nixpacks --version`, puis mettre à jour Dokploy ou Nixpacks. |
| `ERR_PNPM_OUTDATED_LOCKFILE` | `package.json` modifié sans le lockfile : lancer `pnpm install` en local, commiter `pnpm-lock.yaml`. |
| Erreur Corepack ou signature à l'install | Garder `packageManager: pnpm@9.10.0` (Nixpacks utilise Corepack 0.24.1, qui ne connaît pas les clés de signature npm récentes). |
| `panda codegen` échoue | Le build importe `src/choreography/**` depuis `panda.config.ts` : reproduire avec `pnpm build` en local, l'erreur TypeScript ou d'import y est identique. |
| `tsc -b` en erreur | Lancer `pnpm typecheck` en local ; le build s'arrête avant Vite. |
| `dist` introuvable / « publish directory not found » | Le build a échoué plus haut (lire le log), ou Publish Directory ≠ `./dist`, ou Build Path ≠ `/`. |
| Page blanche | Console du navigateur : un 404 sur `/assets/*.js` signifie que le site est servi depuis un sous-chemin (le build suppose la racine du domaine, Path `/`). |
| Routes en 404 | Pas de routes par chemin dans cette app : n'utiliser que `/?…`. Si on ajoute un routeur un jour, activer le mode SPA de l'app static dans Dokploy. |
| Styles ou animations absents | Le CSS est mal généré : lancer `pnpm build && pnpm verify:css` en local (vérifie que chaque `@keyframes` référencé existe). Polices manquantes : Google Fonts bloqué côté client, sans lien avec le build. |
| Certificat non émis / erreur TLS | DNS pas encore propagé (`dig +short aura.mondomaine.fr` doit renvoyer l'IP du VPS), ports 80 et 443 fermés sur le pare-feu, ou proxy Cloudflare activé avant l'émission du certificat. Après correction, redéployer ou réenregistrer le domaine. |
