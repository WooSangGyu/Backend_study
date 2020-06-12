'use strict';

module.exports = (sequelize, DataType) => {
    var user = sequelize.define('user', {
        id : {
            type: DataType.STRING,
            unique : true,
            primaryKey : true,
            allowNull: false
        },
        password : {
            type: DataType.STRING,
            allowNull : true
        },
        name : {
            type : DataType.STRING,
            allowNull:false
        },
        gender : {
            type : DataType.STRING,
            allowNull:false
        },
        createTime : {
            type : DataType.DATE,
            allowNull:false
        }
    },
    {
        timestamps: false
    });
    return user;
};