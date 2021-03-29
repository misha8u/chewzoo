import React, { useState, useCallback } from 'react';
import Link from 'next/link';

import { Col, Comment, List, Row, Avatar, Divider, Badge } from 'antd';
import { QuestionCircleTwoTone, QuestionCircleOutlined, 
  ExclamationCircleTwoTone, ExclamationCircleOutlined, 
  MessageOutlined, MessageFilled, BranchesOutlined,
  FileImageOutlined, FileImageFilled, CloseOutlined, AlertOutlined, ConsoleSqlOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_BRANCH_POSTFORM } from '../../reducers/user';
import { ON_EXCLAMATION_REQUEST, OFF_EXCLAMATION_REQUEST, 
  ON_QUESTION_REQUEST, OFF_QUESTION_REQUEST, REMOVE_COMMENT_REQUEST } from '../../reducers/post';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import ChewzooAvatar from '../ChewzooAvatar';

const PostCardActionButtons = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [ImageFormOpened, setImageFormOpened] = useState(true);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);

  const [commentHover, setCommentHover] = useState(null);
  const mouseEnter = useCallback((e) => () => {
    if (id) {
        setCommentHover(e); 
      }
  }, [id, commentHover]);
  const mouseLeave = () => setCommentHover(null);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onToggleImage = useCallback(() => {
    setImageFormOpened((prev) => !prev);
  }, []);

  const onToggleExclamation = useCallback(() => {
    if (!id) {
      return dispatch({
        type: SHOW_USER_FORM,
      });
    }
      return dispatch({
        type: ON_EXCLAMATION_REQUEST,
        data: post.id,
      });
  }, [id]);

  const offToggleExclamation = useCallback(() => {
    if (!id) {
      return dispatch({
        type: SHOW_USER_FORM,
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
      dispatch({
        type: SHOW_USER_FORM,
      });
    }
      return dispatch({
        type: ON_QUESTION_REQUEST,
        data: post.id,
      })
  }, [id]);

  const offToggleQuestion = useCallback(() => {
    if (!id) {
      dispatch({
        type: SHOW_USER_FORM,
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
      return dispatch({
        type: SHOW_USER_FORM,
      });
    }
      return dispatch({
        type: SHOW_BRANCH_POSTFORM,
        data: post,
      });
  }, [id]);

  const onRemoveComment = useCallback((item) => () => {
    dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: { commentId: item.id },
      })
  }, []);

  const CommentList = post.Comments.slice().sort((a, b) => a.id - b.id);

  const ActionButtonIconStyle = {
    fontSize: '19px',
  }

  const leftActionButtonStyle = {
    margin: '16px 5px 16px 5px',
    float: 'left',
  }

  const rightActionButtonStyle = {
    margin: '16px 5px 16px 5px',
    fontSize: '19px',
    float: 'right',
  }

  const CommentListWrapperStyle = {
    width: '100%',
    padding: '0% 24px 0% 24px'  
  }

  const CommentWrapperStyle = {
    width: '100%',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  const SelectedCommentWrapperStyle = {
    width: '100%',
    backgroundColor: '#FEF3F0',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  const CommentStyle = {
    width: 'calc(100% - 47px)',
    padding: '0px'
  };

  const CommentAuthorStyle = {
    fontSize: '13px',
    color: '#ababab',
  };

  const CommentAvatarStyle = {
    //margin: '0px 0px 100% 0px'
  };

  const PostImagesStyle = {
    width: '100%',
    padding: '0px'
  }

  //const PostImagesStyleChekcer = () => {
  //  const checker = (post.Images.length === 0)
  //  return checker 
  //    ? { width: '100%', padding: '0%' }
  //    : { width: '100%', padding: '1%' }
  //};
  //const [PostImagesStyle] = useState(PostImagesStyleChekcer());

  return (
    <div>
      {ImageFormOpened && post.Images.length > 0 && (
        <div style={ PostImagesStyle }>
          {post.Images[0] && <PostImages key='imagesWrapper' images={post.Images}/>}
        </div>
      )}

      <div style={{ width: '100%', padding: '0% 24px 0% 24px' }}>
        <Row>
        <Col xs={12} md={12}>
          {post.Images.length > 0 &&
            <div style={ leftActionButtonStyle } onClick={onToggleImage}>
              <Badge
                count={post.Images.length}
                size="small"
                offset={[1, 20]}
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
            ? <div style={ leftActionButtonStyle } onClick={onToggleComment}>
              <Badge
                count={post.Comments.length}
                size="small"
                offset={[1, 20]}
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
            <div style={ leftActionButtonStyle } onClick={onBranchPostForm}>
              <Badge
                count={0}
                size="small"
                offset={[1, 20]}
                style={{ backgroundColor: '#262626', textAlign: 'center' }}
              >
              <BranchesOutlined style={ ActionButtonIconStyle } key="branch"/>
              </Badge>
            </div>
          }
        </Col>

        <Col xs={12} md={12}>
          <div style={ rightActionButtonStyle }
            onClick={ question ? offToggleQuestion : onToggleQuestion }>
              <Badge
                count={post.Questioners.length}
                size="small"
                offset={[1, 20]}
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
                offset={[1, 20]}
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
        <div style={ CommentListWrapperStyle } hoverable={false}>
          <Divider style={{ margin: '0px'}}/>
          <List
            itemLayout="horizontal"
            dataSource={ CommentList }
            inverted={true}
            renderItem={(item) => (
              <List.Item
                style={commentHover === item.id ? SelectedCommentWrapperStyle : CommentWrapperStyle}
                onMouseEnter={mouseEnter(item.id)}
                onMouseLeave={mouseLeave}
              >
                <div style={CommentAvatarStyle}>
                  <ChewzooAvatar userId={item.User.id} avatarPosition={'comment'}/>
                </div>
                <div style={ CommentStyle }>
                  <div style={ CommentAuthorStyle }>{item.User.nickname}</div>
                  <div>
                    {item.content.split(/(#[^\s#]+)/g).map((v) => {
                      if (v.match(/(#[^\s#]+)/)) {
                        return (
                          <Link
                            href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                            as={`/hashtag/${v.slice(1)}`}
                            key={v}
                          >
                            <a>{v}</a>
                          </Link>
                        );
                      }
                      return v;
                    })}
                  </div>
                </div>

                {id
                  ? <>{commentHover === item.id
                      ? <>{item.User.id === id
                          ? (<CloseOutlined ket="delete" onClick={onRemoveComment(item)} style={{ fontSize: '12px', color: '#E13427' }}/>)
                          : (<AlertOutlined key="report" style={{ fontSize: '12px', color: '#E13427' }}/>)
                        }</>
                      : <div style={{ width: '12px'}}/>
                    }</>
                  : <div style={{ width: '12px'}}/>
                }
                
              </List.Item>
            )}
          />
        </div>
      )}

      {commentFormOpened && id && (
        <div style={ CommentListWrapperStyle }><CommentForm post={post} /></div>
      )}
      
    </div>
  );
};

export default PostCardActionButtons;