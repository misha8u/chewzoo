import React, { useCallback, useState, useEffect } from 'react';
import { Form, Divider, Button, Input, AutoComplete, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Router from 'next/router';
import useInput from '../../../hooks/useInput'
import { useSelector, useDispatch } from 'react-redux';
import { BEGIN_CHECKLIST, CLOSE_CHECKLIST } from '../../../reducers/checklist';
import { ADD_POST_REQUEST, ADD_POSTDONE_RESET, CLOSE_POSTFORM } from '../../../reducers/post';
import { PARROT_COMMENT_REQUEST } from '../../../reducers/checklist';

const ChecklistForm = () => {
  const dispatch = useDispatch();
  const { addPostDone } = useSelector((state) => state.post);
  const { addedPostId } = useSelector((state) => state.user);
  const [checklistOpened, setChecklistOpened] = useState(false);
  const [parrotChecklist, setParrotChecklist] = useState(false);
  const [basicInfoCode, setBasicInfoCode] = useState('ACT_TARGET_FOR_FLO_WHY');
  const [parrotProbability, setParrotProbability] = useState(0);
  const [parrotText, setParrotText] = useState('WHY_FLO_TARGET_FOR_ACT');
  const [codeName, onChangeCodeName, setCodeName] = useInput('');
  const [firstQuestion, setFirstQuestion] = useState(false);
  const [secondQuestion, setSecondQuestion] = useState(false);
  const [second_1Question, setSecond_1Question] = useState(false);
  const [recommendation, setRecommendation] = useState(false);
  const [thirdQuestion, setThirdQuestion] = useState(false);
  const [fourthQuestion, setFourthQuestion] = useState(false);
  const [fifthQuestion, setFifthQuestion] = useState(false);
  const [finalQuestion, setfinalQuestion] = useState(false);

  useEffect(() => {
    if (addPostDone & parrotChecklist) {
      return(
        dispatch({
          type: PARROT_COMMENT_REQUEST,
          data: { content: '후회하고 껄무새 부를 확률, ' + String(parrotProbability) + '%', 
            userId: 'parrot', postId: addedPostId, 
            infocode: String(basicInfoCode), codename: String(codeName), probability: parrotProbability},
        }),
        dispatch({
          type: ADD_POSTDONE_RESET
        }),
        offChecklist(),
        onClose(),
        setParrotChecklist(false),
        Router.replace('/')
      )
    }
  }, [addPostDone, parrotChecklist, 
    addedPostId, parrotProbability, basicInfoCode, codeName ]);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  const offChecklist = useCallback(() => {
    setChecklistOpened(false);
    setBasicInfoCode('');
    setCodeName('');
    setParrotProbability(0);
    setFirstQuestion(false);
    setSecondQuestion(false);
    setSecond_1Question(false);
    setFourthQuestion(false);
    setThirdQuestion(false);
    setFifthQuestion(false);
    setRecommendation(false);
    setfinalQuestion(false);
    dispatch({
      type: CLOSE_CHECKLIST
    })
  }, []);

  const onFirstQuestion = useCallback(() => {
    setBasicInfoCode('');
    setParrotText('');
    setFirstQuestion(true);
    setChecklistOpened(true);
    dispatch({
      type: BEGIN_CHECKLIST
    })
  }, []);

  const onSecondQuestion = useCallback((e, t, r) => () => {
    setSecondQuestion(true);
    setFirstQuestion(false);
    setBasicInfoCode(basicInfoCode + e);
    setParrotProbability(parrotProbability + r)
    setParrotText(parrotText + t)
  }, [basicInfoCode, parrotProbability, parrotText]);

  //종목코드+종목명 DB와 자동완성 기능이 추가 되기 전까진 비활성화 부분 입니다.
  const onSecond_1Question = useCallback(() => {
    setSecond_1Question(true);
    setSecondQuestion(false);
  }, []);
  
  const onRecommendation = useCallback(() => {
    setRecommendation(true);
    setSecondQuestion(false);
    setSecond_1Question(false);
  }, []);

  const onThirdQuestion = useCallback((e) => () => {
    if (!codeName || !codeName.trim()) {
      return message.error({content: '종목 이름을 써줘', style: {marginTop: '3vh'}});
    }
    setCodeName(codeName.replace(/ /g,""));
    setThirdQuestion(true);
    setSecondQuestion(false);
    setSecond_1Question(false);
    setRecommendation(false);
    setBasicInfoCode(basicInfoCode + e);
  }, [basicInfoCode, codeName]);

  const onFourthQuestion = useCallback((e, t, y, l, s) => () => {
    setFourthQuestion(true);
    setThirdQuestion(false);
    setBasicInfoCode(basicInfoCode + e);
    if (basicInfoCode.substr(0,3) === 'BUY') {
      setParrotProbability(parrotProbability + y)
    }
    if (basicInfoCode.substr(0,3) === 'SEL') {
      setParrotProbability(parrotProbability + l)
    }
    if (basicInfoCode.substr(0,3) === 'SEE') {
      setParrotProbability(parrotProbability + s)
    }
    setParrotText(t + ' ' + parrotText);
  }, [basicInfoCode, parrotProbability, parrotText]);

  const onFifthQuestion = useCallback((e, t, y, l, s) => () => {
    setFifthQuestion(true);
    setFourthQuestion(false);
    setBasicInfoCode(basicInfoCode + e);
    if (basicInfoCode.substr(0,3) === 'BUY') {
      setParrotProbability(parrotProbability + y)
    }
    if (basicInfoCode.substr(0,3) === 'SEL') {
      setParrotProbability(parrotProbability + l)
    }
    if (basicInfoCode.substr(0,3) === 'SEE') {
      setParrotProbability(parrotProbability + s)
    }
    setParrotText(t + ' #'  + codeName + ', ' + parrotText);
  }, [basicInfoCode, codeName, parrotProbability, parrotText]);

  const onSixthQuestion = useCallback((e, t, y, l, s) => () => {
    setfinalQuestion(true);
    setFifthQuestion(false);
    setBasicInfoCode(basicInfoCode + e);
    if (basicInfoCode.substr(0,3) === 'BUY') {
      setParrotProbability(parrotProbability + y)
    }
    if (basicInfoCode.substr(0,3) === 'SEL') {
      setParrotProbability(parrotProbability + l)
    }
    if (basicInfoCode.substr(0,3) === 'SEE') {
      setParrotProbability(parrotProbability + s)
    };
    setParrotText(t + ' '  + parrotText);
  }, [basicInfoCode, parrotProbability, parrotText]);

  const completeChecklist = useCallback(() => {
    const formData = new FormData();
    formData.append('content', parrotText);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    }),
    setParrotChecklist(true)
  }, [parrotText]);
  
  return(
    <>
      <Form>
        {!checklistOpened && <Button shape="round" type="dashed" danger
          style={{ width: '100%', marginBottom: '12px' }} onClick={ onFirstQuestion }
        >
          🦜껄무새에게 물어봐!
        </Button>}

        {checklistOpened && <div>
          <Divider style={{ margin: '12px 0px 12px 0px', }} dashed/>

            {firstQuestion &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  <span>주식을?</span>
                </div>
                <div>
                  <Button style={{ margin: '2px' }} onClick={ onSecondQuestion('BUY', '살 거야.', 40) }>살 거야!</Button>
                  <Button style={{ margin: '2px' }} onClick={ onSecondQuestion('SEL', '팔 거야.', 30) }>팔 거야!</Button>
                  <Button style={{ margin: '2px' }} onClick={ onSecondQuestion('SEE', '지켜볼 거야.', 20) }>지켜볼 거야.</Button>
                </div>
              </div>  
            }

            {secondQuestion && 
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  <span>어떤 종목을?</span>
                </div>
                <div>
                  {/*<Input.Search style={{ width: '150px', margin: '2px' }} 
                    placeholder="종목 검색" enterButton onSearch={ onThirdQuestion('000000') } />
                  <Button style={{ margin: '2px' }} onClick={ onSecond_1Question }>몰라..</Button>*/}
                  <Input.Search style={{ width: '280px', margin: '2px' }} value={ codeName } onChange={ onChangeCodeName }
                    placeholder="띄어 쓰기 없이 종목 이름을 써줘!" enterButton={<CheckOutlined />} onSearch={ onThirdQuestion('000000') } />
                </div>
              </div>
            }

            {/*{second_1Question &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  <span>어떤 산업군 또는 테마를?</span>
                </div>
                <div>
                  <Input.Search style={{ width: '150px', margin: '2px' }}
                    placeholder="산업군 / 테마 검색" enterButton onSearch={ onRecommendation } />
                  <Button style={{ margin: '2px' }} onClick={ onRecommendation }>몰라..</Button>
                </div>
              </div>
            }

            {recommendation &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  <span>이 종목은 어때?</span>
                </div>
                <div>
                  <Button style={{ margin: '2px' }} onClick={ onThirdQuestion('000000') }>삼성전자</Button>
                  <Button style={{ margin: '2px' }} onClick={ onThirdQuestion('000000') }>LG전자</Button>
                  <Button style={{ margin: '2px' }} onClick={ onThirdQuestion('000000') }>SK하이닉스</Button>
                  <Button style={{ margin: '2px' }} onClick={ onThirdQuestion('000000') }>NAVER</Button>
                </div>
              </div>
            }*/}

            {thirdQuestion &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  {basicInfoCode.substr(0,3) === 'SEL'
                    ? <span>얼마나 보유했어?</span>
                    : <span>얼마간 보유하게?</span>
                  }
                </div>
                <div>
                  {/* 순서 대로 BUY SEL SEE 의 경우 */}
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('MIN', '스캘핑으로', 15, 10, 5) }>하루(스캘핑)</Button>
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('DAY', '단타로', 20, -5, 0) }>한달(단타)</Button>
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('WEE', '스윙 투자로', 10, -10, 0) }>두세달(스윙)</Button>
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('MON', '중기 투자로', 0, -15, -5) }>약 1년(중기)</Button>
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('YEA', '장기 투자로', -5, -20, -10) }>2년 이상(장기)</Button>
                  <Button style={{ margin: '2px' }} onClick={ onFourthQuestion('NNN', '계획 없이', 20, 0, 0) }>몰라(계획 없음)</Button>
                </div>
              </div>
            }

            {fourthQuestion &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  {basicInfoCode.substr(9,3) === 'MIN' && <span>최근 3일 추세가 어때?</span>}
                  {basicInfoCode.substr(9,3) === 'DAY' && <span>최근 일주일 추세가 어때?</span>}
                  {basicInfoCode.substr(9,3) === 'WEE' && <span>최근 3개월 추세가 어때?</span>}
                  {basicInfoCode.substr(9,3) === 'MON' && <span>최근 1년 추세가 어때?</span>}
                  {basicInfoCode.substr(9,3) === 'YEA' && <span>최근 10년 추세가 어때?</span>}
                  {basicInfoCode.substr(9,3) === 'NNN' && <span>최근 추세가 어때?</span>}
                </div>
                <div>
                  {basicInfoCode.substr(9,3) === 'MIN' || basicInfoCode.substr(9,3) === 'DAY' || basicInfoCode.substr(9,3) === 'NNN'
                    ? <>
                      {/* 순서 대로 BUY SEL SEE 의 경우 */}
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BDN', '급하게 하락한', 5, 10, 5) }>급한 하락!</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('SDN', '천천히 하락한', 15, -5, -5) }>천천히 하락..</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BOX', '1% 대 횡보 중인', 10, -8, 5) }>-1% ~ +1%</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('SUP', '약하게 상승한', -5, -10, 10) }>약한 상승!</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BUP', '급하게 상승한', -8, -15, 8) }>급하고 강한 상승!!</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('NNN', '최근 추세를 모르는', 10, 10, 10) }>몰라..</Button>
                    </>
                    :<>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BDN', '급하게 하락한', -5, 8, 10) }>고점 대비 50% 이상 하락</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('SDN', '천천히 하락한', -10, 12, 7) }>고점 대비 20% 이상 하락</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BOX', '1% 대 횡보 중인', -5, 17, 5) }>10% 이내의 박스권</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('SUP', '약하게 상승한', 5, -10, 7) }>저점 대비 50% 이상 상승</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('BUP', '급하게 상승한', 10, -20, 10) }>저점 대비 100% 이상 상승</Button>
                      <Button style={{ margin: '2px' }} onClick={ onFifthQuestion('NNN', '최근 추세를 모르는', 10, 10, 10) }>몰라..</Button>
                    </>
                  }
                </div>
              </div>
            }

            {fifthQuestion &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  {basicInfoCode.substr(12,3) === 'SDN' && <span>하락한 원인을 알아?</span>}
                  {basicInfoCode.substr(12,3) === 'BDN' && <span>하락한 원인을 알아?</span>}
                  {basicInfoCode.substr(12,3) === 'SUP' && <span>상승한 이유를 알아?</span>}
                  {basicInfoCode.substr(12,3) === 'BUP' && <span>상승한 이유를 알아?</span>}
                  {basicInfoCode.substr(12,3) === 'BOX' && <span>횡보한 원인을 알아?</span>}
                  {basicInfoCode.substr(12,3) === 'NNN' && <span>지금 주가가 왜 그런지 알아?</span>}
                </div>
                <div>
                  {basicInfoCode.substr(12,3) === 'SDN' || basicInfoCode.substr(12,3) === 'BDN'
                    ? <>
                      {/* 순서 대로 BUY SEL SEE 의 경우 /// 단타냐 장투냐에 따라서도 달라져야 할듯*/}
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('IND', '지수가 하락해서', -5, 5, -5 ) }>지수 하락</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('GRO', '산업군 / 테마가 약세라서', -5, 5, -5 ) }>산업군 / 테마 약세</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('VAL', '고평가 구간이라서', 8, -8, -2 ) }>고평가 구간</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('MOM', '악재 발생 / 재료가 소멸해서', 5, -5, -8 ) }>악재 발생 / 재료 소멸</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('TRI', '새력이 장난쳐서', 9, 9, 0 ) }>세력의 장난</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('POW', '외국인 / 기관이 팔아서', 5, 0, 0 ) }>외국인 / 기관 매도</Button>
                      <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('NNN', '왜 이런지 모르고', 8, 5, 0 ) }>몰라..</Button>
                    </>
                    : <>
                      {basicInfoCode.substr(12,3) === 'SUP' || basicInfoCode.substr(12,3) === 'BUP'
                        ?<>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('IND', '지수가 상승해서', -5, 3, 5 ) }>지수 상승</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('GRO', '산업군 / 테마가 강세라서', -6, 4, 6 ) }>산업군 / 테마 강세</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('VAL', '저평가 구간이라서', -8, 9, 6 ) }>저평가 구간</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('MOM', '호재 발생 / 재료 노출되서', 0, -5, 0 ) }>호재 발생 / 재료 노출</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('TRI', '주포 형님이 올려서', 5, -10, -6 ) }>주포 형님 등장</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('POW', '외국인 / 기관이 사서', -5, 3, 4 ) }>외국인 / 기관 매수</Button>
                          <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('NNN', '왜 이런지 모르고', 10, 5, 0 ) }>몰라..</Button>
                        </>
                        :<>
                          {basicInfoCode.substr(12,3) === 'BOX'
                            ?<>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('IND', '지수가 횡보해서', -3, 1, 4 ) }>지수 횡보</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('GRO', '산업군 / 테마가 횡보해서', -5, 5, 2 ) }>산업군 / 테마 횡보</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('VAL', '급등락 후, 조정 중이라서', 0, -4, -6 ) }>급등락 후, 조정</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('MOM', '무관심과 소외 때문에', -7, 7, 5 ) }>무관심과 소외</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('TRI', '세력이 작업 중이라', 5, 5, 0 ) }>세력 작업 중</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('POW', '특별한 수급 동향이 없어서', 0, 5, 0 ) }>특별한 수급 동향 없음</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('NNN', '왜 이런지 모르고', -1, 5, 0 ) }>몰라..</Button>
                            </>
                            :<>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('IND', '지수 때문인 것 같은데', 10, 10, 0 ) }>지수 때문에?</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('GRO', '산업군 / 테마 영향 같은데', 10, 10, 0 ) }>산업군 / 테마 영향?</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('VAL', '기업 가치가 반영되는 것 같은데', 10, 10, 0 ) }>기업 가치 반영</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('MOM', '모멘텀이나 뉴스가 있을 것 같은데', 10, 10, 0 ) }>모멘텀 / 뉴스</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('TRI', '세력이 있는 것 같은데', 10, 10, 0 ) }>세력이 있다!</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('POW', '외국인 / 기관 수급 때문인 듯한데', 10, 10, 0 ) }>외국인 / 기관 수급</Button>
                              <Button style={{ margin: '2px' }} onClick={ onSixthQuestion('NNN', '왜 이런지 모르고', 15, 10, 0 ) }>몰라..</Button>
                            </>
                          }
                        </>
                      }
                    </>
                  }
                </div>
              </div>
            }

            {finalQuestion &&
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px', fontSize: '22px' }}>
                  <span>{parrotText}</span>
                </div>
              </div>  
            }

            {/** 기본적인 질문 종료, 랜덤 질문 시작 기점 */}

            {finalQuestion
              ?<div style={{ textAlign: 'center' }}>
                <Button shape="round" type="dashed"
                  style={{ width: '40%', margin: '20px 8px 0px 8px'  }} onClick={ completeChecklist }
                >
                  🦜어떨까?
                </Button>
                <Button shape="round" type="dashed"
                  style={{ width: '40%', margin: '20px 8px 0px 8px'  }} onClick={ offChecklist }
                >
                  😬집어 치워!
                </Button>
              </div>
              :<>
                <Button shape="round" type="dashed"
                  style={{ width: '100%', marginTop: '20px'  }} onClick={ offChecklist }
                >
                  😤안해!
                </Button>
              </>
            }
          <Divider style={{ margin: '12px 0px 12px 0px', }} dashed/>
        </div>}
      </Form>
    </>
  );
};

ChecklistForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default ChecklistForm;