package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type BuildWithoutCacheMount struct{}

func (r BuildWithoutCacheMount) ID() string {
	return "dockerfile/build-without-cache-mount"
}

func (r BuildWithoutCacheMount) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding

	for _, ins := range instructions {
		if ins.Command != "RUN" {
			continue
		}

		if isCacheableRun(ins.Args) && !hasCacheMount(ins.Args) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "low",
				File:       file,
				Line:       ins.Line,
				Title:      "Build or dependency step does not use a cache mount",
				Message:    "This RUN step could reuse BuildKit cache, but no --mount=type=cache is configured.",
				Suggestion: "Add a BuildKit cache mount for compiler or package-manager cache directories.",
			})
		}
	}

	return findings
}

func isCacheableRun(args string) bool {
	patterns := []string{
		"RUN go build",
		"RUN go test",
		"RUN go mod download",
		"RUN npm ci",
		"RUN npm install",
		"RUN pnpm install",
		"RUN yarn install",
		"RUN pip install",
		"RUN poetry install",
	}

	for _, pattern := range patterns {
		if strings.Contains(args, pattern) {
			return true
		}
	}

	return false
}

func hasCacheMount(args string) bool {
	return strings.Contains(args, "--mount=type=cache")
}
