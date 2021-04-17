const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for Employee
class Employee extends Model {}

// you can add functions to the model if you want - like this:
// class User extends Model {
//   checkPassword(loginPw) {
//     return bcrypt.compareSync(loginPw, this.password);
//   }
// }

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'role',
        key: 'id',
      },
      allowNull: false,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employee',
        key: 'id',
      }
    },

  },
  {
    // hooks: { // EXAMPLE HOOKS
    //   beforeCreate: async (newUserData) => {
    //     newUserData.password = await bcrypt.hash(newUserData.password, 10);
    //     return newUserData;
    //   }, 
    //   beforeUpdate: async (updatedUserData) => {
    //     updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    //     return updatedUserData;
    //   },
    // },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'employee',
  }
);

module.exports = Employee;