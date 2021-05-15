import React, { useEffect, useRef } from 'react';
import { Col, Empty, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { END } from 'redux-saga';

import axios from 'axios';
import { backUrl } from '../../config/config';
import { LOAD_POST_REQUEST, RETURNED_FOCUSCARD } from '../../reducers/post';
import wrapper from '../../store/configureStore';
import PostCard from '../../components/post/PostCard';
import AppLayout from '../../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Post = () => {
  const dispatch = useDispatch();
  const { singlePost, branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const router = useRouter();
  const postDiv = useRef();
  const { id } = router.query;

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

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  
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
    <AppLayout pageType={'singlepost'}>
      {singlePost
        ? <>
            <Head>
              <title>
                cHEWzOO | {singlePost.User.nickname}
              </title>
            </Head>

            <div style={ PostContainerStyle }>
              <Col xs={2} md={7} style ={ PostContainerSideStyle }>
              </Col>

              <Col style={ PostContainerCenterStyle } ref={postDiv}>
                <PostCard post={singlePost} />
              </Col>

              <Col xs={2} md={7} style ={ PostContainerSideStyle }>
              </Col>
            </div>
          </>
        : <>
            <Head>
              <title>
                cHEWzOO | 여기는 어디?
              </title>
            </Head>

            <div style={ PostContainerStyle }>
              <Col xs={2} md={7} style ={ PostContainerSideStyle }>
              </Col>

              <Col style={ PostContainerCenterStyle } ref={postDiv}>
                <Empty
                  image = {`${backUrl}/resource/searching.png`}
                  description={
                    <span>없는 걸 찾으려 하지마!</span>
                  }
                  style={{ marginTop: '50px'}}
                >
                  <Link href="/"><Button type="primary">아.. 미안</Button></Link>
                </Empty>
              </Col>

              <Col xs={2} md={7} style ={ PostContainerSideStyle }>
              </Col>
            </div>
          </>
      }
    </AppLayout>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//       { params: { id: '4' } },
//     ],
//     fallback: true,
//   };
// }

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  console.log(context);
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Post;
