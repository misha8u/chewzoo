import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Form, Input, Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import ChewzooAvatar from '../ChewzooAvatar';
import useInput from '../../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me?.id);
  const { me } = useSelector((state) => state.user);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    if (!commentText || !commentText.trim()) {
      return alert('할 말 없어?');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, userId: id, postId: post.id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: '10px 0px 0px 0px' }}>
        <Row>
          <ChewzooAvatar userId={me.id} avatarPosition={'comment'}/>
          <Input.TextArea 
            rows={1}
            value={commentText}
            placeholder="80자 이내로 짧게 한마디"
            onChange={onChangeCommentText}
            maxLength={80}
            style={{ margin: '0px 0px 16px 0px', width: 'calc(85% - 35px)' }}
            autoSize={{ minRows: 1, maxRows: 3 }}
            />
          <Button
            style={{ margin: '0px 1% 16px 1%', padding: '0%', width: '13%', float: 'right' }}
            type="primary"
            htmlType="submit"
            loading={addCommentLoading}
          ><CheckOutlined />
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
