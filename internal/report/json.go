package report

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/vviveksharma/layerLint/internal/models"
)

type JSONReport struct {
	Tool     string        `json:"tool"`
	Version  string        `json:"version"`
	Findings []JSONFinding `json:"findings"`
	Summary  Summary       `json:"summary"`
}

type JSONFinding struct {
	RuleID     string `json:"ruleId"`
	Severity   string `json:"severity"`
	File       string `json:"file"`
	Line       int    `json:"line"`
	Title      string `json:"title"`
	Message    string `json:"message"`
	Suggestion string `json:"suggestion"`
}

type Summary struct {
	Total      int            `json:"total"`
	BySeverity map[string]int `json:"bySeverity"`
}

func GenerateJSON(findings []models.Finding, outputPath string) error {
	summary := Summary{
		Total:      len(findings),
		BySeverity: make(map[string]int),
	}

	jsonFindings := make([]JSONFinding, 0, len(findings))
	for _, f := range findings {
		jsonFindings = append(jsonFindings, JSONFinding{
			RuleID:     f.RuleID,
			Severity:   f.Severity,
			File:       f.File,
			Line:       f.Line,
			Title:      f.Title,
			Message:    f.Message,
			Suggestion: f.Suggestion,
		})
		summary.BySeverity[f.Severity]++
	}

	report := JSONReport{
		Tool:     "LayerLint",
		Version:  "1.0.0",
		Findings: jsonFindings,
		Summary:  summary,
	}

	jsonData, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	if outputPath == "" || outputPath == "-" {
		fmt.Println(string(jsonData))
		return nil
	}

	return os.WriteFile(outputPath, jsonData, 0644)
}
