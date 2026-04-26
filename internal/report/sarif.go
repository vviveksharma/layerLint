package report

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/vviveksharma/layerLint/internal/models"
)

type SARIFReport struct {
	Schema  string     `json:"$schema"`
	Version string     `json:"version"`
	Runs    []SARIFRun `json:"runs"`
}

type SARIFRun struct {
	Tool    SARIFTool     `json:"tool"`
	Results []SARIFResult `json:"results"`
}

type SARIFTool struct {
	Driver SARIFDriver `json:"driver"`
}

type SARIFDriver struct {
	Name           string      `json:"name"`
	InformationURI string      `json:"informationUri"`
	Version        string      `json:"version"`
	Rules          []SARIFRule `json:"rules,omitempty"`
}

type SARIFRule struct {
	ID               string          `json:"id"`
	ShortDescription SARIFMessage    `json:"shortDescription"`
	FullDescription  SARIFMessage    `json:"fullDescription"`
	Help             SARIFMessage    `json:"help"`
	Properties       SARIFProperties `json:"properties"`
}

type SARIFMessage struct {
	Text string `json:"text"`
}

type SARIFProperties struct {
	Tags []string `json:"tags,omitempty"`
}

type SARIFResult struct {
	RuleID    string          `json:"ruleId"`
	Level     string          `json:"level"`
	Message   SARIFMessage    `json:"message"`
	Locations []SARIFLocation `json:"locations"`
}

type SARIFLocation struct {
	PhysicalLocation SARIFPhysicalLocation `json:"physicalLocation"`
}

type SARIFPhysicalLocation struct {
	ArtifactLocation SARIFArtifactLocation `json:"artifactLocation"`
	Region           SARIFRegion           `json:"region"`
}

type SARIFArtifactLocation struct {
	URI string `json:"uri"`
}

type SARIFRegion struct {
	StartLine int `json:"startLine"`
}

func severityToSARIFLevel(severity string) string {
	switch severity {
	case "high":
		return "error"
	case "medium":
		return "warning"
	case "low":
		return "note"
	default:
		return "warning"
	}
}

func GenerateSARIF(findings []models.Finding, outputPath string) error {
	ruleMap := make(map[string]models.Finding)
	for _, f := range findings {
		if _, exists := ruleMap[f.RuleID]; !exists {
			ruleMap[f.RuleID] = f
		}
	}

	sarifRules := make([]SARIFRule, 0, len(ruleMap))
	for _, f := range ruleMap {
		sarifRules = append(sarifRules, SARIFRule{
			ID: f.RuleID,
			ShortDescription: SARIFMessage{
				Text: f.Title,
			},
			FullDescription: SARIFMessage{
				Text: f.Message,
			},
			Help: SARIFMessage{
				Text: f.Suggestion,
			},
			Properties: SARIFProperties{
				Tags: []string{"docker", "layer-caching", f.Severity},
			},
		})
	}

	sarifResults := make([]SARIFResult, 0, len(findings))
	for _, f := range findings {
		sarifResults = append(sarifResults, SARIFResult{
			RuleID: f.RuleID,
			Level:  severityToSARIFLevel(f.Severity),
			Message: SARIFMessage{
				Text: fmt.Sprintf("%s: %s", f.Title, f.Message),
			},
			Locations: []SARIFLocation{
				{
					PhysicalLocation: SARIFPhysicalLocation{
						ArtifactLocation: SARIFArtifactLocation{
							URI: f.File,
						},
						Region: SARIFRegion{
							StartLine: f.Line,
						},
					},
				},
			},
		})
	}

	report := SARIFReport{
		Schema:  "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
		Version: "2.1.0",
		Runs: []SARIFRun{
			{
				Tool: SARIFTool{
					Driver: SARIFDriver{
						Name:           "LayerLint",
						InformationURI: "https://github.com/vviveksharma/layerLint",
						Version:        "1.0.0",
						Rules:          sarifRules,
					},
				},
				Results: sarifResults,
			},
		},
	}

	jsonData, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal SARIF: %w", err)
	}

	if outputPath == "" || outputPath == "-" {
		fmt.Println(string(jsonData))
		return nil
	}

	return os.WriteFile(outputPath, jsonData, 0644)
}
