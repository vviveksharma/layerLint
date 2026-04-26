package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type AddInsteadOfCopy struct{}

func (r AddInsteadOfCopy) ID() string {
	return "dockerfile/add-instead-of-copy"
}

func (r AddInsteadOfCopy) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding

	for _, ins := range instructions {
		if ins.Command != "ADD" {
			continue
		}

		if !isLegitimateAddUsage(ins.Args) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "high",
				File:       file,
				Line:       ins.Line,
				Title:      "ADD used instead of COPY for local file",
				Message:    "ADD has implicit behaviours: it auto-extracts local tarballs and can fetch remote URLs, which can lead to unexpected results and harder-to-audit Dockerfiles. Use COPY for plain local file copies.",
				Suggestion: "Replace ADD with COPY unless you specifically need tarball auto-extraction or a remote URL fetch.",
			})
		}
	}

	return findings
}

func isLegitimateAddUsage(args string) bool {
	fields := strings.Fields(args)
	if len(fields) < 2 {
		return true
	}

	sources := fields[:len(fields)-1]

	var realSources []string
	for _, s := range sources {
		if strings.HasPrefix(s, "--") {
			continue
		}
		realSources = append(realSources, s)
	}

	for _, src := range realSources {
		if strings.HasPrefix(src, "http://") || strings.HasPrefix(src, "https://") {
			return true
		}
		tarExtensions := []string{".tar", ".tar.gz", ".tgz", ".tar.bz2", ".tar.xz", ".tar.zst"}
		for _, ext := range tarExtensions {
			if strings.HasSuffix(src, ext) {
				return true
			}
		}
	}

	return false
}
