const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      avatar: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    }, {
      modelName: 'User',
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
      sequelize,
    });
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.hasMany(db.Report);
    db.User.belongsToMany(db.Post, { through: 'Question', as: 'Questioned' })
    db.User.belongsToMany(db.Post, { through: 'Exclamation', as: 'Exclamationed' })
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  }
};
