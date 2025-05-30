package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"relif/platform-bff/entities"
	"time"
)

type OrganizationDataAccessGrant struct {
	ID                   string       `bson:"_id,omitempty"`
	TargetOrganizationID string       `bson:"target_organization_id,omitempty"`
	TargetOrganization   Organization `bson:"target_organization,omitempty"`
	OrganizationID       string       `bson:"organization_id,omitempty"`
	AuditorID            string       `bson:"auditor_id,omitempty"`
	CreatedAt            time.Time    `bson:"created_at,omitempty"`
}

func (grant *OrganizationDataAccessGrant) ToEntity() entities.OrganizationDataAccessGrant {
	return entities.OrganizationDataAccessGrant{
		ID:                   grant.ID,
		TargetOrganizationID: grant.TargetOrganizationID,
		TargetOrganization:   grant.TargetOrganization.ToEntity(),
		OrganizationID:       grant.OrganizationID,
		AuditorID:            grant.AuditorID,
		CreatedAt:            grant.CreatedAt,
	}
}

func NewOrganizationDataAccessGrant(entity entities.OrganizationDataAccessGrant) OrganizationDataAccessGrant {
	return OrganizationDataAccessGrant{
		ID:                   primitive.NewObjectID().Hex(),
		TargetOrganizationID: entity.TargetOrganizationID,
		OrganizationID:       entity.OrganizationID,
		AuditorID:            entity.AuditorID,
		CreatedAt:            time.Now(),
	}
}
