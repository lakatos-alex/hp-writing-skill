param([string]$SourceDir = (Join-Path $PSScriptRoot '../original-sources'), [switch]$Apply)
$ErrorActionPreference = 'Stop'
$sourceRoot = (Resolve-Path -LiteralPath $SourceDir).Path
$stems = @('01-philosophers-stone','02-chamber-of-secrets','03-prisoner-of-azkaban','04-goblet-of-fire','05-order-of-the-phoenix','06-half-blood-prince','07-deathly-hallows')
$codes = @('PS','CoS','PoA','GoF','OotP','HBP','DH')
$moves = @()
foreach ($lang in @('en','hu')) {
    $destination = Join-Path $sourceRoot $lang
    $inputDir = if ($lang -eq 'en' -and (Test-Path -LiteralPath (Join-Path $sourceRoot 'catalogue.local.json'))) { $sourceRoot } else { $destination }
    $cataloguePath = Join-Path $inputDir 'catalogue.local.json'
    if (!(Test-Path -LiteralPath $cataloguePath)) { continue }
    $catalogue = Get-Content -LiteralPath $cataloguePath -Raw | ConvertFrom-Json
    foreach ($book in $catalogue.books) {
        $index = [Array]::IndexOf($codes, $book.code)
        if ($index -lt 0 -or [IO.Path]::GetFileName($book.source) -ne $book.source) { throw 'Unrecognised source entry' }
        $ext = [IO.Path]::GetExtension($book.source)
        if ($ext -ne '.epub') { continue } # PDF sidecars need their converter to refresh provenance.
        foreach ($suffix in @($ext,'.md')) {
            $old = [IO.Path]::GetFullPath((Join-Path $inputDir ([IO.Path]::ChangeExtension($book.source,$suffix))))
            $new = [IO.Path]::GetFullPath((Join-Path $destination ($stems[$index] + $suffix)))
            if (!$old.StartsWith($sourceRoot + [IO.Path]::DirectorySeparatorChar) -or !$new.StartsWith($sourceRoot + [IO.Path]::DirectorySeparatorChar)) { throw 'Path escaped source root' }
            if ($old -eq $new -or !(Test-Path -LiteralPath $old)) { continue }
            if (Test-Path -LiteralPath $new) { throw "Destination already exists: $new" }
            $moves += [PSCustomObject]@{from=$old; to=$new; sha256=(Get-FileHash -LiteralPath $old -Algorithm SHA256).Hash.ToLowerInvariant()}
        }
    }
}
$moves | Format-Table from,to
if (!$Apply) { Write-Output 'Preview only. Use -Apply to rename the listed files.'; return }
foreach ($move in $moves) {
    $null = New-Item -ItemType Directory -Force -Path ([IO.Path]::GetDirectoryName($move.to))
    Move-Item -LiteralPath $move.from -Destination $move.to
    if ((Get-FileHash -LiteralPath $move.to -Algorithm SHA256).Hash.ToLowerInvariant() -ne $move.sha256) { throw 'Moved file hash changed' }
}
if ($moves.Count) {
    $record = Join-Path $sourceRoot ('organisation-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.local.json')
    $moves | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $record -Encoding utf8
}
Write-Output 'Original bytes preserved. Re-import each language to refresh paths and Markdown headers.'
