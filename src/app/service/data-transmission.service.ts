import { Injectable } from '@angular/core';

export { DataTransmissionService }
@Injectable({
    providedIn: 'root'
})

class DataTransmissionService {
    private db;
    private db_open_request;
    private db_objectstore;
    private db_operate_table;

    constructor() { }

    init(table_name: string, table_result: any) {
        if (this.db_operate_table != table_name) {
            let _this = this;
            this.db_open_request = window.indexedDB.open("zhaimt_DB", 1);
            this.db_open_request.onerror = function () {
                console.log('本地数据库打开失败');
            }
            this.db_open_request.onsuccess = function (event) {
                _this.db = event.target.result;
                _this.db_operate_table = table_name;
                _this.get_all_value(table_result);
            }
            this.db_open_request.onupgradeneeded = function (this: IDBRequest, event) {
                _this.db = event.target.result;
                let objectStore;
                if (!_this.db.objectStoreNames.contains(table_name)) {
                    objectStore = _this.db.createObjectStore(table_name, { keyPath: "value.id", autoIncrement: true });
                }
                _this.db_operate_table = table_name;
            }
        }
    }
    set_value(value: any) {
        this.db_objectstore = this.db.transaction([this.db_operate_table], 'readwrite').objectStore(this.db_operate_table);
        this.db_objectstore.add({ value });
    }
    update_value(value: any) {
        this.db_objectstore = this.db.transaction([this.db_operate_table], 'readwrite').objectStore(this.db_operate_table);
        this.db_objectstore.put({ value });
    }
    get_all_value(ret: any) {
        this.db_objectstore = this.db.transaction([this.db_operate_table], 'readwrite').objectStore(this.db_operate_table);
        let DB_result = this.db_objectstore.getAll();

        DB_result.onsuccess = function () {
            for (let i = 0; i < DB_result.result.length; i++) {
                ret.push(DB_result.result[i].value);
            }
        }
    }

    remove_value(value: any) {
        this.db_objectstore = this.db.transaction([this.db_operate_table], 'readwrite').objectStore(this.db_operate_table);
        let DB_result = this.db_objectstore.delete(value);
    }
}
