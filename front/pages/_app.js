import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
//import withReduxSaga from 'next-redux-saga';
//import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';

const cHEWzOO = ({ Component }) => (
  <>
    <Head>
      <title>cHEWzOO</title>
      <script data-ad-client="ca-pub-9319397510907127" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </Head>
    <Component />
  </>
);

cHEWzOO.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export function reportWebVitals(metric) {
  console.log(metric);
}

export default wrapper.withRedux(cHEWzOO);
