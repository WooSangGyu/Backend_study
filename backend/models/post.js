'use strict';

module.exports = (sequelize, DataType) => {
    var board = sequelize.define('board', {
        no : {
            type : DataType.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        writer : {
            type : DataType.STRING,
        },
        title : {
            type: DataType.STRING,
            allowNull: false
        },
        content : {
            type: DataType.STRING,
            allowNull : false
        }
    },
    {
        timestamp: true
    });
    return board;
};