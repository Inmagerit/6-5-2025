package repositories

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"relif/platform-bff/entities"
	"relif/platform-bff/models"
)

type PasswordChangeRequests interface {
	Create(data entities.PasswordChangeRequest) error
	FindOneByCode(code string) (entities.PasswordChangeRequest, error)
	DeleteByCode(code string) error
}

type mongoPasswordChangeRequests struct {
	collection *mongo.Collection
}

func NewMongoPasswordChangeRequests(database *mongo.Database) PasswordChangeRequests {
	return &mongoPasswordChangeRequests{
		collection: database.Collection("password_change_requests"),
	}
}

func (rep *mongoPasswordChangeRequests) Create(data entities.PasswordChangeRequest) error {
	model := models.NewPasswordChangeRequest(data)

	update := bson.M{"$set": &model}
	opts := options.Update().SetUpsert(true)

	if _, err := rep.collection.UpdateByID(context.Background(), model.UserID, update, opts); err != nil {
		return err
	}

	return nil
}

func (rep *mongoPasswordChangeRequests) FindOneByCode(code string) (entities.PasswordChangeRequest, error) {
	var model models.PasswordChangeRequest

	filter := bson.M{"code": code}
	if err := rep.collection.FindOne(context.Background(), filter).Decode(&model); err != nil {
		return entities.PasswordChangeRequest{}, err
	}

	return model.ToEntity(), nil
}

func (rep *mongoPasswordChangeRequests) DeleteByCode(code string) error {
	filter := bson.M{"code": code}
	if _, err := rep.collection.DeleteOne(context.Background(), filter); err != nil {
		return err
	}

	return nil
}
