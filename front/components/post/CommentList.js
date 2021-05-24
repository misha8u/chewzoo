import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

import { List, Divider, Modal, message } from 'antd';
import { DeleteOutlined, AlertOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { REMOVE_COMMENT_REQUEST } from '../../reducers/post';
import ChewzooAvatar from '../ChewzooAvatar';
import moment from 'moment';

moment.locale('ko');

const CommentList = ({post}) => {
  const { removeCommentError } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me?.id);
  const dispatch = useDispatch();
  
  const [commentHover, setCommentHover] = useState(null);
  const mouseEnter = useCallback((e) => () => {
    setCommentHover(e); 
  }, [commentHover]);
  const mouseLeave = () => setCommentHover(null);

  useEffect(() => {
    if (removeCommentError) {
      return (message.error({content: removeCommentError, style: {marginTop: '3vh'}}));
    }
  }, [removeCommentError])

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

  const CommentListWrapperStyle = {
    width: '100%',
    padding: '1% 1.5% 1% 1.5%',
  }

  const SelectedCommentWrapperStyle = {
    width: '100%',
    backgroundColor: '#FEF3F0',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  const CommentWrapperStyle = {
    width: '100%',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  const CommentAuthorStyle = {
    fontSize: '13px',
    color: '#ababab',
  };

  const CommentStyle = {
    width: 'calc(100% - 47px)',
    padding: '0px',
    marginLeft: '5px',
  };

  const CommentAvatarStyle = {
    //margin: '0px 0px 100% 0px'
  };

  const CommentListData = post.Comments?.slice().sort((a, b) => a.id - b.id);

  return (
    <div style={ CommentListWrapperStyle } hoverable={false}>
      <Divider style={{ margin: '0px'}}/>
      <List
        itemLayout="horizontal"
        dataSource={ CommentListData }
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
                <div style={{whiteSpace: 'pre-wrap'}}>
                  {item.content.split(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/g).map((v) => {
                    if (v && v.match(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/)) {
                      return (
                        <a
                          href={v}
                          as={v}
                          prefetch={false}
                          key={v}
                          target='_blank'
                        >
                          &#60;URL 이동&#62;
                        </a>
                      );
                    }
                    return (
                      v && v.split(/(#[^\s#]+)/g).map((i) => {
                        if (i && i.match(/(#[^\s#]+)/)) {
                          return (
                            <Link
                              href={{ pathname: '/hashtag', query: { tag: i.slice(1) } }}
                              as={`/hashtag/${i.slice(1)}`}
                              prefetch={false}
                              key={i}
                            >
                              <a>{i}</a>
                            </Link>
                          )
                        }
                        return i
                      })
                    )
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
  );
};

export default CommentList;