import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connect_Db.js';
import Joi from 'joi';
const Applicant = sequelize.define('Applicant', {
    applicantId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnic: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    tableName: 'applicants',
    timestamps: true,
});

// Joi validation for the required fields in the Applicant model
function validateApplicant(applicant) {
    const schema = Joi.object({
        userName: Joi.string().alphanum().min(4).max(15).required(),
        email: Joi.string().required().email(),
        qualification: Joi.string().required(),
        cnic: Joi.string().pattern(/^\d{13}$/).required(),
        address: Joi.string().required(),
        phoneNumber: Joi.string().pattern(/^\d{11}$/).required(),
        age: Joi.number().integer().positive().max(120).required()
    });

    return schema.validate(applicant);
}

export { Applicant, validateApplicant };
