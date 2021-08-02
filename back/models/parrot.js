const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Parrot extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      infocode: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      codename: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      probability: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      modelName: 'Parrot',
      tableName: 'parrots',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }
  static associate(db) {
    db.Parrot.belongsTo(db.User);
    db.Parrot.belongsTo(db.Post);
  }
};
