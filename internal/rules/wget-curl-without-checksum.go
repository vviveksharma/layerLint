package rules

import (
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

type WgetCurlWithoutChecksum struct{}

func (r WgetCurlWithoutChecksum) ID() string {
	return "dockerfile/wget-curl-without-checksum"
}

func (r WgetCurlWithoutChecksum) Check(file string, instructions []models.Instruction) []models.Finding {
	var findings []models.Finding

	for _, ins := range instructions {
		if ins.Command != "RUN" {
			continue
		}

		if !isDownloadCommand(ins.Args) {
			continue
		}

		if !hasChecksumVerification(ins.Args) {
			findings = append(findings, models.Finding{
				RuleID:     r.ID(),
				Severity:   "high",
				File:       file,
				Line:       ins.Line,
				Title:      "Binary downloaded without checksum verification",
				Message:    "curl or wget is used to download a file but no checksum verification (sha256sum, md5sum, gpg) follows. This makes the build vulnerable to supply chain attacks.",
				Suggestion: "After downloading, verify the file integrity: echo '<expected-sha256>  filename' | sha256sum -c -",
			})
		}
	}

	return findings
}

func isDownloadCommand(args string) bool {
	downloadPatterns := []string{
		"curl ",
		"wget ",
	}
	for _, p := range downloadPatterns {
		if strings.Contains(args, p) {
			return true
		}
	}
	return false
}

func hasChecksumVerification(args string) bool {
	checksumPatterns := []string{
		"sha256sum",
		"sha512sum",
		"sha1sum",
		"md5sum",
		"gpg --verify",
		"gpg --batch --verify",
		"cosign verify",
	}
	for _, p := range checksumPatterns {
		if strings.Contains(args, p) {
			return true
		}
	}
	return false
}
