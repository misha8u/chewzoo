import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import { RETURN_FOCUSCARD } from '../../reducers/post';

const PostCardContent = ({ postData, postId }) => {
  const [seeMoreOpened, setSeeMoreOpened] = useState(false);
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

  const postDataWithHyperLink = postData && postData.split(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/g).map((v) => {
    if (v && v.match(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/)) {
      return (
        <a
          href={v}
          as={v}
          prefetch={false}
          key={v + `${Math.floor(Math.random())}`}
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
  });

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
    <div style={{whiteSpace: 'pre-wrap'}}>
      {postData && postData.length > 350
        ? <>
            <div style={{ position: 'relative'}}>
              {!seeMoreOpened && <div style={moreContentStyle}/>}
              {!seeMoreOpened
                ? postData.slice(0, 350)
                : postDataWithHyperLink}
            </div>
            <div style={moreStyle} onClick={onToggleSeeMore}>
              {!seeMoreOpened ? '... TMI 보기' : 'TMI 숨기기'}
            </div>
          </>
        : <>
            {postDataWithHyperLink}
          </>
      }
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;