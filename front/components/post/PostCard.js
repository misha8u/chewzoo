import React, { useCallback } from 'react';
import { Card, Col } from 'antd';
import PropTypes from 'prop-types';
import Router from 'next/router';

import PostCardAuthor from './PostCardAuthor';
import PostCardContent from './PostCardContent';
import BranchPostContent from './BranchPostContent';
import PostCardActionButtons from './PostCardActionButtons';

const PostCard = ({ post }) => {
  const toOrigin = useCallback(() => {
    Router.push(`/post/${post.BranchId}`);  
  }, [post.BranchId]);

  const authorStyle = {
    width: '100%',
    padding: '1.5%',
    fontWeight: 'bold',
    color: '#262626',
  };

  const PostCardContentStyle = {
    width: '100%',
    padding: '1.5%',
  };

  const BranchPostContentStyle = {
    width: '100%',
    padding: '0% 0% 1% 0%',
    fontStyle: 'italic',
    color: '#ababab',
    cursor: 'pointer',
  };

  return (
    <div key={post.id} id={post.id} style={{ padding: '15px 1% 5px 1%' }}>
      <Card hoverable={false} bodyStyle={{ padding: '0.8px' }}>
        <Col style={{ padding: '0%', alignContent: 'center' }}>
          <div style={ authorStyle }>
            <PostCardAuthor post={post}/>
          </div>
          <div style={ PostCardContentStyle }>
            {post.BranchId && post.Branch &&
              <div style={ BranchPostContentStyle } onClick={ toOrigin }>
                <BranchPostContent postData={post.Branch.content}/>
              </div>
            }
            <div>
            <PostCardContent postData={post.content} postId={post.id}/>
            </div>
          </div>
        </Col>

        <PostCardActionButtons post={post}/>

      </Card>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({
      nickname: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    UserId: PropTypes.number,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Exclamationers: PropTypes.arrayOf(PropTypes.object),
    Questioners: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;