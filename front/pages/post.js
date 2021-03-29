import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';

import { Col, Menu, Row, Input, Layout } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons'

import PostForm from '../components/PostForm';
import PostCard from '../components/post/PostCard';
import AppLayout from '../components/AppLayout';

import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { SHOW_POSTFORM } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const postdiv = useRef();

  //react virtualized 반영해봅니다.

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

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

    postdiv.current.addEventListener('scroll', onScroll);
    
    return () => {
      postdiv.current.removeEventListener('scroll', onScroll);
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

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'auto',
  }

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 47px)',
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
        <Col xs={2} md={6} style ={ PostContainerSideStyle }>
          right
        </Col>

        <Col style={ PostContainerCenterStyle } ref={postdiv}>
          {mainPosts.map((c) => (
            <PostCard key={c.id} post={c} />
          ))}
        </Col>

        <Col xs={2} md={6} style ={ PostContainerSideStyle }>
          left
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
