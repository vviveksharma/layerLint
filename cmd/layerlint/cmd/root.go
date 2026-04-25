package cmd

import "github.com/spf13/cobra"

var rootCmd = &cobra.Command{
	Use:   "layerLint",
	Short: "Catch Docker layer cache mistakes before they slow down CI.",
}

func Execute() {
	rootCmd.AddCommand(scanCmd)
	rootCmd.Execute()
}
