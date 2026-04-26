package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type RedundantDependencyInstall struct{}

func (r RedundantDependencyInstall) ID() string {
	return "dockerfile/redundant-dependency-install"
}

func (r RedundantDependencyInstall) Check(file string, instructions []models.Instruction) []models.Finding {
    var findings []models.Finding
    checklist := map[string][]int{}
    
    patterns := []string{
        "npm install",
        "go mod download",
        "pip install -r requirements.txt",
    }
    for _, ins := range instructions {
        if ins.Command != "RUN" {
            continue
        }
        
        for _, pattern := range patterns {
            if strings.Contains(ins.Args, pattern) {
                checklist[pattern] = append(checklist[pattern], ins.Line)
            }
        }
    }
    
    for pattern, lines := range checklist {
        if len(lines) > 1 { 
            for i := 1; i < len(lines); i++ {
                findings = append(findings, models.Finding{
                    RuleID:     r.ID(),
                    Severity:   "medium",
                    File:       file,
                    Line:       lines[i],
                    Title:      "Redundant dependency install detected",
                    Message:    "Multiple '" + pattern + "' commands found. This indicates broken layer design.",
                    Suggestion: "Consolidate dependency installs into a single RUN command.",
                })
            }
        }
    }
    
    return findings
}