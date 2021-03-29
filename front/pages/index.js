import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import Media from 'react-media';
import axios from 'axios';

import { Col } from 'antd';
import { EditFilled } from '@ant-design/icons'

import PostForm from '../components/postform/PostForm';
import PostCard from '../components/post/PostCard';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

import { LOAD_POSTS_REQUEST, RETURNED_FOCUSCARD } from '../reducers/post';
import { SHOW_POSTFORM, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading,
    branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const postdiv = useRef();

  //react virtualized 반영해봅니다.
  //.scrollHeight * 0.5 으로 처리하는 방안은 상단 포스트에선 너무 늦게,
  // 중후반 포스트에선 너무 빨리 반응하는 경향이 있습니다.

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    })
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (branchDone || addPostDone) {
      postdiv.current.scrollTo(0, 0)
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
    function onScroll() {
      if (postdiv.current.scrollTop > postdiv.current.scrollHeight * 0.5) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    {postdiv.current && postdiv.current.addEventListener('scroll', onScroll);}
    
    return () => {
      {postdiv.current && postdiv.current.removeEventListener('scroll', onScroll);}
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  const onPostForm = useCallback(()=> {
    dispatch({
      type: SHOW_POSTFORM,
    });
  },);

  const WriterStyle = {
    position: 'fixed',
    zIndex: 10,
    float: 'right',
    color: '#E13427',
    fontSize: '400%',
    bottom: '3%',
    left: '70%',
  }

  const WriterStyleMobile = {
    position: 'fixed',
    zIndex: 10,
    float: 'right',
    color: '#E13427',
    fontSize: '300%',
    bottom: '3%',
    left: '87%',
  }

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 47px)',
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
    <AppLayout>
      <div style={ PostContainerStyle }>
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>
        
        <Col style={ PostContainerCenterStyle } ref={postdiv}>
            {mainPosts.map((c) => (
              <PostCard key={c.id} id={c.id} post={c} />  
            ))}
        </Col>
        
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>

      </div>

      {me &&
        <Media queries={{small: "(max-width: 767px)"}}>
          {(matches) => matches.small
            ? <EditFilled style={ WriterStyleMobile } onClick={ onPostForm } />
            : <EditFilled style={ WriterStyle } onClick={ onPostForm } />
          }
        </Media>
      }

      {me && <PostForm />}
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
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Home;
