package scanner

import (
	"github.com/vviveksharma/layerLint/internal/models"
	"github.com/vviveksharma/layerLint/internal/rules"
)

func DefaultRules() []models.Rule {
	return []models.Rule{
		rules.BroadCopyBeforeDepsRule{},
		rules.MissingDockerIgnore{},
		rules.ManifestWithoutLockfile{},
		rules.BuildWithoutCacheMount{},
	}
}

func ScanDockerfile(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding

	for _, rule := range DefaultRules() {
		findings = append(findings, rule.Check(file, instructions)...)
	}

	return findings
}
