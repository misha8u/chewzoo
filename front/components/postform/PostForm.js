import React, { useCallback } from 'react';
import Media from 'react-media';
import { Drawer } from 'antd';

import { useSelector, useDispatch } from 'react-redux';

import { CLOSE_POSTFORM } from '../../reducers/user';
import BranchPostStoryForm from './BranchPostStoryForm'
import PostStoryForm from './PostStoryForm'

const PostForm = ({branch}) => {
  //PostForm의 Story와 Forecast를 Tabs로 구분하고 각각 js의 코드들을 정리해주세요.
  const dispatch = useDispatch();
  const { showPostForm, showBranchPostForm } = useSelector((state) => state.user);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  return (
    <>
      <Media queries={{small: "(max-width: 767px)"}}>
        {(matches) => matches.small
          ? (<>
              <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showPostForm}
                width='75%'
              >
                <PostStoryForm/>
              </Drawer>

              <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showBranchPostForm}
                width='75%'
              >
                <BranchPostStoryForm branch ={ branch }/>
              </Drawer>
            
            </>)
          : (<>
              <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showPostForm}
                width='35%'
              >
                <PostStoryForm/>
              </Drawer>

              <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showBranchPostForm}
                width='35%'
              >
                <BranchPostStoryForm branch ={ branch }/>
              </Drawer>
            </>)
        }
      </Media>
    </>
  );
};

export default PostForm;
