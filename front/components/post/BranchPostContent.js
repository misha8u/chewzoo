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

  const postDataWithHyperLink = postData && postData.substr(0, 20).split(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/g).map((v) => {
    if (v && v.match(/(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))(https?:\/\/[a-z0-9&#=.\/\-?_%A-Z+:]+)/)) {
      return (
        <span>
          &#60;URL 이동&#62;
        </span>
      );
    }
    return (
      v && v.split(/(#[^\s#]+)/g).map((i) => {
        if (i && i.match(/(#[^\s#]+)/)) {
          return (
            <Link
              href={{ pathname: '/hashtag', query: { tag: i.slice(1) } }}
              as={`/hashtag/${i.slice(1)}`}
              prefetch={false}
              key={i}
            >
              <a>{i}</a>
            </Link>
          )
        }
        return i
      })
    )
  });

  return (
    <Row
      onMouseEnter={ mouseEnter }
      onMouseLeave={ mouseLeave }
      style={branchrHover && { backgroundColor: '#FEF3F0' }}
    >"
      {postDataWithHyperLink}..."에 대해서
    </Row>
  );
}

BranchPostContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default BranchPostContent;
