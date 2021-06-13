import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import Head from 'next/head';
import { backUrl } from '../config/config';
import { Col } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

import PostCard from '../components/post/PostCard';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

import { LOAD_POSTS_REQUEST, RETURNED_FOCUSCARD } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading,
    branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const postDiv = useRef();

  //react virtualized 반영해봅니다.
  // 중후반 포스트에선 너무 빨리 반응하는 경향이 있습니다.

  useEffect(() => {
    if (branchDone || addPostDone) {
      return(
        postDiv.current.scrollTo(0, 0)
      );
    }
    if (focusCardDone) {
      return(
        document.getElementById(focusCard).scrollIntoView(true),
        dispatch({
          type: RETURNED_FOCUSCARD,
        })
      );
    }
  }, [branchDone, addPostDone, focusCardDone]);

  useEffect(() => {
    function onScroll() {
      if (postDiv.current.offsetTop + postDiv.current.scrollTop > postDiv.current.scrollHeight  - 800) {  
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    {postDiv.current && postDiv.current.addEventListener('scroll', onScroll);}
    
    return () => {
      {postDiv.current && postDiv.current.removeEventListener('scroll', onScroll);}
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 94.6px)',
  }

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'auto',
  }

  const PostContainerSideStyle = {
    //flex: '0.5',
    //display: 'flex',
    //justifyContent: 'center',
    //alignItems: 'center',
    //background: '#FFFFFF',
  }

  return (
    <AppLayout>
      <Head>
        <title>츄주 | 주식 커뮤니티</title>
        <meta name="description" content={'주식에 대해 씹어볼 모든 이야기'} />
        <meta property="og:title" content={'주식 커뮤니티, 츄주(cHEWzOO)'} />
        <meta property="og:description" content={'주식에 대해 씹어볼 모든 이야기'} />
        <meta property="og:image" content={`${backUrl}/resource/signupTitle.png`} />
      </Head>
      <div style={ PostContainerStyle }>
        <Col xs={1} md={7} style ={ PostContainerSideStyle }>
        </Col>
        
        <Col style={ PostContainerCenterStyle } ref={postDiv}>
          {mainPosts.map((c) => (
            <PostCard post={c} />  
          ))}
        </Col>        
        
        <Col xs={1} md={7} style ={ PostContainerSideStyle }>
        </Col>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;