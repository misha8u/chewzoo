const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { Post, Image, Comment, Report, User, Hashtag, Parrot } = require('../models');
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

const _storage = process.env.NODE_ENV === 'production'  
  ? multerS3({
      s3: new AWS.S3(),
      bucket: 'chewzoo-s3',
      key(req, file, cb) {
        cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
      }
    })
  : multer.diskStorage({
      destination(req, file, done) {
        done(null, 'uploads');
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        done(null, basename + '_' + new Date().getTime() + ext);
      },
    })
;

const upload = multer({
  storage: _storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
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
  if (process.env.NODE_ENV === 'production') {
    res.json(req.files.map((v) => v.location));
  } else {
    res.json(req.files.map((v) => v.filename));
  }
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

router.patch('/:postId', isLoggedIn, upload.none(), async (req, res, next) => { // PATCH /post/10
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.findOne({ where: { id: req.body.PostId }});
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.setHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      const existingImages = await Image.findAll({ where: { PostId: req.body.PostId }});
      if (existingImages?.length > 0) {
        const existingImagesIds = existingImages.map(e => e?.id); 
        const updatedImagesIds = req.body.image.map(e => e.id);
        const savingImagesIds = existingImagesIds.filter(e => updatedImagesIds.includes(e));
        const removingImages = existingImages.filter(x => !savingImagesIds.includes(x.id));

        if (removingImages?.length > 0) {
          await post.removeImages(removingImages.map((v) => v.id))
        }
      }

      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((i) => {
          if (typeof(i) === 'string') {
            return(
              Image.create({ src: i })
            )
          }
        }))
        if (images?.length > 0) {
          await post.addImages(images);
        }
      } else {
        if (typeof(req.body.image) === 'string') {
          const image = await Image.create({ src: req.body.image })
          await post.addImages(image);
        }
      }
    }

    await Post.update({
      content: req.body.content,
      image: req.body.image,
    }, {
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });

    const updatedPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }]
    })
    res.status(201).json(updatedPost);

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
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (!post) {
      return res.status(403).send('댓글을 어디 달려고?');
    }
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map((v) => v[0]));
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

router.post('/:postId/parrot', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (!post) {
      return res.status(403).send('껄무새는 어디에?');
    }
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map((v) => v[0]));
    }
    const parrotUser = await User.findOne({
      where: { email: 'parrot@parrot.com' },
      attributes: {
        exclude: ['password', 'nickname', 'avatar', 'email', 'createdAt', 'updatedAt']
      }
    })

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: parseInt(parrotUser.id, 10),
    })
    const parrot = await Parrot.create({
      content: req.body.content,
      infocode: req.body.infocode,
      codename: req.body.codename,
      probability: parseInt(req.body.probability, 10),
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
    const post = await Post.findOne({
      where: { id: comment.PostId },
    });
    const hashtags = comment.content.match(/#[^\s#]+/g);
    if (!comment) {
      res.status(403).send('무슨 댓글을 지우려고?');
    }
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.removeHashtags(result.map((v) => v[0]));
    }
    await comment.destroy({ id: req.params.commentId });
    res.status(200).json({ CommentId: comment.id, PostId: comment.PostId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;