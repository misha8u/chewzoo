import React, { useState, useCallback } from 'react';
import { frontkUrl } from '../../config/config';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Col, Row, Badge, message } from 'antd';
import { QuestionCircleTwoTone, QuestionCircleOutlined, 
  ExclamationCircleTwoTone, ExclamationCircleOutlined, 
  MessageOutlined, MessageFilled, BranchesOutlined,
  LinkOutlined, FileImageFilled, FileImageOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_BRANCH_POSTFORM } from '../../reducers/user';
import { ON_EXCLAMATION_REQUEST, OFF_EXCLAMATION_REQUEST, 
  ON_QUESTION_REQUEST, OFF_QUESTION_REQUEST} from '../../reducers/post';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const PostCardActionButtons = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [ImageFormOpened, setImageFormOpened] = useState(true);
  const dispatch = useDispatch();
  const { onExclamationError, onQuestionError } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me?.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onToggleImage = useCallback(() => {
    setImageFormOpened((prev) => !prev);
  }, []);

  const onPostURL = useCallback((e) => () => {
    if (e === post.id) {
      message.success({content: 'URL 복사!', style: {marginTop: '3vh'}})
    }
  }, [post.id]);

  const onToggleExclamation = useCallback(() => {
    if (!id) {
      const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
    }
      return (
        dispatch({
          type: ON_EXCLAMATION_REQUEST,
          data: post.id,
        }),
        !onExclamationError && message.success({content: '신뢰해!', style: {marginTop: '3vh'}})
      )
  }, [id]);

  const offToggleExclamation = useCallback(() => {
    if (!id) {
      const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
    }
      return dispatch({
        type: OFF_EXCLAMATION_REQUEST,
        data: post.id,
      });
  }, [id]);
  const exclamation = post.Exclamationers.find((v) => v.id === id);

  const onToggleQuestion = useCallback(() => {
    if (!id) {
      const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
    }
      return (
        dispatch({
          type: ON_QUESTION_REQUEST,
          data: post.id,
        }),
        !onQuestionError && message.success({content: '의심해?', style: {marginTop: '3vh'}})
      )
  }, [id]);

  const offToggleQuestion = useCallback(() => {
    if (!id) {
      const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
    }
      return dispatch({
        type: OFF_QUESTION_REQUEST,
        data: post.id,
      })
  }, [id]);
  const question = post.Questioners.find((v) => v.id === id);

  const onBranchPostForm = useCallback(() => {
    if (!id) {
      const formType = String('login')
      return dispatch({
        type: SHOW_USER_FORM,
        data: { formType }
      });
    }
      return dispatch({
        type: SHOW_BRANCH_POSTFORM,
        data: post,
      });
  }, [id]);

  const ActionButtonIconStyle = {
    fontSize: '19px',
  }

  const leftActionButtonStyle = {
    margin: '16px 5px 16px 5px',
    float: 'left',
  }

  const rightActionButtonStyle = {
    margin: '16px 5px 16px 5px',
    float: 'right',
  }

  const CommentListWrapperStyle = {
    width: '100%',
    padding: '1% 1.5% 1% 1.5%',
  }

  const PostImagesStyle = {
    width: '100%',
    padding: '0px'
  }

  const badgePosition = [-1, 17];

  return (
    <div>
      {ImageFormOpened && post.Images.length > 0 && (
        <div style={ PostImagesStyle }>
          {post.Images[0] && <PostImages key='imagesWrapper' images={post.Images}/>}
        </div>
      )}

      <div style={{ width: '100%', padding: '0% 1.5% 0% 1.5%' }}>
        <Row>
        <Col xs={12} md={12}>
          {post.Images.length > 0 &&
            <div style={ leftActionButtonStyle } onClick={ onToggleImage }>
              <Badge
                count={post.Images.length}
                size="small"
                offset={ badgePosition }
                style={{ backgroundColor: '#262626', textAlign: 'center' }}
              >
                {ImageFormOpened
                  ? <FileImageFilled style={ ActionButtonIconStyle } key="image" />
                  : <FileImageOutlined style={ ActionButtonIconStyle } key="image" />
                }
              </Badge>
            </div>
          }

          {id || post.Comments.length > 0 
            ? <div style={ leftActionButtonStyle } onClick={ onToggleComment }>
              <Badge
                count={post.Comments?.length}
                size="small"
                offset={ badgePosition }
                style={{ backgroundColor: '#262626', textAlign: 'center' }}
              >
                {commentFormOpened
                  ? <MessageFilled style={ ActionButtonIconStyle } key="message"/>
                  : <MessageOutlined style={ ActionButtonIconStyle } key="message"/>
                }
              </Badge>
              </div>
            : <></>
          }

          {id &&
            <div style={ leftActionButtonStyle } onClick={ onBranchPostForm }>
              <Badge
                count={0}
                size="small"
                offset={ badgePosition }
                style={{ backgroundColor: '#262626', textAlign: 'center' }}
              >
                <BranchesOutlined style={ ActionButtonIconStyle } key="branch"/>
              </Badge>
            </div>
          }
            <div style={ leftActionButtonStyle } onClick={ onPostURL(post.id) }>
              <CopyToClipboard text={`${frontkUrl}/post/${post.id}`}>
                <LinkOutlined style={ ActionButtonIconStyle } key="link"/>
              </CopyToClipboard>
            </div>
        </Col>

        <Col xs={12} md={12}>
          <div style={ rightActionButtonStyle }
            onClick={ question ? offToggleQuestion : onToggleQuestion }>
              <Badge
                count={post.Questioners.length}
                size="small"
                offset={ badgePosition }
                style={{ backgroundColor: '#0070C0', textAlign: 'center' }}
              >
                {question
                ? <QuestionCircleTwoTone style={ ActionButtonIconStyle } key="question" twoToneColor="#0070C0" />
                : <QuestionCircleOutlined style={ ActionButtonIconStyle } key="question" />}
              </Badge>
          </div>

          <div style={ rightActionButtonStyle }
            onClick={ exclamation ? offToggleExclamation : onToggleExclamation }>
              <Badge
                count={post.Exclamationers.length}
                size="small"
                offset={ badgePosition }
                style={{ backgroundColor: '#E13427', textAlign: 'center' }}
              >
                {exclamation
                ? <ExclamationCircleTwoTone style={ ActionButtonIconStyle } key="exclamation" twoToneColor="#E13427" />
                : <ExclamationCircleOutlined style={ ActionButtonIconStyle } key="exclamation" />}
              </Badge>
          </div>
        </Col>
        </Row>
      </div>

      {commentFormOpened && post.Comments.length > 0 && (
        <CommentList post={post}/>
      )}

      {commentFormOpened && id && (
        <div style={ CommentListWrapperStyle }><CommentForm post={post} /></div>
      )}
      
    </div>
  );
};

export default PostCardActionButtons;