const express = require('express');
const { Op } = require('sequelize');

const { Post, Image, User, Comment, Report } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'ASC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }],
      }, {
        model: User, // 신뢰해요 누른 사람
        as: 'Exclamationers',
        attributes: ['id'],
      }, {
        model: User, // 의심해요 누른 사람
        as: 'Questioners',
        attributes: ['id'],
      }, {
        model: Report,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: Post,
        as: 'Branch',
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }, {
          model: Image,
        }]
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
