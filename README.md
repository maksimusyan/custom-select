# Тестовое задание #5

Выпадающий список c произвольной стилизацией

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
> ДЕМО: [index.html](index.html)

В коде страницы html в блоке "head" подключаем готовые файлы
```html
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="build/custom_select.css">
    <script type="text/javascript" src="build/custom_select.min.js"></script>
</head>
```

В коде страницы html, нужно указать элемент, внутрь которого будет загружен выпадающий список.
```html
<form action="" method="post">
    <div id="my-custom-select"></div>
</form>
```

Далее, в самом конце страницы, в коде html необходимо вызвать функцию построения выпадающего списка
```html
<footer>
    <script type="text/javascript">
        // Вызываем функцию после загрузки DOM-структуры
        document.addEventListener('DOMContentLoaded', function () {
            
            // Создаём объект javascript с элементами нашего списка
            let list = {
                '1':'Москва',
                '2':'Нижний Новгород',
                '3':'Казань',
            };
            
            // Помещаем в переменную нужный нам элемент страницы
            let selectTarget = document.getElementById('my-custom-select');
            
            // Создаём новый экземпляр класса CustomSelect и передаём ему параметры
            // первый аргумент - целевой DOM-элемент
            // второй аргумент - параметры впадающего списка
            let selectOne = new CustomSelect(selectTarget,{
                
                // передаёт наш объект-список
                data: list,
                
                // подписываемся на событие выбора элемента выпадающго списка
                // при котором будет передан массив значений values[]
                onChange: function (values) {
                    console.log(values);
                }
                
                // Доступные параметры:
                //defaultValue: 'none', // Значение по-умолчанию (оно же - первый элемент списка)
                //defaultName: '--- укажите город ---', // Имя по-умолчанию (оно же - первый элемент списка)
                //maxWidthHead: 300, // Максимальная ширина заголовка списка
                //maxWidthList: 300, // Максимальная ширина списка
                //maxHeightList: 400, // Максимальная высота списка
                //scrollX: 'hidden', // Метод отображения горизонтального скролла
                //scrollY: 'auto', // Метод отображения вертикального скролла
            });
            
            // Получить текущее значение выпадающего списка можно через функцию getValues()
            let arrayValues = selectOne.getValues();

        });
    </script>
</footer>
```

##### ПРИМЕЧАНИЕ
Объект javascript (в примере - "list") будет всегда отсортирован браузером. Поэтому, для указания первого элемента списка используйте параметры "defaultValue" и "defaultName", которые должны отсутсвовать в вашем объекте-списке.