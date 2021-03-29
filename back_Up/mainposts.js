import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostCard from '../front/components/post/PostCard';

import { LOAD_POSTS_REQUEST } from '../front/reducers/post';

const MainPosts = () => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  //react virtualized 반영해봅니다.

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight * 0.7) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);
  
  return (
    <>
      {mainPosts.map((c) => (
        
        <PostCard key={c.id} post={c} />
        
      ))}
    </>
  );
};

export default MainPosts;
