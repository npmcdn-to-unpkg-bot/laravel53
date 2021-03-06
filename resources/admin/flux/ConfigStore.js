'use strict';
var AppDispatcher = require('./AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'config';

var _todos = {
    transition: 'example',
    msg: '',
    loading: true,
    title: '王的理想乡',
};

var ConfigStore = assign({}, EventEmitter.prototype, {

    getAll: function () {
        return _todos;
    },

    get: function (id) {
        return _todos[id];
    },

    message: function () {
        let msg = _todos['message']
        if (_todos['message'] != '') {
            _todos['message'] = ''
        }
        return msg
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

module.exports = ConfigStore;

// Register callback to handle all updates
AppDispatcher.register(function (action) {
    let data = action.data
    if (_todos[action.id] == data) {
        return
    }
    switch (action.actionType) {
        case 'updateAll':
            for (let key in data) {
                update(key, data[key])
            }
            break;
        case 'updateArticle':
            update(data.id, data)
            update('title', data.title)
            break;
        case 'message':
            let message = {}
            message.msg = data
            message.time = new Date()
            update('message', message)
            break;
        default:
            update(action.id, action.data)

    }
    ConfigStore.emitChange()
})

function update(id, data) {
    _todos[id] = data
}
