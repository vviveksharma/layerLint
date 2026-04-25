package cmd

import (
	"errors"

	"github.com/spf13/cobra"
	"github.com/vviveksharma/layerLint/internal/dockerfile"
	"github.com/vviveksharma/layerLint/internal/scan"
	"github.com/vviveksharma/layerLint/internal/scanner"
)

var dockerfilePath string

var scanCmd = &cobra.Command{
	Use:   "scan",
	Short: "Scan Dockerfiles for build cache issues",
	RunE: func(cmd *cobra.Command, args []string) error {
		var err error
		if dockerfilePath == "" {
			return errors.New("Dockerfile path can't be empty")
		}
		instructions, err := dockerfile.Parse(dockerfilePath)
		if err != nil {
			return err
		}
		// Scan the dockerFile
		findings := scanner.ScanDockerfile(dockerfilePath, instructions)
		scan.PrintText(findings)
		return err
	},
}

func init() {
	scanCmd.Flags().StringVar(&dockerfilePath, "dockerfile", "Dockerfile", "Path to Dockerfile")
	scanCmd.MarkFlagRequired("dockerfile")

}
