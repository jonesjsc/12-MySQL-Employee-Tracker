const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for Department
class Role extends Model {}

// you can add functions to the model if you want - like this:
// class User extends Model {
//   checkPassword(loginPw) {
//     return bcrypt.compareSync(loginPw, this.password);
//   }
// }

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'department',
        key: 'id',
      },
      allowNull: false,
    },

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'role',
  }
);

module.exports = Role;