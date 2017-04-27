 var Admins = require('../lib/mongo').Admins,
     Classifications = require('../lib/mongo').Classifications,
     Articles = require('../lib/mongo').Articles,
     Comments = require('../lib/mongo').Comments,
     async = require('async'),
     // 文章中根据classificationId及commentsId查询分类及评论并补充
     ClassAndCommentQuery = (articles, resolve, reject) => {
       // 获取文章成功，查询分类及评论
       async.map(articles, (articleItem, callback) => {
         Classifications.findOne({ _id: articleItem.classificationId })
                        .exec()
                        .then((classification) => {
                          // 获取分类成功，查询评论
                          articleItem.classification = classification.name
                          Comments.find({ articleId: articleItem._id })
                                  .addDate()
                                  .sort({ _id: -1 })
                                  .exec()
                                  .then((comments) => {
                                    // 获取评论成功，进行回调
                                    articleItem.comments = comments
                                    callback(null, articleItem)
                                  })
                        })
       }, (err, articles) => {
         if (!err) {
           resolve(articles)
         } else {
           reject(err)
         }
       })
     },
     // 评论中根据articleId查询文章并补充
     ArticleQuery = (comments, resolve, reject) => {
       // 获取评论成功，查询文章
       async.map(comments, (commentItem, callback) => {
         Articles.findOne({ _id: commentItem.articleId })
                 .exec()
                 .then((article) => {
                   commentItem.article = article
                   callback(null, commentItem)
                 })
       }, (err, comments) => {
         if (!err) {
           resolve(comments)
         } else {
           reject(err)
         }
       })
     }

module.exports = {
// 管理员相关API函数 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getAdmin (account) {
    return Admins.findOne({ account: account })
                 .exec()
  },
// 文章相关API函数 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 新建文章
  createArticle (article) {
    return Articles.create({
                      title: article.title,
                      intro: article.intro,
                      body: article.body,
                      classificationId: article.classificationId
                   })
                   .exec()
  },
  // 根据文章ID删除文章
  removeArticle (articleId) {
    return new Promise((resolve, reject) => {
      Articles.remove({ _id: articleId })
              .exec()
              .then((result) => {
                Comments.remove({ articleId: articleId })
                        .exec()
                        .then((result) => {
                          resolve(result)
                        })
                        .catch((err) => {
                          reject(err)
                        })
              })
              .catch((err) => {
                reject(err)
              })
    })
  },
  // 根据文章ID更新文章
  updateArticle (article) {
    return Articles.update({ _id: article._id }, { $set: {
                      title: article.title,
                      intro: article.intro,
                      body: article.body,
                      classificationId: article.classificationId
                   } })
                   .exec()
  },
  // 根据文章ID获取一篇文章
  getArticle (articleId) {
    return new Promise((resolve, reject) => {
      Articles.find({ _id: articleId })
              .addDate()
              .exec()
              .then((articles) => {
                ClassAndCommentQuery(articles, resolve, reject)
              })
              .catch((err) => {
                reject(err)
              })
    })
  },
  // 根据页数和数量获取文章，page为页数，number为数量，page从0开始，number不为负数
  getArticleList (page, number) {
    if (number) {
      // 当number不为0时，数据库查询跳过page*number数量
      return new Promise((resolve, reject) => {
        var skip = page * number
        Articles.find()
                .addDate()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(number)
                .exec()
                .then((articles) => {
                  ClassAndCommentQuery(articles, resolve, reject)
                })
                .catch((err) => {
                  reject(err)
                })
      })
    } else {
      // 当number为0时，则获取所有文章
      return new Promise((resolve, reject) => {
        Articles.find()
                .addDate()
                .sort({ _id: -1 })
                .exec()
                .then((articles) => {
                  ClassAndCommentQuery(articles, resolve, reject)
                })
                .catch((err) => {
                  reject(err)
                })
      })
    }
  },
  // 根据文章ID获取文章内所有评论
  getCommentListByArticle (articleId) {
    return Comments.find({ articleId: articleId })
                   .addDate()
                   .sort({ _id: -1 })
                   .exec()
  },
// 分类相关API函数 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 新建分类
  createClassification (name) {
    return Classifications.create({ name })
                          .exec()
  },
  // 根据分类ID删除分类
  removeClassification (classificationId) {
    return new Promise((resolve, reject) => {
      Articles.find({ classificationId: classificationId })
              .exec()
              .then((articles) => {
                if (articles.length === 0) {
                  Classifications.remove({ _id: classificationId })
                                 .exec()
                                 .then((result) => {
                                   resolve(result)
                                 })
                                 .catch((err) => {
                                   reject(err)
                                 })
                } else {
                  reject('分类中文章未删除，无法删除该分类')
                }
              })
              .catch((err) => {
                reject(err)
              })
    })
  },
  // 根据分类ID更新分类
  updateClassification (classification) {
    return Classifications.update({ _id: classification._id }, { $set: { name: classification.name } })
                          .exec()
  },
  // 获取分类
  getClassificationList() {
    return Classifications.find()
                          .sort({ _id: -1 })
                          .exec()
  },
  // 根据分类获取该分类下的所有文章
  getArticleListByClassification(name, page, number) {
    return new Promise((resolve, reject) => {
      var skip = page*number
      Classifications.findOne({ name: name })
                     .exec()
                     .then((classResult) => {
                       Articles.find({ classificationId: classResult._id })
                              .addDate()
                              .sort({ _id: -1 })
                              .skip(skip)
                              .limit(number)
                              .exec()
                              .then((articles) => {
                                ClassAndCommentQuery(articles, resolve, reject)
                              })
                      })
                      .catch((err) => {
                        reject(err)
                      })
    })
  },
// 评论相关API函数 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 新建评论
  createComment (comment) {
    return Comments.create(comment)
                   .exec()
  },
  // 根据评论ID删除评论
  removeComment (commentId) {
    return Comments.remove({ _id: commentId })
                   .exec()
  },
  // 获取一定数量的评论及对应文章标题，page为页数，number为数量，page从0开始，number不为负数
  getCommentList (page, number) {
    if (number) {
      // 当number不为0时，数据库查询跳过page*number数量
      var skip = page*number
      return new Promise((resolve, reject) => {
        Comments.find()
                .addDate()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(number)
                .exec()
                .then((comments) => {
                  ArticleQuery(comments, resolve, reject)
                })
                .catch((err) => {
                  reject(err)
                })
      })
    } else {
      // 当number为0时，则获取所有评论
      return new Promise((resolve, reject) => {
        Comments.find()
                .addDate()
                .sort({ _id: -1 })
                .exec()
                .then((comments) => {
                  ArticleQuery(comments, resolve, reject)
                })
                .catch((err) => {
                  reject(err)
                })
      })
    }
  }
}
