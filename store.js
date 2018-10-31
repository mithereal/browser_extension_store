//
// Copyright (c) 2018 Jason Clark
// derived from switchysharp and store-js
// https://github.com/mithereal/browser_extension_store
// License: MIT-license
//
(function () {
    var Store = this.Store = function (name, defaults, ns = null) {

        this.store_cache = {};
        this.store_ns = ns;
        this.store_name = name;

        var key;

        if (defaults !== undefined) {
            for (key in defaults) {
                if (defaults.hasOwnProperty(key) && this.get(key) === undefined) {
                    this.set(key, defaults[key]);
                }
            }
        }
    };

    Store.prototype.all = function (name) {
        if(this.store_ns === null){
            name =  "" ;
        }else{
            name = this.store_ns + "." + this.store_name ;
        }

        if (localStorage.getItem(name) === null) { return undefined; }
        try {
            return JSON.parse(localStorage.getItem(name));
        } catch (e) {
            return null;
        }
    };

    Store.prototype.get = function (name) {

        if(this.store_ns === null){
            name =  "";
        }else{
            name = this.store_ns + "." + this.store_name + "." + name;
        }


        if (localStorage.getItem(name) === null) { return undefined; }
        try {
            return JSON.parse(localStorage.getItem(name));
        } catch (e) {
            return null;
        }
    };

    Store.prototype.set = function (name, value) {
        if (value === undefined) {
            this.remove(name);
        } else {
            if (typeof value === "function") {
                value = null;
            } else {
                try {
                    value = JSON.stringify(value);
                } catch (e) {
                    value = null;
                }
            }

            if(this.store_ns === null){
                localStorage.setItem(this.store_name + "." + name, value);
            }else{
                localStorage.setItem(this.store_ns + "." + this.store_name + "." + name, value);
            }
        }

        return this;
    };

    Store.prototype.remove = function (name) {
        if(this.store_ns === null){
            localStorage.removeItem(this.store_name + "." + name);
        }else{
            localStorage.removeItem(this.store_ns + "." + this.store_name + "." + name);
        }

        return this;
    };

    Store.prototype.removeAll = function () {
        var name,
            i;

        if(this.store_ns === null){
            name = this.store_name + ".";
        }else{
            name = this.store_ns + "." + this.store_name + ".";
        }

        for (i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                localStorage.removeItem(localStorage.key(i));
            }
        }

        return this;
    };

    Store.prototype.toObject = function () {
        var values,
            name,
            i,
            key,
            value;

        values = {};

        if(this.store_ns === null){
            name = this.store_name + ".";
        }else{
            name = this.store_ns + "." + this.store_name + ".";
        }

        for (i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                key = localStorage.key(i).substring(name.length);
                value = this.get(key);
                if (value !== undefined) { values[key] = value; }
            }
        }

        return values;
    };

    Store.prototype.fromObject = function (values, merge) {
        if (merge !== true) { this.removeAll(); }
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this.set(key, values[key]);
            }
        }

        return this;
    };

    Store.prototype.keyExists = function keyExists(key) {
        var exists = false;

        if (localStorage.getItem(key) === null) {
          exists = false;
         }else{
         exists = true;
        }

        return exists;
    };

    Store.prototype.encode = function encode(key, object) {
        localStorage[key] = JSON.stringify(object);
        return object;
    };

    Store.prototype.decode = function decode(key) {
        if (localStorage[key] == undefined)
            return undefined;

        return JSON.parse(localStorage[key]);
    };

    Store.prototype.refreshCache = function refreshCache() {
        this.store_cache = {};
    };

}());