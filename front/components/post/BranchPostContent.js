import React, { useState, useCallback } from 'react';
import { Row } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';

const BranchPostContent = ({ postData }) => {
  const [branchrHover, setBranchHover] = useState(false);
  const mouseEnter = useCallback(() => {
    setBranchHover(true); 
  }, [branchrHover]);
  const mouseLeave = () => setBranchHover(false);

  return (
    <Row
      onMouseEnter={ mouseEnter }
      onMouseLeave={ mouseLeave }
      style={branchrHover && { backgroundColor: '#FEF3F0' }}
    >"
      {postData.substr(0, 20).split(/(#[^\s#]+)/g).map((v) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link
              href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
              as={`/hashtag/${v.slice(1)}`}
              key={v}
            >
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}..."에 대해서
    </Row>
  );
}

BranchPostContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default BranchPostContent;
