# Publication du calculateur

Dépôt dédié : https://github.com/cyrilAndro/fikolasai-gains-ia

Ce projet est indépendant du dépôt et du projet « Site FikolasAI ».

Le workflow `.github/workflows/ci.yml` vérifie TypeScript, ESLint, les tests unitaires et les parcours Chromium avant de publier le build sur GitHub Pages. Le chemin Vite utilise automatiquement le nom du dépôt.

Dans Settings > Pages, choisir **GitHub Actions** comme source. La publication se lance au push sur main ou manuellement depuis Actions > Vérification et publication.

Adresse attendue une fois le déploiement réussi : https://cyrilandro.github.io/fikolasai-gains-ia/

Pour travailler localement : Node 24.19, `npm ci`, puis `npm run dev`.
Pour publier les évolutions : committer et pousser vers ce dépôt uniquement. Ne pas ajouter de CNAME vers fikolasai.com.

## Intégration au site principal — 7 octobre 2026

L’utilisateur a demandé explicitement une nouvelle page sur son site principal après la création du dépôt indépendant.

Adresse destinée à la prospection : https://fikolasai.com/calculateur-ia/
Version anglaise : https://fikolasai.com/calculateur-ia/?lang=en

`npm run build:site` construit la page native dans `.tools/site-integration/calculateur-ia/`, avec ses ressources locales, ses métadonnées de partage et sa référence canonique. Publier uniquement ce dossier dans `cyrilAndro/fikolasai.github.io`, sans modifier son CNAME. Le code source et les formules restent maintenus dans le présent dépôt.

Les accueils français et anglais proposent un lien dans la navigation desktop et sous l’action principale (accessible sur mobile). Le sitemap inclut cette page. Pour une nouvelle version, vérifier les parcours avec `E2E_BASE_PATH=/calculateur-ia/` sur un aperçu servant le dossier d’intégration.

### Cloudflare Web Analytics

Le build destiné au site principal inclut le script officiel Cloudflare, avec le même token public que le site fikolasai.com (configuration « JS Snippet installation »). Les visites de `/calculateur-ia/` sont ainsi rattachées aux statistiques existantes. Les nombres, le nom de tâche et les résultats du calculateur ne sont pas transmis au script. Ce suivi mesure les visites et performances de page ; il ne mesure pas les simulations terminées. Le build indépendant GitHub Pages reste sans fournisseur analytics.

Pour retrouver la page : Cloudflare → Web Analytics → fikolasai.com → Page views → Paths → `/calculateur-ia/`. Les données peuvent prendre quelques minutes à apparaître ; les visites de test doivent être distinguées des visites de prospects.
