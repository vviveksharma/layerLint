package report

import (
	"fmt"
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type Format string

const (
	FormatText  Format = "text"
	FormatJSON  Format = "json"
	FormatSARIF Format = "sarif"
	FormatHTML  Format = "html"
)

func Generate(findings []models.Finding, format Format, outputPath string) error {
	switch format {
	case FormatJSON:
		return GenerateJSON(findings, outputPath)
	case FormatSARIF:
		return GenerateSARIF(findings, outputPath)
	case FormatHTML:
		return GenerateHTML(findings, outputPath)
	case FormatText:
		PrintText(findings)
		return nil
	default:
		return fmt.Errorf("unsupported format: %s", format)
	}
}

func ParseFormat(s string) (Format, error) {
	switch strings.ToLower(s) {
	case "text", "txt":
		return FormatText, nil
	case "json":
		return FormatJSON, nil
	case "sarif":
		return FormatSARIF, nil
	case "html", "htm":
		return FormatHTML, nil
	default:
		return "", fmt.Errorf("unknown format: %s (supported: text, json, sarif, html)", s)
	}
}

func PrintText(findings []models.Finding) {
	if len(findings) == 0 {
		fmt.Println("LayerLint found no cache issues")
		return
	}

	fmt.Printf("LayerLint found %d issue(s)\n\n", len(findings))

	for _, finding := range findings {
		fmt.Printf("%s %s:%d\n", strings.ToUpper(finding.Severity), finding.File, finding.Line)
		if finding.Title != "" {
			fmt.Println(finding.Title)
			fmt.Println()
		}
		fmt.Println(finding.Message)
		fmt.Println()
		if finding.Suggestion != "" {
			fmt.Println("Suggestion:")
			fmt.Println(finding.Suggestion)
			fmt.Println()
		}
	}
}
