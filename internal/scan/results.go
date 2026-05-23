package scan

import (
	"fmt"
	"strings"

	"github.com/vviveksharma/layerLint/internal/models"
)

func PrintText(findings []models.Finding) {
	if len(findings) == 0 {
		fmt.Println("LayerLint found no issues")
		return
	}

	fmt.Printf("LayerLint found %d issue(s)\n\n", len(findings))

	for _, finding := range findings {
		fmt.Printf("%s %s:%d\n", strings.ToUpper(finding.Severity), finding.File, finding.Line)
		fmt.Println(finding.Title)
		fmt.Println()
		fmt.Println(finding.Message)
		fmt.Println()
		fmt.Println("Suggestion:")
		fmt.Println(finding.Suggestion)
		fmt.Println()
	}
}
