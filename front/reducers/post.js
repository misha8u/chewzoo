import produce from '../util/produce';

export const initialState = {
  singlePost: null,
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  onExclamationLoading: false,
  onExclamationDone: false,
  onExclamationError: null,
  offExclamationLoading: false,
  offExclamationDone: false,
  offExclamationError: null,
  onQuestionLoading: false,
  onQuestionDone: false,
  onQuestionError: null,
  offQuestionLoading: false,
  offQuestionDone: false,
  offQuestionError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  branchLoading: false,
  branchDone: false,
  branchError: null,
  reportLoading: false,
  reportDone: false,
  reportError: null,
  reportedPost: null,
  focusCardDone: false,
  focusCard: 0,
  showPostForm: false,
  showBranchPostForm: false,
  showUpdatePostForm: false,
  branchPost: null,
  updatePost: null,
};

export const BRANCH_REQUEST = 'BRANCH_REQUEST';
export const BRANCH_SUCCESS = 'BRANCH_SUCCESS';
export const BRANCH_FAILURE = 'BRANCH_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ON_EXCLAMATION_REQUEST = 'ON_EXCLAMATION_REQUEST';
export const ON_EXCLAMATION_SUCCESS = 'ON_EXCLAMATION_SUCCESS';
export const ON_EXCLAMATION_FAILURE = 'ON_EXCLAMATION_FAILURE';

export const OFF_EXCLAMATION_REQUEST = 'OFF_EXCLAMATION_REQUEST';
export const OFF_EXCLAMATION_SUCCESS = 'OFF_EXCLAMATION_SUCCESS';
export const OFF_EXCLAMATION_FAILURE = 'OFF_EXCLAMATION_FAILURE';

export const ON_QUESTION_REQUEST = 'ON_QUESTION_REQUEST';
export const ON_QUESTION_SUCCESS = 'ON_QUESTION_SUCCESS';
export const ON_QUESTION_FAILURE = 'ON_QUESTION_FAILURE';

export const OFF_QUESTION_REQUEST = 'OFF_QUESTION_REQUEST';
export const OFF_QUESTION_SUCCESS = 'OFF_QUESTION_SUCCESS';
export const OFF_QUESTION_FAILURE = 'OFF_QUESTION_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

export const REPORT_POST_REQUEST = 'REPORT_POST_REQUEST';
export const REPORT_POST_SUCCESS = 'REPORT_POST_SUCCESS';
export const REPORT_POST_FAILURE = 'REPORT_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_COMMENT_REQUEST = 'REMOVE_COMMENT_REQUEST';
export const REMOVE_COMMENT_SUCCESS = 'REMOVE_COMMENT_SUCCESS';
export const REMOVE_COMMENT_FAILURE = 'REMOVE_COMMENT_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const RETURN_FOCUSCARD = 'RETURN_FOCUS_CARD';
export const RETURNED_FOCUSCARD = 'RETURNED_FOCUSCARD';

