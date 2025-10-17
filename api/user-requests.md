## Пользователи

### Получить список пользователей

`GET /users`

#### Ответ
```json
[
  { id: 4444,
    name: 'Pupkin Vasilii',
    login: 'pupkinv',
    phone: '+790000000',
    schoolName: 'it college',
    role: 'admin',
  },
  ...
]
```

#### Ошибки
```yaml
# Универсальная ошибка, если не прилогинились
- code: 401
  object: "authentification"
  message: "Authentication should be made"

# Если по роли не положено получать
- code: 403
  object: "role"
  message: "Access restricted"
```

### Создать пользователя

`POST /users`

#### Запрос

```json
{
  name: "Vasilii Pupkin",
  login: 'pupkinv',
  password: 'password',
  phone: "+790000000",
  schoolName: 'it college',
  role: 'admin',
}
```

#### Ответ

```json
{
  id: 4444,
  name: "Vasilii Pupkin",
  login: 'pupkinv',
  phone: "+790000000",
  schoolName: 'it college',
  role: 'admin',
}
```

### Редактирование пользователя

`PUT /users/:userId`

см `POST /users`

### Удаление пользователя

`DELETE /users/:userId`

### Логин

`POST /users/login`

#### Запрос

```json
{
  login: 'pupkinv',
  password: 'password'
}
```

#### Ответ

```json
{
  success: true,
  accessToken: "asdfkjasdflk;jas;ldkfja;lsdfjkasf"
}
```

Предполагается, что в дальнейшем accessToken будет использоваться всеми остальными
запросами.

### Логаут

`POST /users/logout`

#### Запрос

На самом деле, не очень важно, что именно, главное, что POST и logout

```json
{
  login: 'pupkinv'
}
```
