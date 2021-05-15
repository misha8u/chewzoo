import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM } from '../reducers/user';
import { backUrl } from '../config/config';

const ChewzooAvatar = ({ userId, userAvatar, avatarPosition, disabledClick }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const onUserForm = useCallback(() => {
    if (!disabledClick) {
      if (me) {
        if (me.id === userId) {
          const formType = String('my')
          return dispatch({
            type: SHOW_USER_FORM,
            data: { formType }
          });
        } else {
          const formType = String('other')
          return dispatch({
            type: SHOW_USER_FORM,
            data: { formType, userId }
          });
        }
      } else {
        const formType = String('login')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
      }
    }
  },[me, userId]);

  const commentAvatarStyle ={
    width: '30px',
    height: '30px',
    border: '1px solid #F0F0F0',
    borderRadius: '15%',
  };

  const postAvatarStyle ={
    width: '40px',
    height: '40px',
    border: '1px solid #F0F0F0',
    borderRadius: '15%',
  };

  return (
    <>
      <img
        onClick={ onUserForm }
        src={`${backUrl}/${userAvatar}`}
        style={avatarPosition === 'comment'
            ? commentAvatarStyle
            : postAvatarStyle
          }
          
      />
    </>
  )
};

export default ChewzooAvatar;