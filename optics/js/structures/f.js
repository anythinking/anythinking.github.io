/* F · 양자·신호 — 옛 아티팩트 장(html)과 그 장을 움직이는 코드(run).
   compute.js 가 html 을 페이지 밖 요소 트리로 한 번 만들고 run 을 그 트리에 묶은 뒤,
   고른 구조의 그림·손잡이 요소를 그대로 떼어 그림판·오른쪽 패널에 붙인다(복제·대리 없음).
   run 의 document 는 그 트리를 찾는 좁은 창이다: getElementById · querySelector(All) 만. */
(window.CMP = window.CMP || { groups: {} }).groups.f = {
  id: 'f', name: "F · 양자·신호",
  html: "<section id=\"sec-f\" hidden>\n  <p class=\"lede\" style=\"margin-bottom:10px\">회로는 A군의 MZI 메시와 같다. 달라지는 건 그 안에 무엇을 넣느냐다 — 광자를 하나씩 넣으면 양자컴이 되고, 시간 지연을 넣으면 필터가 되고, 주파수 빗살을 넣으면 채널 수천 개가 된다.</p>\n  <div class=\"tabs\" id=\"f-tabs\" role=\"tablist\">\n    <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>선형광학 양자컴</button>\n    <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>마이크로파 포토닉스</button>\n    <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>주파수 콤</button>\n    <button type=\"button\" data-s=\"4\" aria-pressed=\"false\">겹쳐 보면</button>\n  </div>\n\n  <!-- ══ 01 ══════════════════════════════════════════ -->\n  <div class=\"card sec\" id=\"f-s1\">\n    <div class=\"head\">\n      <div><div class=\"num\">01</div><h2>선형광학 양자컴 · 보손샘플링</h2></div>\n      <div class=\"chips\"><span class=\"chip\">PsiQuantum · Xanadu · Quandela</span><span class=\"chip wall\">손실이 η^(mn)으로 지수 붕괴</span></div>\n    </div>\n    <p class=\"idea\">회로는 A군 01의 MZI 메시와 <span class=\"k\">똑같다</span>. 바뀌는 건 입력뿐이다 — 연산기는 세기 있는 빛을 흘려보내고, 양자컴은 <span class=\"k\">광자를 하나씩</span> 넣는다. 같은 격자, 다른 입력.</p>\n\n    <h3>① 2×2에서 HOM 간섭 — 두 광자가 뭉친다</h3>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f1a\" viewBox=\"0 0 440 250\" role=\"img\" aria-label=\"HOM 간섭 — 결합기 모형과 동시검출 곡선\"></svg></div>\n      <div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c1t\">θ (나눔비)</label><input type=\"range\" id=\"f-c1t\" min=\"0\" max=\"180\" step=\"1\" value=\"90\"><output id=\"f-o1t\"></output></div>\n          <div class=\"row\"><label for=\"f-c1v\">광자 겹침 V</label><input type=\"range\" id=\"f-c1v\" min=\"0\" max=\"100\" step=\"1\" value=\"100\"><output id=\"f-o1v\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r1a\"></div>\n        <p class=\"note\">동시검출 확률 = (T²+R²) − 2TR·V. θ=90°면 T=R=0.5이고 V=1일 때 <span class=\"k\">정확히 0</span>이 된다. 둘 중 한 포트로 둘이 같이 나가버린다 — 고전적으로는 설명이 안 되는 지점이다. V를 낮추면(두 광자의 도착 시각·모양이 어긋나면) 0.5로 되돌아간다.</p>\n      </div>\n    </div>\n\n    <h3>② 4모드 유니터리에서 보손샘플링 — permanent로 직접 계산</h3>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f1b\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"출력 패턴 확률 분포\"></svg></div>\n      <div>\n        <div class=\"btns\" style=\"margin-bottom:8px\">\n          <button type=\"button\" id=\"f-b1r\">유니터리 바꾸기</button>\n          <button type=\"button\" id=\"f-b1e\">균등 분배로</button>\n        </div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c1n\">광자 n</label><input type=\"range\" id=\"f-c1n\" min=\"1\" max=\"3\" step=\"1\" value=\"3\"><output id=\"f-o1n\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r1b\"></div>\n        <p class=\"note\">4×4 Clements 메시(MZI 6개)를 A군 쪽 코드 그대로 합성하고, 출력 패턴마다 n×n 부분행렬의 <span class=\"k\">permanent</span>를 직접 전개해 확률을 낸다. 확률 합이 1.000으로 닫히는 게 계산이 맞다는 증거다. 모드 m, 광자 n이면 패턴 수가 C(m+n−1, n)으로 늘고, permanent는 n!에 비례해 비싸진다 — 그게 고전 컴퓨터가 못 따라오는 이유다.</p>\n      </div>\n    </div>\n\n    <h3>③ 벽 — 손실은 지수로 깎는다</h3>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f1c\" viewBox=\"0 0 440 180\" role=\"img\" aria-label=\"광자 수에 따른 생존 확률 지수 붕괴\"></svg></div>\n      <div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c1e\">부품 투과율 η</label><input type=\"range\" id=\"f-c1e\" min=\"9000\" max=\"9999\" step=\"1\" value=\"9900\"><output id=\"f-o1e\"></output></div>\n          <div class=\"row\"><label for=\"f-c1m\">경로상 부품 m</label><input type=\"range\" id=\"f-c1m\" min=\"4\" max=\"200\" step=\"2\" value=\"40\"><output id=\"f-o1m\"></output></div>\n          <div class=\"row\"><label for=\"f-c1p\">광자 n</label><input type=\"range\" id=\"f-c1p\" min=\"1\" max=\"60\" step=\"1\" value=\"20\"><output id=\"f-o1p\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r1c\"></div>\n        <p class=\"note\">광자 하나가 부품 m개를 지나면 η^m, n개가 다 살아남아야 하니 <span class=\"w\">η^(mn)</span>. 지수가 m·n이라 광자 수를 늘리는 순간 무너진다. η=0.99·m=40이면 광자 20개에서 이미 생존 확률이 0.03% 수준이다. 이게 손실 요구가 dB/m 영역으로 내려가는 이유이고, 실리콘 대신 질화실리콘(SiN)을 쓰는 이유다. 단광자 검출기(SNSPD)는 2~4 K 펄스튜브 냉동기가 따라붙는다.</p>\n      </div>\n    </div>\n  </div>\n\n  <!-- ══ 02 ══════════════════════════════════════════ -->\n  <div class=\"card sec\" id=\"f-s2\" hidden>\n    <div class=\"head\">\n      <div><div class=\"num\">02</div><h2>마이크로파 포토닉 프로세서</h2></div>\n      <div class=\"chips\"><span class=\"chip\">스윈번 · 발렌시아공대(UPV)</span><span class=\"chip wall\">아날로그 정밀도 · 전광 변환 손실</span></div>\n    </div>\n    <p class=\"idea\">마이크로파 신호를 빛에 실어 광학 영역에서 적분·미분·필터링을 한다. 회로의 본체는 <span class=\"k\">탭 지연선</span> — 빛을 여러 갈래로 나누고 서로 다른 지연을 준 뒤 계수를 곱해 다시 합친다. 전자회로의 FIR 필터를 빛으로 짓는 것이고, 계수는 각 탭의 세기다.</p>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f2a\" viewBox=\"0 0 440 220\" role=\"img\" aria-label=\"탭 지연선 구조\"></svg></div>\n      <div>\n        <div class=\"btns\" style=\"margin-bottom:8px\">\n          <button type=\"button\" data-g=\"2k\" data-v=\"diff\" aria-pressed=\"true\">미분기</button>\n          <button type=\"button\" data-g=\"2k\" data-v=\"int\" aria-pressed=\"false\">적분기</button>\n          <button type=\"button\" data-g=\"2k\" data-v=\"bp\" aria-pressed=\"false\">대역통과</button>\n        </div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c2n\">탭 수 N</label><input type=\"range\" id=\"f-c2n\" min=\"2\" max=\"16\" step=\"1\" value=\"8\"><output id=\"f-o2n\"></output></div>\n          <div class=\"row\"><label for=\"f-c2t\">탭 지연 ΔT</label><input type=\"range\" id=\"f-c2t\" min=\"10\" max=\"200\" step=\"5\" value=\"50\"><output id=\"f-o2t\"></output></div>\n          <div class=\"row\"><label for=\"f-c2f\">중심 주파수</label><input type=\"range\" id=\"f-c2f\" min=\"5\" max=\"95\" step=\"1\" value=\"30\"><output id=\"f-o2f\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r2a\"></div>\n      </div>\n    </div>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f2b\" viewBox=\"0 0 440 210\" role=\"img\" aria-label=\"주파수 응답과 이상적 응답 비교\"></svg></div>\n      <div>\n        <p class=\"note\">응답은 H(f) = Σ cₖ·e^(−j2πf·kΔT)를 주파수 격자 240점에서 <span class=\"k\">직접 합산</span>해 그린다(DFT와 같은 계산). 같은 하드웨어에 계수만 갈아끼우면 기능이 바뀐다 — 미분기는 이상적 미분기의 충격응답을 N개로 잘라 창함수를 씌운 것이고, 적분기는 전부 1(유한구간 이동평균), 대역통과는 cos(2π f_c kΔT)에 창함수를 씌운 것이다.</p>\n        <p class=\"note\">미분기에서 점선은 이상적인 |H| ∝ f 직선이고, 실선이 그 직선을 따라가는 구간이 쓸 수 있는 대역이다. 탭 2개면 나이퀴스트의 38% 정도까지만 선형이고, 16개면 96%까지 간다 — <span class=\"w\">대신 지연선이 길어지고 손실이 쌓인다.</span> 그게 이 구조의 거래다. 탭이 홀수면 대역 끝에 영점이 강제돼 쓸 폭이 반으로 준다.</p>\n        <p class=\"note\"><b>적분기는 정직하게 말해야 한다.</b> 탭 지연선은 FIR이라 되먹임이 없고, 전부 1인 계수는 DC에서 |H|가 1로 평탄하다 — 참 적분기라면 DC에서 발산해야 하니 이건 <span class=\"w\">유한구간 평균이지 적분이 아니다.</span> 실제 마이크로파 포토닉 적분기가 고Q 링 공진기(되먹임 구조)로 만들어지는 이유가 여기 있다. 이 모드의 점선은 이상적 응답이 아니라 이동평균의 해석식이고, 직접 합산한 실선과 겹치는 것이 계산이 맞다는 검산이다.</p>\n        <p class=\"note\">탭 지연 ΔT의 역수가 응답이 되풀이되는 주기(자유 스펙트럼 범위)다. ΔT를 키우면 세밀해지는 대신 쓸 수 있는 주파수 범위가 좁아진다.</p>\n        <div class=\"read\" id=\"f-r2b\"></div>\n      </div>\n    </div>\n    <p class=\"note\" style=\"border-top:1px solid var(--rule);padding-top:10px\">《Nature》 2024에 보고된 마이크로파 포토닉 처리 엔진은 적분·미분 동작에서 <b>98.1%</b> 정확도를 보고했다 — <span class=\"chip\">보고값 · 재현 미확인</span> 이 페이지의 숫자는 위 계수로 직접 계산한 것이고, 98.1%는 그 논문의 주장이다.</p>\n  </div>\n\n  <!-- ══ 03 ══════════════════════════════════════════ -->\n  <div class=\"card sec\" id=\"f-s3\" hidden>\n    <div class=\"head\">\n      <div><div class=\"num\">03</div><h2>주파수 콤 병렬 처리</h2></div>\n      <div class=\"chips\"><span class=\"chip\">스윈번 Moss · 하버드</span><span class=\"chip wall\">고Q 공진기 + 커 비선형 · Si는 TPA로 못 씀</span></div>\n    </div>\n    <p class=\"idea\">하나의 레이저에서 수백~수천 개의 등간격 선을 뽑아낸다. <span class=\"k\">빗살 하나가 채널 하나</span>이므로, 파장 다중 연산에서 콤은 곧 병렬도다. A군 02의 링 가중치 뱅크가 파장마다 가중치 하나를 두는 구조라면, 콤은 그 파장을 공급하는 쪽이다.</p>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f3a\" viewBox=\"0 0 440 200\" role=\"img\" aria-label=\"콤 스펙트럼\"></svg></div>\n      <div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c3s\">선 간격 FSR</label><input type=\"range\" id=\"f-c3s\" min=\"10\" max=\"200\" step=\"5\" value=\"49\"><output id=\"f-o3s\"></output></div>\n          <div class=\"row\"><label for=\"f-c3n\">선 개수</label><input type=\"range\" id=\"f-c3n\" min=\"9\" max=\"201\" step=\"2\" value=\"81\"><output id=\"f-o3n\"></output></div>\n          <div class=\"row\"><label for=\"f-c3r\">선당 속도</label><input type=\"range\" id=\"f-c3r\" min=\"1\" max=\"100\" step=\"1\" value=\"10\"><output id=\"f-o3r\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r3a\"></div>\n        <p class=\"note\">세기 포락선은 sech² 모양으로 그렸다(커 소리톤 콤의 전형). 가장자리 선은 약해서 실제로 쓰려면 평탄화가 따로 필요하다 — 그려진 선 전부가 쓸 수 있는 채널은 아니다.</p>\n      </div>\n    </div>\n\n    <h3>광 기준을 마이크로파로 내릴 때 — 위상잡음 20·log N</h3>\n    <div class=\"split\">\n      <div class=\"fig\"><svg class=\"f\" id=\"f-f3b\" viewBox=\"0 0 440 190\" role=\"img\" aria-label=\"주파수 분할에 따른 위상잡음 저감\"></svg></div>\n      <div>\n        <div class=\"ctl\">\n          <div class=\"row\"><label for=\"f-c3o\">광 기준</label><input type=\"range\" id=\"f-c3o\" min=\"50\" max=\"400\" step=\"5\" value=\"200\"><output id=\"f-o3o\"></output></div>\n          <div class=\"row\"><label for=\"f-c3m\">목표 마이크로파</label><input type=\"range\" id=\"f-c3m\" min=\"1\" max=\"100\" step=\"1\" value=\"10\"><output id=\"f-o3m\"></output></div>\n          <div class=\"row\"><label for=\"f-c3p\">광 기준 위상잡음</label><input type=\"range\" id=\"f-c3p\" min=\"-120\" max=\"-40\" step=\"1\" value=\"-80\"><output id=\"f-o3p\"></output></div>\n        </div>\n        <div class=\"read\" id=\"f-r3b\"></div>\n        <p class=\"note\">주파수를 N배로 나누면 위상 흔들림도 N배로 줄고, 전력 척도(dB)에서는 <span class=\"k\">20·log₁₀N</span>만큼 내려간다. 200 THz를 10 GHz로 내리면 N = 20,000이고 20·log₁₀(20,000) ≈ <span class=\"k\">86.0 dB</span>. 콤이 하는 일은 그 분할의 눈금을 광학적으로 코히런트하게 들고 있는 것이다. 이건 분할의 상한이고, 실제로는 검출기 산탄잡음·열잡음이 바닥을 깐다 — 그 바닥은 이 계산에 들어 있지 않다.</p>\n      </div>\n    </div>\n    <p class=\"note\" style=\"border-top:1px solid var(--rule);padding-top:10px\"><b>벽.</b> 콤을 칩에서 만들려면 Q가 수백만인 공진기와 커(Kerr) 비선형이 둘 다 있어야 한다. 실리콘은 1550 nm에서 <span class=\"w\">2광자 흡수(TPA)</span>가 일어나 세기를 올릴수록 흡수가 늘어 소리톤이 안 선다. 그래서 질화실리콘(SiN)을 쓴다 — 밴드갭이 넓어 TPA가 없고 손실도 낮다. 01의 양자 쪽이 SiN으로 가는 이유와 같은 재료적 결론이 다른 길로 도착한다.</p>\n  </div>\n\n  <!-- ══ 04 ══════════════════════════════════════════ -->\n  <div class=\"card sec close\" id=\"f-s4\" hidden>\n    <h2 style=\"font-size:16px\">셋을 겹쳐 보면</h2>\n    <p style=\"margin-top:8px\"><b>회로는 같고 자원이 다르다.</b> 01은 A군 01의 MZI 메시를 글자 하나 안 바꾸고 쓴다 — 실제로 이 페이지의 보손샘플링은 4×4 Clements 메시 코드를 그대로 돌린 것이다. 통신은 그 격자의 위상을 흔들어 정보를 실어 보내고, 연산은 위상을 값으로 고정해 행렬을 만들고, 양자는 고정한 격자에 광자를 하나씩 넣는다. 세 용도가 같은 하드웨어를 다르게 쓰는 것뿐이다.</p>\n    <p><b>02와 03은 빛의 다른 축을 쓴다.</b> 01이 쓰는 자원은 광자 하나하나의 개수이고, 02는 <span class=\"k\">시간</span>을, 03은 <span class=\"k\">주파수</span>를 쓴다. 02의 탭 지연선은 같은 빛을 시간으로 펼쳐 계수를 곱하고, 03의 콤은 같은 레이저를 주파수로 펼쳐 채널을 만든다. 그래서 둘은 겹쳐 쓸 수 있다 — 콤으로 채널을 공급하고 지연선으로 각 채널을 처리하는 구성이 실제 마이크로파 포토닉 논문들의 기본형이다.</p>\n    <p><b>벽은 셋 다 다르게 생겼지만 재료는 한 군데서 만난다.</b> 01의 벽은 손실이 지수로 깎는 것이고(η^(mn)), 02의 벽은 아날로그 정밀도와 탭 수의 거래이고, 03의 벽은 콤을 세우는 비선형 조건이다. 그런데 01의 손실 요구(dB/m)와 03의 TPA 회피가 <span class=\"k\">둘 다 질화실리콘</span>으로 끝난다. 다른 문제를 풀다 같은 재료에 도착하는 건 우연이 아니라, 저손실·넓은 밴드갭이라는 한 가지 성질이 두 요구를 동시에 만족시키기 때문이다.</p>\n    <p><b>셋 중 어느 것도 \"광 컴퓨터\"가 아니다.</b> 01은 샘플링이라는 특정 문제의 하드웨어이고, 02는 신호처리 전단이고, 03은 광원 겸 시계다. 범용 연산을 노리는 건 A군이고, F군은 <span class=\"k\">빛이 전자보다 확실히 유리한 지점</span>에만 붙어 있다. 그 자리가 어디인지 알아보는 쪽이 범용을 노리는 쪽보다 성적이 좋았다는 게 지금까지의 기록이다.</p>\n  </div>\n\n  <div class=\"src\" id=\"f-src\" hidden>\n    <p><b>이 페이지에서 실제로 계산한 것</b> — HOM 동시검출 확률(2×2 전달행렬 해석식), 보손샘플링 출력 분포(4×4 Clements 메시 + permanent 직접 전개, 확률 합으로 자가검산), 손실 생존 확률(η^(mn)), 탭 지연선 주파수 응답(240점 직접 합산), 콤 스펙트럼, 주파수 분할 위상잡음(20·log₁₀N).</p>\n    <p><b>인용한 주장</b> — 《Nature》 2024 마이크로파 포토닉 처리 엔진의 적분·미분 98.1% 정확도는 논문 보고값이고 여기서 재현하지 않았다. 회사 이름(PsiQuantum·Xanadu·Quandela·스윈번·발렌시아공대·하버드)은 그 구조를 밀고 있는 곳을 가리키는 표시이고, 성능 주장을 옮긴 것은 아니다.</p>\n    <p><b>미확인</b> — SNSPD의 2~4 K 펄스튜브 냉동기 소량 상용 단계라는 서술은 정리 노트의 기록이고 이 페이지에서 다시 확인하지 않았다. 콤의 \"수천 채널\"은 구조적으로 가능한 수이고, 평탄화·잡음을 넘겨 실제로 다 쓴 보고는 별개다.</p>\n    <p><b>같은 틀의 다른 묶음</b> — A군 <a href=\"https://claude.ai/artifact/1rU7rNCNLmKpuXvThQPB9S\">4×4 광 연산 메시</a> · 행렬곱을 만드는 여덟 구조.</p>\n  </div>\n</section>",
  run: function (document, getComputedStyle, MOD) {


/* F군 — 전부 즉시실행 함수 안. 복소수 헬퍼(cadd·cmul·mziT 등)가 메시·A군 쪽과
   이름이 겹치지만 이 안에 닫혀 있어 충돌하지 않는다.
   전역으로 내보내는 건 MOD.f 하나뿐이고, 로드 시 아무것도 그리지 않는다. */
(function(){
const SEC=document.getElementById('sec-f');
const $=id=>(document.getElementById(id)||SEC.querySelector('#'+id));
const D2R=Math.PI/180;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(v,n)=>v.toFixed(n==null?2:n);

/* ── 복소수 (mzi-mesh-4x4.html 과 동일) ─────────── */
const C=(re,im)=>({re,im});
const cadd=(a,b)=>C(a.re+b.re,a.im+b.im);
const csub=(a,b)=>C(a.re-b.re,a.im-b.im);
const cmul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const cscale=(a,s)=>C(a.re*s,a.im*s);
const cmulI=a=>C(-a.im,a.re);
const cabs2=a=>a.re*a.re+a.im*a.im;
const ONE=C(1,0), ZERO=C(0,0);
const expi=t=>C(Math.cos(t),Math.sin(t));

/* MZI 전달행렬: BS · P(θ) · BS · Φ(φ) */
function mziT(th,ph){
  const e=expi(th);
  const a=cscale(csub(e,ONE),0.5);
  const b=cscale(cmulI(cadd(e,ONE)),0.5);
  const f=expi(ph);
  return [[cmul(a,f),b],[cmul(b,f),cscale(csub(ONE,e),0.5)]];
}
/* Clements 직사각 4×4 */
const COLS=[[[0,1],[2,3]],[[1,2]],[[0,1],[2,3]],[[1,2]]];
const IDX=[[0,0],[0,1],[1,0],[2,0],[2,1],[3,0]];
const mzOf=(c,k)=>IDX.findIndex(p=>p[0]===c&&p[1]===k);
function colMatrix(c,mz){
  const M=[0,1,2,3].map(i=>[0,1,2,3].map(j=>i===j?ONE:ZERO));
  COLS[c].forEach((ports,k)=>{
    const m=mz[mzOf(c,k)], T=mziT(m.t*D2R,m.p*D2R), p=ports[0], q=ports[1];
    M[p][p]=T[0][0]; M[p][q]=T[0][1];
    M[q][p]=T[1][0]; M[q][q]=T[1][1];
  });
  return M;
}
const matmul=(A,B)=>A.map(row=>[0,1,2,3].map(j=>row.reduce((s,a,k)=>cadd(s,cmul(a,B[k][j])),ZERO)));
function meshU(mz){
  let U=[0,1,2,3].map(i=>[0,1,2,3].map(j=>i===j?ONE:ZERO));
  for(let c=0;c<4;c++) U=matmul(colMatrix(c,mz),U);
  return U;
}

/* permanent — n! 항 직접 전개 (n ≤ 4) */
function perm(M){
  const n=M.length;
  if(n===0) return ONE;
  let s=ZERO;
  const rec=(row,used,acc)=>{
    if(row===n){ s=cadd(s,acc); return; }
    for(let j=0;j<n;j++) if((used&(1<<j))===0) rec(row+1,used|(1<<j),cmul(acc,M[row][j]));
  };
  rec(0,0,ONE);
  return s;
}
const fact=k=>{let r=1;for(let i=2;i<=k;i++)r*=i;return r;};

/* ══ 01-① HOM ═════════════════════════════════════ */
function r1a(){
  const th=+$('f-c1t').value, V=+$('f-c1v').value/100;
  const T=Math.sin(th*D2R/2)**2, R=1-T;
  const pc=(T*T+R*R)-2*T*R*V;          // 동시검출
  const p20=T*R*(1+V), p02=T*R*(1+V);  // 뭉침 (합 = 1 - pc)
  $('f-o1t').textContent=th+'°';
  $('f-o1v').textContent=fmt(V);
  // 곡선: θ 0~180
  const X=t=>26+t/180*(410-26), Y=p=>160-p*110;
  let pts='';
  for(let t=0;t<=180;t+=2){
    const TT=Math.sin(t*D2R/2)**2, RR=1-TT;
    const y=(TT*TT+RR*RR)-2*TT*RR*V;
    pts+=(t===0?'M':'L')+fmt(X(t),1)+' '+fmt(Y(y),1)+' ';
  }
  const g=[];
  // 상단: 결합기 그림
  g.push(`<path class="wg" stroke-width="1.4" opacity=".55" d="M40 24 C72 24 72 46 104 46 H150 C182 46 182 24 214 24 H262"/>`);
  g.push(`<path class="wg" stroke-width="1.4" opacity=".55" d="M40 68 C72 68 72 46 104 46 H150 C182 68 182 68 214 68 H262"/>`);
  g.push(`<rect class="ht" x="152" y="20" width="44" height="5" rx="2" opacity=".9"/>`);
  g.push(`<text class="m" x="174" y="15" font-size="9.5" text-anchor="middle">θ = ${th}°</text>`);
  g.push(`<circle class="bmf" cx="26" cy="24" r="4.2"/><circle class="bmf" cx="26" cy="68" r="4.2"/>`);
  g.push(`<text class="m" x="4" y="14" font-size="9">γ₁</text><text class="m" x="4" y="84" font-size="9">γ₂</text>`);
  // 출력 세 경우
  const bar=(x,y,p,lab)=>{
    const w=Math.max(0.5,46*p);
    return `<rect class="fillg" x="${x}" y="${y}" width="46" height="9" rx="2"/>`+
           `<rect class="pdf" x="${x}" y="${y}" width="${fmt(w,1)}" height="9" rx="2" opacity=".9"/>`+
           `<text class="m" x="${x+52}" y="${y+8}" font-size="9.5">${lab} ${fmt(p,3)}</text>`;
  };
  g.push(bar(268,20,p20,'●● | ·'));
  g.push(bar(268,36,pc,'● | ●'));
  g.push(bar(268,52,p02,'· | ●●'));
  // 하단: 곡선
  g.push(`<path class="gridl" stroke-width="1" d="M26 160 H410 M26 50 V160"/>`);
  for(let k=0;k<=4;k++){
    const y=Y(k/4);
    g.push(`<path class="gridl" stroke-width=".7" opacity=".55" d="M26 ${fmt(y,1)} H410"/>`);
    g.push(`<text class="m" x="22" y="${fmt(y+3,1)}" font-size="8.5" text-anchor="end">${fmt(k/4,2)}</text>`);
  }
  [0,45,90,135,180].forEach(t=>{
    g.push(`<text class="m" x="${fmt(X(t),1)}" y="174" font-size="8.5" text-anchor="middle">${t}°</text>`);
  });
  g.push(`<path class="bm" stroke-width="2" d="${pts}"/>`);
  g.push(`<circle class="pdf" cx="${fmt(X(th),1)}" cy="${fmt(Y(pc),1)}" r="4"/>`);
  g.push(`<text class="m" x="26" y="44" font-size="9.5">● | ● 동시검출 확률</text>`);
  g.push(`<text class="m" x="410" y="190" font-size="9" text-anchor="end">T=R=0.5 에서 바닥까지 내려간다</text>`);
  g.push(`<text class="m" x="26" y="208" font-size="9">T = sin²(θ/2) = ${fmt(T,3)} · R = ${fmt(R,3)}</text>`);
  g.push(`<text class="m" x="26" y="224" font-size="9">V=1 이면 밑바닥 = (T−R)² = cos²θ</text>`);
  g.push(`<text class="m" x="26" y="240" font-size="9">합 ${fmt(p20+pc+p02,4)} — 닫힌다</text>`);
  $('f-f1a').innerHTML=g.join('');
  const cls=pc<1e-9?'0 — 사라졌다':fmt(pc,4);
  $('f-r1a').innerHTML=`나눔 T/R <b>${fmt(T,3)} / ${fmt(R,3)}</b><br>`+
    `동시검출 <b>${cls}</b> · 뭉침 합 <b>${fmt(p20+p02,4)}</b><br>`+
    (V>0.999&&Math.abs(th-90)<0.5?`<span style="color:var(--probe)">HOM 딥의 밑바닥 — 동시검출이 정확히 0</span>`:
     V<0.001?`<span style="color:var(--wall)">겹침 0 — 고전적 값(T²+R²)으로 돌아갔다</span>`:
     `고전 기준 T²+R² = ${fmt(T*T+R*R,3)}`);
}

/* ══ 01-② 보손샘플링 ═══════════════════════════════ */
let mz1=[[60,0],[180,0],[70.5,0],[180,0],[90,0],[180,0]].map(p=>({t:p[0],p:p[1]}));
function patterns(m,n){ // 길이 m, 합 n 인 점유수 벡터 전부
  const out=[];
  const rec=(i,left,cur)=>{
    if(i===m-1){ out.push(cur.concat([left])); return; }
    for(let k=left;k>=0;k--) rec(i+1,left-k,cur.concat([k]));
  };
  rec(0,n,[]);
  return out;
}
const expand=occ=>{const L=[];occ.forEach((c,i)=>{for(let k=0;k<c;k++)L.push(i);});return L;};
function r1b(){
  const n=+$('f-c1n').value;
  $('f-o1n').textContent=n+'개';
  const U=meshU(mz1);
  const sIn=[];
  for(let i=0;i<n;i++) sIn.push(i);                // 입력 모드 0..n-1 에 하나씩
  const pats=patterns(4,n);
  const probs=pats.map(occ=>{
    const tL=expand(occ);
    const M=tL.map(r=>sIn.map(c=>U[r][c]));
    const a=perm(M);
    const norm=occ.reduce((s,c)=>s*fact(c),1);     // 입력은 전부 1이라 1! 뿐
    return cabs2(a)/norm;
  });
  const tot=probs.reduce((s,v)=>s+v,0);
  const mx=Math.max(...probs,1e-12);
  const g=[];
  const w=(410-30)/pats.length;
  g.push(`<path class="gridl" stroke-width="1" d="M30 150 H410 M30 24 V150"/>`);
  for(let k=1;k<=4;k++){
    const y=150-k/4*120;
    g.push(`<path class="gridl" stroke-width=".7" opacity=".5" d="M30 ${fmt(y,1)} H410"/>`);
    g.push(`<text class="m" x="26" y="${fmt(y+3,1)}" font-size="8.5" text-anchor="end">${fmt(mx*k/4,3)}</text>`);
  }
  probs.forEach((p,i)=>{
    const h=p/mx*120, x=30+i*w;
    g.push(`<rect class="pdf" x="${fmt(x+w*0.14,1)}" y="${fmt(150-h,1)}" width="${fmt(w*0.72,1)}" height="${fmt(Math.max(0.4,h),1)}" rx="1" opacity=".85"/>`);
    if(pats.length<=20) g.push(`<text class="m" x="${fmt(x+w/2,1)}" y="163" font-size="7" text-anchor="middle" transform="rotate(90 ${fmt(x+w/2,1)} 163)">${pats[i].join('')}</text>`);
  });
  g.push(`<text class="m" x="30" y="18" font-size="9.5">4모드 출력 패턴별 확률 · 패턴 ${pats.length}개</text>`);
  g.push(`<text class="m" x="410" y="18" font-size="9" text-anchor="end">가로축 = 출력 점유수 (예: 1110)</text>`);
  g.push(`<text class="m" x="30" y="196" font-size="9">진폭 = perm(U 부분행렬) / √(∏ tⱼ!) · 확률 = |진폭|²</text>`);
  $('f-f1b').innerHTML=g.join('');
  // 상위 3 패턴
  const rank=probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]).slice(0,3)
    .map(r=>`${pats[r[1]].join('')} ${fmt(r[0],4)}`).join(' · ');
  $('f-r1b').innerHTML=`패턴 <b>${pats.length}</b>개 · 확률 합 <b>${fmt(tot,6)}</b><br>`+
    `상위 <b>${rank}</b><br>`+
    (Math.abs(tot-1)<1e-9?`<span style="color:var(--probe)">합이 1로 닫힌다 — 유니터리와 permanent 계산이 모두 정상</span>`:
     `<span style="color:var(--wall)">합이 1에서 ${fmt((tot-1)*1e6,2)}×10⁻⁶ 빗나감</span>`);
}

/* ══ 01-③ 손실 ════════════════════════════════════ */
function r1c(){
  const eta=+$('f-c1e').value/10000, m=+$('f-c1m').value, n=+$('f-c1p').value;
  $('f-o1e').textContent=fmt(eta,4);
  $('f-o1m').textContent=m+'개';
  $('f-o1p').textContent=n+'개';
  const lg=k=>k*m*Math.log10(eta);          // log10 생존확률
  const nMax=60;
  const yLo=Math.min(-1,lg(nMax));
  const X=k=>34+(k-1)/(nMax-1)*(410-34);
  const Y=L=>24+clamp(L/yLo,0,1)*(140-24);  // L=0 → 위, L=yLo → 아래
  let pts='';
  for(let k=1;k<=nMax;k++) pts+=(k===1?'M':'L')+fmt(X(k),1)+' '+fmt(Y(lg(k)),1)+' ';
  const g=[];
  g.push(`<path class="gridl" stroke-width="1" d="M34 140 H410 M34 20 V140"/>`);
  const steps=4;
  for(let s=0;s<=steps;s++){
    const L=yLo*s/steps, y=Y(L);
    g.push(`<path class="gridl" stroke-width=".7" opacity=".5" d="M34 ${fmt(y,1)} H410"/>`);
    g.push(`<text class="m" x="30" y="${fmt(y+3,1)}" font-size="8.5" text-anchor="end">10${sup(Math.round(L))}</text>`);
  }
  [1,20,40,60].forEach(k=>g.push(`<text class="m" x="${fmt(X(k),1)}" y="154" font-size="8.5" text-anchor="middle">${k}</text>`));
  g.push(`<path class="bm" stroke-width="2" d="${pts}"/>`);
  g.push(`<circle class="pdf" cx="${fmt(X(n),1)}" cy="${fmt(Y(lg(n)),1)}" r="4"/>`);
  g.push(`<text class="m" x="34" y="14" font-size="9.5">생존 확률 η^(mn) · 로그 눈금</text>`);
  g.push(`<text class="m" x="410" y="168" font-size="9" text-anchor="end">가로축 = 광자 수 n</text>`);
  $('f-f1c').innerHTML=g.join('');
  // 로그 공간에서 계산한다 — 지수가 커지면 부동소수점이 0으로 주저앉아 ∞·NaN이 나온다
  const L=lg(n), L1=lg(1);
  const dB=-10*L;
  const p10=x=>{                                  // log10 값을 읽을 수 있게
    if(x>-5) return fmt(Math.pow(10,x),x>-2?4:7);
    const e=Math.floor(x), man=Math.pow(10,x-e);
    return fmt(man,2)+'×10'+sup(e);
  };
  $('f-r1c').innerHTML=`광자 하나 η^m = <b>${p10(L1)}</b><br>`+
    `n=${n} 전부 생존 η^(mn) = <b>${p10(L)}</b> (${fmt(dB,1)} dB)<br>`+
    `시도 <b>${-L<6?Math.round(Math.pow(10,-L)).toLocaleString():'10'+sup(Math.round(-L))}</b>번에 한 번 기대`;
}
function sup(k){
  const S={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  return String(k).split('').map(c=>S[c]||c).join('');
}

/* ══ 02 탭 지연선 ═════════════════════════════════ */
let kind2='diff';
/* 탭 간격이 정한 나이퀴스트 위의 주파수는 아래로 접힌다(에일리어싱) */
function fold(f,fsr){
  let r=f%fsr;
  if(r<0) r+=fsr;
  return r>fsr/2?fsr-r:r;
}
function taps(){
  const N=+$('f-c2n').value, fc=+$('f-c2f').value, dT=+$('f-c2t').value;
  if(kind2==='diff'){
    // 절단된 이상 미분기 충격응답 × 해밍 창
    // h(n) = d/dn sinc(n) = (πn·cos πn − sin πn) / (πn²), 중심은 0
    const c=[], mid=(N-1)/2;
    for(let k=0;k<N;k++){
      const n=k-mid;
      const h=Math.abs(n)<1e-9?0:(Math.PI*n*Math.cos(Math.PI*n)-Math.sin(Math.PI*n))/(Math.PI*n*n);
      const w=N>1?0.54-0.46*Math.cos(2*Math.PI*k/(N-1)):1;
      c.push(h*w);
    }
    const s=Math.max(...c.map(Math.abs))||1;
    return c.map(v=>v/s);
  }
  if(kind2==='int') return new Array(N).fill(1/N);
  // 대역통과 — 해밍 창을 씌운 cos
  const c=[];
  for(let k=0;k<N;k++){
    const w=0.54-0.46*Math.cos(2*Math.PI*k/Math.max(1,N-1));
    c.push(w*Math.cos(2*Math.PI*fc*1e-3*k*dT));
  }
  const s=Math.sqrt(c.reduce((a,v)=>a+v*v,0))||1;
  return c.map(v=>v/s);
}
function r2a(){
  const N=+$('f-c2n').value, dT=+$('f-c2t').value, fc=+$('f-c2f').value;
  $('f-o2n').textContent=N+'개';
  $('f-o2t').textContent=dT+' ps';
  $('f-o2f').textContent=fc+' GHz';
  const c=taps();
  const g=[];
  // 분배기 → 지연선 → 계수 → 합산
  g.push(`<path class="bm" stroke-width="4" opacity=".85" d="M10 100 H54"/>`);
  g.push(`<path class="wg" stroke-width="1.3" opacity=".6" d="M54 100 L72 100"/>`);
  g.push(`<rect class="box" x="56" y="54" width="18" height="92" rx="3" stroke-width="1.2"/>`);
  g.push(`<text class="m" x="65" y="166" font-size="8.5" text-anchor="middle">분배</text>`);
  const show=Math.min(N,8);
  const amax=Math.max(...c.map(Math.abs),1e-9);
  for(let k=0;k<show;k++){
    const y=58+k*(84/Math.max(1,show-1));
    const len=90+k*18;
    g.push(`<path class="wg" stroke-width="1.2" opacity=".55" d="M74 ${fmt(y,1)} H${fmt(74+len,1)}"/>`);
    const a=c[k]/amax;
    g.push(`<rect class="${a>=0?'pdf':'wmf'}" x="${fmt(74+len,1)}" y="${fmt(y-3.5,1)}" width="${fmt(Math.max(1.5,Math.abs(a)*26),1)}" height="7" rx="2" opacity=".9"/>`);
    g.push(`<text class="m" x="${fmt(74+len+30,1)}" y="${fmt(y+3,1)}" font-size="8">${fmt(c[k],2)}</text>`);
    g.push(`<text class="m" x="78" y="${fmt(y-5,1)}" font-size="7.5">${k}ΔT</text>`);
  }
  if(N>show) g.push(`<text class="m" x="78" y="158" font-size="8">… 앞 ${show}개만 그렸다 (전체 ${N}개)</text>`);
  g.push(`<path class="wg" stroke-width="1.3" opacity=".6" d="M376 58 V142"/>`);
  g.push(`<rect class="pd" x="382" y="88" width="28" height="26" rx="3" stroke-width="1.3"/>`);
  g.push(`<text class="p" x="396" y="105" font-size="9" text-anchor="middle">Σ</text>`);
  g.push(`<text class="m" x="10" y="88" font-size="9">마이크로파 신호</text>`);
  g.push(`<text class="m" x="10" y="190" font-size="9">탭마다 지연 kΔT · 계수 cₖ · 다시 합산 — FIR 필터를 빛으로 지은 구조</text>`);
  g.push(`<text class="m" x="10" y="206" font-size="9">파랑 = 양수 계수 · 갈색 = 음수 계수</text>`);
  $('f-f2a').innerHTML=g.join('');
  const nm={diff:'절단 이상미분기 × 해밍',int:'전부 1/N — 유한구간 이동평균',bp:'cos(2πf_c kΔT) × 해밍'}[kind2];
  const fsr=1000/dT; // ps → GHz
  $('f-r2a').innerHTML=`계수 <b>${nm}</b><br>시간 창 길이 (N−1)ΔT = <b>${fmt((N-1)*dT,0)} ps</b><br>자유 스펙트럼 범위 1/ΔT = <b>${fmt(fsr,1)} GHz</b>`;
  r2b();
}
function r2b(){
  const dT=+$('f-c2t').value, c=taps(), N=c.length;
  const fsr=1000/dT, fMax=Math.min(fsr,120);
  const K=240, H=[];
  for(let i=0;i<K;i++){
    const f=fMax*i/(K-1);
    let re=0,im=0;
    for(let k=0;k<N;k++){
      const ph=-2*Math.PI*f*k*dT*1e-3;   // f GHz, dT ps → 무차원
      re+=c[k]*Math.cos(ph); im+=c[k]*Math.sin(ph);
    }
    H.push(Math.sqrt(re*re+im*im));
  }
  const hmax=Math.max(...H,1e-9);
  const X=f=>34+f/fMax*(410-34), Y=v=>150-clamp(v/hmax,0,1)*124;
  let p='';
  H.forEach((v,i)=>{p+=(i===0?'M':'L')+fmt(X(fMax*i/(K-1)),1)+' '+fmt(Y(v),1)+' ';});
  // 점선 — 미분기는 이상적 직선, 적분기는 해석식(직접 합산과 겹쳐야 한다 = 검산)
  const nyq=fsr/2;
  let q='', lab='', slope=0;
  if(kind2==='diff'){
    lab='이상적 |H| ∝ f';
    // 하단 20% 로 비례상수를 잡는다 — 거기가 선형이어야 할 자리
    let sxy=0,sxx=0;
    for(let i=1;i<K;i++){const f=fMax*i/(K-1); if(f<=nyq*0.2){sxy+=f*H[i];sxx+=f*f;}}
    slope=sxx>0?sxy/sxx:0;
    for(let i=0;i<K;i++){const f=fMax*i/(K-1);q+=(i===0?'M':'L')+fmt(X(f),1)+' '+fmt(Y(slope*f),1)+' ';}
  }else if(kind2==='int'){
    lab='해석식 |sin(πfNΔT)/(N·sin(πfΔT))| — 직접 합산과 겹친다 = 검산';
    for(let i=1;i<K;i++){
      const f=fMax*i/(K-1), a=Math.PI*f*dT*1e-3;
      const v=Math.abs(Math.sin(a*N))/Math.max(1e-12,N*Math.abs(Math.sin(a)));
      q+=(i===1?'M':'L')+fmt(X(f),1)+' '+fmt(Y(v),1)+' ';
    }
  }
  const g=[];
  g.push(`<path class="gridl" stroke-width="1" d="M34 150 H410 M34 22 V150"/>`);
  for(let k=1;k<=4;k++){
    const y=150-k/4*124;
    g.push(`<path class="gridl" stroke-width=".7" opacity=".5" d="M34 ${fmt(y,1)} H410"/>`);
    g.push(`<text class="m" x="30" y="${fmt(y+3,1)}" font-size="8.5" text-anchor="end">${fmt(k/4,2)}</text>`);
  }
  for(let k=0;k<=4;k++){
    const f=fMax*k/4;
    g.push(`<text class="m" x="${fmt(X(f),1)}" y="164" font-size="8.5" text-anchor="middle">${fmt(f,0)}</text>`);
  }
  if(q) g.push(`<path class="pd" stroke-width="1.2" stroke-dasharray="4 3" opacity=".8" d="${q}"/>`);
  g.push(`<path class="bm" stroke-width="2" d="${p}"/>`);
  if(kind2==='bp'){
    const fe=fold(+$('f-c2f').value,fsr);
    g.push(`<path class="gridl" stroke-width="1" stroke-dasharray="3 3" d="M${fmt(X(fe),1)} 22 V150"/>`);
  }
  g.push(`<text class="m" x="34" y="16" font-size="9.5">|H(f)| · 정규화</text>`);
  g.push(`<text class="m" x="410" y="178" font-size="9" text-anchor="end">가로축 = 주파수 (GHz)</text>`);
  if(lab) g.push(`<text class="p" x="34" y="194" font-size="9">점선 = ${lab}</text>`);
  g.push(`<text class="m" x="34" y="${lab?208:194}" font-size="9">H(f) = Σ cₖ e^(−j2πf·kΔT) — 240점 직접 합산</text>`);
  $('f-f2b').innerHTML=g.join('');
  if(kind2==='diff'){
    // 피팅 직선에서 ±5% 를 벗어나기 전까지가 쓸 수 있는 대역이다
    let bw=0;
    for(let i=1;i<K;i++){
      const f=fMax*i/(K-1);
      if(Math.abs(H[i]-slope*f)<=0.05*slope*f) bw=f; else break;
    }
    // 그 대역 안에서의 평균 상대오차
    let num=0,den=0;
    for(let i=1;i<K;i++){const f=fMax*i/(K-1); if(f>Math.max(bw,nyq*0.2)) break; num+=Math.abs(H[i]-slope*f); den+=slope*f;}
    $('f-r2b').innerHTML=`선형 대역 (±5% 이내) <b>${fmt(bw,2)} GHz</b> · 나이퀴스트 ${fmt(nyq,1)} GHz 의 <b>${fmt(bw/nyq*100,0)}%</b><br>`+
      `그 대역 평균 오차 <b>${den>0?fmt(num/den*100,1):'—'}%</b><br>`+
      `탭을 늘리면 선형 대역이 넓어진다 — 대신 지연선이 길어지고 손실이 쌓인다`+
      (N%2===1?`<br><span style="color:var(--wall)">탭이 홀수면 대역 끝에 영점이 강제돼 쓸 폭이 반으로 준다</span>`:'');
  }else if(kind2==='int'){
    // −3 dB 지점과 첫 영점
    let f3=null;
    for(let i=1;i<K;i++){const f=fMax*i/(K-1); if(H[i]<H[0]/Math.SQRT2){f3=f;break;}}
    const null1=fsr/N;
    $('f-r2b').innerHTML=`−3 dB 지점 <b>${f3!=null?fmt(f3,2)+' GHz':'—'}</b> · 첫 영점 <b>${fmt(null1,2)} GHz</b><br>`+
      `DC 에서 |H| = <b>${fmt(H[0],3)}</b> — 참 적분기라면 여기서 발산해야 한다<br>`+
      `<span style="color:var(--wall)">탭만으로는 참 적분이 안 된다 — 유한구간 평균일 뿐</span>`;
  }else{
    const peak=H.indexOf(Math.max(...H));
    // −3 dB 통과대역 폭
    let lo=null,hi=null;
    for(let i=0;i<K;i++){const f=fMax*i/(K-1);
      if(H[i]>=hmax/Math.SQRT2){ if(lo===null) lo=f; hi=f; }}
    const fcSet=+$('f-c2f').value, fe=fold(fcSet,fsr);
    $('f-r2b').innerHTML=`첨두 <b>${fmt(fMax*peak/(K-1),2)} GHz</b> · 지정 ${fcSet} GHz<br>`+
      `−3 dB 폭 <b>${lo!=null?fmt(hi-lo,2)+' GHz':'—'}</b> — 탭이 많을수록 좁아진다`+
      (Math.abs(fe-fcSet)>0.05
        ? `<br><span style="color:var(--wall)">지정 ${fcSet} GHz 는 나이퀴스트 ${fmt(nyq,1)} GHz 를 넘어 ${fmt(fe,2)} GHz 로 접혔다 — 탭 간격이 쓸 수 있는 주파수의 상한이다</span>`
        : '');
  }
}

/* ══ 03 콤 ════════════════════════════════════════ */
function r3a(){
  const fsr=+$('f-c3s').value, n=+$('f-c3n').value, rate=+$('f-c3r').value;
  $('f-o3s').textContent=fsr+' GHz';
  $('f-o3n').textContent=n+'개';
  $('f-o3r').textContent=rate+' Gb/s';
  const half=(n-1)/2;
  const g=[];
  g.push(`<path class="gridl" stroke-width="1" d="M26 150 H412"/>`);
  const X=k=>26+(k+half)/(n-1||1)*(412-26);
  const env=k=>{const u=k/(half*0.55+1e-9);const s=2/(Math.exp(u)+Math.exp(-u));return s*s;};
  const step=n>120?2:1;
  for(let k=-half;k<=half;k+=step){
    const h=env(k)*118, x=X(k);
    g.push(`<path class="bm" stroke-width="${n>60?1:1.8}" opacity="${fmt(0.35+0.6*env(k),2)}" d="M${fmt(x,1)} 150 V${fmt(150-Math.max(1,h),1)}"/>`);
  }
  // 간격 표시
  if(n<=41){
    const x0=X(0), x1=X(1);
    g.push(`<path class="pd" stroke-width="1" d="M${fmt(x0,1)} 162 H${fmt(x1,1)}"/>`);
    g.push(`<text class="p" x="${fmt((x0+x1)/2,1)}" y="174" font-size="8.5" text-anchor="middle">${fsr} GHz</text>`);
  }
  g.push(`<text class="m" x="26" y="18" font-size="9.5">커 소리톤 콤 스펙트럼 · 포락선 sech²</text>`);
  g.push(`<text class="m" x="412" y="18" font-size="9" text-anchor="end">빗살 ${n}개 = 채널 ${n}개</text>`);
  const span=(n-1)*fsr;
  g.push(`<text class="m" x="26" y="190" font-size="9">전체 폭 ${fmt(span/1000,2)} THz · 1550 nm 기준 약 ${fmt(span/1000*1550*1550/299.792458/1000,1)} nm</text>`);
  $('f-f3a').innerHTML=g.join('');
  const agg=n*rate;
  $('f-r3a').innerHTML=`채널 <b>${n}</b>개 · 전체 폭 <b>${fmt(span/1000,2)} THz</b><br>`+
    `모으면 <b>${agg>=1000?fmt(agg/1000,2)+' Tb/s':agg+' Gb/s'}</b> (선당 ${rate} Gb/s 기준)<br>`+
    `가장자리 빗살은 세기가 약해 실제로는 못 쓴다 — 평탄화 별도`;
}
function r3b(){
  const fo=+$('f-c3o').value, fm=+$('f-c3m').value, L=+$('f-c3p').value;
  $('f-o3o').textContent=fo+' THz';
  $('f-o3m').textContent=fm+' GHz';
  $('f-o3p').textContent=L+' dBc/Hz';
  const N=fo*1000/fm;                 // THz→GHz
  const gain=20*Math.log10(N);
  const out=L-gain;
  const g=[];
  // 사다리 그림: 광 기준 → 분할 → 마이크로파
  const Y=v=>{const lo=-200,hi=-20;return 142-clamp((v-lo)/(hi-lo),0,1)*110;};
  g.push(`<path class="gridl" stroke-width="1" d="M60 142 H412 M60 24 V142"/>`);
  [-20,-60,-100,-140,-180].forEach(v=>{
    const y=Y(v);
    g.push(`<path class="gridl" stroke-width=".7" opacity=".5" d="M60 ${fmt(y,1)} H412"/>`);
    g.push(`<text class="m" x="56" y="${fmt(y+3,1)}" font-size="8.5" text-anchor="end">${v}</text>`);
  });
  g.push(`<rect class="bmf" x="92" y="${fmt(Y(L),1)}" width="56" height="4" rx="2" opacity=".9"/>`);
  g.push(`<text class="a" x="120" y="${fmt(Y(L)-7,1)}" font-size="9" text-anchor="middle">광 기준 ${L}</text>`);
  g.push(`<rect class="pdf" x="300" y="${fmt(Y(out),1)}" width="56" height="4" rx="2" opacity=".9"/>`);
  g.push(`<text class="p" x="328" y="${fmt(Y(out)+16,1)}" font-size="9" text-anchor="middle">${fmt(out,1)}</text>`);
  g.push(`<path class="pd" stroke-width="1.4" stroke-dasharray="4 3" d="M148 ${fmt(Y(L)+2,1)} H300 M300 ${fmt(Y(L)+2,1)} V${fmt(Y(out),1)}"/>`);
  g.push(`<text class="m" x="224" y="${fmt(Y(L)-6,1)}" font-size="9" text-anchor="middle">÷ N = ${Math.round(N).toLocaleString()}</text>`);
  g.push(`<text class="m" x="306" y="${fmt((Y(L)+Y(out))/2+3,1)}" font-size="9">−20·log N = −${fmt(gain,1)} dB</text>`);
  g.push(`<text class="m" x="60" y="18" font-size="9.5">위상잡음 (dBc/Hz) · 분할의 상한</text>`);
  g.push(`<text class="m" x="60" y="160" font-size="9">${fo} THz → ${fm} GHz · 광학적 분할 눈금을 콤이 들고 있다</text>`);
  g.push(`<text class="m" x="60" y="176" font-size="9">검출기 산탄·열잡음 바닥은 이 계산에 없다</text>`);
  $('f-f3b').innerHTML=g.join('');
  $('f-r3b').innerHTML=`분할비 N = <b>${Math.round(N).toLocaleString()}</b><br>`+
    `위상잡음 저감 20·log₁₀N = <b>${fmt(gain,2)} dB</b><br>`+
    `결과 <b>${fmt(out,1)} dBc/Hz</b>`+
    (Math.abs(fo-200)<0.6&&Math.abs(fm-10)<0.6?`<br><span style="color:var(--probe)">200 THz → 10 GHz · N=20,000 · 86.0 dB — 노트의 숫자와 일치</span>`:'');
}

/* ── 묶기 ───────────────────────────────────────── */
['f-c1t','f-c1v'].forEach(id=>$(id).addEventListener('input',r1a));
$('f-c1n').addEventListener('input',r1b);
$('f-b1r').addEventListener('click',()=>{
  mz1=mz1.map(()=>({t:Math.round(Math.random()*360),p:Math.round(Math.random()*360)}));
  r1b();
});
$('f-b1e').addEventListener('click',()=>{
  mz1=[[60,0],[180,0],[70.5,0],[180,0],[90,0],[180,0]].map(p=>({t:p[0],p:p[1]}));
  r1b();
});
['f-c1e','f-c1m','f-c1p'].forEach(id=>$(id).addEventListener('input',r1c));
['f-c2n','f-c2t','f-c2f'].forEach(id=>$(id).addEventListener('input',r2a));
SEC.querySelectorAll('[data-g="2k"]').forEach(b=>b.addEventListener('click',()=>{
  SEC.querySelectorAll('[data-g="2k"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  kind2=b.dataset.v; r2a();
}));
['f-c3s','f-c3n','f-c3r'].forEach(id=>$(id).addEventListener('input',r3a));
['f-c3o','f-c3m','f-c3p'].forEach(id=>$(id).addEventListener('input',r3b));

/* ── 탭 ─────────────────────────────────────────── */
function showSec(n){
  for(let i=1;i<=4;i++) $('f-s'+i).hidden=(i!==n);
  $('f-src').hidden=(n!==4);
  SEC.querySelectorAll('#f-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===n)));
}
SEC.querySelectorAll('#f-tabs button').forEach(b=>b.addEventListener('click',()=>{
  showSec(+b.dataset.s);
  SEC.scrollIntoView({block:'start',behavior:'smooth'});
}));

/* ── 합본 연결부 ───────────────────────────────── */
let ready=false;
function init(){
  if(ready) return;          // 두 번 불러도 안전
  ready=true;
  r1a();r1b();r1c();r2a();r3a();r3b();   // permanent·240점 합산이 여기서 처음 돈다
  showSec(1);
}

MOD.f={init:init};
})();


}
};
