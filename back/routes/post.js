const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { Post, Image, Comment, Report, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  fs.mkdirSync('uploads');
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: ' chewzoo-s3',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname', 'avatar'],
        }],
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname', 'avatar'],
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
          model: User, // 신고자
          attributes: ['id', 'nickname'],
        }],
      }]
    })
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
  console.log(req.files);
  res.json(req.files.map((v) => v.location));
});

router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
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
          order: [['createdAt', 'DESC']],
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
      }],
    });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/branch', isLoggedIn, upload.none(), async (req, res, next) => { // POST /post/1/branch
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Branch',
      }],
    });
    if (!post) {
      return res.status(403).send('뭘 하자는지 모르겠어..');
    }
    const branch = await Post.create({
      UserId: req.user.id,
      BranchId: parseInt(post.id, 10),
      content: req.body.content,
    });

    const hashtags = req.body.content.match(/#[^\s#]+/g);    
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await branch.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await branch.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await branch.addImages(image);
      }
    }
    
    const branchWithPrevPost = await Post.findOne({
      where: { id: branch.id },
      include: [{
        model: Post,
        as: 'Branch',
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }, {
        model: Report,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
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
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }],
      }],
    })
    res.status(201).json(branchWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/exclamation', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('뭘 하자는지 모르겠어..');
    }
    await post.addExclamationers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/exclamation', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('뭘 하자는지 모르겠어..');
    }
    await post.removeExclamationers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/question', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('뭘 하자는지 모르겠어..');
    }
    await post.addQuestioners(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/question', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('');
    }
    await post.removeQuestioners(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/report', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('뭘 하자는지 모르겠어..');
    }
    const exReport = await Report.findOne({
      where: {
        PostId: parseInt(req.params.postId, 10),
        UserId: req.user.id,
      }
    });
    if (exReport) {
      return res.status(403).send('이미 신고했어.');
    }
    const report = await Report.create({
      content: req.body.content,
      target: req.body.target,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    })
    const fullReport = await Report.findOne({
      where: { id: report.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    })
    res.status(201).json(fullReport);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('댓글을 어디 달려고?');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    })
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }],
    })
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/comment/:commentId', isLoggedIn, async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      where: { 
        id: req.params.commentId,
        UserId: req.user.id,
      },
    });
    if (!comment) {
      res.status(403).send('무슨 댓글을 지우려고?');
    }
    await comment.destroy({ id: req.params.commentId });
    res.status(200).json({ CommentId: comment.id, PostId: comment.PostId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;