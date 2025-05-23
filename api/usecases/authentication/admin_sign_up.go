package authentication

import (
	"relif/platform-bff/entities"
	"relif/platform-bff/repositories"
	"relif/platform-bff/services"
	usersUseCase "relif/platform-bff/usecases/users"
	"relif/platform-bff/utils"
)

type AdminSignUp interface {
	Execute(data entities.User) (string, error)
}

type adminSignUp struct {
	sessionsRepository   repositories.Sessions
	tokensService        services.Tokens
	createUserUseCase    usersUseCase.Create
	passwordHashFunction utils.PasswordHashFn
}

func NewAdminSignUp(
	sessionsRepository repositories.Sessions,
	tokensService services.Tokens,
	createUserUseCase usersUseCase.Create,
	passwordHashFunction utils.PasswordHashFn,
) AdminSignUp {
	return &adminSignUp{
		sessionsRepository:   sessionsRepository,
		tokensService:        tokensService,
		createUserUseCase:    createUserUseCase,
		passwordHashFunction: passwordHashFunction,
	}
}

func (uc *adminSignUp) Execute(data entities.User) (string, error) {
	hashed, err := uc.passwordHashFunction(data.Password)

	if err != nil {
		return "", err
	}

	data.Password = hashed
	data.PlatformRole = utils.RelifMemberPlatformRole

	user, err := uc.createUserUseCase.Execute(data)

	if err != nil {
		return "", err
	}

	session := entities.Session{
		UserID: user.ID,
	}

	session, err = uc.sessionsRepository.Generate(session)

	if err != nil {
		return "", err
	}

	token, err := uc.tokensService.SignToken(user, session)

	if err != nil {
		return "", err
	}

	return token, nil
}
