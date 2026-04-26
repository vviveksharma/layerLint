package rules

import (
	"github.com/vviveksharma/layerLint/internal/models"
)

type MultipleBroadCopies struct{}

func (r MultipleBroadCopies) ID() string {
	return "dockerfile/multiple-broad-copies"
}

func (r MultipleBroadCopies) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	check := 0
	for _, ins := range instructions {
		if isBroadCopy(ins.Args) {
			check++
			if check > 1 {
				findings = append(findings, models.Finding{
					RuleID:     r.ID(),
					Severity:   "medium",
					File:       file,
					Line:       ins.Line,
					Title:      "Multiple broad source copies detected",
					Message:    "This is the {N}th broad copy operation (COPY . . or ADD . .). Multiple broad copies create redundant layers and invalidate cache unnecessarily.",
					Suggestion: "Consolidate into a single COPY/ADD operation, or use specific paths instead of broad copies.",
				})
			}
		}
	}
	return findings
}
