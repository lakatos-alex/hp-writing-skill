param([string]$SourceDir = (Join-Path $PSScriptRoot '../original-sources'), [ValidateSet('en','hu')][string]$Language = 'en')
$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot '../skills/harry-potter-fanfic/scripts/hp.mjs') import --sources $SourceDir --lang $Language
if ($LASTEXITCODE -ne 0) { throw 'EPUB import failed' }
