export default class CustomSelectClass
{
    constructor(target,options){
        // Маркер того что класс уже был инициирован
        this._isLoaded = false;
        // Маркер корректно переданного DOM-объекта
        this._targetDomElement = typeof target === 'object' && typeof target.attributes === 'object' ? target : null;
        this._currentValues = [];
        this._wrap = document.createElement('div');
        this._head = document.createElement('div');
        this._list = document.createElement('ul');
        // Базовые параметры
        this._opts = {
            data: {},
            defaultValue: 'none',
            defaultName: '--- выберите из списка ---',
            maxWidthHead: 300,
            maxWidthList: 300,
            maxHeightList: 600,
            scrollX: 'hidden',
            scrollY: 'auto',
            onChange: function(){},
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

        this._wrap.setAttribute('class',this._opts.classes.wrapper);
        this._head.setAttribute('class',this._opts.classes.head);

        this._list.setAttribute('class',this._opts.classes.list);
        this._list.setAttribute('style','display:none;');

        // Добавляем обработчик события клика по странице (для закрытия выпадающего списка)
        document.addEventListener('click', this.onClickDocument);
        // Добавляем обработчик события клика по заголовку выпадающего списка
        this._head.addEventListener('click', this.onClickHead);

        // Добавляем в выпадающий список первый пункт, который устанавливается как "по-умолчанию"
        // такой подход необходим из-за принудительной сортировки объектов браузером
        if(typeof this._opts.defaultValue === 'string' && typeof this._opts.defaultName === 'string'){
            let listItem = document.createElement('li');
            listItem.setAttribute('class',this._opts.classes.listItem);
            listItem.setAttribute('data-value',this._opts.defaultValue);
            listItem.innerHTML = this._opts.defaultName;
            this._list.appendChild(listItem);
            this._currentValues = [this._opts.defaultValue];
            firstItemName = this._opts.defaultName;
        }

        // Добавляем в выпадающий список все указанные элементы
        // помним, что этот список будет отсортирован браузером
        if(Object.keys(this._opts.data).length > 0){
            for (let keyData in this._opts.data) {
                if (this._opts.data.hasOwnProperty(keyData)){
                    if(typeof keyData === 'string' && typeof this._opts.data[keyData] === 'string'){
                        let listItem = document.createElement('li');
                        listItem.setAttribute('class',this._opts.classes.listItem);
                        listItem.setAttribute('data-value',keyData);
                        listItem.innerHTML = this._opts.data[keyData];
                        this._list.appendChild(listItem);
                        if(itemCounter === 1 && firstItemName === ''){
                            this._currentValues = [keyData];
                            firstItemName = this._opts.data[keyData];
                        }
                        itemCounter++;
                    }
                }
            }
        }
        this._head.innerHTML = firstItemName;

        this._wrap.appendChild(this._head);
        this._wrap.appendChild(this._list);
        this._targetDomElement.appendChild(this._wrap);

        this._isLoaded = true;
    }
    onClickDocument(event){

    }
    onClickHead(event){
        //console.log(self._list);
    }
    onClickListItem(){

    }
    onChange(){
        if(typeof this._opts.onChange === 'function'){
            this._opts.onChange(this._currentValues);
        }
    }
}
global.CustomSelect = CustomSelectClass;