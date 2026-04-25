package dockerfile

import (
	"os"
	"strings"

	"github.com/moby/buildkit/frontend/dockerfile/parser"
	"github.com/vviveksharma/layerLint/internal/models"
)

func Parse(path string) ([]models.Instruction, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	result, err := parser.Parse(file)
	if err != nil {
		return nil, err
	}

	var instructions []models.Instruction

	for _, node := range result.AST.Children {
		instructions = append(instructions, models.Instruction{
			Command: strings.ToUpper(node.Value),
			Args:    node.Original,
			Line:    node.StartLine,
		})
	}

	return instructions, nil
}
