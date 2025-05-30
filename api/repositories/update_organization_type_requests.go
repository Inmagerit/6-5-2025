package repositories

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"relif/platform-bff/entities"
	"relif/platform-bff/models"
	"relif/platform-bff/utils"
)

type UpdateOrganizationTypeRequests interface {
	Create(data entities.UpdateOrganizationTypeRequest) (entities.UpdateOrganizationTypeRequest, error)
	FindOneByID(id string) (entities.UpdateOrganizationTypeRequest, error)
	FindManyPaginated(offset, limit int64) (int64, []entities.UpdateOrganizationTypeRequest, error)
	FindManyByOrganizationIDPaginated(organizationID string, offset, limit int64) (int64, []entities.UpdateOrganizationTypeRequest, error)
	UpdateOneByID(id string, data entities.UpdateOrganizationTypeRequest) error
}

type mongoUpdateOrganizationTypeRequests struct {
	collection *mongo.Collection
}

func NewMongoUpdateOrganizationTypeRequests(database *mongo.Database) UpdateOrganizationTypeRequests {
	return &mongoUpdateOrganizationTypeRequests{
		collection: database.Collection("update_organization_type_requests"),
	}
}

func (repository *mongoUpdateOrganizationTypeRequests) Create(data entities.UpdateOrganizationTypeRequest) (entities.UpdateOrganizationTypeRequest, error) {
	model := models.NewUpdateOrganizationTypeRequest(data)

	if _, err := repository.collection.InsertOne(context.Background(), &model); err != nil {
		return entities.UpdateOrganizationTypeRequest{}, err
	}

	return model.ToEntity(), nil
}

func (repository *mongoUpdateOrganizationTypeRequests) FindOneByID(id string) (entities.UpdateOrganizationTypeRequest, error) {
	var model models.UpdateOrganizationTypeRequest

	filter := bson.M{"_id": id}

	if err := repository.collection.FindOne(context.Background(), filter).Decode(&model); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return entities.UpdateOrganizationTypeRequest{}, utils.ErrUpdateOrganizationTypeRequestNotFound
		}
		return entities.UpdateOrganizationTypeRequest{}, err
	}

	return model.ToEntity(), nil
}

func (repository *mongoUpdateOrganizationTypeRequests) FindManyPaginated(offset, limit int64) (int64, []entities.UpdateOrganizationTypeRequest, error) {
	entityList := make([]entities.UpdateOrganizationTypeRequest, 0)

	filter := bson.M{}

	count, err := repository.collection.CountDocuments(context.Background(), filter)

	if err != nil {
		return 0, nil, err
	}

	pipeline := mongo.Pipeline{
		bson.D{
			{"$match", filter},
		},
		bson.D{
			{"$sort", bson.M{"created_at": -1}},
		},
		bson.D{
			{"$skip", offset},
		},
		bson.D{
			{"$limit", limit},
		},
		bson.D{
			{"$lookup", bson.D{
				{"from", "organizations"},
				{"localField", "organization_id"},
				{"foreignField", "_id"},
				{"as", "organization"},
			}},
		},
		bson.D{
			{"$lookup", bson.D{
				{"from", "users"},
				{"localField", "creator_id"},
				{"foreignField", "_id"},
				{"as", "creator"},
			}},
		},
		bson.D{
			{"$lookup", bson.D{
				{"from", "users"},
				{"localField", "auditor_id"},
				{"foreignField", "_id"},
				{"as", "auditor"},
			}},
		},
		bson.D{
			{"$unwind", bson.D{{"path", "$organization"}, {"preserveNullAndEmptyArrays", true}}},
		},
		bson.D{
			{"$unwind", bson.D{{"path", "$creator"}, {"preserveNullAndEmptyArrays", true}}},
		},
		bson.D{
			{"$unwind", bson.D{{"path", "$auditor"}, {"preserveNullAndEmptyArrays", true}}},
		},
	}

	cursor, err := repository.collection.Aggregate(context.Background(), pipeline)

	if err != nil {
		return 0, nil, err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var model models.FindUpdateOrganizationTypeRequest

		if err = cursor.Decode(&model); err != nil {
			return 0, nil, err
		}

		entityList = append(entityList, model.ToEntity())
	}

	return count, entityList, nil
}

func (repository *mongoUpdateOrganizationTypeRequests) FindManyByOrganizationIDPaginated(organizationID string, offset, limit int64) (int64, []entities.UpdateOrganizationTypeRequest, error) {
	entityList := make([]entities.UpdateOrganizationTypeRequest, 0)

	filter := bson.M{"organization_id": organizationID}

	count, err := repository.collection.CountDocuments(context.Background(), filter)

	if err != nil {
		return 0, nil, err
	}

	pipeline := mongo.Pipeline{
		bson.D{
			{"$match", filter},
		},
		bson.D{
			{"$sort", bson.M{"created_at": -1}},
		},
		bson.D{
			{"$skip", offset},
		},
		bson.D{
			{"$limit", limit},
		},
		bson.D{
			{"$lookup", bson.D{
				{"from", "users"},
				{"localField", "creator_id"},
				{"foreignField", "_id"},
				{"as", "creator"},
			}},
		},
		bson.D{
			{"$lookup", bson.D{
				{"from", "users"},
				{"localField", "auditor_id"},
				{"foreignField", "_id"},
				{"as", "auditor"},
			}},
		},
		bson.D{
			{"$unwind", bson.D{{"path", "$creator"}, {"preserveNullAndEmptyArrays", true}}},
		},
		bson.D{
			{"$unwind", bson.D{{"path", "$auditor"}, {"preserveNullAndEmptyArrays", true}}},
		},
	}

	cursor, err := repository.collection.Aggregate(context.Background(), pipeline)

	if err != nil {
		return 0, nil, err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var model models.FindUpdateOrganizationTypeRequest

		if err = cursor.Decode(&model); err != nil {
			return 0, nil, err
		}

		entityList = append(entityList, model.ToEntity())
	}

	return count, entityList, nil
}

func (repository *mongoUpdateOrganizationTypeRequests) UpdateOneByID(id string, data entities.UpdateOrganizationTypeRequest) error {
	model := models.NewUpdatedUpdateOrganizationTypeRequest(data)

	update := bson.M{"$set": &model}

	if _, err := repository.collection.UpdateByID(context.Background(), id, update); err != nil {
		return err
	}

	return nil
}
