import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Empty, Button } from 'antd';
import { END } from 'redux-saga';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';
import { backUrl } from '../../config/config';
import { LOAD_USER_POSTS_REQUEST, RETURNED_FOCUSCARD } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import PostCard from '../../components/post/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePosts, loadUserPostsLoading,
    branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);
  const postDiv = useRef();

  useEffect(() => {
    if (branchDone || addPostDone) {
      postDiv.current.scrollTo(0, 0)
    }
  }, [branchDone, addPostDone]);

  useEffect(() => {
    if (focusCardDone) {
      document.getElementById(focusCard).scrollIntoView(true);
      dispatch({
        type: RETURNED_FOCUSCARD,
      });
    }
  }, [focusCardDone]);

  useEffect(() => {
    const onScroll = () => {
      if (postDiv.current.offsetTop + postDiv.current.scrollTop > postDiv.current.scrollHeight  - 800) {  
        if (hasMorePosts && !loadUserPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            data: id,
          });
        }
      }
    };
    {postDiv.current && postDiv.current.addEventListener('scroll', onScroll);}
    return () => {
      {postDiv.current && postDiv.current.removeEventListener('scroll', onScroll);}
    };
  }, [mainPosts, hasMorePosts, id, loadUserPostsLoading]);

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 94.6px)',
  }

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'auto',
    webkitScrollbar: {
      width: '100px',
    }
  }

  const PostContainerSideStyle = {
    //flex: '0.5',
    //display: 'flex',
    //justifyContent: 'center',
    //alignItems: 'center',
    //background: '#FFFFFF',
  }

  return (
    <AppLayout pageType={'userpost'}>
      {userInfo && (
        <Head>
          <title>
            cHEWzOO | {userInfo.nickname}
          </title>
        </Head>
      )}
      
      <div style={ PostContainerStyle }>
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>
        
        <Col style={ PostContainerCenterStyle } ref={postDiv}>
          {mainPosts.map((c) => (
            <PostCard post={c} />  
          ))}
          {mainPosts.length === 0 &&
            <Empty
              image = {`${backUrl}/resource/noposts.png`}
              description={
                <><span style={{ fontWeight: 'bold' }}>{userInfo.nickname}</span><span> 주주님은 <br /> 하신 말씀이 없네..</span></>
              }
              style={{ marginTop: '50px'}}
            >
              <Link href="/" prefetch={false}><Button type="primary">돌아가자!</Button></Link>
            </Empty>
          }
        </Col>
        
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
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
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default User;
