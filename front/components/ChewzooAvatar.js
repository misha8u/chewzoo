import React from 'react';
import Link from 'next/link';

const ChewzooAvatar = ({ userId, avatarPosition }) => {
  const commentAvatarStyle ={
    width: '30px',
    margin: '0px 5px 5px 0px',
    border: '1px solid #F0F0F0',
    borderRadius: '15%',
  };

  const postAvatarStyle ={
    width: '40px',
    margin: '0px 5px 5px 0px',
    border: '1px solid #F0F0F0',
    borderRadius: '15%',
  };

  return (
    <Link href={`/user/${userId}`}>
      <a><img style={
        avatarPosition === 'comment'
          ? commentAvatarStyle
          : postAvatarStyle
        }
        src="http://localhost:3065/avatars/ava4.png"/>
      </a>
    </Link>
  )
};

export default ChewzooAvatar;