package report

import (
	"fmt"
	"html/template"
	"os"
	"time"

	"github.com/vviveksharma/layerLint/internal/models"
)

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LayerLint Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            border-bottom: 1px solid #e5e5e5;
        }
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .summary-card h3 {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .summary-card .number {
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }
        .high { color: #dc2626; }
        .medium { color: #ea580c; }
        .low { color: #0891b2; }
        .findings {
            padding: 30px;
        }
        .finding {
            margin-bottom: 25px;
            padding: 20px;
            border-left: 4px solid;
            background: #f9f9f9;
            border-radius: 4px;
        }
        .finding.high { border-left-color: #dc2626; }
        .finding.medium { border-left-color: #ea580c; }
        .finding.low { border-left-color: #0891b2; }
        .finding-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
        }
        .finding-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            flex: 1;
        }
        .severity-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: white;
        }
        .severity-badge.high { background: #dc2626; }
        .severity-badge.medium { background: #ea580c; }
        .severity-badge.low { background: #0891b2; }
        .finding-meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .finding-meta code {
            background: #e5e5e5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .finding-message {
            color: #555;
            margin-bottom: 15px;
        }
        .finding-suggestion {
            background: white;
            padding: 15px;
            border-radius: 4px;
            border-left: 3px solid #10b981;
        }
        .finding-suggestion strong {
            color: #10b981;
            display: block;
            margin-bottom: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e5e5e5;
        }
        .no-issues {
            text-align: center;
            padding: 60px 30px;
            color: #10b981;
        }
        .no-issues h2 {
            font-size: 48px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LayerLint Report</h1>
            <p>Generated on {{.Timestamp}}</p>
        </div>
        
        {{if .Findings}}
        <div class="summary">
            <div class="summary-card">
                <h3>Total Issues</h3>
                <div class="number">{{.Summary.Total}}</div>
            </div>
            <div class="summary-card">
                <h3>High Severity</h3>
                <div class="number high">{{.Summary.High}}</div>
            </div>
            <div class="summary-card">
                <h3>Medium Severity</h3>
                <div class="number medium">{{.Summary.Medium}}</div>
            </div>
            <div class="summary-card">
                <h3>Low Severity</h3>
                <div class="number low">{{.Summary.Low}}</div>
            </div>
        </div>

        <div class="findings">
            {{range .Findings}}
            <div class="finding {{.Severity}}">
                <div class="finding-header">
                    <div class="finding-title">{{.Title}}</div>
                    <span class="severity-badge {{.Severity}}">{{.Severity}}</span>
                </div>
                <div class="finding-meta">
                    <code>{{.File}}:{{.Line}}</code> • Rule: <code>{{.RuleID}}</code>
                </div>
                <div class="finding-message">{{.Message}}</div>
                <div class="finding-suggestion">
                    <strong>Suggestion:</strong>
                    {{.Suggestion}}
                </div>
            </div>
            {{end}}
        </div>
        {{else}}
        <div class="no-issues">
            <h2>All Clear</h2>
            <p>No issues found! Your Dockerfile looks great.</p>
        </div>
        {{end}}

        <div class="footer">
            <p>Generated by LayerLint • https://github.com/vviveksharma/layerLint</p>
        </div>
    </div>
</body>
</html>`

type HTMLReportData struct {
	Timestamp string
	Findings  []models.Finding
	Summary   struct {
		Total  int
		High   int
		Medium int
		Low    int
	}
}

func GenerateHTML(findings []models.Finding, outputPath string) error {
	data := HTMLReportData{
		Timestamp: time.Now().Format("January 2, 2006 at 3:04 PM"),
		Findings:  findings,
	}

	data.Summary.Total = len(findings)
	for _, f := range findings {
		switch f.Severity {
		case "high":
			data.Summary.High++
		case "medium":
			data.Summary.Medium++
		case "low":
			data.Summary.Low++
		}
	}

	tmpl, err := template.New("report").Parse(htmlTemplate)
	if err != nil {
		return fmt.Errorf("failed to parse HTML template: %w", err)
	}

	if outputPath == "" || outputPath == "-" {
		return tmpl.Execute(os.Stdout, data)
	}

	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create HTML file: %w", err)
	}
	defer file.Close()

	return tmpl.Execute(file, data)
}
