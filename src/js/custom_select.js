class CustomSelectClass{
    constructor(target,options){
        this._classInit = typeof target === 'object' && typeof target.attributes === 'object';
        this._opts = {

        };
        if(typeof options === 'object' && Object.keys(options).length > 0){
            for (let key in options) {
                if (options.hasOwnProperty(key)){
                    this._opts[key] = options[key];
                }
            }
        }
    }
}
global.CustomSelect = CustomSelectClass;