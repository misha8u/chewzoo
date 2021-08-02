import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

import {
  PARROT_COMMENT_FAILURE, PARROT_COMMENT_REQUEST, PARROT_COMMENT_SUCCESS,
} from '../reducers/checklist';
import {
  ADD_COMMENT_SUCCESS,
} from '../reducers/post';

function parrotCommentAPI(data) {
  return axios.post(`/post/${data.postId}/parrot`, data);
}

function* parrotComment(action) {
  try {
    const result = yield call(parrotCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
    yield put({
      type: PARROT_COMMENT_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARROT_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchParrotComment() {
  yield takeLatest(PARROT_COMMENT_REQUEST, parrotComment);
}

export default function* userSaga() {
  yield all([
    fork(watchParrotComment),
  ]);
}
