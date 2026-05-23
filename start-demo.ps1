$ErrorActionPreference = "Stop"

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  & $node.Source "$PSScriptRoot\server.mjs"
  exit $LASTEXITCODE
}

$codexNode = Join-Path $env:LOCALAPPDATA "Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Local\OpenAI\Codex\bin\node.exe"
if (Test-Path $codexNode) {
  & $codexNode "$PSScriptRoot\server.mjs"
  exit $LASTEXITCODE
}

throw "Node.js was not found. Install Node.js 20+ or run npm install after adding Node.js to PATH."
