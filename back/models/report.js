const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Report extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      target: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      modelName: 'Report',
      tableName: 'reports',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }
  static associate(db) {
    db.Report.belongsTo(db.User);
    db.Report.belongsTo(db.Post);
    db.Report.belongsTo(db.Comment);
  }
};
