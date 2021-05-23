import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { backUrl } from '../config/config';
//import withReduxSaga from 'next-redux-saga';
//import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';

const cHEWzOO = ({ Component }) => (
  <>
    <Head>
      <title>cHEWzOO</title>
      <meta name="description" content={'주식을 씹다! cHEWzOO.'} />
      <meta property="og:title" content={'cHEWzOO'} />
      <meta property="og:description" content={'주식을 씹다! cHEWzOO.'} />
      <meta property="og:image" content={`${backUrl}/resource/signupTitle.png`} />
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
