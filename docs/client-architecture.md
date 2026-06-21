# Архитектура клиента

Клиент разделен на небольшие модули в `src/client`.

## `client.js`

Главный bootstrap-файл.

Отвечает за:

- создание UI;
- создание Three.js сцены;
- создание socket controller;
- регистрацию login handler;
- запуск render loop.

Бизнес-логика вынесена в отдельные модули.

## `config.js`

Общие настройки клиента:

- размер игрока;
- параметры камеры;
- лимиты чата;
- тайминги input watchdog;
- время жизни уведомлений.

Также содержит список клавиш движения:

- `W`, `A`, `S`, `D`;
- стрелки.

## `state.js`

Общее runtime-состояние клиента:

- `token`;
- `selfId`;
- `socket`;
- `players`;
- текущий `input`;
- набор зажатых клавиш.

Также содержит helper-функции для input state.

## `input.js`

Контроллер движения.

Задачи:

- слушает `keydown` и `keyup`;
- хранит реально зажатые клавиши;
- отправляет `player:input` на сервер;
- сбрасывает движение при потере фокуса, скрытии вкладки, переходе в input и disconnect;
- периодически переотправляет активное движение;
- очищает устаревшие клавиши, если `keyup` не пришел.

Это сделано против бага с "залипанием" клавиш, когда браузер теряет событие `keyup`.

## `players.js`

Менеджер игроков.

Отвечает за:

- создание куба игрока;
- обновление позиции;
- обновление цвета;
- создание и удаление label ника;
- создание и удаление bubble сообщения;
- удаление игрока из сцены.

Важно: CSS2D labels удаляются явно через `removeCssLabel`, чтобы DOM-элементы не оставались после выхода игрока.

## `socket.js`

Socket.IO wiring.

Слушает события:

- `init`;
- `world:update`;
- `player:joined`;
- `player:left`;
- `chat:message`;
- `chat:error`;
- `disconnect`;
- `connect_error`.

Socket controller не рисует UI сам, а вызывает переданные callbacks.

## `chat.js`

UI-логика чата:

- отправка сообщения;
- валидация пустого/слишком длинного сообщения;
- рендер истории;
- добавление системных сообщений.

## `ui.js`

Создание DOM-интерфейса:

- login panel;
- chat panel;
- message form;
- notification container;
- game root.

Также содержит helpers для входа в игру, состояния login-кнопки и сворачивания чата.

## `world.js`

Three.js setup:

- scene;
- floor;
- grid;
- border;
- lights;
- camera;
- WebGLRenderer;
- CSS2DRenderer;
- resize controller.

## `api.js`

Минимальный fetch-wrapper:

- `postJson`;
- `parseResponse`;
- `formatError`.

## `notifications.js`

Factory для toast-уведомлений.

Использует `CONFIG.notifications.ttlMs`.
