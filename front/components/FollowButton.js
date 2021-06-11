import React, { useCallback } from 'react';
import { Button, message } from 'antd';
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
      message.warning({content: '함께해서 더러웠고..', style: {marginTop: '3vh'}})
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: otherUserId,
      });
      message.success({content: '아껴주고 살펴줘😍', style: {marginTop: '3vh'}})
    }
  }, [isFollowing, otherUserId]);

  const bottomButtonStyle = {
    width: '100%',  
    padding: '0px 6px 0px 0px'
  }

  return (
    <>
      {isFollowing === 'object'
        ? <Button shape="round" onClick={ onClickButton } loading={ unfollowLoading } style={ bottomButtonStyle }>관심 끊기</Button>
        : <Button shape="round" onClick={ onClickButton } loading={ followLoading } style={ bottomButtonStyle } type='primary'>관심 갖기</Button>
      }
    </>
  )
};

export default FollowButton;