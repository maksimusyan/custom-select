export default class CustomSelectClass
{
    constructor(target,options){
        // Маркер того что класс уже был инициирован
        this._isLoaded = false;
        // Маркер корректно переданного DOM-объекта
        this._targetDomElement = typeof target === 'object' && typeof target.attributes === 'object' ? target : null;
        // Текущее значение выпадающего списка
        this._currentValues = [];
        // Создаём основные элементы списка
        this._wrap = document.createElement('div');
        this._head = document.createElement('div');
        this._list = document.createElement('ul');
        // В основного родителя в качестве произвольного аттрибута добавляем ссылку на текущий экземпляр класса
        // это необходимо чтобы из стандартного Event при клике достать именно текущий экземпляр класса
        this._wrap.thisClass = this;
        // Базовые параметры
        this._opts = {
            data: {}, // Объект javascript на основе которого будет построен список
            defaultValue: 'none', // Значение по-умолчанию (оно же - первый элемент списка)
            defaultName: '--- выберите из списка ---', // Имя по-умолчанию (оно же - первый элемент списка)
            maxWidthHead: 300, // Максимальная ширина заголовка списка
            maxWidthList: 300, // Максимальная ширина списка
            maxHeightList: 400, // Максимальная высота списка
            scrollX: 'hidden', // Метод отображения горизонтального скролла
            scrollY: 'auto', // Метод отображения вертикального скролла
            onChange: function(){}, // callback-функция, которая будет вызвана при выборе элемента выпадающего списка
            // Базовые имена атрибута "class" элементов списка
            classes: {
                wrapper: 'custom_select_wrapper',
                head: 'csw_header',
                list: 'csw_list',
                listItem: 'csw_item',
            }
        };
        // Если DOM-объект существует
        if(this._targetDomElement !== null){
            // Переопределение базовых параметров при создании экземпляра класса
            if(typeof options === 'object' && Object.keys(options).length > 0){
                for (let key in options) {
                    // Является ли свойство собственным для объекта
                    if (options.hasOwnProperty(key)){
                        this._opts[key] = options[key];
                    }
                }
            }
            // Задаём стили отображения
            this._wrap.setAttribute('style','width:'+this._opts.maxWidthHead+'px;');
            this._head.setAttribute('style','width:'+this._opts.maxWidthHead+'px;max-width:'+this._opts.maxWidthHead+'px;');
            this._list.setAttribute('style','width:'+(this._opts.maxWidthList - 2)+'px;max-height:'+this._opts.maxHeightList+'px;overflow-x:'+this._opts.scrollX+';overflow-y:'+this._opts.scrollY+';');
            // Запускаем рендер элемента
            this.init();
        }
    }
    init(){
        // Защищаем метод init() от прямого вызова и повторного рендера
        if(this._targetDomElement === null || this._isLoaded){
            return false;
        }
        let firstItemName = '', itemCounter = 1;
        // Добавляем классы к основным элементам
        this._wrap.setAttribute('class',this._opts.classes.wrapper);
        this._head.setAttribute('class',this._opts.classes.head);
        this._list.setAttribute('class',this._opts.classes.list+' hidden');
        // Добавляем обработчик события клика по странице (для закрытия выпадающего списка)
        document.addEventListener('click', this.onClickDocument);
        // Добавляем обработчик события клика по заголовку выпадающего списка
        this._head.addEventListener('click', this.onClickHead);

        // Добавляем в выпадающий список первый пункт, который устанавливается как "по-умолчанию"
        // такой подход необходим из-за принудительной сортировки объектов браузером
        if(typeof this._opts.defaultValue === 'string' && typeof this._opts.defaultName === 'string'){
            // Создаём новый элемент списка
            let listItem = document.createElement('li');
            listItem.setAttribute('class',this._opts.classes.listItem);
            listItem.setAttribute('data-value',this._opts.defaultValue);
            listItem.innerHTML = this._opts.defaultName;
            // Добавляем обработчик события клика по элементу списка
            listItem.addEventListener('click', this.onClickListItem);
            // Вставляем элемент в общий список
            this._list.appendChild(listItem);
            // Заполняем значение данными по-умолчанию
            this._currentValues = [this._opts.defaultValue];
            firstItemName = this._opts.defaultName;
        }

        // Добавляем в выпадающий список все указанные элементы
        // помним, что этот список будет отсортирован браузером
        if(Object.keys(this._opts.data).length > 0){
            for (let keyData in this._opts.data) {
                if (this._opts.data.hasOwnProperty(keyData)){
                    if(typeof keyData === 'string' && typeof this._opts.data[keyData] === 'string'){
                        // Создаём новый элемент списка
                        let listItem = document.createElement('li');
                        listItem.setAttribute('class',this._opts.classes.listItem);
                        listItem.setAttribute('data-value',keyData);
                        listItem.innerHTML = this._opts.data[keyData];
                        // Добавляем обработчик события клика по элементу списка
                        listItem.addEventListener('click', this.onClickListItem);
                        // Вставляем элемент в общий список
                        this._list.appendChild(listItem);
                        // Если не были указаны значения по-умолчанию,
                        // то заполняем текущее значение первым элементом в списке
                        if(itemCounter === 1 && firstItemName === ''){
                            this._currentValues = [keyData];
                            firstItemName = this._opts.data[keyData];
                        }
                        itemCounter++;
                    }
                }
            }
        }
        // Добавляем DOM-элементы на страницу
        this._head.innerHTML = firstItemName;
        this._wrap.appendChild(this._head);
        this._wrap.appendChild(this._list);
        this._targetDomElement.appendChild(this._wrap);
        // Ставим маркер успешной инициации
        this._isLoaded = true;
    }
    onClickDocument(event){
        /** TODO: в будущем нужно учитывать переназначенные классы экземпляров custom_select */
        // Если клик не по документу, а по по экземляру custom_select = прерываем выполнение события
        if(event.target.parentNode !== document){
            if(event.target.parentNode.classList.contains('custom_select_wrapper') || event.target.parentNode.classList.contains('csw_list')){
                return;
            }
        }
        // Ищем все экземляры custom_select и закрываем выпадающий список
        let customSelects = document.getElementsByClassName('csw_list');
        if(customSelects !== null){
            // Если экземляры custom_select найдены
            Array.prototype.forEach.call(customSelects, function(item) {
                // Если экземляры custom_select не имеют класса hidden
                if(!item.classList.contains('hidden')){
                    item.classList.add('hidden');
                }
            });
        }
    }
    onClickHead(event){
        // При клике по заголовку custom_select открываем выпадающий список
        let _list = event.target.nextSibling;
        if(_list !== null){
            _list.classList.remove('hidden');
        }
    }
    onClickListItem(event){
        // При клике по элементу выпадающего списка выполняем действия:
        // 1. Устанавливаем переменные для работы
        let thisClass = event.target.parentNode.parentNode.thisClass,
            currentName = event.target.textContent,
            currentValue = event.target.getAttribute('data-value'),
            _head = event.target.parentNode.previousSibling;
        // 2. Меняем заголовок списка на название выбранного элемента
        if(_head !== null){
            _head.innerHTML = currentName;
        }
        // 3. Устанавливаем значение выбранного элемента в качестве значения объекта
        thisClass._currentValues = [currentValue];
        // 4. Скрываем список
        if(!event.target.parentNode.classList.contains('hidden')){
            event.target.parentNode.classList.add('hidden');
        }
        // 5. Вызываем callback-функцию
        thisClass.onChange();
    }
    onChange(){
        if(typeof this._opts.onChange === 'function'){
            this._opts.onChange(this._currentValues);
        }
    }
    getValues(){
        // Возвращаем текущее значение
        return this._currentValues;
    }
}
// Устанавливаем CustomSelect как глобальную переменную для прямого обращения к классу из любого места
global.CustomSelect = CustomSelectClass;