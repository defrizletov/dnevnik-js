const axios = require('axios');

class APIError extends Error {
    constructor (message) {
        super(message || 'Неизвестная ошибка API.');
        this.name = 'APIError';
    };
};

class Dnevnik {
    constructor (options = {}) {
        if(!options?.token) throw new APIError('Не найден параметр "token" для авторизации.');

        this.api = {
            apiHeaders: {'Content-Type':'application/json', 'Access-Token': options?.token},
            apiVersion: options?.apiVersion || 'v2',
            apiUrl: 'https://api.dnevnik.ru/',
            apiCategories: ['users','user','authorizations','lessons','persons','person','edu-groups','edu-group','criteriajournalsections','criteriajournal','schools','files','folder','apps','gis-my-school','works','lesson-log-entries','periods','marks','school-rating','sferum','events','groups','networks','tasks','teacher','thematic-marks','work-types'],
            callMethod: async (method, params) => {
                if(typeof params !== 'object') throw new APIError('В вызов метода нужно передать объект типа { method: string, ...any }.');
                if(!params?.method) throw new APIError('Не найден параметр "method" для обозначения типа запроса.');
                if(!['get','post','put','delete'].includes(params.method?.toLowerCase())) throw new APIError('Параметр "method" не валиден.');
                if(params?.body) {
                    if(!params?.data) params.data = body;
                    delete params.body;
                };

                ['url','headers'].map(x => { if(Object.keys(params).map(x => x?.toLowerCase()).includes(x)) delete params[x]; });
        
                return (await axios({ url: this.api.apiUrl + this.api.apiVersion + '/' + method, headers: this.api.apiHeaders, ...params }).catch(err => { throw new APIError(err?.response?.data?.type ? `[${err?.response?.data?.type}, ${err?.response?.status}] ${err?.response?.data?.description || 'Неизвестная ошибка'}` : `[${err?.response?.status}] Неизвестная ошибка.`); }))?.data;
            }
        };

        this.api.apiCategories.map(apiCategoria => this.api[apiCategoria] = new Proxy({apiCategoria}, {get: (obj, prop) => params => this.api.callMethod(obj?.apiCategoria + '/' + prop?.replaceAll('.', '/'), params)}));
    };
};

exports.Dnevnik = Dnevnik;