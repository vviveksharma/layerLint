package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type ManifestWithoutLockfile struct{}

func (r ManifestWithoutLockfile) ID() string {
	return "dockerfile/manifest-without-lockfile"
}

func (r ManifestWithoutLockfile) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	copiedFiles := map[string]bool{}

	for _, ins := range instructions {
		if isCopyOrAdd(ins.Command) {
			for _, copied := range extractCopiedFiles(ins.Args) {
				copiedFiles[copied] = true
			}
		}

		if ins.Command != "RUN" {
			continue
		}

		if isNpmCI(ins.Args) {
			if copiedFiles["package.json"] && !copiedFiles["package-lock.json"] {
				findings = append(findings, models.Finding{
					RuleID:     r.ID(),
					Severity:   "high",
					File:       file,
					Line:       ins.Line,
					Title:      "npm ci runs without package-lock.json",
					Message:    "npm ci should run after both package.json and package-lock.json are copied for reproducible installs and better cache reuse.",
					Suggestion: "Copy package.json and package-lock.json before running npm ci.",
				})
			}
		}

		if isGoModDownload(ins.Args) {
			if copiedFiles["go.mod"] && !copiedFiles["go.sum"] {
				findings = append(findings, models.Finding{
					RuleID:     r.ID(),
					Severity:   "medium",
					File:       file,
					Line:       ins.Line,
					Title:      "go mod download runs without go.sum",
					Message:    "go mod download should usually run after both go.mod and go.sum are copied to improve cache reuse and dependency correctness.",
					Suggestion: "Copy go.mod and go.sum before running go mod download.",
				})
			}
		}
	}

	return findings
}

func isNpmCI(args string) bool {
	return strings.Contains(args, "RUN npm ci")
}

func isGoModDownload(args string) bool {
	return strings.Contains(args, "RUN go mod download")
}

func extractCopiedFiles(args string) []string {
	fields := strings.Fields(args)
	if len(fields) < 3 {
		return nil
	}

	// args is like: "COPY package.json package-lock.json ./"
	// fields[0] is COPY, last field is destination
	return fields[1 : len(fields)-1]
}
