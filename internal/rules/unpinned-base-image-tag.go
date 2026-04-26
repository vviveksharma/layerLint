package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type UnpinnedBaseImageTag struct{}

func (r UnpinnedBaseImageTag) ID() string {
	return "dockerfile/unpinned-base-image-tag"
}

func (r UnpinnedBaseImageTag) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding
	for _, ins := range instructions {
		if ins.Command != "FROM" {
			continue
		}

		imageName := extractImageName(ins.Args)

		if isUnpinnedImage(imageName) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "medium",
				File:       file,
				Line:       ins.Line,
				Title:      "Unpinned base image tag detected",
				Message:    "Base image uses ':latest' or no tag (implicit :latest), which hurts reproducibility and can cause unexpected rebuilds when the upstream image changes.",
				Suggestion: "Pin to a specific version tag (e.g., 'node:18.20.0', 'ubuntu:22.04', 'golang:1.22.3').",
			})
		}
	}
	return findings
}

func extractImageName(args string) string {
	args = strings.TrimPrefix(args, "FROM ")

	if strings.HasPrefix(args, "--platform=") {
		parts := strings.Fields(args)
		if len(parts) > 1 {
			args = strings.Join(parts[1:], " ")
		}
	}

	fields := strings.Fields(args)
	if len(fields) > 0 {
		return fields[0]
	}
	return ""
}

func isUnpinnedImage(imageName string) bool {
	if imageName == "" {
		return false
	}
	if strings.HasSuffix(imageName, ":latest") {
		return true
	}

	lastSlash := strings.LastIndex(imageName, "/")
	imageNamePart := imageName
	if lastSlash != -1 {
		imageNamePart = imageName[lastSlash+1:]
	}

	return !strings.Contains(imageNamePart, ":")
}
