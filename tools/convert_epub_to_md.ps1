param([string]$SourceDir = (Join-Path $PSScriptRoot '../original-sources'))
$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot '../skills/harry-potter-fanfic/scripts/hp.mjs') import --sources $SourceDir
if ($LASTEXITCODE -ne 0) { throw 'EPUB import failed' }
