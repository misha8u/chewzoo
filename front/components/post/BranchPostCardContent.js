import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const BranchPostCardContent = ({ postData }) => (
  <div>"
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
  </div>
);

BranchPostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default BranchPostCardContent;
