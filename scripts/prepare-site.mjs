import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { log } from 'node:console';

// Build a native page for the main site, independently of the calculator's GitHub Pages URL.
const output = resolve('.tools/site-integration/calculateur-ia');
await build({ base: '/calculateur-ia/', build: { outDir: output, emptyOutDir: true } });
const path = resolve(output, 'index.html');
let html = await readFile(path, 'utf8');
const title = 'Calculateur de gains IA : estimez le temps récupérable | FikolasAI';
const description = 'Une tâche, quelques chiffres : estimez gratuitement le temps et la valeur que votre équipe pourrait récupérer grâce à l’IA. Disponible en français et en anglais.';
const metadata = `
<link rel="canonical" href="https://fikolasai.com/calculateur-ia/"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="FikolasAI"/>
<meta property="og:url" content="https://fikolasai.com/calculateur-ia/"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="https://fikolasai.com/assets/photo-cyril.png"/>
<meta property="og:image:alt" content="Cyril Cieslak, fondateur de FikolasAI"/>
<meta property="og:locale" content="fr_FR"/>
<meta property="og:locale:alternate" content="en_GB"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="https://fikolasai.com/assets/photo-cyril.png"/>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Calculateur de gains IA FikolasAI', url: 'https://fikolasai.com/calculateur-ia/', description, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', inLanguage: ['fr', 'en'], isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'FikolasAI', url: 'https://fikolasai.com/' } })}</script>
`;
html = html.replace('</head>', metadata + '</head>').replace('<div id="root"></div>', '<div id="root"></div><noscript><main><h1>Calculateur de gains IA FikolasAI</h1><p>Activez JavaScript pour estimer le temps récupérable et sa valeur, à partir d’une tâche répétitive, du nombre de personnes et du coût horaire.</p><p>La valeur estimée n’est pas une économie de trésorerie garantie.</p><a href="https://fikolasai.com/">Retour au site FikolasAI</a></main></noscript>');
await writeFile(path, html);
log('Page prête à publier dans calculateur-ia/ du site FikolasAI.');
