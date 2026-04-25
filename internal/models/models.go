package models

type Instruction struct {
	Command string
	Args    string
	Line    int
}


type Finding struct {
	RuleID     string
	Severity   string
	File       string
	Line       int
	Title      string
	Message    string
	Suggestion string
}

type Rule interface {
	ID() string
	Check(file string, instructions []Instruction) []Finding
}
