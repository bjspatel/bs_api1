## APIs Lookup

<table>
  <tr>
    <th></th>
    <th>Method</th>
    <th>URL</th>
    <th>Action</th>
  </tr>
  <tr>
    <td colspan="4"><b>Users</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>GET</td>
    <td><a href="#get-apiv1users">/api/v1/users</a></td>
    <td>Gets all users</td>
  </tr>
  <tr>
    <td>2</td>
    <td>POST</td>
    <td>/api/v1/users/create</td>
    <td>Creates a new user</td>
  </tr>
  <tr>
    <td>3</td>
    <td>GET</td>
    <td>/api/v1/users/confirm-account/:token</td>
    <td>Activate the user</td>
  </tr>
  <tr>
    <td>4</td>
    <td>PUT</td>
    <td>/api/v1/users/reset-password-request</td>
    <td>Send reset password access link</td>
  </tr>
  <tr>
    <td>5</td>
    <td>GET</td>
    <td>/api/v1/users/reset-password/:token</td>
    <td>Opens the reset password form</td>
  </tr>
  <tr>
    <td>6</td>
    <td>PUT</td>
    <td>/api/v1/users/reset-password</td>
    <td>Resets the password</td>
  </tr>
  <tr>
    <td>7</td>
    <td>POST</td>
    <td>/api/v1/users/login</td>
    <td>Login the user</td>
  </tr>
  <tr>
    <td>8</td>
    <td>PUT</td>
    <td>/api/v1/users/update</td>
    <td>Update the user</td>
  </tr>
  <tr>
    <td colspan="4"><b>Games</b></td>
  </tr>
  <tr>
    <td>9</td>
    <td>GET</td>
    <td>/api/v1/games</td>
    <td>Get all games</td>
  </tr>
  <tr>
    <td>10</td>
    <td>POST</td>
    <td>/api/v1/games/create</td>
    <td>Create a new game</td>
  </tr>
  <tr>
    <td>11</td>
    <td>PUT</td>
    <td>/api/v1/games/update</td>
    <td>Update a game</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>
## 1
### GET - /api/v1/users

_Action_: Gets all users

_Input_:

Header: token

Optional Params: email, id, created-at-from, created-at-to, updated-at-from, updated-at-to, last-active-at-from, last-active-at-to, role, status

_Action_: Return a collection of users, without passwords that match the optional query params, if any

_Example_: /users?email=test@example.com&id=123456

_Errors_: (400) If any param other than the ones provided are used


[Top](#apis-lookup)


<table>
  <tr>
    <td>One</td>
    <td>Two</td>
  </tr>
  <tr>
    <td colspan="2">Three</td>
  </tr>
</table>