export const SHOW_POSTFORM = 'SHOW_POSTFORM';
export const SHOW_BRANCH_POSTFORM = 'SHOW_BRANCH_POSTFORM';
export const SHOW_UPDATE_POSTFORM = 'SHOW_UPDATE_POSTFORM';
export const CLOSE_POSTFORM = 'CLOSE_POSTFORM';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case BRANCH_REQUEST:
      draft.branchLoading = true;
      draft.branchDone = false;
      draft.branchError = null;
      break;
    case BRANCH_SUCCESS: {
      draft.branchLoading = false;
      draft.branchDone = true;
      draft.mainPosts.unshift(action.data);
      draft.imagePaths = [];
      break;
    }
    case BRANCH_FAILURE:
      draft.branchLoading = false;
      draft.branchError = action.error;
      break;
    case UPLOAD_IMAGES_REQUEST:
      draft.uploadImagesLoading = true;
      draft.uploadImagesDone = false;
      draft.uploadImagesError = null;
      break;
    case UPLOAD_IMAGES_SUCCESS:
      draft.imagePaths = draft.imagePaths.concat(action.data);
      draft.uploadImagesLoading = false;
      draft.uploadImagesDone = true;
      break;
    case UPLOAD_IMAGES_FAILURE:
      draft.uploadImagesLoading = false;
      draft.uploadImagesError = action.error;
      break;
    case REMOVE_IMAGE:
      draft.imagePaths = draft.imagePaths.filter((i) =>  i !== action.data);
      break;
    case OFF_EXCLAMATION_REQUEST:
      draft.offExclamationLoading = true;
      draft.offExclamationDone = false;
      draft.offExclamationError = null;
      break;
    case OFF_EXCLAMATION_SUCCESS:{
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Exclamationers = post.Exclamationers.filter((v) => v.id !== action.data.UserId);
      draft.offExclamationLoading = false;
      draft.offExclamationDone = true;
      break;
    }
    case OFF_EXCLAMATION_FAILURE:
      draft.offExclamationLoading = false;
      draft.offExclamationError = action.error;
      break;
    case ON_EXCLAMATION_REQUEST:
      draft.onExclamationLoading = true;
      draft.onExclamationDone = false;
      draft.onExclamationError = null;
      break;
    case ON_EXCLAMATION_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Exclamationers.push({ id: action.data.UserId });
      draft.onExclamationLoading = false;
      draft.onExclamationDone = true;
      break;
    }
    case ON_EXCLAMATION_FAILURE:
      draft.onExclamationLoading = false;
      draft.onExclamationError = action.error;
      break;
      
    case OFF_EXCLAMATION_REQUEST:
      draft.offExclamationLoading = true;
      draft.offExclamationDone = false;
      draft.offExclamationError = null;
      break;
    case OFF_EXCLAMATION_SUCCESS:{
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Exclamationers = post.Exclamationers.filter((v) => v.id !== action.data.UserId);
      draft.offExclamationLoading = false;
      draft.offExclamationDone = true;
      break;
    }
    case OFF_EXCLAMATION_FAILURE:
      draft.offExclamationLoading = false;
      draft.offExclamationError = action.error;
      break;
    case ON_EXCLAMATION_REQUEST:
      draft.onExclamationLoading = true;
      draft.onExclamationDone = false;
      draft.onExclamationError = null;
      break;
    case ON_EXCLAMATION_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Exclamationers.push({ id: action.data.UserId });
      draft.onExclamationLoading = false;
      draft.onExclamationDone = true;
      break;
    }
    case ON_EXCLAMATION_FAILURE:
      draft.onExclamationLoading = false;
      draft.onExclamationError = action.error;
      break;
    case OFF_QUESTION_REQUEST:
      draft.offQuestionLoading = true;
      draft.offQuestionDone = false;
      draft.offQuestionError = null;
      break;
    case OFF_QUESTION_SUCCESS:{
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Questioners = post.Questioners.filter((v) => v.id !== action.data.UserId);
      draft.offQuestionLoading = false;
      draft.offQuestionDone = true;
      break;
    }
    case OFF_QUESTION_FAILURE:
      draft.offQuestionLoading = false;
      draft.offQuestionError = action.error;
      break;
    case ON_QUESTION_REQUEST:
      draft.onQuestionLoading = true;
      draft.onQuestionDone = false;
      draft.onQuestionError = null;
      break;
    case ON_QUESTION_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Questioners.push({ id: action.data.UserId });
      draft.onQuestionLoading = false;
      draft.onQuestionDone = true;
      break;
    }
    case ON_QUESTION_FAILURE:
      draft.onQuestionLoading = false;
      draft.onQuestionError = action.error;
      break;
    case LOAD_POST_REQUEST:
      draft.loadPostLoading = true;
      draft.loadPostDone = false;
      draft.loadPostError = null;
      break;
    case LOAD_POST_SUCCESS:
      draft.loadPostLoading = false;
      draft.loadPostDone = true;
      draft.singlePost = action.data;
      break;
    case LOAD_POST_FAILURE:
      draft.loadPostLoading = false;
      draft.loadPostError = action.error;
      break;
    case LOAD_USER_POSTS_REQUEST:
    case LOAD_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
      draft.loadPostsLoading = true;
      draft.loadPostsDone = false;
      draft.loadPostsError = null;
      break;
    case LOAD_USER_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_POSTS_SUCCESS:
      draft.loadPostsLoading = false;
      draft.loadPostsDone = true;
      draft.mainPosts = draft.mainPosts.concat(action.data);
      draft.hasMorePosts = action.data.length === 10;
      break;
    case LOAD_USER_POSTS_FAILURE:
    case LOAD_HASHTAG_POSTS_FAILURE:
    case LOAD_POSTS_FAILURE:
      draft.loadPostsLoading = false;
      draft.loadPostsError = action.error;
      break;
    case RETURN_FOCUSCARD:
      draft.focusCardDone = true;
      draft.focusCard = action.data;
      break;
    case RETURNED_FOCUSCARD:
      draft.focusCardDone = false;
      draft.focusCard = null;
      break;
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS:
      draft.addPostLoading = false;
      draft.addPostDone = true;
      draft.mainPosts.unshift(action.data);
      draft.imagePaths = [];
      break;
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostError = action.error;
      break;
    case REPORT_POST_REQUEST:
      draft.reportLoading = true;
      draft.reportDone = false;
      draft.reportError = null;
      draft.reportedPost = null;
      break;
    case REPORT_POST_SUCCESS: {
      draft.reportLoading = false;
      draft.reportDone = true;
      draft.reportedPost = action.data.PostId;
      break;
    } 
    case REPORT_POST_FAILURE:
      draft.reportLoading = false;
      draft.reportError = action.error;
      draft.reportedPost = action.data;
      break;
    case REMOVE_POST_REQUEST:
      draft.removePostLoading = true;
      draft.removePostDone = false;
      draft.removePostError = null;
      break;
    case REMOVE_POST_SUCCESS:
      draft.removePostLoading = false;
      draft.removePostDone = true;
      draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
      break;
    case REMOVE_POST_FAILURE:
      draft.removePostLoading = false;
      draft.removePostError = action.error;
      break;
    case UPDATE_POST_REQUEST:
      draft.updatePostLoading = true;
      draft.updatePostDone = false;
      draft.updatePostError = null;
      break;
    case UPDATE_POST_SUCCESS:
      draft.updatePostLoading = false;
      draft.updatePostDone = true;
      draft.mainPosts.find((v) => v.id === action.data.PostId).content = action.data.content;
      draft.imagePaths = [];
      break;
    case UPDATE_POST_FAILURE:
      draft.updatePostLoading = false;
      draft.updatePostError = action.error;
      break;
    case REMOVE_COMMENT_REQUEST:
      draft.removeCommentLoading = true;
      draft.removeCommentDone = false;
      draft.removeCommentError = null;
      break;
    case REMOVE_COMMENT_SUCCESS:
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Comments = post.Comments.filter((v) => v.id !== action.data.CommentId);
      draft.removeCommentLoading = false;
      draft.removeCommentDone = true;
      break;
    case REMOVE_COMMENT_FAILURE:
      draft.removeCommentLoading = false;
      draft.removeCommentError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Comments.push(action.data);
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
    }
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentError = action.error;
      break;
    case SHOW_BRANCH_POSTFORM:
      draft.showBranchPostForm = true;
      draft.branchPost = action.data;
      break;
    case SHOW_UPDATE_POSTFORM:
      draft.showUpdatePostForm = true;
      draft.updatePost = action.data;
      break;
    case SHOW_POSTFORM:
      draft.showPostForm = true;
      break;
    case CLOSE_POSTFORM:
      draft.showPostForm = false;
      draft.showBranchPostForm = false;
      draft.showUpdatePostForm = false;
      draft.branchPost = [];
      draft.updatePost = [];
      break;
    default:
      break;
  }
});

export default reducer;
