if(!(window.OPT_LEGACY&&window.OPT_LEGACY.c)){(window.OPT_LEGACY=window.OPT_LEGACY||{}).c={html:"<section id=\"sec-c\" hidden>\n  <p class=\"lede\" style=\"margin-bottom:10px\">A군은 행렬곱을 빠르게 하는 얘기였다. C군 셋은 다르다 — 답을 계산하지 않고, 물리계가 <span class=\"k\">스스로 낮은 에너지로 떨어지게</span> 두고 그 자리를 읽는다. 셋은 같은 이징 문제를 서로 다른 방식으로 풀고, 서로 다른 벽에 막힌다.</p>\n<div class=\"tabs\" id=\"c-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>코히런트 이징 머신</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>공간광 이징 머신</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>리커런트 샘플러</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n\n<div class=\"card sec\" id=\"c-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>코히런트 이징 머신 (OPO 네트워크)</h2></div>\n    <div class=\"chips\"><span class=\"chip\">스탠포드 Mabuchi·Fejer · NTT Yamamoto</span><span class=\"chip wall\">측정-되먹임 지연 · 국부 최적</span></div>\n  </div>\n  <p class=\"idea\">광 파라메트릭 발진기는 발진할 때 위상이 0 또는 π 둘 중 하나로 잠긴다. 그 <span class=\"k\">두 갈래가 곧 스핀 ±1</span>이다. 발진기 사이를 결합해두고 펌프를 문턱 아래에서 천천히 올리면, 가장 적게 손해 보는 위상 조합이 먼저 켜진다 — <span class=\"k\">적어도 설계는 그렇다.</span> 아래에서 돌려보면 그게 보장이 아닌 것도 같이 보인다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"c-f1\" viewBox=\"0 0 440 268\" role=\"img\" aria-label=\"OPO 네트워크의 Max-Cut 수렴\"></svg></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">노드</span>\n        <button type=\"button\" data-g=\"1n\" data-v=\"8\" aria-pressed=\"true\">8</button>\n        <button type=\"button\" data-g=\"1n\" data-v=\"12\" aria-pressed=\"false\">12</button>\n        <button type=\"button\" data-g=\"1n\" data-v=\"16\" aria-pressed=\"false\">16</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"c-c1p\">펌프 p</label><input type=\"range\" id=\"c-c1p\" min=\"60\" max=\"190\" step=\"1\" value=\"130\"><output id=\"c-o1p\"></output></div>\n        <div class=\"row\"><label for=\"c-c1k\">결합 K</label><input type=\"range\" id=\"c-c1k\" min=\"0\" max=\"40\" step=\"1\" value=\"12\"><output id=\"c-o1k\"></output></div>\n        <div class=\"row\"><label for=\"c-c1z\">잡음</label><input type=\"range\" id=\"c-c1z\" min=\"0\" max=\"60\" step=\"1\" value=\"12\"><output id=\"c-o1z\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"c-b1run\">한 번 돌리기</button>\n        <button type=\"button\" id=\"c-b1stat\">100회 통계</button>\n      </div>\n      <div class=\"read\" id=\"c-r1\"></div>\n      <p class=\"note\">실제로 적분한다 — ẋᵢ = (p−1−xᵢ²)xᵢ − K·Σⱼ wᵢⱼxⱼ + 잡음, 오일러 400스텝. 최적 컷은 2ⁿ 전수조사로 미리 구해놓고 비교한다.</p>\n    </div>\n  </div>\n  <div class=\"walk\">\n    <div class=\"walkhead\">\n      <h3>어떻게 돌아가나 — 하나씩 돌려보기</h3>\n      <div class=\"steps\" id=\"c-wtabs\">\n        <button type=\"button\" data-w=\"1\" aria-pressed=\"true\">1</button>\n        <button type=\"button\" data-w=\"2\" aria-pressed=\"false\">2</button>\n        <button type=\"button\" data-w=\"3\" aria-pressed=\"false\">3</button>\n        <button type=\"button\" data-w=\"4\" aria-pressed=\"false\">4</button>\n        <button type=\"button\" data-w=\"5\" aria-pressed=\"false\">5</button>\n        <button type=\"button\" data-w=\"6\" aria-pressed=\"false\">6</button>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w1\">\n      <p class=\"wtext\"><b>펄스 하나가 스핀 하나다.</b> 축퇴 광 파라메트릭 발진기로 펄스를 수천 개 만든다. 섬유 고리를 한 바퀴 도는 동안 펄스들이 시간축에 줄지어 늘어서고, 그 줄 하나하나가 스핀이 된다. <b>고리 길이가 스핀 수의 상한을 정한다</b> — 둘을 움직여 보면 왜 그런지 숫자로 나온다.</p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf1\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"섬유 고리와 펄스 열\"></svg></div>\n        <div>\n          <div class=\"ctl\">\n            <div class=\"row\"><label for=\"c-wc1L\">고리 길이</label><input type=\"range\" id=\"c-wc1L\" min=\"1\" max=\"200\" step=\"1\" value=\"10\"><output id=\"c-wo1L\"></output></div>\n            <div class=\"row\"><label for=\"c-wc1N\">스핀 수 N</label><input type=\"range\" id=\"c-wc1N\" min=\"0\" max=\"5\" step=\"1\" value=\"2\"><output id=\"c-wo1N\"></output></div>\n          </div>\n          <div class=\"read\" id=\"c-wr1\"></div>\n          <p class=\"note\">빛은 석영 섬유에서 n≈1.468 만큼 느려진다 — 진공의 2.04×10⁸ m/s. 라운드트립을 스핀 수로 나눈 게 슬롯 하나다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w2\" hidden>\n      <p class=\"wtext\"><b>위상은 0 아니면 π.</b> 축퇴 OPO는 문턱을 넘는 순간 둘 중 하나로 잠기는데, 어느 쪽으로 잠길지는 미리 정해져 있지 않다. 잡음이 민다. 그 두 갈래를 +1, −1에 대응시킨다.</p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf2\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"갈래질 그림\"></svg></div>\n        <div>\n          <div class=\"ctl\">\n            <div class=\"row\"><label for=\"c-wc2p\">펌프 p</label><input type=\"range\" id=\"c-wc2p\" min=\"0\" max=\"250\" step=\"1\" value=\"150\"><output id=\"c-wo2p\"></output></div>\n            <div class=\"row\"><label for=\"c-wc2z\">잡음 σ</label><input type=\"range\" id=\"c-wc2z\" min=\"1\" max=\"80\" step=\"1\" value=\"20\"><output id=\"c-wo2z\"></output></div>\n          </div>\n          <div class=\"btns\" style=\"margin-top:8px\">\n            <button type=\"button\" id=\"c-wb2one\">한 개 켜보기</button>\n            <button type=\"button\" id=\"c-wb2many\">50번 켜보기</button>\n          </div>\n          <div class=\"read\" id=\"c-wr2\"></div>\n          <p class=\"note\">ẋ = (p−1−x²)x + 잡음 을 실제로 적분한다. p&lt;1이면 0으로 죽고, p&gt;1이면 ±√(p−1)로 간다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w3\" hidden>\n      <p class=\"wtext\"><b>J<sub>ij</sub>는 사실 FPGA가 만든다.</b> 결합 방법은 둘인데 나란한 선택지가 아니라 세대가 다르다. 광학적 지연선이 초기·소규모였고, 규모를 낸 건 전부 측정-피드백이다 — 2016년 NTT의 2000스핀, 2021년의 100,512스핀이 모두 이쪽이다(같은 2016년 스탠포드 쪽은 100스핀이었다). 펄스를 재서 Σⱼ Jᵢⱼxⱼ를 FPGA가 디지털로 계산하고 그 결과를 다시 빛에 실어준다. <b>J를 거의 자유롭게 쓸 수 있다는 CIM의 가장 큰 장점은, 광이 아니라 전자 쪽이 치르는 값이다.</b></p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf3\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"측정-피드백 고리와 처리량\"></svg></div>\n        <div>\n          <div class=\"ctl\">\n            <div class=\"row\"><label for=\"c-wc3N\">스핀 수 N</label><input type=\"range\" id=\"c-wc3N\" min=\"0\" max=\"5\" step=\"1\" value=\"2\"><output id=\"c-wo3N\"></output></div>\n            <div class=\"row\"><label for=\"c-wc3L\">고리 길이</label><input type=\"range\" id=\"c-wc3L\" min=\"1\" max=\"200\" step=\"1\" value=\"10\"><output id=\"c-wo3L\"></output></div>\n            <div class=\"row\"><label for=\"c-wc3F\">FPGA 처리량</label><input type=\"range\" id=\"c-wc3F\" min=\"1\" max=\"400\" step=\"1\" value=\"20\"><output id=\"c-wo3F\"></output></div>\n          </div>\n          <div class=\"read\" id=\"c-wr3\"></div>\n          <p class=\"note\">조밀 결합이면 라운드트립 한 번에 N²번 곱해야 한다. 이게 안 되면 기계가 아예 못 돈다 — 벽에 적어둔 「측정-되먹임 지연」이 이것이다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w4\" hidden>\n      <p class=\"wtext\"><b>설계 논리는 「최소 이득」이다.</b> 펌프를 문턱 아래에서 천천히 올리면 손실이 가장 작은 모드가 가장 먼저 발진한다. 결합이 만드는 손실이 스핀 배치마다 다르니, 가장 적게 손해 보는 배치가 먼저 켜지고 나머지는 이득을 빼앗겨 눌린다. <b>펌프를 올려보면 「천천히」가 왜 조건인지 보인다</b> — 빨리 올리면 여러 모드가 한꺼번에 문턱을 넘는다.</p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf4\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"모드별 성장률\"></svg></div>\n        <div>\n          <div class=\"ctl\">\n            <div class=\"row\"><label for=\"c-wc4p\">펌프 p</label><input type=\"range\" id=\"c-wc4p\" min=\"40\" max=\"190\" step=\"1\" value=\"72\"><output id=\"c-wo4p\"></output></div>\n            <div class=\"row\"><label for=\"c-wc4K\">결합 K</label><input type=\"range\" id=\"c-wc4K\" min=\"1\" max=\"40\" step=\"1\" value=\"12\"><output id=\"c-wo4K\"></output></div>\n          </div>\n          <div class=\"read\" id=\"c-wr4\"></div>\n          <p class=\"note\">결합 행렬 J를 야코비 회전으로 실제 고유분해한다. 모드 k의 문턱은 p = 1 + K·λₖ, 성장률은 (p−1) − K·λₖ다. 그래프 크기는 위 카드의 노드 버튼을 따라간다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w5\" hidden>\n      <p class=\"wtext\"><b class=\"w\">그런데 먼저 켜지는 모드가 바닥상태라는 보장은 없다.</b> 최소 이득 논증은 잡음이 없다는 가정 아래의 이상화다. 문턱 근처 선형 해석에서 먼저 켜지는 건 J의 최소 고유벡터인데, 그건 ±1 제약을 풀어버린 <b>연속 완화</b> 문제의 해지 이징 바닥상태가 아니다. 거기에 발진기들의 진폭이 서로 다르다는 문제가 겹친다(amplitude heterogeneity) — 고유벡터 성분의 크기가 제각각인 게 바로 그것이다.</p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf5\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"최소 고유벡터 성분과 반올림\"></svg></div>\n        <div>\n          <div class=\"btns\" style=\"margin-bottom:8px\">\n            <button type=\"button\" id=\"c-wb5scan\">그래프 60개로 재보기</button>\n          </div>\n          <div class=\"read\" id=\"c-wr5\"></div>\n          <p class=\"note\">최소 고유벡터를 부호로 자른 해와, 2ⁿ 전수조사로 구한 진짜 최적을 같은 그래프에서 비교한다. 한 그래프만 보면 우연히 맞을 수 있어서 60개를 돌려보는 버튼을 뒀다. <b>위 카드의 노드를 16으로 올리고 다시 눌러봐라</b> — 적중률이 뚝 떨어진다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"wstep\" id=\"c-w6\" hidden>\n      <p class=\"wtext\"><b>그래서 실제로는 여러 번 돌린다.</b> 초기조건을 바꿔 반복하고 가장 좋은 것을 고른다. 진폭을 공통 목표값으로 끌어당기는 오차보정 되먹임이 제안됐지만, 저자들 스스로 이 둘을 「부분적으로만」 해결한다고 쓴다. <b>그러면 「한 번 푸는 시간」은 라운드트립이 아니라 반복 횟수가 정한다.</b></p>\n      <div class=\"split\">\n        <div class=\"fig\"><svg class=\"f\" id=\"c-wf6\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"반복에 따른 누적 성공확률\"></svg></div>\n        <div>\n          <div class=\"btns\" style=\"margin-bottom:8px\">\n            <button type=\"button\" id=\"c-wb6run\">1회 성공률 재보기 (100회)</button>\n          </div>\n          <div class=\"ctl\">\n            <div class=\"row\"><label for=\"c-wc6R\">반복 횟수 R</label><input type=\"range\" id=\"c-wc6R\" min=\"1\" max=\"200\" step=\"1\" value=\"20\"><output id=\"c-wo6R\"></output></div>\n          </div>\n          <div class=\"read\" id=\"c-wr6\"></div>\n          <p class=\"note\">99%로 답을 얻는 데 드는 반복 수 R₉₉ = ln(0.01)/ln(1−p)를 실측 p로 계산하고, 1단계의 라운드트립을 곱해 시간으로 바꾼다.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"nav\">\n      <button type=\"button\" id=\"c-wprev\">← 이전</button>\n      <button type=\"button\" id=\"c-wnext\">다음 →</button>\n    </div>\n  </div>\n  </div>\n\n<div class=\"card sec\" id=\"c-s2\">\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>공간광 이징 머신 (SPIM)</h2></div>\n    <div class=\"chips\"><span class=\"chip\">사피엔차(로마) Pierangeli·Conti</span><span class=\"chip wall\">SLM 프레임레이트 ms · 결합이 Mattis 꼴</span></div>\n  </div>\n  <p class=\"idea\">SLM 화소 하나가 스핀 하나다. 빛을 통째로 모아 한 점에 맺으면 그 세기가 <span class=\"k\">전체 에너지를 한 번에</span> 준다 — 스핀이 몇 개든 측정 한 번은 한 프레임. 대신 결합 행렬을 자유롭게 못 쓰고, 프레임이 밀리초고, <span class=\"k\">필요한 프레임 수는 N과 함께 늘어난다</span>.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"c-f2\" viewBox=\"0 0 440 268\" role=\"img\" aria-label=\"SPIM 에너지 하강과 프레임 환산\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"c-c2n\">스핀 N</label><input type=\"range\" id=\"c-c2n\" min=\"0\" max=\"7\" step=\"1\" value=\"3\"><output id=\"c-o2n\"></output></div>\n        <div class=\"row\"><label for=\"c-c2k\">패턴 수 k</label><input type=\"range\" id=\"c-c2k\" min=\"1\" max=\"8\" step=\"1\" value=\"4\"><output id=\"c-o2k\"></output></div>\n        <div class=\"row\"><label for=\"c-c2f\">프레임 시간</label><input type=\"range\" id=\"c-c2f\" min=\"1\" max=\"200\" step=\"1\" value=\"50\"><output id=\"c-o2f\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"c-b2run\">담금질 돌리기</button>\n      </div>\n      <div class=\"read\" id=\"c-r2\"></div>\n      <p class=\"note\">Mattis 결합 Jᵢⱼ = (1/N)Σₖξᵢᵏξⱼᵏ 으로 에너지를 실제로 계산하고, 프레임마다 한 번 읽는 담금질을 1200회 돈다. 걸린 시간은 프레임 수 × 프레임 시간이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"c-s3\">\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>포토닉 리커런트 이징 샘플러</h2></div>\n    <div class=\"chips\"><span class=\"chip\">C. Roques-Carmes (MIT → 2026 ISTA)</span><span class=\"chip wall\">잡음-온도 교정 · 수렴 판정</span></div>\n  </div>\n  <p class=\"idea\">앞의 둘은 답 하나를 찾으려고 잡음을 <span class=\"k\">줄인다</span>. 이쪽은 잡음을 자원으로 쓴다 — 되먹임 고리에 광 잡음을 일부러 남겨두면 계가 한 자리에 멈추지 않고 상태 공간을 돌아다니고, 그 체류 빈도가 <span class=\"k\">볼츠만 분포</span>를 이룬다. 얻는 건 최적해 하나가 아니라 분포다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"c-f3\" viewBox=\"0 0 440 268\" role=\"img\" aria-label=\"샘플러가 만든 해의 분포\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"c-c3z\">잡음 σ</label><input type=\"range\" id=\"c-c3z\" min=\"4\" max=\"120\" step=\"1\" value=\"30\"><output id=\"c-o3z\"></output></div>\n        <div class=\"row\"><label for=\"c-c3m\">샘플 수</label><input type=\"range\" id=\"c-c3m\" min=\"200\" max=\"4000\" step=\"100\" value=\"1500\"><output id=\"c-o3m\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"c-b3run\">다시 뽑기</button>\n        <button type=\"button\" id=\"c-b3ov\" aria-pressed=\"true\">이론값 겹치기</button>\n      </div>\n      <div class=\"read\" id=\"c-r3\"></div>\n      <p class=\"note\">10노드 그래프를 글라우버 되먹임으로 실제 샘플링하고, 2¹⁰=1024 상태 전수조사로 구한 볼츠만 분포를 점선으로 겹친다. 두 곡선이 겹치면 「분포를 뽑았다」가 말 그대로 참이라는 뜻이다.</p>\n  </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"c-s4\">\n  <h2 style=\"font-size:16px\">셋을 겹쳐 보면</h2>\n  <p style=\"margin-top:8px\"><b>셋 다 같은 이징 에너지를 내려가지만, 무엇을 희생했는지가 다르다.</b> CIM은 결합 행렬을 거의 자유롭게 쓸 수 있는 대신 스핀을 시간축에 줄 세워 쓴다 — 펄스가 N개면 한 라운드트립이 N 슬롯이라, 스핀을 늘리면 한 바퀴 도는 시간이 비례해 늘어난다. SPIM은 정반대다. 스핀을 10만 개로 늘려도 에너지 한 번 읽는 값은 한 프레임으로 그대로다 — 광이 합산을 공짜로 해주니까. 그런데 02를 실제로 돌려보면 이게 공짜가 아닌 게 드러난다. 프레임 수를 1200장으로 고정해놓고 N만 키우면, N=200에서 달성 가능한 바닥의 90% 가까이 내려가던 것이 N=50,000에서는 1%도 못 내려간다. 즉 비용은 프레임 <b>한 장</b>에서 사라지고 프레임 <b>장수</b>로 되살아난다. 거기에 결합 행렬이 Mattis 꼴(소수의 패턴으로 만든 낮은 랭크)에 묶인다. 샘플러는 두 축을 다 포기하고 세 번째를 가져간다 — 답이 아니라 분포.</p>\n  <p><b>그래서 쓸 곳이 갈린다.</b> 조밀한 결합에 스핀이 수백~수천이면 CIM 쪽, 결합이 몇 개 패턴의 합으로 표현되고 스핀이 수만이면 SPIM 쪽이다. 그리고 애초에 분포가 필요한 작업 — 볼츠만 머신 학습, 베이지안 추론, 확률적 조합 생성 — 은 1·2로는 할 수 없다. 해 하나를 아무리 빨리 찾아도 그건 분포의 한 점일 뿐이다.</p>\n  <table class=\"cmp\">\n    <tr><th>축</th><th>01 CIM</th><th>02 SPIM</th><th>03 샘플러</th></tr>\n    <tr><td>스핀이 사는 곳</td><td>시간다중 광펄스의 위상</td><td>SLM 화소의 위상</td><td>되먹임 고리의 광 진폭</td></tr>\n    <tr><td>결합 Jᵢⱼ</td><td>거의 자유 (측정-되먹임)</td><td>Mattis 꼴 · 낮은 랭크</td><td>자유 (전자 되먹임)</td></tr>\n    <tr><td>스핀 수를 늘리면</td><td>라운드트립이 N에 비례해 길어진다</td><td>프레임 한 장 값은 그대로, 필요한 <b>장수</b>가 늘어난다</td><td>갱신 횟수가 늘어난다</td></tr>\n    <tr><td>한 번 갱신</td><td class=\"n\">N × ~ns 급</td><td class=\"n\">프레임 1장 = ms 급</td><td class=\"n\">전자 되먹임이 결정</td></tr>\n    <tr><td>얻는 것</td><td>해 하나 (국부 최적 가능)</td><td>해 하나</td><td>해의 <span class=\"k\">분포</span></td></tr>\n    <tr><td>막히는 곳</td><td>되먹임 지연이 라운드트립보다 길면 못 돈다</td><td>프레임레이트 · 랭크 제한</td><td>잡음↔온도 대응을 측정해야 안다</td></tr>\n  </table>\n  <p style=\"margin-top:12px\"><b>숫자를 믿을 때 조심할 것.</b> 이 분야에서 「GPU 대비 몇백 배」가 나올 때, 대개 광 쪽은 라운드트립 시간만 세고 측정·AD 변환·FPGA 되먹임·SLM 로딩은 빼고, GPU 쪽은 담금질 코드를 최적화하지 않은 채 비교한다. 이 페이지가 내놓는 숫자도 전부 <span class=\"k\">이 시뮬레이션 안의 숫자</span>지 측정값이 아니다 — 프레임 시간이나 슬롯 시간처럼 물리에서 온 값은 가정으로 명시해뒀다.</p>\n</div>\n\n<div class=\"pending\" id=\"c-pend\">\n  <b>이 페이지가 안 다루는 것</b> — 같은 분류표의 B군(리저버·스파이킹·텐서코어) · D군(전광 논리·스위칭) · E군(in-sensor·전처리기) · F군(선형광학 양자컴·주파수 콤)은 다른 장이다. 여기서 쓴 잡음 세기·결합 상수는 물리 단위가 아니라 <span style=\"color:var(--wall)\">무차원 모형 값</span>이고, 실제 소자의 값과 맞춘 적 없다(미확인).\n</div>\n</section>",run:function(getComputedStyle){


(function(){
'use strict';
const SEC='sec-c';
function sleeping(){const r=document.getElementById(SEC);return !r||r.hidden||!r.isConnected;}
function g1buttons(){return Array.prototype.slice.call(document.querySelectorAll('#'+SEC+' [data-g="1n"]'));}

const $=id=>document.getElementById('c-'+id);   // 접두어를 $ 안에 — 동적 조립까지 한 번에 덮인다
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(v,n)=>v.toFixed(n==null?2:n);
function rngOf(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(rnd){let u=0,v=0;while(u===0)u=rnd();while(v===0)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

/* ── 그래프 만들기 · 전수조사 ─────────────────────── */
function makeGraph(n,deg,seed){
  const rnd=rngOf(seed), E=[], seen=new Set();
  const key=(i,j)=>Math.min(i,j)*64+Math.max(i,j);
  for(let i=0;i<n;i++){const j=(i+1)%n; E.push([i,j]); seen.add(key(i,j));}
  const want=n+Math.round(n*(deg-2)/2);
  let guard=0;
  while(E.length<want && guard++<4000){
    const i=Math.floor(rnd()*n), j=Math.floor(rnd()*n);
    if(i===j||seen.has(key(i,j))) continue;
    E.push([i,j]); seen.add(key(i,j));
  }
  return E;
}
function cutOf(E,s){let c=0;for(let e=0;e<E.length;e++){if(s[E[e][0]]!==s[E[e][1]])c++;}return c;}
function bruteCut(n,E){
  let best=0;
  const s=new Int8Array(n);
  for(let m=0;m<(1<<(n-1));m++){
    s[0]=1;
    for(let i=1;i<n;i++) s[i]=((m>>(i-1))&1)?1:-1;
    const c=cutOf(E,s);
    if(c>best) best=c;
  }
  return best;
}

/* ── 01 코히런트 이징 머신 ───────────────────────── */
const G1={n:8,E:[],opt:0,traj:[],frame:0,timer:null,stat:null};
function g1graph(){
  G1.E=makeGraph(G1.n,3,1234+G1.n);
  G1.opt=bruteCut(G1.n,G1.E);
  G1.stat=null;
  if(typeof onGraphChanged==='function') onGraphChanged();
}
function cimRun(n,E,p,K,sig,steps,rnd){
  const x=new Float64Array(n), f=new Float64Array(n), dt=0.03, traj=[], every=Math.max(1,Math.round(steps/70));
  for(let i=0;i<n;i++) x[i]=0.01*gauss(rnd);
  for(let t=0;t<steps;t++){
    f.fill(0);
    for(let e=0;e<E.length;e++){const a=E[e][0], b=E[e][1]; f[a]+=x[b]; f[b]+=x[a];}
    // 펌프를 0에서 p까지 천천히 올린다 (실제 CIM의 펌프 램프)
    const pt=p*Math.min(1,t/(steps*0.55));
    for(let i=0;i<n;i++){
      const xi=x[i];
      const dx=(pt-1-xi*xi)*xi - K*f[i] + sig*gauss(rnd);
      let nx=xi+dt*dx;
      if(nx>3)nx=3; else if(nx<-3)nx=-3;
      x[i]=nx;
    }
    if(t%every===0||t===steps-1) traj.push(Float64Array.from(x));
  }
  const s=new Int8Array(n);
  for(let i=0;i<n;i++) s[i]=x[i]>=0?1:-1;
  return {x:x,traj:traj,s:s,cut:cutOf(E,s)};
}
function p1(){return +$('c1p').value/100;}
function k1(){return +$('c1k').value/100;}
function z1(){return +$('c1z').value/1000;}
function r1labels(){
  $('o1p').textContent=fmt(p1(),2);
  $('o1k').textContent=fmt(k1(),2);
  $('o1z').textContent=fmt(z1(),3);
}
function r1(){
  r1labels();
  const n=G1.n, E=G1.E;
  const fr=G1.traj.length?G1.traj[clamp(G1.frame,0,G1.traj.length-1)]:new Float64Array(n);
  const s=new Int8Array(n);
  for(let i=0;i<n;i++) s[i]=fr[i]>=0?1:-1;
  const cut=cutOf(E,s);
  const cx=118, cy=132, R=92;
  const px=i=>cx+R*Math.cos(-Math.PI/2+2*Math.PI*i/n);
  const py=i=>cy+R*Math.sin(-Math.PI/2+2*Math.PI*i/n);
  let g='<text class="m" x="14" y="20" font-size="10">발진기 '+n+'개 · 간선 '+E.length+'개 — 색이 위상(0 / π)</text>';
  for(let e=0;e<E.length;e++){
    const a=E[e][0], b=E[e][1], isCut=s[a]!==s[b];
    g+='<line x1="'+fmt(px(a),1)+'" y1="'+fmt(py(a),1)+'" x2="'+fmt(px(b),1)+'" y2="'+fmt(py(b),1)+'" stroke="'+(isCut?'var(--probe)':'var(--rule)')+'" stroke-width="'+(isCut?2.1:1.1)+'" opacity="'+(isCut?0.95:0.5)+'"/>';
  }
  for(let i=0;i<n;i++){
    const amp=Math.min(1,Math.abs(fr[i])/1.1), rr=5+7*amp;
    const up=fr[i]>=0;
    g+='<circle cx="'+fmt(px(i),1)+'" cy="'+fmt(py(i),1)+'" r="'+fmt(rr,1)+'" fill="'+(up?'var(--beam)':'var(--warm)')+'" opacity="'+fmt(0.25+0.7*amp,2)+'" stroke="var(--panel)" stroke-width="1"/>';
  }
  g+='<text class="a" x="14" y="250" font-size="10">● 위상 0 (+1)</text>';
  g+='<text class="m" x="14" y="264" font-size="10" fill="var(--warm)">● 위상 π (−1)</text>';
  // 오른쪽: 진폭 궤적
  const X0=236, X1=430, Y0=40, Y1=210;
  g+='<rect class="gridl" x="'+X0+'" y="'+Y0+'" width="'+(X1-X0)+'" height="'+(Y1-Y0)+'" fill="none" stroke-width="1"/>';
  g+='<line class="gridl" x1="'+X0+'" y1="'+((Y0+Y1)/2)+'" x2="'+X1+'" y2="'+((Y0+Y1)/2)+'" stroke-width="1" stroke-dasharray="3 3"/>';
  g+='<text class="m" x="'+X0+'" y="32" font-size="10">발진기 진폭 xᵢ(t)</text>';
  g+='<text class="m" x="'+(X1+2)+'" y="'+((Y0+Y1)/2+3)+'" font-size="9" text-anchor="end">0</text>';
  if(G1.traj.length>1){
    const T=G1.traj.length, sx=t=>X0+(X1-X0)*t/(T-1), sy=v=>(Y0+Y1)/2-(Y1-Y0)/2*clamp(v/1.6,-1,1);
    for(let i=0;i<n;i++){
      let d='';
      for(let t=0;t<T;t++) d+=(t?'L':'M')+fmt(sx(t),1)+' '+fmt(sy(G1.traj[t][i]),1);
      g+='<path d="'+d+'" fill="none" stroke="'+(G1.traj[T-1][i]>=0?'var(--beam)':'var(--warm)')+'" stroke-width="1.2" opacity=".75"/>';
    }
    const mx=X0+(X1-X0)*clamp(G1.frame,0,T-1)/(T-1);
    g+='<line x1="'+fmt(mx,1)+'" y1="'+Y0+'" x2="'+fmt(mx,1)+'" y2="'+Y1+'" stroke="var(--probe)" stroke-width="1.4" opacity=".8"/>';
  }
  // 펌프 램프 표시
  g+='<text class="m" x="'+X0+'" y="230" font-size="9.5">펌프를 0 → p로 올리는 동안</text>';
  g+='<text class="m" x="'+X0+'" y="244" font-size="9.5">진폭이 ±로 갈라진다</text>';
  $('f1').innerHTML=g;
  // 라운드트립 산수 — 시간다중 CIM 가정: 펄스 슬롯 2.5 ns
  const slot=2.5, rt=n*slot, steps=400, total=rt*steps;
  let out='컷 <b>'+cut+'</b> / 최적 <b>'+G1.opt+'</b> ('+fmt(cut/G1.opt*100,1)+'%)<br>'+
    '이징 에너지 Σwᵢⱼsᵢsⱼ = <b>'+(E.length-2*cut)+'</b>';
  if(G1.stat) out+='<br><span style="color:var(--probe)">100회 중 최적 도달 '+G1.stat.hit+'회 · 평균 최적비 '+fmt(G1.stat.mean*100,1)+'%</span>';
  out+='<br><span style="color:var(--wall)">시간다중 가정(슬롯 2.5 ns): 라운드트립 '+fmt(rt,1)+' ns × '+steps+'바퀴 = '+fmt(total/1000,1)+' µs</span>';
  $('r1').innerHTML=out;
}
function r1animate(){
  if(G1.timer){clearInterval(G1.timer);G1.timer=null;}
  if(sleeping()) return;                                            // 숨은 동안엔 시작조차 안 한다
  const rnd=rngOf((Math.random()*1e9)|0);
  const res=cimRun(G1.n,G1.E,p1(),k1(),z1(),400,rnd);
  G1.traj=res.traj; G1.frame=0;
  G1.timer=setInterval(function(){
    if(sleeping()){clearInterval(G1.timer);G1.timer=null;return;}   // 섹션이 숨으면 적분 루프를 끊는다
    G1.frame++;
    if(G1.frame>=G1.traj.length){G1.frame=G1.traj.length-1;clearInterval(G1.timer);G1.timer=null;}
    r1();
  },28);
  r1();
}
function r1stats(){
  const rnd=rngOf(99991), p=p1(), K=k1(), z=z1();
  let hit=0, sum=0;
  for(let t=0;t<100;t++){
    const res=cimRun(G1.n,G1.E,p,K,z,400,rnd);
    if(res.cut>=G1.opt) hit++;
    sum+=res.cut/G1.opt;
  }
  G1.stat={hit:hit,mean:sum/100};
  r1();
}

/* ── 02 공간광 이징 머신 ─────────────────────────── */
const N2LIST=[200,500,1000,2500,5000,10000,20000,50000];
const G2={curve:[],iters:0,E0:0,E1:0,acc:0};
function spimRun(N,K,frames,rnd){
  // Mattis 결합: J_ij = (1/N) Σ_k ξ_i^k ξ_j^k , H = -(1/2N) Σ_k m_k²
  const xi=[];
  for(let k=0;k<K;k++){const v=new Int8Array(N);for(let i=0;i<N;i++)v[i]=rnd()<0.5?-1:1;xi.push(v);}
  const s=new Int8Array(N);
  for(let i=0;i<N;i++) s[i]=rnd()<0.5?-1:1;
  const m=new Float64Array(K);
  for(let k=0;k<K;k++){let a=0;const v=xi[k];for(let i=0;i<N;i++)a+=v[i]*s[i];m[k]=a;}
  const energy=()=>{let e=0;for(let k=0;k<K;k++)e+=m[k]*m[k];return -e/(2*N);};
  const E0=energy();
  const curve=[]; let acc=0;
  const maxb=Math.max(2,Math.ceil(N*0.12)+2);
  const flip=new Int32Array(maxb);
  for(let f=0;f<frames;f++){
    const prog=f/frames;
    const T=1.2*Math.exp(-4.0*prog)+0.004;              // 담금질 온도
    const nb=clamp(Math.round(N*0.12*(1-prog)*(1-prog)+1),1,maxb); // 뒤집는 덩어리 크기
    for(let b=0;b<nb;b++) flip[b]=Math.floor(rnd()*N);
    const before=energy();
    for(let b=0;b<nb;b++){const i=flip[b];for(let k=0;k<K;k++) m[k]-=2*xi[k][i]*s[i]; s[i]=-s[i];}
    const after=energy();                                // ← 광으로 한 프레임에 읽는 값
    const dE=after-before;
    if(dE<=0 || rnd()<Math.exp(-dE/T)){acc++;}
    else{for(let b=0;b<nb;b++){const i=flip[b];for(let k=0;k<K;k++) m[k]-=2*xi[k][i]*s[i]; s[i]=-s[i];}}
    if(f%Math.max(1,Math.round(frames/80))===0||f===frames-1) curve.push(energy());
  }
  return {curve:curve,E0:E0,E1:energy(),acc:acc/frames};
}
function r2labels(){
  $('o2n').textContent=N2LIST[+$('c2n').value].toLocaleString();
  $('o2k').textContent=+$('c2k').value;
  $('o2f').textContent=(+$('c2f').value/10)+' ms';
}
function r2(){
  r2labels();
  const N=N2LIST[+$('c2n').value], K=+$('c2k').value, fms=+$('c2f').value/10;
  const frames=G2.iters||1200;
  let g='<text class="m" x="14" y="20" font-size="10">SLM 한 장 = 스핀 '+N.toLocaleString()+'개 · 패턴 '+K+'장</text>';
  // SLM 모사 격자
  const px=7, cols=16, rows=12;
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
    const up=Math.sin(i*1.7+j*2.3+K)>0;
    g+='<rect x="'+(16+j*px)+'" y="'+(34+i*px)+'" width="'+(px-1)+'" height="'+(px-1)+'" fill="'+(up?'var(--beam)':'var(--warm)')+'" opacity=".55"/>';
  }
  g+='<text class="m" x="16" y="'+(34+rows*px+14)+'" font-size="9.5">(일부만 표시)</text>';
  g+='<path class="bm" stroke-width="1.6" opacity=".45" d="M138 70 L186 76 M138 90 L186 76 M138 50 L186 76"/>';
  g+='<circle class="pdf" cx="194" cy="76" r="7" opacity=".85"/>';
  g+='<text class="p" x="206" y="72" font-size="10">세기 1점</text>';
  g+='<text class="m" x="206" y="86" font-size="9.5">= 에너지 전체</text>';
  // 에너지 하강 곡선
  const X0=150, X1=430, Y0=120, Y1=228;
  g+='<rect class="gridl" x="'+X0+'" y="'+Y0+'" width="'+(X1-X0)+'" height="'+(Y1-Y0)+'" fill="none" stroke-width="1"/>';
  g+='<text class="m" x="'+X0+'" y="112" font-size="10">스핀당 에너지 (프레임 수에 따라)</text>';
  if(G2.curve.length>1){
    const C=G2.curve, lo=Math.min.apply(null,C), hi=Math.max.apply(null,C), sp=(hi-lo)||1;
    const sx=t=>X0+(X1-X0)*t/(C.length-1);
    let d='';
    for(let t=0;t<C.length;t++){
      const y=Y1-(Y1-Y0)*(C[t]-lo)/sp;
      d+=(t?'L':'M')+fmt(sx(t),1)+' '+fmt(y,1);
    }
    g+='<path d="'+d+'" fill="none" stroke="var(--beam)" stroke-width="1.8"/>';
    g+='<text class="m" x="'+(X0+3)+'" y="'+(Y0+12)+'" font-size="9">'+fmt(hi/N,4)+' (시작)</text>';
    g+='<text class="m" x="'+(X0+3)+'" y="'+(Y1-5)+'" font-size="9">'+fmt(lo/N,4)+' (바닥)</text>';
    g+='<text class="m" x="'+(X1-4)+'" y="'+(Y1+14)+'" font-size="9" text-anchor="end">'+frames+' 프레임</text>';
  }else{
    g+='<text class="m" x="'+(X0+10)+'" y="'+((Y0+Y1)/2)+'" font-size="10">「담금질 돌리기」를 눌러라</text>';
  }
  g+='<text class="m" x="14" y="250" font-size="10">한 프레임 = 설정 한 번 올리고 에너지 한 번 읽기</text>';
  g+='<text class="m" x="14" y="264" font-size="10">N이 커질수록 같은 프레임 수로는 덜 내려간다 — 그게 진짜 벽이다</text>';
  $('f2').innerHTML=g;
  const wall=frames*fms;
  let out;
  if(G2.curve.length>1){
    const reach=G2.E1/N/(-0.5)*100;   // 패턴 하나에 완전 정렬 = -0.50 (달성 가능한 바닥)
    out='스핀당 에너지 <b>'+fmt(G2.E0/N,5)+'</b> → <b>'+fmt(G2.E1/N,5)+'</b><br>'+
      '정렬 바닥(−0.50) 대비 <b>'+fmt(reach,1)+'%</b> · 수락률 <b>'+fmt(G2.acc*100,1)+'%</b>';
  }else{
    out='아직 안 돌렸다';
  }
  out+='<br><span style="color:var(--wall)">프레임 '+fms+' ms × '+frames+'장 = <b>'+fmt(wall/1000,2)+' s</b></span>'+
    '<br>프레임 한 장 값은 N과 무관하다 — 그런데 N을 키우면 같은 1200장으로 훨씬 덜 내려간다. N을 옮겨보면 그게 바로 보인다.';
  $('r2').innerHTML=out;
}
function r2run(){
  const N=N2LIST[+$('c2n').value], K=+$('c2k').value;
  const rnd=rngOf((Math.random()*1e9)|0);
  const res=spimRun(N,K,1200,rnd);
  G2.curve=res.curve; G2.iters=1200; G2.E0=res.E0; G2.E1=res.E1; G2.acc=res.acc;
  r2();
}

/* ── 03 리커런트 샘플러 ──────────────────────────── */
const N3=10;
const G3={E:makeGraph(N3,3,777),hist:null,exact:null,ov:true,ess:0};
function exactDist(beta){
  // 1024 상태 전수조사 → 컷 값별 볼츠만 확률
  const E=G3.E, M=E.length, w=new Float64Array(M+1), s=new Int8Array(N3);
  let Z=0;
  for(let m=0;m<(1<<N3);m++){
    for(let i=0;i<N3;i++) s[i]=((m>>i)&1)?1:-1;
    const c=cutOf(E,s);
    const H=M-2*c;                 // 이징 에너지
    const p=Math.exp(-beta*H);
    w[c]+=p; Z+=p;
  }
  for(let c=0;c<=M;c++) w[c]/=Z;
  return w;
}
function glauber(beta,samples,rnd){
  const E=G3.E, M=E.length;
  const adj=[]; for(let i=0;i<N3;i++) adj.push([]);
  for(let e=0;e<M;e++){adj[E[e][0]].push(E[e][1]); adj[E[e][1]].push(E[e][0]);}
  const s=new Int8Array(N3);
  for(let i=0;i<N3;i++) s[i]=rnd()<0.5?-1:1;
  const hist=new Float64Array(M+1);
  const burn=200*N3;
  const total=burn+samples*N3;
  for(let t=0;t<total;t++){
    const i=Math.floor(rnd()*N3);
    let h=0; const a=adj[i];
    for(let q=0;q<a.length;q++) h+=s[a[q]];
    // P(s_i=+1) = 1/(1+exp(2βh))  — H = Σ_edge s_i s_j 를 낮추는 방향
    s[i] = (rnd() < 1/(1+Math.exp(2*beta*h))) ? 1 : -1;
    if(t>=burn && (t-burn)%N3===0) hist[cutOf(E,s)]++;
  }
  let tot=0; for(let c=0;c<=M;c++) tot+=hist[c];
  for(let c=0;c<=M;c++) hist[c]/=tot;
  return hist;
}
function beta3(){return 1/(+$('c3z').value/10);}
function r3labels(){
  $('o3z').textContent=fmt(+$('c3z').value/10,1);
  $('o3m').textContent=(+$('c3m').value).toLocaleString();
}
function r3(){
  r3labels();
  const E=G3.E, M=E.length, beta=beta3();
  const h=G3.hist, ex=G3.exact;
  let g='<text class="m" x="14" y="20" font-size="10">같은 10노드 그래프를 '+(+$('c3m').value).toLocaleString()+'번 읽은 결과</text>';
  const X0=34, X1=424, Y0=42, Y1=196;
  g+='<line class="gridl" x1="'+X0+'" y1="'+Y1+'" x2="'+X1+'" y2="'+Y1+'" stroke-width="1"/>';
  g+='<line class="gridl" x1="'+X0+'" y1="'+Y0+'" x2="'+X0+'" y2="'+Y1+'" stroke-width="1"/>';
  const cLo=Math.max(0,Math.floor(M*0.35)), cHi=M;
  const nb=cHi-cLo+1, bw=(X1-X0)/nb;
  let pmax=0.08;
  if(h) for(let c=cLo;c<=cHi;c++) pmax=Math.max(pmax,h[c]);
  if(ex&&G3.ov) for(let c=cLo;c<=cHi;c++) pmax=Math.max(pmax,ex[c]);
  pmax*=1.12;
  if(h){
    for(let c=cLo;c<=cHi;c++){
      const x=X0+(c-cLo)*bw, hh=(Y1-Y0)*h[c]/pmax;
      const isOpt=(c===G3.opt);
      g+='<rect x="'+fmt(x+bw*0.14,1)+'" y="'+fmt(Y1-hh,1)+'" width="'+fmt(bw*0.72,1)+'" height="'+fmt(hh,1)+'" fill="'+(isOpt?'var(--beam)':'var(--probe)')+'" opacity="'+(isOpt?0.85:0.55)+'"/>';
      if(nb<=14||c%2===0) g+='<text class="m" x="'+fmt(x+bw/2,1)+'" y="'+(Y1+13)+'" font-size="9" text-anchor="middle">'+c+'</text>';
    }
  }
  if(ex&&G3.ov){
    let d='';
    for(let c=cLo;c<=cHi;c++){
      const x=X0+(c-cLo)*bw+bw/2, y=Y1-(Y1-Y0)*ex[c]/pmax;
      d+=(d?'L':'M')+fmt(x,1)+' '+fmt(y,1);
    }
    g+='<path d="'+d+'" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="4 3" opacity=".8"/>';
    for(let c=cLo;c<=cHi;c++){
      const x=X0+(c-cLo)*bw+bw/2, y=Y1-(Y1-Y0)*ex[c]/pmax;
      g+='<circle cx="'+fmt(x,1)+'" cy="'+fmt(y,1)+'" r="2.2" fill="var(--ink)" opacity=".8"/>';
    }
    g+='<text class="i" x="'+(X1-4)+'" y="'+(Y0+2)+'" font-size="9.5" text-anchor="end">--- 전수조사 볼츠만</text>';
  }
  g+='<text class="m" x="'+((X0+X1)/2)+'" y="'+(Y1+26)+'" font-size="10" text-anchor="middle">컷 값 (오른쪽이 좋은 해 · 최적 '+G3.opt+')</text>';
  g+='<text class="m" x="14" y="'+(Y0-10)+'" font-size="10">빈도</text>';
  g+='<text class="m" x="14" y="244" font-size="10">잡음을 줄이면(σ↓) 막대가 오른쪽 끝으로 몰린다 — 그게 1·2가 하는 일이다.</text>';
  g+='<text class="m" x="14" y="260" font-size="10">잡음을 키우면 퍼진다. 어느 쪽이 쓸모 있는지는 문제가 정한다.</text>';
  $('f3').innerHTML=g;
  if(h){
    let best=cLo, hsum=0, mean=0;
    for(let c=0;c<=M;c++){if(h[c]>h[best])best=c; if(h[c]>0) hsum-=h[c]*Math.log2(h[c]); mean+=c*h[c];}
    let tv=0;
    if(ex) for(let c=0;c<=M;c++) tv+=Math.abs(h[c]-ex[c]);
    $('r3').innerHTML='최빈 컷 <b>'+best+'</b> · 평균 <b>'+fmt(mean,2)+'</b> · 최적('+G3.opt+') 비율 <b>'+fmt(h[G3.opt]*100,1)+'%</b><br>'+
      '분포 엔트로피 <b>'+fmt(hsum,2)+'</b> bit · β = 1/σ = <b>'+fmt(beta,3)+'</b> (무차원 · 소자 교정은 미확인)'+
      (ex?'<br>이론값과의 거리 (총변동) <b>'+fmt(tv/2,3)+'</b> — 0에 가까울수록 진짜 볼츠만을 뽑은 것':'');
  }
}
function r3run(){
  const beta=beta3(), m=+$('c3m').value;
  const rnd=rngOf((Math.random()*1e9)|0);
  G3.hist=glauber(beta,m,rnd);
  G3.exact=exactDist(beta);
  r3();
}


/* ══ 01 걸어보기 — 여섯 단계 ══════════════════════ */
const WN=[100,500,2000,10000,50000,100512];      // 스핀 수 눈금
const VFIB=2.9979e8/1.468;                        // 석영 섬유 속 빛의 속도 m/s
let walkReady=false, wstep=1;
const W2={last:null,plus:0,minus:0}, W5={scan:null}, W6={p:null,n:0};

function jacobiEig(Ain,n){            // 대칭행렬 고유분해 (야코비 회전)
  const A=[]; for(let i=0;i<n;i++) A.push(Float64Array.from(Ain[i]));
  const V=[]; for(let i=0;i<n;i++){const r=new Float64Array(n); r[i]=1; V.push(r);}
  for(let sweep=0;sweep<80;sweep++){
    let off=0;
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) off+=A[i][j]*A[i][j];
    if(off<1e-22) break;
    for(let q1=0;q1<n;q1++) for(let q2=q1+1;q2<n;q2++){
      if(Math.abs(A[q1][q2])<1e-15) continue;
      const th=(A[q2][q2]-A[q1][q1])/(2*A[q1][q2]);
      const t=(th>=0?1:-1)/(Math.abs(th)+Math.sqrt(th*th+1));
      const c=1/Math.sqrt(t*t+1), sn=t*c;
      for(let k=0;k<n;k++){const a=A[k][q1],b=A[k][q2];A[k][q1]=c*a-sn*b;A[k][q2]=sn*a+c*b;}
      for(let k=0;k<n;k++){const a=A[q1][k],b=A[q2][k];A[q1][k]=c*a-sn*b;A[q2][k]=sn*a+c*b;}
      for(let k=0;k<n;k++){const a=V[k][q1],b=V[k][q2];V[k][q1]=c*a-sn*b;V[k][q2]=sn*a+c*b;}
    }
  }
  const ev=[];
  for(let i=0;i<n;i++){const vec=[];for(let k=0;k<n;k++)vec.push(V[k][i]);ev.push({val:A[i][i],vec:vec});}
  ev.sort(function(a,b){return a.val-b.val;});
  return ev;
}
function adjOf(n,E){
  const J=[]; for(let i=0;i<n;i++) J.push(new Float64Array(n));
  for(let e=0;e<E.length;e++){const a=E[e][0],b=E[e][1];J[a][b]=1;J[b][a]=1;}
  return J;
}
function axes(X0,Y0,X1,Y1){
  return '<line class="gridl" x1="'+X0+'" y1="'+Y1+'" x2="'+X1+'" y2="'+Y1+'" stroke-width="1"/>'+
         '<line class="gridl" x1="'+X0+'" y1="'+Y0+'" x2="'+X0+'" y2="'+Y1+'" stroke-width="1"/>';
}

/* ── 1단계: 고리와 펄스 열 ──────────────────────── */
function rw1(){
  const L=+$('wc1L').value/10, N=WN[+$('wc1N').value];
  $('wo1L').textContent=fmt(L,1)+' km';
  $('wo1N').textContent=N.toLocaleString();
  const Trt=L*1000/VFIB, slot=Trt/N, rate=1/slot;
  const st=slot>=1e-9?fmt(slot*1e9,2)+' ns':fmt(slot*1e12,1)+' ps';
  const rt=rate>=1e9?fmt(rate/1e9,2)+' GHz':fmt(rate/1e6,0)+' MHz';
  let g='<text class="m" x="14" y="20" font-size="10">섬유 고리 '+fmt(L,1)+' km — 펄스가 줄지어 돈다 (36개만 표시)</text>';
  const cx=118, cy=118, R=76;
  g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="var(--rule)" stroke-width="7"/>';
  for(let i=0;i<36;i++){
    const a=-Math.PI/2+2*Math.PI*i/36;
    g+='<circle cx="'+fmt(cx+R*Math.cos(a),1)+'" cy="'+fmt(cy+R*Math.sin(a),1)+'" r="3.1" fill="'+(i%2?'var(--beam)':'var(--warm)')+'" opacity=".9"/>';
  }
  g+='<rect class="pd" x="'+(cx-14)+'" y="'+(cy+R-9)+'" width="28" height="18" rx="3" stroke-width="1.3" fill="var(--panel)"/>';
  g+='<text class="p" x="'+cx+'" y="'+(cy+R+4)+'" font-size="9" text-anchor="middle">검출</text>';
  g+='<text class="m" x="'+cx+'" y="'+cy+'" font-size="10" text-anchor="middle">N = '+N.toLocaleString()+'</text>';
  g+='<text class="m" x="'+cx+'" y="'+(cy+14)+'" font-size="9" text-anchor="middle">스핀</text>';
  const X0=232,Y=66;
  g+='<text class="m" x="'+X0+'" y="40" font-size="10">시간축에 펼치면</text>';
  for(let i=0;i<9;i++){
    const x=X0+i*22;
    g+='<line x1="'+x+'" y1="'+Y+'" x2="'+x+'" y2="'+(Y+22)+'" stroke="var(--beam)" stroke-width="2.4" opacity=".85"/>';
  }
  g+='<path class="pd" d="M'+X0+' '+(Y+34)+' H'+(X0+22)+'" stroke-width="1.2"/>';
  g+='<text class="p" x="'+(X0+26)+'" y="'+(Y+38)+'" font-size="9">슬롯 '+st+'</text>';
  g+='<text class="m" x="'+X0+'" y="'+(Y+62)+'" font-size="10">한 바퀴 = '+fmt(Trt*1e6,2)+' µs</text>';
  g+='<text class="m" x="'+X0+'" y="'+(Y+78)+'" font-size="10">= 슬롯 '+N.toLocaleString()+'개</text>';
  const hot=rate>1e10;
  g+='<text class="'+(hot?'a':'m')+'" x="'+X0+'" y="'+(Y+100)+'" font-size="10">반복률 '+rt+'</text>';
  if(hot) g+='<text class="a" x="'+X0+'" y="'+(Y+114)+'" font-size="9">변조기 대역 밖 — 고리를 늘려라</text>';
  $('wf1').innerHTML=g;
  $('wr1').innerHTML='라운드트립 <b>'+fmt(Trt*1e6,2)+' µs</b> · 슬롯 <b>'+st+'</b><br>'+
    '펄스 반복률 <b>'+rt+'</b>'+(hot?' <span style="color:var(--beam)">— 현실 변조기 대역(~10 GHz) 밖</span>':'')+
    '<br><span style="color:var(--wall)">위 시뮬의 「슬롯 2.5 ns」는 1 km · 2000스핀에 해당한다</span>';
}

/* ── 2단계: 갈래질 ──────────────────────────────── */
function dopoRun(p,sig,rnd){
  let x=0.001*gauss(rnd); const dt=0.02, tr=[];
  for(let t=0;t<600;t++){
    x+=dt*((p-1-x*x)*x + sig*gauss(rnd));
    if(x>3)x=3; else if(x<-3)x=-3;
    if(t%10===0) tr.push(x);
  }
  return {x:x,tr:tr};
}
function rw2(){
  const p=+$('wc2p').value/100, sig=+$('wc2z').value/1000;
  $('wo2p').textContent=fmt(p,2); $('wo2z').textContent=fmt(sig,3);
  const X0=40,X1=250,Y0=28,Y1=150, mid=(Y0+Y1)/2;
  const px=v=>X0+(X1-X0)*v/2.5, py=v=>mid-((Y1-Y0)/2)*(v/1.6);
  let g=axes(X0,Y0,X1,Y1);
  g+='<line class="gridl" x1="'+X0+'" y1="'+mid+'" x2="'+X1+'" y2="'+mid+'" stroke-width="1" stroke-dasharray="3 3"/>';
  g+='<text class="m" x="'+X0+'" y="20" font-size="10">고정점 x* vs 펌프 p</text>';
  let up='',dn='';
  for(let i=0;i<=120;i++){
    const pp=1+1.5*i/120, v=Math.sqrt(pp-1);
    up+=(i?'L':'M')+fmt(px(pp),1)+' '+fmt(py(v),1);
    dn+=(i?'L':'M')+fmt(px(pp),1)+' '+fmt(py(-v),1);
  }
  g+='<path d="M'+px(0)+' '+py(0)+' H'+px(1)+'" fill="none" stroke="var(--muted)" stroke-width="1.6" opacity=".7"/>';
  g+='<path d="'+up+'" fill="none" stroke="var(--beam)" stroke-width="1.8"/>';
  g+='<path d="'+dn+'" fill="none" stroke="var(--warm)" stroke-width="1.8"/>';
  g+='<line x1="'+fmt(px(p),1)+'" y1="'+Y0+'" x2="'+fmt(px(p),1)+'" y2="'+Y1+'" stroke="var(--probe)" stroke-width="1.4" opacity=".85"/>';
  g+='<text class="m" x="'+px(1)+'" y="'+(Y1+13)+'" font-size="9" text-anchor="middle">문턱 p=1</text>';
  if(W2.last){
    const T=W2.last.tr.length, Z0=272,Z1=430;
    g+=axes(Z0,Y0,Z1,Y1);
    g+='<line class="gridl" x1="'+Z0+'" y1="'+mid+'" x2="'+Z1+'" y2="'+mid+'" stroke-width="1" stroke-dasharray="3 3"/>';
    g+='<text class="m" x="'+Z0+'" y="20" font-size="10">이번에 켠 발진기</text>';
    let d='';
    for(let t=0;t<T;t++) d+=(t?'L':'M')+fmt(Z0+(Z1-Z0)*t/(T-1),1)+' '+fmt(py(W2.last.tr[t]),1);
    g+='<path d="'+d+'" fill="none" stroke="'+(W2.last.x>=0?'var(--beam)':'var(--warm)')+'" stroke-width="1.8"/>';
    g+='<text x="'+Z0+'" y="'+(Y1+14)+'" font-size="10" fill="'+(W2.last.x>=0?'var(--beam)':'var(--warm)')+'">위상 '+(W2.last.x>=0?'0 (+1)':'π (−1)')+'</text>';
  }
  g+='<text class="m" x="14" y="176" font-size="10">같은 설정으로 다시 켜면 다른 쪽으로 갈 수 있다 — 잡음이 정한다.</text>';
  g+='<text class="m" x="14" y="192" font-size="10">이 동전 던지기가 스핀의 자유도다.</text>';
  $('wf2').innerHTML=g;
  const tot=W2.plus+W2.minus;
  let out = p>1 ? '고정점 <b>±'+fmt(Math.sqrt(p-1),3)+'</b> (문턱 위 — 발진한다)'
                : '고정점 <b>0</b> 하나 (문턱 아래 — 안 켜진다)';
  if(W2.last) out+='<br>이번 결과 <b>'+(W2.last.x>=0?'위상 0 (+1)':'위상 π (−1)')+'</b> · 진폭 '+fmt(Math.abs(W2.last.x),3);
  if(tot) out+='<br>누적 <b>'+W2.plus+' : '+W2.minus+'</b> (+ : −) — '+fmt(W2.plus/tot*100,0)+' : '+fmt(W2.minus/tot*100,0);
  $('wr2').innerHTML=out;
}

/* ── 3단계: 측정-피드백 처리량 ──────────────────── */
function rw3(){
  const N=WN[+$('wc3N').value], L=+$('wc3L').value/10, F=+$('wc3F').value;
  $('wo3N').textContent=N.toLocaleString(); $('wo3L').textContent=fmt(L,1)+' km'; $('wo3F').textContent=F+' TMAC/s';
  const Trt=L*1000/VFIB, need=N*N/Trt, have=F*1e12, slack=have/need;
  let g='<text class="m" x="14" y="20" font-size="10">라운드트립 한 번에 N² = '+(N*N).toLocaleString()+'번 곱해야 한다</text>';
  const bx=[[20,'펄스',56],[90,'검출·ADC',76],[180,'FPGA',56],[250,'DAC·변조',72],[336,'다시 고리',68]];
  for(let i=0;i<bx.length;i++){
    const x=bx[i][0], w=bx[i][2];
    g+='<rect class="box" x="'+x+'" y="40" width="'+w+'" height="30" rx="5" stroke-width="1.2"/>';
    g+='<text class="i" x="'+(x+w/2)+'" y="59" font-size="9.5" text-anchor="middle">'+bx[i][1]+'</text>';
    if(i<bx.length-1) g+='<path class="bm" stroke-width="1.6" opacity=".6" d="M'+(x+w+2)+' 55 H'+(bx[i+1][0]-3)+'"/>';
  }
  g+='<path class="pd" stroke-width="1.3" stroke-dasharray="4 3" d="M404 70 V88 H48 V72"/>';
  g+='<text class="m" x="210" y="102" font-size="9.5" text-anchor="middle">이 한 바퀴가 '+fmt(Trt*1e6,2)+' µs 안에 끝나야 한다</text>';
  const X0=30,X1=420,Y=132,H=20;
  const lg=v=>Math.log10(Math.max(v,1e9));
  const lo=9, hi=Math.max(lg(need),lg(have),13)+0.4;
  const bar=v=>(X1-X0)*(lg(v)-lo)/(hi-lo);
  g+='<text class="m" x="'+X0+'" y="'+(Y-6)+'" font-size="9.5">필요 '+fmt(need/1e12,2)+' TMAC/s</text>';
  g+='<rect x="'+X0+'" y="'+Y+'" width="'+fmt(Math.max(2,bar(need)),1)+'" height="'+H+'" rx="2" fill="var(--beam)" opacity=".8"/>';
  g+='<text class="m" x="'+X0+'" y="'+(Y+H+16)+'" font-size="9.5">가용 '+F+' TMAC/s</text>';
  g+='<rect x="'+X0+'" y="'+(Y+H+22)+'" width="'+fmt(Math.max(2,bar(have)),1)+'" height="'+H+'" rx="2" fill="var(--probe)" opacity=".8"/>';
  g+='<text class="m" x="14" y="200" font-size="10">가로축은 로그다. N을 10배 하면 필요량이 100배 뛴다.</text>';
  $('wf3').innerHTML=g;
  $('wr3').innerHTML='필요 <b>'+fmt(need/1e12,2)+' TMAC/s</b> · 가용 <b>'+F+' TMAC/s</b> · 여유 <b>'+fmt(slack,2)+'배</b><br>'+
    (slack>=1?'<span style="color:var(--probe)">돈다 — 되먹임이 라운드트립 안에 들어온다</span>'
             :'<span style="color:var(--wall)">못 돈다 — 고리를 '+fmt(1/slack,1)+'배 늘리거나 결합을 성기게 해야 한다</span>')+
    '<br>N을 2배 하면 필요량은 4배다 (N² 곱셈)';
}

/* ── 4단계: 모드 경쟁 ───────────────────────────── */
function rw4(){
  const p=+$('wc4p').value/100, K=+$('wc4K').value/100, n=G1.n;
  $('wo4p').textContent=fmt(p,2); $('wo4K').textContent=fmt(K,2);
  const ev=jacobiEig(adjOf(n,G1.E),n);
  const gr=ev.map(function(e){return (p-1)-K*e.val;});
  let over=0; for(let i=0;i<n;i++) if(gr[i]>0) over++;
  const X0=34,X1=428,Y0=36,Y1=150, mid=(Y0+Y1)/2;
  let g='<text class="m" x="14" y="20" font-size="10">모드별 성장률 (p−1) − K·λₖ — 0을 넘은 모드가 켜진다</text>';
  g+='<line class="gridl" x1="'+X0+'" y1="'+mid+'" x2="'+X1+'" y2="'+mid+'" stroke-width="1.2"/>';
  const bw=(X1-X0)/n, amp=Math.max(0.35,Math.max.apply(null,gr.map(Math.abs)));
  for(let i=0;i<n;i++){
    const h=(mid-Y0)*gr[i]/amp, x=X0+i*bw;
    g+='<rect x="'+fmt(x+bw*0.16,1)+'" y="'+fmt(gr[i]>=0?mid-h:mid,1)+'" width="'+fmt(bw*0.68,1)+'" height="'+fmt(Math.abs(h),1)+'" fill="'+(gr[i]>0?(i===0?'var(--beam)':'var(--probe)'):'var(--rule)')+'" opacity="'+(gr[i]>0?0.88:0.6)+'"/>';
  }
  g+='<text class="m" x="'+X0+'" y="'+(Y1+14)+'" font-size="9">λ 작은 모드</text>';
  g+='<text class="m" x="'+X1+'" y="'+(Y1+14)+'" font-size="9" text-anchor="end">λ 큰 모드</text>';
  g+='<text class="m" x="'+X0+'" y="'+(mid-4)+'" font-size="9">0</text>';
  if(over===1) g+='<text class="a" x="14" y="180" font-size="10">모드 하나만 켜졌다 — 경쟁이 깨끗하다. 이게 「천천히」가 만드는 상태다.</text>';
  else if(over===0) g+='<text class="m" x="14" y="180" font-size="10">아직 아무 모드도 문턱을 못 넘었다. 펌프를 올려라.</text>';
  else g+='<text x="14" y="180" font-size="10" fill="var(--wall)">'+over+'개 모드가 한꺼번에 켜졌다 — 섞인다. 펌프를 너무 올린 것이다.</text>';
  g+='<text class="m" x="14" y="196" font-size="10">첫 모드 문턱 p = 1 + K·λmin = '+fmt(1+K*ev[0].val,3)+'</text>';
  $('wf4').innerHTML=g;
  $('wr4').innerHTML='λmin <b>'+fmt(ev[0].val,3)+'</b> · 그 모드의 문턱 <b>p = '+fmt(1+K*ev[0].val,3)+'</b><br>'+
    '지금 문턱 넘은 모드 <b>'+over+'</b> / '+n+' 개'+
    (over===1?' — 깨끗함':(over>1?' <span style="color:var(--wall)">— 여러 모드가 섞인다</span>':''));
}

/* ── 5단계: 연속 완화 해를 반올림하면 ───────────── */
function rw5(){
  const n=G1.n, ev=jacobiEig(adjOf(n,G1.E),n), v=ev[0].vec;
  const sg=new Int8Array(n); for(let i=0;i<n;i++) sg[i]=v[i]>=0?1:-1;
  const spec=cutOf(G1.E,sg), opt=G1.opt;
  const mag=v.map(Math.abs), sorted=mag.slice().sort(function(a,b){return a-b;});
  const med=sorted[Math.floor(n/2)], mx=sorted[n-1];
  const X0=34,X1=428,Y0=40,Y1=132;
  let g='<text class="m" x="14" y="20" font-size="10">최소 고유벡터의 성분 |vᵢ| — 길이가 제각각인 게 진폭 비균일이다</text>';
  g+='<line class="gridl" x1="'+X0+'" y1="'+Y1+'" x2="'+X1+'" y2="'+Y1+'" stroke-width="1"/>';
  const bw=(X1-X0)/n, top=Math.max.apply(null,mag)||1;
  for(let i=0;i<n;i++){
    const h=(Y1-Y0)*mag[i]/top, x=X0+i*bw;
    g+='<rect x="'+fmt(x+bw*0.16,1)+'" y="'+fmt(Y1-h,1)+'" width="'+fmt(bw*0.68,1)+'" height="'+fmt(h,1)+'" fill="'+(v[i]>=0?'var(--beam)':'var(--warm)')+'" opacity=".85"/>';
  }
  g+='<text class="m" x="'+X0+'" y="'+(Y1+14)+'" font-size="9">빨강 = 부호 +, 주황 = 부호 −</text>';
  g+='<text class="m" x="14" y="162" font-size="10">부호만 남기고 길이를 버리면 ±1 해가 된다 — 그게 반올림이다.</text>';
  g+='<text x="14" y="180" font-size="10" fill="'+(spec>=opt?'var(--probe)':'var(--beam)')+'">반올림 컷 '+spec+' vs 전수조사 최적 '+opt+(spec>=opt?' — 이 그래프는 맞았다':' — 어긋난다')+'</text>';
  g+='<text class="m" x="14" y="196" font-size="10">한 그래프로는 못 정한다. 옆 버튼으로 60개를 돌려봐라.</text>';
  $('wf5').innerHTML=g;
  let out='가장 큰 성분이 중앙값의 <b>'+fmt(mx/Math.max(med,1e-12),1)+'배</b> — 모든 발진기가 같은 세기로 켜지지 않는다<br>'+
    '반올림 해의 컷 <b>'+spec+'</b> / 최적 <b>'+opt+'</b> ('+fmt(spec/opt*100,1)+'%)';
  if(W5.scan) out+='<br><span style="color:var(--wall)">'+W5.scan.n+'노드 그래프 '+W5.scan.tot+'개: 최적 적중 <b>'+fmt(W5.scan.hit/W5.scan.tot*100,0)+'%</b> · 평균 최적비 '+fmt(W5.scan.mean*100,1)+'%</span>';
  $('wr5').innerHTML=out;
}
function rw5scan(){
  const n=G1.n; let hit=0,sum=0,tot=0;
  for(let seed=0;seed<60;seed++){
    const E=makeGraph(n,3,seed*77+5);
    const lo=jacobiEig(adjOf(n,E),n)[0];
    const sg=new Int8Array(n); for(let i=0;i<n;i++) sg[i]=lo.vec[i]>=0?1:-1;
    const best=bruteCut(n,E), c=cutOf(E,sg);
    tot++; sum+=c/best; if(c>=best) hit++;
  }
  W5.scan={n:n,hit:hit,tot:tot,mean:sum/tot};
  rw5();
}

/* ── 6단계: 반복과 풀이 시간 ────────────────────── */
function rw6(){
  const R=+$('wc6R').value;
  $('wo6R').textContent=R+' 회';
  const ph=W6.p;
  const X0=40,X1=428,Y0=34,Y1=146;
  let g=axes(X0,Y0,X1,Y1);
  g+='<text class="m" x="14" y="20" font-size="10">R번 돌려서 한 번이라도 최적에 닿을 확률 = 1 − (1−p)ᴿ</text>';
  if(ph!=null && ph>0 && ph<1){
    let d='';
    for(let i=0;i<=200;i++){
      const y=1-Math.pow(1-ph,i+1);
      d+=(i?'L':'M')+fmt(X0+(X1-X0)*i/200,1)+' '+fmt(Y1-(Y1-Y0)*y,1);
    }
    g+='<path d="'+d+'" fill="none" stroke="var(--beam)" stroke-width="1.8"/>';
    const y99=Y1-(Y1-Y0)*0.99;
    g+='<line class="gridl" x1="'+X0+'" y1="'+fmt(y99,1)+'" x2="'+X1+'" y2="'+fmt(y99,1)+'" stroke-width="1" stroke-dasharray="4 3"/>';
    g+='<text class="m" x="'+(X1-2)+'" y="'+fmt(y99-4,1)+'" font-size="9" text-anchor="end">99%</text>';
    const cum=1-Math.pow(1-ph,R), mx=X0+(X1-X0)*(R-1)/200;
    g+='<line x1="'+fmt(mx,1)+'" y1="'+Y0+'" x2="'+fmt(mx,1)+'" y2="'+Y1+'" stroke="var(--probe)" stroke-width="1.4" opacity=".85"/>';
    g+='<circle cx="'+fmt(mx,1)+'" cy="'+fmt(Y1-(Y1-Y0)*cum,1)+'" r="3.4" fill="var(--probe)"/>';
    g+='<text class="m" x="'+X0+'" y="'+(Y1+14)+'" font-size="9">1회</text>';
    g+='<text class="m" x="'+X1+'" y="'+(Y1+14)+'" font-size="9" text-anchor="end">200회</text>';
  }else{
    g+='<text class="m" x="'+(X0+12)+'" y="'+((Y0+Y1)/2)+'" font-size="10">'+(ph==null?'「1회 성공률 재보기」를 눌러라':'곡선을 그릴 수 없는 값이다 (p='+fmt(ph,2)+')')+'</text>';
  }
  g+='<text class="m" x="14" y="176" font-size="10">라운드트립을 아무리 줄여도 이 곡선이 완만하면 시간은 안 줄어든다.</text>';
  g+='<text class="m" x="14" y="192" font-size="10">CIM의 풀이 시간을 정하는 건 한 바퀴가 아니라 반복 횟수다.</text>';
  $('wf6').innerHTML=g;
  if(ph==null){ $('wr6').innerHTML='아직 안 쟀다 — 위 버튼을 눌러라'; return; }
  const slot=2.45e-9, steps=400, Trt=G1.n*slot;
  let out='1회 성공률 <b>'+fmt(ph*100,0)+'%</b> ('+W6.n+'노드 그래프, 100회 실측)<br>'+
    R+'회 누적 <b>'+fmt((1-Math.pow(1-ph,R))*100,2)+'%</b>';
  if(ph>=1) out+='<br>R₉₉ = <b>1회</b> — 이 설정에선 한 번에 닿는다';
  else if(ph<=0) out+='<br><span style="color:var(--wall)">100회 모두 실패 — 이 설정으로는 안 풀린다</span>';
  else{
    const R99=Math.ceil(Math.log(0.01)/Math.log(1-ph));
    const tts=R99*steps*Trt;
    out+='<br>R₉₉ = <b>'+R99+'회</b> · 풀이 시간 <b>'+fmt(tts*1e6,1)+' µs</b> (슬롯 2.45 ns · 400바퀴 기준)';
  }
  $('wr6').innerHTML=out;
}
function rw6measure(){
  const rnd=rngOf(20260018);
  let hit=0;
  for(let t=0;t<100;t++) if(cimRun(G1.n,G1.E,p1(),k1(),z1(),400,rnd).cut>=G1.opt) hit++;
  W6.p=hit/100; W6.n=G1.n;
  rw6();
}

/* ── 단계 전환 · 묶기 ───────────────────────────── */
const WR=[null,rw1,rw2,rw3,rw4,rw5,rw6];
function wshow(n){
  wstep=clamp(n,1,6);
  for(let i=1;i<=6;i++) $('w'+i).hidden=(i!==wstep);
  document.querySelectorAll('#wtabs button').forEach(function(b){
    b.setAttribute('aria-pressed',String(+b.dataset.w===wstep));
  });
  WR[wstep]();
}
function onGraphChanged(){ if(walkReady){ rw4(); rw5(); W6.p=null; rw6(); } }
function bindWalk(){
  document.querySelectorAll('#wtabs button').forEach(function(b){
    b.addEventListener('click',function(){wshow(+b.dataset.w);});
  });
  $('wprev').addEventListener('click',function(){wshow(wstep-1);});
  $('wnext').addEventListener('click',function(){wshow(wstep+1);});
  ['wc1L','wc1N'].forEach(function(id){$(id).addEventListener('input',rw1);});
  ['wc2p','wc2z'].forEach(function(id){$(id).addEventListener('input',function(){W2.last=null;W2.plus=0;W2.minus=0;rw2();});});
  $('wb2one').addEventListener('click',function(){
    const rnd=rngOf((Math.random()*1e9)|0);
    W2.last=dopoRun(+$('wc2p').value/100,+$('wc2z').value/1000,rnd);
    if(W2.last.x>=0) W2.plus++; else W2.minus++;
    rw2();
  });
  $('wb2many').addEventListener('click',function(){
    const rnd=rngOf((Math.random()*1e9)|0);
    const p=+$('wc2p').value/100, z=+$('wc2z').value/1000;
    for(let i=0;i<50;i++){const r=dopoRun(p,z,rnd); if(r.x>=0) W2.plus++; else W2.minus++; W2.last=r;}
    rw2();
  });
  ['wc3N','wc3L','wc3F'].forEach(function(id){$(id).addEventListener('input',rw3);});
  ['wc4p','wc4K'].forEach(function(id){$(id).addEventListener('input',rw4);});
  $('wb5scan').addEventListener('click',rw5scan);
  $('wb6run').addEventListener('click',rw6measure);
  $('wc6R').addEventListener('input',rw6);
}
function walkInit(){ walkReady=true; wshow(1); }


/* ── 탭 (섹션 내부 전용 · URL 해시는 건드리지 않는다) ── */
function showSec(n){
  for(let i=1;i<=4;i++) $('s'+i).hidden=(i!==n);
  $('pend').hidden=(n!==4);
  document.querySelectorAll('#c-tabs button').forEach(function(b){
    b.setAttribute('aria-pressed',String(+b.dataset.s===n));
  });
}

/* ── 묶기 — init() 에서 한 번만 ─────────────────── */
function bind(){
  document.querySelectorAll('#c-tabs button').forEach(function(b){
    b.addEventListener('click',function(){showSec(+b.dataset.s);});
  });
  g1buttons().forEach(function(b){
    b.addEventListener('click',function(){
      g1buttons().forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
      G1.n=+b.dataset.v; g1graph(); G1.traj=[]; G1.frame=0; r1animate();
    });
  });
  ['c1p','c1k','c1z'].forEach(function(id){$(id).addEventListener('input',function(){G1.stat=null;r1labels();});});
  $('b1run').addEventListener('click',r1animate);
  $('b1stat').addEventListener('click',r1stats);
  ['c2n','c2k','c2f'].forEach(function(id){$(id).addEventListener('input',function(){if(id!=='c2f'){G2.curve=[];G2.iters=0;}r2();});});
  $('b2run').addEventListener('click',r2run);
  ['c3z','c3m'].forEach(function(id){$(id).addEventListener('input',r3labels);});
  $('b3run').addEventListener('click',r3run);
  $('b3ov').addEventListener('click',function(){G3.ov=!G3.ov;$('b3ov').setAttribute('aria-pressed',String(G3.ov));r3();});
  bindWalk();
}

let inited=false;
window.MOD=window.MOD||{};
window.MOD.c={
  init:function(){
    if(inited) return;                 // 두 번 불러도 안전
    inited=true;
    bind();
    g1graph();
    G3.opt=bruteCut(N3,G3.E);
    walkInit();
    showSec(1);
    r1animate(); r2(); r3run();
  }
};
})();


}};
}
window.dispatchEvent(new Event("opt-ready"));
