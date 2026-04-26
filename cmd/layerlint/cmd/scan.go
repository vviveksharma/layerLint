package cmd

import (
	"errors"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/vviveksharma/layerLint/internal/dockerfile"
	"github.com/vviveksharma/layerLint/internal/models"
	"github.com/vviveksharma/layerLint/internal/report"
	"github.com/vviveksharma/layerLint/internal/scanner"
)

var (
	dockerfilePath string
	outputFormat   string
	outputPath     string
	failOnSeverity string
)

var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan Dockerfiles for build cache issues",
	Long: `Scan Dockerfiles for layer caching anti-patterns.

Supports multiple output formats:
  - text (default): Human-readable output
  - json: Machine-readable JSON format
  - sarif: SARIF format for GitHub Security integration
  - html: HTML report for sharing`,
	Example: `  # Basic scan with text output
  layerlint scan --dockerfile Dockerfile

  # Generate JSON report
  layerlint scan --dockerfile Dockerfile --format json

  # Save report to file
  layerlint scan --dockerfile Dockerfile --format json --output report.json

  # Generate HTML report
  layerlint scan --dockerfile Dockerfile --format html --output report.html

  # SARIF for GitHub Security
  layerlint scan --dockerfile Dockerfile --format sarif --output results.sarif`,
	RunE: func(cmd *cobra.Command, args []string) error {
		if dockerfilePath == "" {
			return errors.New("Dockerfile path can't be empty")
		}

		// Parse the Dockerfile
		instructions, err := dockerfile.Parse(dockerfilePath)
		if err != nil {
			return fmt.Errorf("failed to parse Dockerfile: %w", err)
		}

		// Scan the Dockerfile
		findings := scanner.ScanDockerfile(dockerfilePath, instructions)

		// Parse output format
		format, err := report.ParseFormat(outputFormat)
		if err != nil {
			return err
		}

		// Generate report in the specified format
		if err := report.Generate(findings, format, outputPath); err != nil {
			return fmt.Errorf("failed to generate report: %w", err)
		}

		// Exit with error code based on severity threshold (for CI/CD)
		if shouldFail(findings, failOnSeverity) {
			return fmt.Errorf("found issues at or above '%s' severity", failOnSeverity)
		}

		return nil
	},
}

func shouldFail(findings []models.Finding, threshold string) bool {
	if len(findings) == 0 {
		return false
	}

	severityLevels := map[string]int{
		"low":    1,
		"medium": 2,
		"high":   3,
	}

	thresholdLevel := severityLevels[threshold]

	for _, f := range findings {
		if severityLevels[f.Severity] >= thresholdLevel {
			return true
		}
	}
	return false
}

func hasHighSeverity(findings []models.Finding) bool {
	for _, f := range findings {
		if f.Severity == "high" {
			return true
		}
	}
	return false
}

func init() {
	scanCmd.Flags().StringVar(&dockerfilePath, "dockerfile", "Dockerfile", "Path to Dockerfile")
	scanCmd.Flags().StringVarP(&outputFormat, "format", "f", "text", "Output format (text, json, sarif, html)")
	scanCmd.Flags().StringVarP(&outputPath, "output", "o", "", "Output file path (default: stdout)")
	scanCmd.Flags().StringVar(&failOnSeverity, "fail-on-severity", "medium", "Fail if issues at or above this severity are found (low, medium, high)")
	scanCmd.MarkFlagRequired("dockerfile")
}
