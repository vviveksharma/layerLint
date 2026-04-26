package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type RunAsRoot struct{}

func (r RunAsRoot) ID() string {
	return "dockerfile/run-as-root"
}

func (r RunAsRoot) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	userSet := false
	var entrypointLine int

	for _, ins := range instructions {
		switch ins.Command {
		case "FROM":
			userSet = false
			entrypointLine = 0
		case "USER":
			arg := strings.TrimSpace(ins.Args)
			if arg != "root" && arg != "0" && arg != "0:0" {
				userSet = true
			} else {
				userSet = false
			}
		case "CMD", "ENTRYPOINT":
			entrypointLine = ins.Line
		}
	}

	if !userSet && entrypointLine > 0 {
		findings = append(findings, models.Finding{
			RuleID:     r.ID(),
			Severity:   "high",
			File:       file,
			Line:       entrypointLine,
			Title:      "Container runs as root",
			Message:    "No USER instruction is set before CMD/ENTRYPOINT, so the container will run as root by default. This is a significant security risk.",
			Suggestion: "Add a USER instruction with a non-root user before CMD/ENTRYPOINT, e.g., 'RUN addgroup -S appgroup && adduser -S appuser -G appgroup' then 'USER appuser'.",
		})
	}

	return findings
}
