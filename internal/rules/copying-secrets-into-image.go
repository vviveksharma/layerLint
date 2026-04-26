package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type CopyingSecretsintoImage struct{}

func (r CopyingSecretsintoImage) ID() string {
	return "copying-secrets-into-image"
}

func (r CopyingSecretsintoImage) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	for _, ins := range instructions {
		if ins.Command != "COPY" && ins.Command != "ADD" {
			continue
		}
		if containsSecretFile(ins.Args) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "high",
				File:       file,
				Line:       ins.Line,
				Title:      "Sensitive file copied into image",
				Message:    "Detected copying of sensitive files (.env, credentials, etc.) into the Docker image.",
				Suggestion: "Use build secrets (--secret), environment variables at runtime, or ensure sensitive files are in .dockerignore.",
			})
		}
	}
	return findings
}

func containsSecretFile(args string) bool {
	secretPatterns := []string{
		".env",
		".env.local",
		".env.production",
		"id_rsa",
		"id_dsa",
		".pem",
		".key",
		".npmrc",
		".aws",
		"credentials",
		"secrets",
		".git",
	}
	for _, pattern := range secretPatterns {
		if strings.Contains(args, pattern) {
			return true
		}
	}
	return false
}
