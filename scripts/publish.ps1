param([string]$RepositoryName = 'fikolasai-gains-ia')
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
function Check-Exit([string]$Operation) { if ($LASTEXITCODE -ne 0) { throw "$Operation a échoué. Aucune réussite n'est annoncée." } }
if ($RepositoryName -notmatch '^fikolasai-gains-ia(?:-[a-z0-9-]+)?$') { throw 'Utilisez un nom de nouveau dépôt commençant par fikolasai-gains-ia.' }
gh auth status
Check-Exit 'Connexion GitHub (lancez gh auth login)'
$account = gh api user --jq .login
Check-Exit 'Lecture du compte GitHub'
$remotes = git remote
Check-Exit 'Lecture des dépôts distants'
if ($remotes) { throw 'Un dépôt distant est déjà configuré. Vérifiez-le avant toute nouvelle publication.' }
$repositories = gh repo list $account --limit 1000 --json name --jq '.[].name'
Check-Exit 'Vérification des dépôts existants'
if ($repositories -contains $RepositoryName) { throw "Le nom $RepositoryName est déjà utilisé. Relancez avec -RepositoryName fikolasai-gains-ia-v1." }
$changes = git status --porcelain
if ($changes) { throw 'Le dossier comporte des changements non commités. Vérifiez-les puis créez un commit avant de publier.' }
git branch -M main
Check-Exit 'Sélection de main'
gh auth setup-git --hostname github.com
Check-Exit 'Configuration Git pour le compte authentifié'
gh repo create $RepositoryName --public --source=. --remote=origin --push --description 'Calculateur de temps et de valeur économique liés à l’IA — FikolasAI'
Check-Exit 'Création du nouveau dépôt public'
gh api --method POST "repos/$account/$RepositoryName/pages" -f build_type=workflow
Check-Exit 'Activation de GitHub Pages'
gh workflow run ci.yml --ref main --repo "$account/$RepositoryName"
Check-Exit 'Démarrage des contrôles après activation de Pages'
Write-Host "Sources envoyées. Suivre les contrôles : gh run list --repo $account/$RepositoryName"
Write-Host 'Le site ne doit être annoncé comme publié qu’après réussite du workflow et vérification de son URL.'
