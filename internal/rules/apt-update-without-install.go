package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type AptUpdateWithoutInstall struct{}

func (r AptUpdateWithoutInstall) ID() string {
	return "dockerfile/apt-update-without-install"
}

func (r AptUpdateWithoutInstall) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	for _, ins := range instructions {
		if ins.Command != "RUN" {
			continue
		}
		if strings.Contains(ins.Args, "apt-get update") {
			has_install := strings.Contains(ins.Args, "apt-get install")

			if !has_install {
				findings = append(findings, models.Finding{
					RuleID:     r.ID(),
					Severity:   "medium",
					File:       file,
					Line:       ins.Line,
					Title:      "apt-get update without install in same layer",
					Message:    "Running apt-get update in a separate RUN creates a cached layer that may become stale.",
					Suggestion: "Combine apt-get update and apt-get install in the same RUN: RUN apt-get update && apt-get install -y <packages>",
				})
			}

			has_rm_rf := strings.Contains(ins.Args, "rm -rf /var/lib/apt/lists/*")
			if !has_rm_rf {
				findings = append(findings, models.Finding{
					RuleID:     r.ID(),
					Severity:   "low",
					File:       file,
					Line:       ins.Line,
					Message:    "Running apt-get update in a separate RUN creates a cached layer that may become stale.",
					Suggestion: "Combine apt-get update and apt-get install in the same RUN: RUN apt-get update && apt-get install -y <packages>",
				})
			}
		}
	}
	return findings
}
