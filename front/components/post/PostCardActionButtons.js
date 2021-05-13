import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

import { Col, List, Row, Divider, Badge, Modal } from 'antd';
import { QuestionCircleTwoTone, QuestionCircleOutlined, 
  ExclamationCircleTwoTone, ExclamationCircleOutlined, 
  MessageOutlined, MessageFilled, BranchesOutlined,
  FileImageOutlined, FileImageFilled, DeleteOutlined, AlertOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_BRANCH_POSTFORM } from '../../reducers/user';
import { ON_EXCLAMATION_REQUEST, OFF_EXCLAMATION_REQUEST, 
  ON_QUESTION_REQUEST, OFF_QUESTION_REQUEST, REMOVE_COMMENT_REQUEST } from '../../reducers/post';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import ChewzooAvatar from '../ChewzooAvatar';
import moment from 'moment';

moment.locale('ko');

const PostCardActionButtons = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [ImageFormOpened, setImageFormOpened] = useState(true);
  const dispatch = useDispatch();
  const { removeCommentError } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me?.id);

  const [commentHover, setCommentHover] = useState(null);
  const mouseEnter = useCallback((e) => () => {
    setCommentHover(e); 
  }, [commentHover]);
  const mouseLeave = () => setCommentHover(null);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onToggleImage = useCallback(() => {
    setImageFormOpened((prev) => !prev);
  }, []);

  const onToggleExclamation = useCallback(() => {
    if (!id) {
      const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
    }
      return dispatch({
        type: ON_EXCLAMATION_REQUEST,
        data: post.id,
      });
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
      return dispatch({
        type: ON_QUESTION_REQUEST,
        data: post.id,
      })
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

  const { confirm } = Modal;
  const onRemoveComment = useCallback((item) => () => {
    confirm({
      title: '지울래?',
      icon: <DeleteOutlined />,
      okText: 'ㅇㅇ',
      okType: 'danger',
      cancelText: 'ㄴㄴ',
      onOk() {
        dispatch({
          type: REMOVE_COMMENT_REQUEST,
          data: { commentId: item.id },
        });
      }
    })
  }, []);

  //const onRemoveComment = useCallback((item) => () => {
  //  dispatch({
  //      type: REMOVE_COMMENT_REQUEST,
  //      data: { commentId: item.id },
  //    })
  //}, []);

  useEffect(() => {
    if (removeCommentError) {
      message.error({content: removeCommentError, style: {marginTop: '3vh'}});
    }
  }, [removeCommentError])

  const CommentList = post.Comments?.slice().sort((a, b) => a.id - b.id);

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
    padding: '0px',
    marginLeft: '5px',
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
                count={post.Comments?.length}
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
                onMouseEnter={ mouseEnter(item.id) }
                onMouseLeave={ mouseLeave }
              >
                <div style={CommentAvatarStyle}>
                  <ChewzooAvatar userId={item.User.id} userAvatar={item.User.avatar} avatarPosition={'comment'}/>
                </div>
                <div style={ CommentStyle }>
                  <div style={ CommentAuthorStyle }>
                    {item.User.nickname}
                    <span style={{ fontSize: '10px' }}>
                      &#160;&#40;
                        {commentHover === item.id ? moment(item.createdAt).format('YYYY-MM-DD, HH:mm:ss') : moment(item.createdAt).fromNow()}
                      &#41;
                    </span>
                  </div>
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
                          ? <>
                              <DeleteOutlined ket="delete" onClick={onRemoveComment(item)} style={{ fontSize: '12px', color: '#E13427' }}/>
                            </>
                          : <> {/* 아이콘 색을 배경과 동일하게 수정해 배활성화 한 상태 */}
                              <AlertOutlined key="report" style={{ fontSize: '12px', color: '#FEF3F0' }}/>
                            </>
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