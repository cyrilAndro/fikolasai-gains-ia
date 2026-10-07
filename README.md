# FikolasAI — estimation de temps récupérable

Une page React + TypeScript + Vite : une tâche, trois valeurs numériques, une hypothèse et un contact direct. Aucun compte, backend ou fournisseur analytics.

## Lancer

Node 24.19 (voir `.nvmrc`) :

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5173/. Le lanceur Windows `Lancer-calculateur.cmd` reste disponible.

## Personnaliser

- `src/config/brand.ts` : `CTA_URL` (adresse de contact actuelle, à remplacer par une page contact ou réservation), identité, suggestions et `GAIN_OPTIONS` / `DEFAULT_GAIN`.
- `src/App.tsx` : textes, valeurs initiales (1 personne, temps à saisir, 35 €/h indicatifs).
- `src/config/sources.ts` : liens et descriptions des références NBER, Harvard/BCG et Microsoft. Ces sources contextualisent les hypothèses ; elles ne valident pas les taux proposés.
- `src/styles.css` : présentation responsive et couleurs FikolasAI.
- `src/domain/calculations.ts` : calcul pur et validation. `efficiencyGain` est une fraction (0,3 = 30 %).
- `src/lib/analytics.ts` : `configureAnalytics(handler)` reçoit seulement trois noms d’événement. Aucun envoi par défaut, aucune valeur saisie transmise. Ouverture une fois par montage, première simulation valide une fois par simulation, clic contact à chaque clic. Réinitialiser autorise un nouvel événement de simulation terminée.

## Calcul

Temps mensuel = personnes × heures hebdomadaires par personne × **4,33**.
Temps récupérable = temps mensuel × hypothèse.
Valeur mensuelle = temps récupérable × coût horaire. Valeur annuelle = valeur mensuelle × 12.
Aucun arrondi intermédiaire. Affichage entier, « < 1 » pour une valeur positive inférieure à 1.

Exemple : 10 personnes × 2 h/semaine × 35 €/h à 30 % = 86,6 h actuelles, 25,98 h récupérables, 909,30 €/mois et 10 911,60 €/an. Affichage : **26 h · 909 € · 10 912 €**.

Bornes : 1 à 100 000 personnes entières, durée strictement positive jusqu’à 168 h/semaine, coût strictement positif jusqu’à 100 000 €/h. Virgules et points décimaux acceptés. Gain entre 0 et 1. Les bornes protègent des saisies incohérentes ; elles ne constituent pas des recommandations.

La valeur représente du temps humain réaffectable, pas un bénéfice net ni une économie de trésorerie garantie. Les coûts de mise en œuvre ne sont pas évalués.

## Simplification v2

Suppression du parcours en trois étapes, multi-tâches, scénarios financiers, adoption/montée en charge, budgets, ROI, graphiques, import/export et rapport imprimable. Suppression du code associé et de la dépendance directe Zod. Les anciennes sauvegardes du navigateur ne sont ni lues ni effacées : le modèle v2 est différent. Les réponses v2 restent en mémoire pendant la visite, et sont perdues au rechargement. Les versions précédentes sont conservées dans Git.

## Vérifier

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Le test navigateur attend le build sous `/fikolasai-gains-ia/` : définir `VITE_BASE_PATH=/fikolasai-gains-ia/` avant le build. Sur Windows, `PLAYWRIGHT_CHROME_PATH` permet d’utiliser Chrome installé ; sinon installer Chromium avec `npx playwright install chromium`. `E2E_BASE_PATH` adapte le chemin testé. Le workflow CI configure ces chemins automatiquement.

Résultat du 6 octobre 2026 : **33 tests unitaires et 8 tests navigateur réussis**, lint et build réussis. Vérifications : cas de référence, trois hypothèses, saisies invalides/minimales/maximales, virgule, reset/focus, contact configuré, récapitulatif dynamique, explications des hypothèses, accordéon de sources, clavier et absence de débordement à 375, 430, 768 et 1440 px. Aucune erreur ou alerte de console applicative dans le parcours automatisé. Le lien mailto est vérifié sans envoyer de message. Pas de mesure utilisateur réelle du délai de 60 secondes.

Captures : [avant](docs/images/avant-refonte.jpg), [après desktop](docs/images/simple-1440.png), [375 px](docs/images/simple-375.png), [430 px](docs/images/simple-430.png), [768 px](docs/images/simple-768.png).

Publication : voir [DEPLOIEMENT.md](docs/DEPLOIEMENT.md). Dépôt indépendant : https://github.com/cyrilAndro/fikolasai-gains-ia. Le workflow GitHub Actions publie sur GitHub Pages après les contrôles. Le projet « Site FikolasAI » est distinct et ne doit pas être modifié.

## Réassurance utilisateur

Le taux de 50 % s’appelle « Potentiel élevé ». Chaque choix affiche une explication adaptée. Le résultat présente un badge d’estimation, les données utilisées, la formule et la distinction entre valeur du temps et trésorerie. Les références sont repliées par défaut et configurables. Le CTA propose de vérifier le potentiel sur les processus réels. Les formules sont inchangées.

[Capture des explications et sources](docs/images/reassurance.jpg).

## Français / English

Site : https://cyrilandro.github.io/fikolasai-gains-ia/
Liens directs : [Français](https://cyrilandro.github.io/fikolasai-gains-ia/?lang=fr) · [English](https://cyrilandro.github.io/fikolasai-gains-ia/?lang=en).

Le sélecteur FR / EN conserve la simulation en cours. Priorité : langue du lien, préférence enregistrée, puis langue du navigateur (anglais si en*, français sinon). Seule la préférence de langue est enregistrée sous `fikolasai:language` ; les réponses restent en mémoire. La devise reste l’euro. Les nombres, erreurs, explications, sources et sujet du contact sont traduits. Textes anglais : `src/config/language.ts`.

Vérification du 7 octobre 2026 : 33 tests unitaires et 14 parcours navigateur réussis ; build et lint réussis. Tests supplémentaires : changement de langue, conservation des saisies, priorité du lien, préférence, détection anglaise et absence de débordement FR/EN à 360 et 390 px.
