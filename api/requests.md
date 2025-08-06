### Получить с бэкенда здания вокруг точки

`GET /buildings/:lat/:lng/:id` -- _Получить здания вокруг точки с координатами :lat, :lng для экскурсии c указанным id_

_Не факт, что запрос не поменяется на PUT с вынесением параметров в body, но пока можно так_

#### Ответ
```json
[
  // По одному на каждое стандартное здание
  { "id": "234234", "nd": [{"lat": 66.3333, "lng": 65.4444}, ...]},
  ...
  // Для зданий с указанной моделькой
  { "id": "234235", "model": "model_id", "lat": 67.3333, "lng": 68.4444, "rot": [0, 1.5, 0]},
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

# Если запрашиваем северный полюс
- code: 406
  object: "position"
  message: "Unknown terrain"

# Если экскурсия не создана/удалена
- code: 404
  object: "track"
  message: "Specified track is not found"
```


### Загрузить на сервер модельку для здания с указанным id

`POST /model/:building_id`

_И где-то в параметрах будет прикрепляться file с моделькой_

```yaml
body:
  track: track_id # для какой экскурсии загружаем модель
  file: binary
```

--- Ответ:
```json
{
  "model": "model_id"
}
```

Если в ответе не пришел ключ model (или получили не 2xx), значит, загрузить не удалось.

--- Ошибки:
```yaml
# Если загрузка не удалась (проблемы с хранилищем, еще что-нибудь)
- code: 413
  object: "upload"
  message: "Could not upload model"

# Если указанное здание не найдено
- code: 404
  object: "building"
  message: "Building not found"

# Если указанная экскурсия не обнаружена
- code: 404
  object: "track"
  message: "Track not found"
```

### Изменить положение модели на карте

`PUT /model/:model_id`

```yaml
body:
  position: [x, y, z],
  rotation: [a, b, c]
  scale: number
```

--- Ответ
```json
{
  "id": "model_id",
  "position": [lat, y, lng], // возможно, lat и lng еще местами поменяются, будем смотреть
  "rotation": [a, b, c],
  "scale": 1.0 // Ну или что там выставили
}
```

_Т.е. получив ответ, снова переустанавливаем, куда попало здание. Если сохранить новое положение не получилось, это будет заметно._

--- Ошибки:

```yaml
- code: 404
  object: "model"
  message: "Model not found"
```

### Получить модель с сервера

`GET /model/:model_id`

_в ответ должен приходить бинарник модельки. Возможно, это будет по-другому._

### Получить список экскурсий

`GET /tracks/`

--- Ответ
```json
[
  { "id": "track_id", "name": "track_name" }, ...
]
```

--- Ошибки:

```yaml
- code: 404
  object: "model"
  message: "Model not found"
```


### Получить экскурсию со всеми точками, которые в ней

`GET /tracks/:track_id`

--- Ответ
```json
[
  { "id": ":point_id", "name": "point_name", "lat": 66.3333, "lng": 55.3333, ... }, ...
]
```

_Для каждой точки точно будет нужно какое-то название, координаты, и какая-нибудь дополнительная информация, которая добавится позже, например, ограничения на поведение в точке (запрет поворота, запрет наклона и т.п.)_

--- Ошибки:

```yaml
- code: 404
  object: "track"
  message: "Track not found"
```

### Создать новую экскурсию

`POST /tracks`

```yaml
body:
  name: track_name
```


--- Ответ
```json
{
  "id": "track_id",
  "name": "track_name"
}
```

--- Ошибки:
```yaml
# Если по роли не положено создавать экскурсии
- code: 403
  object: "role"
  message: "Access restricted"
```

### Удалить экскурсию

`DELETE /tracks/:track_id`

_При удалении экскурсии модели, привязанные к экскурсии должны быть тоже почищены, по идее._

--- Ошибки:
```yaml
# Если по роли не положено создавать экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"
```


### Добавить новую точку в экскурсию

`POST /tracks/:track_id`

```yaml
body:
  name: "point_name"
  type: "point_type" # может, не тип, а что-то другое
  position: [x, y, z]
  rotation: [a, b, c]
```

--- Ответ
```json
{
  "id": "point_id",
}
```

--- Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"
```

### Переименовать или изменить настройки точки

`PUT /tracks/:track_id/:point_id`

```yaml
body:
  name: "point_name" # например, мы решили точку переименовать
  type: "point_type" # опять же, поменять ограничения
  position: [x, y, z]
  rotation: [a, b, c]
```

--- Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"

# Если указанная точка уже была удалена, например
- code: 404
  object: "point"
  message: "Point not found"
```

### Удалить точку из экскурсии

`DELETE /tracks/:track_id/:point_id`

--- Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"

# Если указанная точка уже была удалена, например
- code: 404
  object: "point"
  message: "Point not found"
```

 * Если не найдена экскурсия, шлется сообщение, что не найдена экскурсия
 * Если экскурсия есть, но точки нет, шлется сообщение, что не найдена точка
