import produce from '../util/produce';

export const initialState = {
  openedChecklist: false,
  parrotCommentLoading: false,
  parrotCommentDone: false,
  parrotCommentError: null,
};

export const BEGIN_CHECKLIST = 'BEGIN_CHECKLIST';
export const CLOSE_CHECKLIST = 'CLOSE_CHECKLIST';

export const PARROT_COMMENT_REQUEST = 'PARROT_COMMENT_REQUEST';
export const PARROT_COMMENT_SUCCESS = 'PARROT_COMMENT_SUCCESS';
export const PARROT_COMMENT_FAILURE = 'PARROT_COMMENT_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case BEGIN_CHECKLIST:
      draft.openedChecklist= true;
      break;
    case CLOSE_CHECKLIST:
      draft.openedChecklist= false;
      break;
    case PARROT_COMMENT_REQUEST:
      draft.parrotCommentLoading = true;
      draft.parrotCommentDone = false;
      draft.parrotCommentError = null;
      break;
    case PARROT_COMMENT_SUCCESS: {
      draft.parrotCommentLoading = false;
      draft.parrotCommentDone = true;
      break;
    }
    case PARROT_COMMENT_FAILURE:
      draft.parrotCommentLoading = false;
      draft.parrotCommentError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;