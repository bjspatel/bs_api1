## APIs Lookup

| Method |                  URL                 |                Task             |
|:------:|:------------------------------------:|:-------------------------------:|
| GET    | [/api/v1/users](#1)                  | Gets all users                  |
| POST   | /api/v1/users/create                 | Creates a new user              |
| GET    | /api/v1/users/confirm-account/:token | Activate the user               |
| PUT    | /api/v1/users/reset-password-request | Send reset password access link |
| GET    | /api/v1/users/reset-password/:token  | Opens the reset password form   |
| PUT    | /api/v1/users/reset-password         | Resets the password             |
| POST   | /api/v1/users/login                  | Login the user                  |
| PUT    | /api/v1/users/update                 | Update the user                 |
| GET    | /api/v1/games                        | Get all games                   |
| POST   | /api/v1/games/create                 | Create a new game               |
| PUT    | /api/v1/games/update                 | Update a game                   |
|        |                                      |                                 |
|        |                                      |                                 |
|        |                                      |                                 |
|        |                                      |                                 |
|        |                                      |                                 |
|        |                                      |                                 |

## 1
#### /api/v1/users

_Action_: Gets all users

_Input_:

Header: token

Optional Params: email, id, created-at-from, created-at-to, updated-at-from, updated-at-to, last-active-at-from, last-active-at-to, role, status

_Action_: Return a collection of users, without passwords that match the optional query params, if any

_Example_: /users?email=test@example.com&id=123456

_Errors_: (400) If any param other than the ones provided are used


[Top](#apis-lookup)
