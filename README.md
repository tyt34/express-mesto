# Проектная работа №13-14 (Яндекс.Практикум)

![](https://shields.io/badge/-JavaScript-yellow)
![](https://shields.io/badge/-Node.js-3E863D)
![](https://shields.io/badge/-MongoDB-00E661)

## Функционал приложения 

* Регистрация и авторизация нового пользователя
* Изменение данных созданного пользователя
* Добавление и удаления карточек
* Добавление и удаления "лайка" на карточку
* В приложение присутствует валидация входных данных

## API

### Взаимодействие с пользователем 

* `POST /signup` — создать нового пользователя. В теле запроса должен быть `email` и `password`. Формат ответа: 
```ts
{
    "data": {
        "email": "aaa0@mail.ru"
    }
}
```

* `POST /signin` — авторизовать зарегистрированного пользователя. В теле запроса должен быть `email` и `password`. Формат ответа: 
```ts
{
    "token": "jwt_tokken"
}
```

* `GET /users` — получить данные всех зарегистрированных пользователей. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": [ 
        {
            "_id": "id пользователя в базе данных",
            "name": "имя пользователя",
            "about": "информация о пользователе",
            "avatar": "url аватара пользователя",
            "email": "электронная почта пользователя",
        },
    ...
    ]
}
```

* `GET /users/me` — получить данные авторизованного пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "имя пользователя",
        "about": "информация о пользователе",
        "avatar": "url аватара пользователя",
        "email": "электронная почта пользователя",
    }
}
```

* `PATCH /users/me` — изменить поля *name* и *about* пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. В теле запроса должен быть `name` и `about`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "имя пользователя",
        "about": "информация о пользователе",
        "avatar": "url аватара пользователя",
        "email": "электронная почта пользователя",
    }
}
```

* `PATCH /users/me/avatar` — изменить поля *avatar* пользователя. Необходим заголовок `authorization: Bearer jwt_tokken`. В теле запроса должен быть `avatar`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "имя пользователя",
        "about": "информация о пользователе",
        "avatar": "url аватара пользователя",
        "email": "электронная почта пользователя",
    }
}
```

* `GET /users/:id` — получить данные пользователя по id. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "имя пользователя",
        "about": "информация о пользователе",
        "avatar": "url аватара пользователя",
        "email": "электронная почта пользователя",
    }
}
```

### Взаимодействие с карточками

* `GET /cards` — получить все добавленные карточки. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "имя пользователя",
        "link": "url изображения",
        "owner": "id пользователя, который добавил её в базу данных",
        "likes": [
             "id пользователя, который поставил лайк"
        ],
        "createAt": "время, когда карточка была добавлена в базу данных",
    }
}
```

* `GET /cards` — получить все добавленные карточки. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "название карточки",
        "link": "url изображения карточки",
        "owner": "id пользователя, который добавил её в базу данных",
        "likes": [
             "id пользователя, который поставил лайк"
        ],
        "createAt": "время, когда карточка была добавлена в базу данных",
    }
}
```

* `POST /cards` — добавить карточку в базу данных. Необходим заголовок `authorization: Bearer jwt_tokken`. В теле запроса должен быть `name` и `link`. Формат ответа: 
```ts
{
    "data": {
        "name": "название карточки",
        "link": "url изображения карточки",
        "owner": "id пользователя, который добавил её в базу данных",
        "likes": [],
        "_id": "id карточки",
        "createAt": "время, когда карточка была добавлена в базу данных",
    },
    "owner": "id пользователя, который добавил её в базу данных"
}
```


* `DELETE /cards/:cardId` — удалить карточку из базы данных. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "message": "Карточка удалена"
}
```

* `PUT /cards/:cardId/likes` — поставить карточки лайк. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "message": "Произошло постановка лайка",
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "название карточки",
        "link": "url изображения карточки",
        "owner": "id пользователя, который добавил её в базу данных",
        "likes": [],
        "createAt": "время, когда карточка была добавлена в базу данных",
    }
}
```

* `PUT /cards/:cardId/likes` — поставить карточки лайк. Необходим заголовок `authorization: Bearer jwt_tokken`. Формат ответа: 
```ts
{
    "message": "Произошло удаление лайка",
    "data": {
        "_id": "id пользователя в базе данных",
        "name": "название карточки",
        "link": "url изображения карточки",
        "owner": "id пользователя, который добавил её в базу данных",
        "likes": [],
        "createAt": "время, когда карточка была добавлена в базу данных",
    }
}
```

## Запуск приложения
1. npm i
2. npm start



