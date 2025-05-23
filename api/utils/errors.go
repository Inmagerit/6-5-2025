package utils

import "errors"

var (
	ErrMissingAWSRegion              = errors.New("missing AWS_REGION env variable")
	ErrMissingEnvironmentEnvVariable = errors.New("missing ENVIRONMENT env variable")
	ErrMissingSecretNameEnvVariable  = errors.New("missing SECRET_NAME env variable")
)

var (
	ErrInvalidCredentials           = errors.New("invalid credentials")
	ErrForbiddenAction              = errors.New("forbidden action")
	ErrMemberOfInactiveOrganization = errors.New("member of inactive organization")
	ErrInactiveUser                 = errors.New("inactive user")
)

var (
	ErrUserNotFound      = errors.New("user with given data not found")
	ErrUserAlreadyExists = errors.New("user with given data already exists")
)

var (
	ErrVoluntaryPersonNotFound      = errors.New("voluntary person with given data not found")
	ErrVoluntaryPersonAlreadyExists = errors.New("voluntary person with given data already exists")
)

var (
	ErrHousingNotFound = errors.New("housing with given data not found")
)

var (
	ErrOrganizationNotFound = errors.New("organization with given data not found")
)

var (
	ErrUpdateOrganizationTypeRequestNotFound = errors.New("update organization type request with given data not found")
)

var (
	ErrJoinOrganizationRequestNotFound = errors.New("join organization request with given data not found")
)

var (
	ErrJoinOrganizationInviteNotFound = errors.New("join organization invite with given data not found")
)

var (
	ErrOrganizationDataAccessRequestNotFound = errors.New("organization data access request with given data not found")
)

var (
	ErrOrganizationDataAccessGrantNotFound = errors.New("organization data access grant with given data not found")
)

var (
	ErrHousingRoomNotFound = errors.New("housing room with given data not found")
)

var (
	ErrBeneficiaryNotFound      = errors.New("beneficiary with given data not found")
	ErrBeneficiaryAlreadyExists = errors.New("beneficiary with given data already exists")
)

var (
	ErrProductTypeNotFound = errors.New("product type with given data not found")
)

var (
	ErrStorageRecordNotFound = errors.New("storage record with given data not found")
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

var (
	ErrJoinPlatformAdminInviteNotFound = errors.New("join platform admin invite with given data not found")
)

var (
	ErrInviteAlreadyExists = errors.New("invite with given e-mail already exists")
)
