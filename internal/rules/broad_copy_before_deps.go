package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type BroadCopyBeforeDepsRule struct{}

func (r BroadCopyBeforeDepsRule) ID() string {
	return "dockerfile/broad-copy-before-deps"
}

func (r BroadCopyBeforeDepsRule) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	broadCopySeen := false

	for _, ins := range instructions {
		if isCopyOrAdd(ins.Command) && isBroadCopy(ins.Args) {
			broadCopySeen = true
		}

		if ins.Command == "RUN" && broadCopySeen && isDependencyInstall(ins.Args) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "high",
				File:       file,
				Line:       ins.Line,
				Title:      "Dependency install runs after broad source copy",
				Message:    "This dependency step runs after a broad COPY/ADD, so source changes can invalidate the dependency cache.",
				Suggestion: "Copy dependency manifests first, install dependencies, then copy the rest of the source.",
			})
		}
	}

	return findings
}

func isCopyOrAdd(command string) bool {
	return command == "COPY" || command == "ADD"
}

func isBroadCopy(args string) bool {
	return strings.Contains(args, "COPY . .") ||
		strings.Contains(args, "COPY . /") ||
		strings.Contains(args, "ADD . .") ||
		strings.Contains(args, "ADD . /")
}

func isDependencyInstall(args string) bool {
	patterns := []string{
		"go mod download",
		"npm install",
		"npm ci",
		"pnpm install",
		"yarn install",
		"pip install",
		"poetry install",
	}

	for _, pattern := range patterns {
		if strings.Contains(args, pattern) {
			return true
		}
	}

	return false
}
