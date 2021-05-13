import React, { useCallback } from 'react';
import { message } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ otherUserId }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
  const isFollowing = typeof me.Followings.find((v) => v.id === otherUserId)

  const onClickButton = useCallback(() => {
    if (isFollowing === 'object') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: otherUserId,
      });
      message.warning({content: '관심을 끊음..', style: {marginTop: '3vh'}})
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: otherUserId,
      });
      message.success({content: '관심 주기 시작!', style: {marginTop: '3vh'}})
    }
  }, [isFollowing, otherUserId]);

  return (
    <>
      {isFollowing === 'object'
        ? <StarFilled onClick={ onClickButton } loading={ unfollowLoading }/>
        : <StarOutlined onClick={ onClickButton } loading={ followLoading }/>
      }
    </>
  )
};

export default FollowButton;