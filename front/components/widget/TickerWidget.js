import React from 'react';

export default class Tabsshow extends React.PureComponent {
  constructor(props) {
      super(props);
      this._ref = React.createRef();
  }
componentDidMount() {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.async = true;
      script.innerHTML = JSON.stringify(  {
        "symbols": [
          {
            "description": "코스피",
            "proName": "KRX:KOSPI"
          },
          {
            "description": "코스닥",
            "proName": "KRX:KOSDAQ"
          },
          {
            "description": "USD환율",
            "proName": "FX_IDC:USDKRW"
          },
          {
            "description": "나스닥100",
            "proName": "CURRENCYCOM:US100"
          },
          {
            "description": "S&P500",
            "proName": "CURRENCYCOM:US500"
          },
          {
            "description": "삼성전자",
            "proName": "KRX:005930"
          },
          {
            "description": "SK하이닉스",
            "proName": "KRX:000660"
          },
          {
            "description": "NAVER",
            "proName": "KRX:035420"
          },
          {
            "description": "카카오",
            "proName": "KRX:035720"
          },
          {
            "description": "LG화학",
            "proName": "KRX:051910"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "kr"
      })
      this._ref.current.appendChild(script);
  }
  render() {
      return(
      <div class="tradingview-widget-container" ref={this._ref}>
          <div class="tradingview-widget-container__widget"></div>
         
      </div>
      );
  }
 
}
