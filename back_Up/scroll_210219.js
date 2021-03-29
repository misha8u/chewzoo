import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostCard from '../components/post/PostCard';

import { LOAD_POSTS_REQUEST } from '../reducers/post';

const MainPosts = () => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const postdiv = useRef();
  const [mediaWidth, setMediaWidth] = useState(0);

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []); 

  useLayoutEffect(() => {
    if (document.documentElement.clientWidth) {
      setMediaWidth(document.documentElement.clientWidth);
      console.log(document.documentElement.clientWidth, mediaWidth, 'layout2');
    }
  },[mediaWidth]);

  useEffect(() => {
    function onScroll() {
      console.log(postdiv.current.scrollHeight, postdiv.current.scrollTop)
      if (postdiv.current.scrollTop > postdiv.current.scrollHeight * 0.5) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }

    function onResize() {
      console.log(document.documentElement.clientWidth, mediaWidth, 'resizing1')
      setMediaWidth(document.documentElement.clientWidth)      
    }

    postdiv.current.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    
    return () => {
      postdiv.current.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize',onResize);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading, mediaWidth]);

  const MenuBarStyle = {
    height: '47px',
    width: '100%',
    fontSize: '32px',
  };

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 47px)',
  }

  const PostContainerSideStyleChecker = () => {
    const checker = (mediaWidth > 767)
    console.log(mediaWidth, 'styler');
    return checker
      ? { flex: '0.1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fffff',
        }
      : { flex: '0.5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#FAFAFA', }
  };
  const [PostContainerSideStyle] = useState(PostContainerSideStyleChecker())

  //const PostContainerSideStyle = {
  //  flex: '0.5',
  //  display: 'flex',
  //  justifyContent: 'center',
  //  alignItems: 'center',
  //  background: '#FAFAFA',
  //}

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'scroll',
  }
  
  return (
    <div>
      <div style={ MenuBarStyle }>asfgggg</div>

      <div style={ PostContainerStyle }>

        <div style ={ PostContainerSideStyle }>
          -
        </div>

        <div
          ref={postdiv}
          style={ PostContainerCenterStyle }
        >
          {mainPosts.map((c) => (
            <PostCard key={c.id} post={c} />
          ))}
        </div>

        <div style ={ PostContainerSideStyle }>
          -
        </div>

      </div>  
    </div>
  );
};

export default MainPosts;
