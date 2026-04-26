# Report Formats

LayerLint outputs in four formats. Pick what works for you.

## Text (Default)

Human-readable output with colors. Just run it:

```bash
layerlint scan --dockerfile Dockerfile
```

Gets you:
```
RuleID:     dockerfile/broad-copy-before-deps
Severity:   high
File:       Dockerfile
Line:       4
Message:    Dependency install runs after broad source copy
Suggestion: Copy manifests first, install, then copy source
```

## JSON

For scripts and tooling:

```bash
layerlint scan --dockerfile Dockerfile --format json --output report.json
```

Structure:
```json
{
  "findings": [
    {
      "ruleId": "dockerfile/broad-copy-before-deps",
      "severity": "high",
      "file": "Dockerfile",
      "line": 4,
      "message": "...",
      "suggestion": "..."
    }
  ],
  "summary": {
    "total": 3,
    "bySeverity": {
      "high": 1,
      "medium": 1,
      "low": 1
    }
  }
}
```

## SARIF

For GitHub Security tab:

```bash
layerlint scan --dockerfile Dockerfile --format sarif --output results.sarif
```

Then in GitHub Actions:
```yaml
- uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: results.sarif
```

Issues show up in the Security tab, reviewable in PRs.

## HTML

For archiving or sharing:

```bash
layerlint scan --dockerfile Dockerfile --format html --output report.html
```

Open report.html in any browser. Color-coded severity, formatted nicely.

## Exit Codes

Exits 1 if high severity issues found. Use this in CI:

```bash
layerlint scan --dockerfile Dockerfile
# Non-zero exit = build fails
```

Want more control? Parse JSON and fail based on your own rules:

```bash
layerlint scan --dockerfile Dockerfile --format json --output report.json
# Check report.json, decide what to do
```

## Output Options

Write to file:
```bash
layerlint scan --dockerfile Dockerfile --format json --output report.json
```

Write to stdout:
```bash
layerlint scan --dockerfile Dockerfile --format json --output -
```

No `--output` = stdout for text format, convenient for piping.
