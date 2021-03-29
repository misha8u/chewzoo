import React, { useState, useCallback } from 'react';
import { Avatar, Tooltip, Modal } from 'antd';
import { StarFilled, StarOutlined, InfoCircleOutlined, EllipsisOutlined,  
  AlertOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_OTHER_PROFILE } from '../../reducers/user';
import { REMOVE_POST_REQUEST } from '../../reducers/post';

import OtherProfile from '../OtherProfile';
import ChewzooAvatar from '../ChewzooAvatar';

const PostCardAuthor = ({ post, cardhover }) => {
  const dispatch = useDispatch();
  const [followAuthor, setFollowAuthor] = useState(false);

  const { me, showOtherProfile } = useSelector((state) => state.user);
  const { removePostLoading } = useSelector((state) => state.post);
  const id = me && me.id;

  const onUserForm = useCallback(()=> {
    dispatch({
      type: SHOW_USER_FORM,
    });
  },);

  const onOtherProfile = useCallback(()=> {
    dispatch({
      type: SHOW_OTHER_PROFILE,
      data: post.User,
    });
  },);

  const onRemovePost = useCallback(() => {
    if (!id) {
      dispatch({
        type: SHOW_USER_FORM,
      });
    }
      return dispatch({
        type: REMOVE_POST_REQUEST,
        data: post.id,
      });
  }, [id]);

  const { confirm } = Modal;
  function removeConfirm() {
    confirm({
      title: '지울래?',
      icon: <DeleteOutlined />,
      okText: 'ㅇㅇ',
      okType: 'danger',
      cancelText: 'ㄴㄴ',
      onOk() {
        dispatch({
          type: REMOVE_POST_REQUEST,
          data: post.id,
        });
      },
      onCancel() {
        console.log('Cancel');
      }
    })
  };

  const onToggleFollowAuthor = useCallback(() => {
    if (me) {
      setFollowAuthor((prev) => !prev)
    } else {
      dispatch({
        type: SHOW_USER_FORM,
      });
    }
  })

  const authorButtonStyle = {
    fontSize: '14px',
    color: '#E13427',
    margin: '0.5% 5px 0.5% 5px',
  };

  const authorNameStyle = {
    fontSize: '17px',
  };

  const authorButtonWrapperStyle = {
    float: 'right',
    margin: '0.5% 16px 0.5% 5px',
    verticalAlign: 'middle',
  };

  return (
    <div style={authorNameStyle}>
      <ChewzooAvatar userId={post.User.id} avatarPosition={'post'}/>
      {post.User.nickname}

      {id && <div style={ authorButtonWrapperStyle }>
        {cardhover && <>
          {post.User.id === id
            ? <>
                <EditOutlined key="edit"
                  onClick={onRemovePost}
                  style={ authorButtonStyle }/>

                <DeleteOutlined ket="delete"
                  style={ authorButtonStyle }
                  loading={ removePostLoading }
                  onClick={removeConfirm}/>
              </>
            : <>
                <AlertOutlined key="report"
                onClick={removeConfirm}
                style={ authorButtonStyle }/>
              </>
          }
        </>}
      </div>}

      {showOtherProfile && <OtherProfile/>}

    </div>
  );
};

export default PostCardAuthor;