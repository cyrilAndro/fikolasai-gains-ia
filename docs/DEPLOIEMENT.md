# Publication du calculateur

Dépôt dédié : https://github.com/cyrilAndro/fikolasai-gains-ia

Ce projet est indépendant du dépôt et du projet « Site FikolasAI ».

Le workflow `.github/workflows/ci.yml` vérifie TypeScript, ESLint, les tests unitaires et les parcours Chromium avant de publier le build sur GitHub Pages. Le chemin Vite utilise automatiquement le nom du dépôt.

Dans Settings > Pages, choisir **GitHub Actions** comme source. La publication se lance au push sur main ou manuellement depuis Actions > Vérification et publication.

Adresse attendue une fois le déploiement réussi : https://cyrilandro.github.io/fikolasai-gains-ia/

Pour travailler localement : Node 24.19, `npm ci`, puis `npm run dev`.
Pour publier les évolutions : committer et pousser vers ce dépôt uniquement. Ne pas ajouter de CNAME vers fikolasai.com.
