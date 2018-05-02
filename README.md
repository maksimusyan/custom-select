# Тестовое задание #5

> Внимание! Это не рабочий проект. Не клонируйте и не использкйте его.

## Сборка проекта

> Предполагается, что в вашей ОС уже установлен [Node.js](https://nodejs.org/en/download/) и [Git](https://git-scm.com/downloads)

Выполняем команды в консоли:
```bash
# клонируем проект
git clone https://github.com/maksimusyan/custom-select.git

# входим в папку проекта
cd custom-select

# устанавливаем зависимости
npm install

# выполняем сборку через Webpack
npm run build

# для "горячей" компиляции в режиме разработки можно запустить dev-сервер
npm run dev
```

После сборки в папке "build" появятся 2 файла:

* custom_select.css
* custom_select.min.js

## Как использовать
В коде страницы html подключаем готовые файлы
```html
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="build/custom_select.css">
    <script type="text/javascript" src="build/custom_select.min.js"></script>
</head>
```

