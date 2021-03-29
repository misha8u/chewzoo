import axios from 'axios';
import { all, delay, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';

import {
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT_FAILURE, REMOVE_COMMENT_REQUEST, REMOVE_COMMENT_SUCCESS,
  ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS,
  LOAD_POSTS_FAILURE, LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS,
  LOAD_POST_FAILURE, LOAD_POST_REQUEST, LOAD_POST_SUCCESS,
  LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
  REMOVE_POST_FAILURE, REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS,
  ON_EXCLAMATION_REQUEST, ON_EXCLAMATION_SUCCESS, ON_EXCLAMATION_FAILURE,
  OFF_EXCLAMATION_REQUEST, OFF_EXCLAMATION_SUCCESS, OFF_EXCLAMATION_FAILURE,
  ON_QUESTION_REQUEST, ON_QUESTION_SUCCESS, ON_QUESTION_FAILURE,
  OFF_QUESTION_REQUEST, OFF_QUESTION_SUCCESS, OFF_QUESTION_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
  BRANCH_FAILURE, BRANCH_REQUEST, BRANCH_SUCCESS, RETURN_FOCUSCARD,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function branchAPI(data) {
  console.log(data.postId, 'saga branchAPI 함수');
  return axios.post(`/post/${data.postId}/branch`, data);
}

function* branch(action) {
  try {
    console.log(action.data, 'saga branch 함수');
    const result = yield call(branchAPI, action.data);
    yield put({
      type: BRANCH_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BRANCH_FAILURE,
      error: err.response.data,
    });
  }
}

function onExclamationAPI(data) {
  return axios.patch(`/post/${data}/exclamation`);
}

function* onExclamation(action) {
  try {
    const result = yield call(onExclamationAPI, action.data);
    yield put({
      type: ON_EXCLAMATION_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ON_EXCLAMATION_FAILURE,
      error: err.response.data,
    });
  }
}

function offExclamationAPI(data) {
  return axios.delete(`/post/${data}/exclamation`);
}

function* offExclamation(action) {
  try {
    const result = yield call(offExclamationAPI, action.data);
    yield put({
      type: OFF_EXCLAMATION_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: OFF_EXCLAMATION_FAILURE,
      error: err.response.data,
    });
  }
}

function onQuestionAPI(data) {
  return axios.patch(`/post/${data}/question`);
}

function* onQuestion(action) {
  try {
    const result = yield call(onQuestionAPI, action.data);
    yield put({
      type: ON_QUESTION_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ON_QUESTION_FAILURE,
      error: err.response.data,
    });
  }
}

function offQuestionAPI(data) {
  return axios.delete(`/post/${data}/question`);
}

function* offQuestion(action) {
  try {
    const result = yield call(offQuestionAPI, action.data);
    yield put({
      type: OFF_QUESTION_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: OFF_QUESTION_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  console.log(data);
  return axios.post('/post', data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function removeCommentAPI(data) {
  return axios.delete(`/post/comment/${data.commentId}`, data);
}

function* removeComment(action) {
  try {
    const result = yield call(removeCommentAPI, action.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });    
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    console.log('uploadImageAPI 성공')
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
    console.log('UPLOAD_IMAGES_SUCCESS 성공')
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function* returnFocusCard(action) {
  try {
    console.log(action.data, 'from saga');
    yield put({
      data: action.data,
    });
  } catch (err) {
      console.error(err);
  }
}

function* watchBranch() {
  yield takeLatest(BRANCH_REQUEST, branch);
}

function* watchOnExclamation() {
  yield takeLatest(ON_EXCLAMATION_REQUEST, onExclamation);
}

function* watchOffExclamation() {
  yield takeLatest(OFF_EXCLAMATION_REQUEST, offExclamation);
}

function* watchOnQuestion() {
  yield takeLatest(ON_QUESTION_REQUEST, onQuestion);
}

function* watchOffQuestion() {
  yield takeLatest(OFF_QUESTION_REQUEST, offQuestion);
}

function* watchLoadPosts() {
  yield throttle(2000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchReturnFocusCard() {
  yield takeLatest(RETURN_FOCUSCARD, returnFocusCard);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchBranch),
    fork(watchOnExclamation),
    fork(watchOffExclamation),
    fork(watchOnQuestion),
    fork(watchOffQuestion),
    fork(watchAddPost),
    fork(watchLoadPost),
    fork(watchLoadPosts),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchUploadImages),
    fork(watchRemovePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchReturnFocusCard),
  ]);
}
