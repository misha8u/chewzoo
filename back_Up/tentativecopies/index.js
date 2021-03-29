import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';

import { Col } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons'

import PostForm from '../components/postform/PostForm';
import PostCard from '../components/post/PostCard';
import AppLayout from '../components/AppLayout';

import { LOAD_POSTS_REQUEST,  } from '../reducers/post';
import { SHOW_POSTFORM, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, branchDone, addPostDone, returnScrollDone, focusCard } = useSelector((state) => state.post);
  const postdiv = useRef();

  //react virtualized 반영해봅니다.

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

  //useEffect(() => {
  //  if (returnScrollDone) {
  //    console.log(focusCard, '돌아가기 시도!')
  //    postdiv.querySelector(focusCard).scrollIntoView(true)
  //    postdiv.current.scrollTo(0, 0)
  //  }
  //}, [branchDone, addPostDone]);

  useEffect(() => {
    function onScroll() {
      console.log(postdiv.current.scrollTop, postdiv.current.scrollHeight, postdiv.current.clientHeight)
      if (postdiv.current.scrollTop > postdiv.current.scrollHeight * 0.5) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          console.log(lastId)
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
    left: '74%'
  }

  const WriterStyleMobile = {
    position: 'fixed',
    zIndex: 10,
    float: 'right',
    color: '#E13427',
    fontSize: '300%',
    bottom: '3%',
    left: '87%'
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
        <Col xs={2} md={7} style={ PostContainerSideStyle }>
        </Col>

        <Col style={ PostContainerCenterStyle } ref={postdiv}>
          {mainPosts.map((c) => (
            <PostCard key={c.id} post={c}/>
          ))}
        </Col>

        <Col xs={2} md={7} style={ PostContainerSideStyle }>
        </Col>

      </div>

      {me &&
        <Media queries={{small: "(max-width: 767px)"}}>
          {(matches) => matches.small
            ? <PlusCircleFilled style={ WriterStyleMobile } onClick={ onPostForm } />
            : <PlusCircleFilled style={ WriterStyle } onClick={ onPostForm } />
          }
        </Media>
      }

      {me && <PostForm />}
    </AppLayout>
  );
};

export default Home;
