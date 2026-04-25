package rules

import (
	"os"
	"path/filepath"

	"github.com/vviveksharma/layerLint/internal/models"
)

type MissingDockerIgnore struct{}

func (r MissingDockerIgnore) ID() string {
	return "dockerfile/missing-dockerignore"
}

func (r MissingDockerIgnore) Check(file string, instructions []models.Instruction) []models.Finding {
	dockerignorePath := filepath.Join(filepath.Dir(file), ".dockerignore")

	if _, err := os.Stat(dockerignorePath); err == nil {
		return nil
	}

	return []models.Finding{
		{
			RuleID:   r.ID(),
			Severity: "medium",
			File:     file,
			Line:     1,
			Title:    ".dockerignore file is missing",
			Message:  "This Dockerfile has no adjacent .dockerignore, so unnecessary files may be sent in the build context.",
			Suggestion: "Add a .dockerignore file to exclude files like .git, node_modules, build output, logs, and secrets.",
		},
	}
}
