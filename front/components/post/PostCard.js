import React, { useState } from 'react';
import { Card, Col } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

import PostCardAuthor from './PostCardAuthor';
import PostCardContent from './PostCardContent';
import BranchPostCardContent from './BranchPostCardContent';
import PostCardActionButtons from './PostCardActionButtons';

moment.locale('ko');

const PostCard = ({ post }) => {
  const [cardHover, setCardHover] = useState(false);
  const mouseEnter = () => setCardHover(true)
  const mouseLeave = () => setCardHover(false)

  const CardStyle = {
    padding: '15px 1% 5px 1%',
  };

  const CardBodyStyle = {
    padding: '0.8px',
  };

  const authorStyle = {
    width: '100%',
    padding: '16px 1% 16px 24px',
    fontWeight: 'bold',
    color: '#262626',
  };

  const PostCardContentStyle = {
    width: '100%',
    padding: '16px 24px 16px 24px',
  };

  const BranchPostCardContentStyle = {
    width: '100%',
    padding: '16px 24px 16px 24px',
    fontStyle: 'italic',
    color: '#ababab',
  };

  return (
    <div key={post.id} id={post.id} style={ CardStyle }>
      <Card
        hoverable
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        bodyStyle={ CardBodyStyle }
        style={{ shadowColor: '#E13427' }}
      >
        <Col style={{ padding: '0%', alignContent: 'center' }}>
          <div style={ authorStyle }>
            <PostCardAuthor post={post} cardhover={cardHover} />
          </div>
          {post.BranchId && post.Branch &&
            <div style={ BranchPostCardContentStyle }>
              <BranchPostCardContent postData={post.Branch.content}/>
            </div>
          }
          <div style={ PostCardContentStyle }>
            <PostCardContent postData={post.content} postId={post.id}/>
          </div>
          <span style={{ float: 'right' }}>{moment(post.createdAt).fromNow()}</span>
        </Col>

        <PostCardActionButtons post={post}/>

      </Card>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
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