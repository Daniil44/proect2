# Серверный протокол

## HTTP

### `POST /auth/login`

Логин по нику.

Request:

```json
{
  "username": "Player_1"
}
```

Success response:

```json
{
  "token": "jwt-token",
  "username": "Player_1"
}
```

Ошибки:

- `400 INVALID_USERNAME` - ник не прошел валидацию.
- `500 INTERNAL_ERROR` - ошибка сервера.

## Socket.IO auth

Клиент подключается с token:

```js
io({
  transports: ["websocket"],
  auth: { token }
});
```

Если token отсутствует или невалидный, socket middleware отклоняет подключение.

## Socket events от сервера к клиенту

### `init`

Первичное состояние после подключения.

```json
{
  "selfId": 1,
  "players": {
    "1": {
      "id": 1,
      "username": "Player_1",
      "position": { "x": 0, "y": 0, "z": 0 },
      "input": { "up": false, "down": false, "left": false, "right": false },
      "color": "#4aa3ff"
    }
  },
  "chat": []
}
```

### `world:update`

Периодическое обновление мира.

```json
{
  "players": {}
}
```

Клиент синхронизирует позиции и цвета игроков.

### `player:joined`

Новый игрок подключился.

### `player:left`

Игрок отключился.

Payload - id игрока.

### `chat:message`

Новое сообщение чата.

```json
{
  "username": "Player_1",
  "text": "hello",
  "created_at": "2026-06-22T00:00:00.000Z"
}
```

Клиент добавляет сообщение в историю и показывает bubble над игроком.

### `chat:error`

Ошибка отправки сообщения.

```json
{
  "error": "INVALID_MESSAGE",
  "message": "Invalid message"
}
```

## Socket events от клиента к серверу

### `player:input`

Состояние движения.

```json
{
  "up": false,
  "down": false,
  "left": true,
  "right": false
}
```

Клиент отправляет событие:

- при изменении input;
- при сбросе input;
- периодически, если движение активно.

### `chat:message`

Текст сообщения.

```js
socket.emit("chat:message", "hello");
```
