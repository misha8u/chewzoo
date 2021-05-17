import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { RETURN_FOCUSCARD } from '../../reducers/post';

const PostCardContent = ({ postData, postId }) => {
  const [seeMoreOpened, setSeeMoreOpened] = useState(false);
  const [contentMaxLength, setContentMaxLength] = useState(500);
  const dispatch = useDispatch();

  const onToggleSeeMore = useCallback(() => {
    setSeeMoreOpened((prev) => !prev);
    if (seeMoreOpened) {
      dispatch({
        type: RETURN_FOCUSCARD,
        data: postId,
      });
    }
  }, [seeMoreOpened]);

  useEffect(() => {
    if (seeMoreOpened) {
      setContentMaxLength(postData.length)
    } else {
      setContentMaxLength(500)
    }
  }, [seeMoreOpened])

  const moreStyle = {
    position: 'relative',
    margin: '0px',
    padding: '0px',
    color: '0px',
    color: '#E13427',
    textDecoration: 'underline',
    cursor: 'pointer'
  }

  const moreContentStyle = {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    background: 'linear-gradient(to top, rgba(255,255,255, 1) 7%, rgba(255,255,255, 0) 80%)',
    pointerEvents: 'none',     
  }
  
  return(
    <div>
      {postData && postData.length > 500
        ? <>
            <div style={{ position: 'relative'}}>
              {!seeMoreOpened && <div style={moreContentStyle}/>}
              {postData.slice(0, contentMaxLength)}
            </div>
            <div style={moreStyle} onClick={onToggleSeeMore}>
              {!seeMoreOpened ? '... 긴 글 더 보기' : '긴 글 숨기기'}
            </div>
          </>
        : <>
            {postData && postData.split(/(#[^\s#]+)/g).map((v) => {
              if (v.match(/(#[^\s#]+)/)) {
                return (
                  <Link
                    href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                    as={`/hashtag/${v.slice(1)}`}
                    prefetch={false}
                    key={v}
                  >
                    <a>{v}</a>
                  </Link>
                );
              }
              return v;
            })}
          </>
      }
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
