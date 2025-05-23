package entities

import (
	"time"
)

type UserPreferences struct {
	Language string
	Timezone string
}

type User struct {
	ID             string
	FirstName      string
	LastName       string
	FullName       string
	Email          string
	Password       string
	Phones         []string
	OrganizationID string
	Organization   Organization
	Role           string
	PlatformRole   string
	Status         string
	Preferences    UserPreferences
	CreatedAt      time.Time
	UpdatedAt      time.Time
}
