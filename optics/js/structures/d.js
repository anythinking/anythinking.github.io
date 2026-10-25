/* D · 논리 — 옛 아티팩트 장(html)과 그 장을 움직이는 코드(run).
   compute.js 가 html 을 페이지 밖 요소 트리로 한 번 만들고 run 을 그 트리에 묶은 뒤,
   고른 구조의 그림·손잡이 요소를 그대로 떼어 그림판·오른쪽 패널에 붙인다(복제·대리 없음).
   run 의 document 는 그 트리를 찾는 좁은 창이다: getElementById · querySelector(All) 만. */
(window.CMP = window.CMP || { groups: {} }).groups.d = {
  id: 'd', name: "D · 논리",
  html: "<section id=\"sec-d\" hidden>\n<div class=\"eyebrow\">D군 · 디지털 전광 논리 · 벽은 클럭이 아니다</div>\n<p class=\"lede\" style=\"margin:6px 0 10px\">빛으로 0과 1을 세우려는 여섯 시도. 전부 같은 벽 앞에 서 있다 — 이득·팬아웃·에너지. 손으로 돌려보면 어느 구조가 그 벽의 어느 면을 깎고 있는지 갈린다.</p>\n<div class=\"tabs\" id=\"d-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>S-SEED</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>전광 논리 게이트</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>펨토패럿 O-E-O</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\"><span class=\"n\">04</span>폴라리톤 논리</button>\n  <button type=\"button\" data-s=\"5\" aria-pressed=\"false\"><span class=\"n\">05</span>2D 소재 비선형</button>\n  <button type=\"button\" data-s=\"6\" aria-pressed=\"false\"><span class=\"n\">06</span>자기 스위칭</button>\n  <button type=\"button\" data-s=\"7\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n<div class=\"card sec\" id=\"d-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>S-SEED · 대칭 자기전기광학 소자</h2></div>\n    <div class=\"chips\"><span class=\"chip\">AT&amp;T 벨연구소 · Miller · 1988~93</span><span class=\"chip wall\">대비 2~3:1 · 열 · 집적도</span></div>\n  </div>\n  <p class=\"idea\">1기에서 <span class=\"k\">유일하게 실제로 돌아간</span> 광 논리 소자. 두 입력 빔의 <span class=\"k\">절대 세기가 아니라 비율</span>로 판정하고, 출력 세기는 입력이 아니라 <span class=\"k\">전원과 읽기 빔</span>이 만든다. 이 둘이 묶여서 「이득」이 생긴다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f1\" viewBox=\"0 0 440 232\" role=\"img\" aria-label=\"S-SEED 직렬 다이오드와 쌍안정 히스테리시스\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c1a\">입력 P1</label><input type=\"range\" id=\"d-c1a\" min=\"-100\" max=\"100\" step=\"1\" value=\"-60\"><output id=\"d-o1a\"></output></div>\n        <div class=\"row\"><label for=\"d-c1b\">입력 P2</label><input type=\"range\" id=\"d-c1b\" min=\"-100\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o1b\"></output></div>\n        <div class=\"row\"><label for=\"d-c1r\">읽기 빔</label><input type=\"range\" id=\"d-c1r\" min=\"1\" max=\"100\" step=\"1\" value=\"40\"><output id=\"d-o1r\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"d-b1u\">P1 천천히 올리기</button>\n        <button type=\"button\" id=\"d-b1d\">천천히 내리기</button>\n        <button type=\"button\" id=\"d-b1z\">초기화</button>\n      </div>\n      <div class=\"read\" id=\"d-r1\"></div>\n      <p class=\"note\">슬라이더를 <span class=\"k\">올렸다 내려보면</span> 같은 비율에서 상태가 갈린다. 그 갈림이 래치다 — 비율이 1 근처로 와도 직전 상태를 붙잡고 있다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s2\">\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>전광 논리 게이트 · XGM / XPM / FWM</h2></div>\n    <div class=\"chips\"><span class=\"chip\">SOA·Kerr 매질 · 1990s~현재</span><span class=\"chip wall\">캐스케이드 — 단수마다 소광비가 주저앉는다</span></div>\n  </div>\n  <p class=\"idea\">데이터 빛이 매질의 이득이나 굴절률을 흔들어 다른 빛을 스위칭한다. 논문은 수천 편인데 <span class=\"k\">실물 회로가 거의 없는</span> 이유는 한 단이 아니라 <span class=\"k\">여러 단을 이을 때</span> 드러난다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f2\" viewBox=\"0 0 440 248\" role=\"img\" aria-label=\"SOA 이득포화 곡선과 캐스케이드 소광비\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c2g\">소신호 이득 G₀</label><input type=\"range\" id=\"d-c2g\" min=\"10\" max=\"35\" step=\"1\" value=\"30\"><output id=\"d-o2g\"></output></div>\n        <div class=\"row\"><label for=\"d-c2p\">펌프 「1」 세기</label><input type=\"range\" id=\"d-c2p\" min=\"-30\" max=\"10\" step=\"1\" value=\"-13\"><output id=\"d-o2p\"></output></div>\n        <div class=\"row\"><label for=\"d-c2n\">캐스케이드 단수</label><input type=\"range\" id=\"d-c2n\" min=\"1\" max=\"10\" step=\"1\" value=\"6\"><output id=\"d-o2n\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r2\"></div>\n      <p class=\"note\">이득포화 G = G₀·exp(−(G−1)P/P<sub>sat</sub>)를 매 단마다 실제로 푼다. 출력을 다음 단 펌프로 그대로 넣으면 「0」 레벨이 올라오고, 소광비는 단수마다 깎인다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s3\">\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>펨토패럿 O-E-O</h2></div>\n    <div class=\"chips\"><span class=\"chip\">NTT 2019 · Nozaki 등 · 2 fF급(보고)</span><span class=\"chip wall\">전자를 완전히 못 버린다</span></div>\n  </div>\n  <p class=\"idea\">전광을 고집하지 않는다. 광검출기와 변조기를 <span class=\"k\">배선 없이 맞붙여</span> 용량을 fF로 떨어뜨리면, 전자 한 토막이 끼어도 에너지가 fJ에 머문다. 대신 전광이 못 주던 것 셋 — <span class=\"k\">이득·캐스케이드·파장변환</span> — 이 한 번에 들어온다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f3\" viewBox=\"0 0 440 232\" role=\"img\" aria-label=\"용량에 따른 스위칭 에너지와 RC 시정수\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c3c\">용량 C</label><input type=\"range\" id=\"d-c3c\" min=\"0\" max=\"100\" step=\"1\" value=\"12\"><output id=\"d-o3c\"></output></div>\n        <div class=\"row\"><label for=\"d-c3v\">구동 전압 V</label><input type=\"range\" id=\"d-c3v\" min=\"10\" max=\"200\" step=\"5\" value=\"50\"><output id=\"d-o3v\"></output></div>\n        <div class=\"row\"><label for=\"d-c3r\">부하 저항 R</label><input type=\"range\" id=\"d-c3r\" min=\"0\" max=\"100\" step=\"1\" value=\"50\"><output id=\"d-o3r\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r3\"></div>\n      <p class=\"note\">E = ½CV², τ = RC, f₃dB = 1/2πRC를 그대로 계산한다. 광자 수는 1.55 µm(0.80 eV) 기준. 보통 소자(수십 fF)와 2 fF를 나란히 둔 막대가 전부를 말한다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s4\">\n  <div class=\"head\">\n    <div><div class=\"num\">04</div><h2>폴라리톤 논리</h2></div>\n    <div class=\"chips\"><span class=\"chip\">IBM 취리히 · 유기 마이크로캐비티</span><span class=\"chip wall\">응집 유지 · 소자화 미검증</span></div>\n  </div>\n  <p class=\"idea\">빛과 물질을 섞어버린다. 광자에 엑시톤을 입히면 <span class=\"k\">광자끼리 서로를 느끼게</span> 되고, 그러면 스위칭에 필요한 광자 수가 내려간다. 비선형을 매질에서 꺼내는 게 아니라 <span class=\"k\">입자를 바꿔</span> 꺼낸다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f4\" viewBox=\"0 0 440 214\" role=\"img\" aria-label=\"상호작용 세기에 따른 필요 광자수\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c4g\">상호작용 배율</label><input type=\"range\" id=\"d-c4g\" min=\"0\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o4g\"></output></div>\n        <div class=\"row\"><label for=\"d-c4q\">캐비티 Q</label><input type=\"range\" id=\"d-c4q\" min=\"0\" max=\"100\" step=\"1\" value=\"33\"><output id=\"d-o4q\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r4\"></div>\n      <p class=\"note\"><i>보고값</i> — 비선형 60배 · 10 fJ · 상온 동작(IBM 취리히 유기 폴라리톤 소자). <b>측정 조건과 재현성은 확인되지 않았다 — 미확인으로 둔다.</b> 아래 숫자는 N = πℏω/(g·Q) 스케일링이고 상수는 1로 잡은 추정이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s5\">\n  <div class=\"head\">\n    <div><div class=\"num\">05</div><h2>2D 소재 비선형</h2></div>\n    <div class=\"chips\"><span class=\"chip\">그래핀·TMD 도포 도파로 · GATEPOST(세부 미확인)</span><span class=\"chip wall\">비선형과 손실이 같이 커진다</span></div>\n  </div>\n  <p class=\"idea\">구조를 바꾸는 게 아니라 <span class=\"k\">재료의 χ⁽³⁾ 자체를 키운다</span>. 도파로 위에 2D 층을 덮으면 n₂가 수백~수천 배로 뛴다. 그러면 π 위상을 만드는 길이가 그만큼 짧아진다 — 거기까지는 맞다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f5\" viewBox=\"0 0 440 218\" role=\"img\" aria-label=\"비선형 배율에 따른 필요 길이와 손실\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c5m\">χ⁽³⁾ 배율</label><input type=\"range\" id=\"d-c5m\" min=\"0\" max=\"100\" step=\"1\" value=\"50\"><output id=\"d-o5m\"></output></div>\n        <div class=\"row\"><label for=\"d-c5p\">광 파워</label><input type=\"range\" id=\"d-c5p\" min=\"1\" max=\"100\" step=\"1\" value=\"30\"><output id=\"d-o5p\"></output></div>\n        <div class=\"row\"><label for=\"d-c5f\">손실 개선</label><input type=\"range\" id=\"d-c5f\" min=\"0\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o5f\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r5\"></div>\n      <p class=\"note\">π 위상 길이 L = λ/(2n₂I)를 실제로 계산한다. <span class=\"k\">χ⁽³⁾ 배율만 올려보라</span> — 길이는 줄는데 π당 손실은 어느 값에서 멈춘다. 흡수도 같은 진동자 세기에서 나오니 같이 커지기 때문이다. 내려가는 건 「손실 개선」 손잡이뿐이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s6\">\n  <div class=\"head\">\n    <div><div class=\"num\">06</div><h2>자기 스위칭 · PhC / SWG 비선형 공진기</h2></div>\n    <div class=\"chips\"><span class=\"chip\">Soljačić·Joannopoulos 계보</span><span class=\"chip wall\">임계 세기 — Q와 모드부피가 전부</span></div>\n  </div>\n  <p class=\"idea\">제어 빛이 따로 없다. <span class=\"k\">입력 자신의 세기가 공진 조건을 밀어서</span> 스스로 경로를 바꾼다. 소자가 가장 단순한 대신 승부는 하나로 모인다 — 임계 세기를 어디까지 내리나.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f6\" viewBox=\"0 0 440 236\" role=\"img\" aria-label=\"Kerr 공진기 쌍안정 S곡선과 임계 파워\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c6x\">입력 세기 X</label><input type=\"range\" id=\"d-c6x\" min=\"0\" max=\"100\" step=\"1\" value=\"20\"><output id=\"d-o6x\"></output></div>\n        <div class=\"row\"><label for=\"d-c6d\">디튜닝 Δ</label><input type=\"range\" id=\"d-c6d\" min=\"0\" max=\"80\" step=\"1\" value=\"40\"><output id=\"d-o6d\"></output></div>\n        <div class=\"row\"><label for=\"d-c6q\">Q</label><input type=\"range\" id=\"d-c6q\" min=\"0\" max=\"100\" step=\"1\" value=\"40\"><output id=\"d-o6q\"></output></div>\n        <div class=\"row\"><label for=\"d-c6v\">모드부피 V</label><input type=\"range\" id=\"d-c6v\" min=\"0\" max=\"100\" step=\"1\" value=\"30\"><output id=\"d-o6v\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r6\"></div>\n      <p class=\"note\">Y³ − 2ΔY² + (1+Δ²)Y = X를 푼다. <span class=\"k\">Δ &gt; √3</span>이라야 히스테리시스가 열리고, 그 아래선 그냥 휘어진 곡선이다. X를 올렸다 내려보면 점프 지점이 갈린다. Q 손잡이가 임계를 <span class=\"k\">Q²로</span> 끌어내린다 — 그게 이 구조의 전부다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"d-s7\">\n  <h2 style=\"font-size:16px\">여섯을 겹쳐 보면</h2>\n  <div class=\"fig\" style=\"margin:12px 0 4px\"><svg class=\"f\" id=\"d-f7\" viewBox=\"0 0 440 230\" role=\"img\" aria-label=\"여섯 구조가 깎는 벽의 면\"></svg></div>\n  <p style=\"margin-top:10px\"><b>벽은 클럭이 아니었다.</b> 광 논리가 전자를 못 이긴 이유로 흔히 속도를 꼽지만, 벨연구소가 1990~93년에 이 길을 접은 실제 이유는 셋이었다 — <span class=\"k\">이득이 없고, 팬아웃이 안 되고, 에너지가 안 맞았다</span>. 게이트 하나는 빠르게 돌아도 그 출력이 다음 게이트 둘을 켜지 못하면 회로가 서지 않는다. 트랜지스터가 공짜로 주던 것(전원에서 이득을 꺼내 쓰기, 출력 하나로 입력 여럿 때리기, 상태를 유지할 때 전력 안 먹기)을 빛은 하나도 공짜로 주지 않는다.</p>\n  <p><b>01이 유일하게 돌아간 건 이득을 포기하지 않았기 때문이다.</b> S-SEED는 입력 빔으로 연산하지 않는다 — 입력은 <span class=\"k\">상태만</span> 정하고, 출력 세기는 바이어스 전원과 읽기 빔이 만든다. 전자회로가 하는 일을 그대로 베낀 셈이다. 그래서 캐스케이드가 됐고, 그래서 1기에서 유일하게 실물이 나왔다. 02가 논문만 많고 회로가 없는 이유는 그 반대다 — 입력 빛 자체가 출력을 만들어서, 슬라이더로 단수를 늘려보면 소광비가 몇 단 안에 주저앉는다.</p>\n  <p><b>03~06은 같은 벽을 서로 다른 면에서 깎는다.</b> 03은 전광을 포기하는 대신 전자 토막을 극단적으로 줄여 이득·캐스케이드·파장변환을 한꺼번에 사온다 — 가장 실용적이고, 가장 「순수하지 않은」 길이다. 04는 광자를 폴라리톤으로 바꿔 상호작용을 키우고, 05는 재료의 χ⁽³⁾를 키우고, 06은 캐비티로 같은 빛을 수천 번 되돌려 실효 비선형을 키운다. 셋은 전부 「같은 광자 수로 더 큰 비선형」을 노리는 같은 문제의 다른 답이다.</p>\n  <p><b>그리고 셋의 바닥이 한 군데서 만난다.</b> 05를 돌려보면 비선형만 키워도 π당 손실이 안 내려간다 — 흡수가 같이 커진다. 06을 돌려보면 임계가 <span class=\"k\">V/Q²</span>로 간다. 04의 스케일링도 g·Q 곱에 묶인다. 결국 전부 <span class=\"k\">캐비티를 작게, Q를 높게</span>로 수렴한다. 재료를 바꾸는 길도, 입자를 바꾸는 길도, 마지막엔 그 작은 캐비티를 만들 수 있느냐에 걸린다.</p>\n  <p><b>남는 질문은 물리가 아니라 사람 수다.</b> 네 경로(폴라리톤 · PhC 나노캐비티와 광 RAM · 펨토패럿 O-E-O · 초전도 광전자)는 물리적으로 열려 있지만, 각각 세계적으로 연구그룹이 얇다. 벽을 낮추는 방법을 아는 것과 그걸 할 자리가 있는 것은 다른 문제다.</p>\n</div>\n\n<div class=\"pending\" id=\"d-pend\">\n  <b>같은 틀의 다른 묶음</b> — A군(행렬곱 여덟 구조)과 4×4 MZI 메시는 따로 있다. B군(리저버·스파이킹·포토닉 텐서코어) · C군(이징 머신) · E군(in-sensor·메타표면) · F군(선형광학 양자컴·주파수 콤)은 이어서 만든다.\n</div>\n</section>",
  run: function (document, getComputedStyle, MOD) {


(function(){

const $=id=>document.getElementById('d-'+id);
const SEC=()=>document.getElementById('sec-d');
const shown=()=>{const e=SEC();return !!e&&!e.hidden&&e.offsetParent!==null;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(v,n)=>v.toFixed(n==null?2:n);
const lg=(s,lo,hi)=>lo*Math.pow(hi/lo,s/100);          /* 슬라이더 → 로그 스케일 */
function eng(v,unit,digits){                            /* SI 접두어 */
  const a=Math.abs(v); let s=1,p='';
  if(a===0){s=1;p='';}
  else if(a<1e-15){s=1e18;p='a';} else if(a<1e-12){s=1e15;p='f';}
  else if(a<1e-9){s=1e12;p='p';} else if(a<1e-6){s=1e9;p='n';}
  else if(a<1e-3){s=1e6;p='µ';} else if(a<1){s=1e3;p='m';}
  else if(a<1e3){s=1;p='';} else if(a<1e6){s=1e-3;p='k';}
  else if(a<1e9){s=1e-6;p='M';} else if(a<1e12){s=1e-9;p='G';}
  else {s=1e-12;p='T';}
  return (v*s).toFixed(digits==null?2:digits)+' '+p+unit;
}
function axes(x0,y0,w,h,xl,yl){
  return `<path class="gridl" stroke-width="1" d="M${x0} ${y0-h} V${y0} H${x0+w}"/>
  <text class="m" x="${x0+w}" y="${y0+14}" font-size="9" text-anchor="end">${xl}</text>
  <text class="m" x="${x0-3}" y="${y0-h-4}" font-size="9" text-anchor="end">${yl}</text>`;
}

/* ══ 01 S-SEED ═══════════════════════════════════════════════
   두 MQW 다이오드 직렬. QCSE로 엑시톤 피크가 전계²만큼 적색이동하니
   고정 파장에서의 흡수 α(v)는 v에 대해 봉우리를 갖는다 (v = 바이어스 분배).
   정상상태 조건: P1·α(v) = P2·α(1−v)  ← 직렬이라 광전류가 같아야 한다.
   그 봉우리 때문에 해가 셋 생기고, 가운데가 불안정해 래치가 된다.      */
const AL=v=>0.03+Math.exp(-Math.pow((v*v-0.4)/0.3,2));
const TR=a=>Math.exp(-8*a);                             /* 창의 투과 (대비 ~3:1) */
let v1=0.5, anim1=null, trail1=[];
function relax1(v,P1,P2,n){
  const s=P1+P2;
  for(let i=0;i<n;i++){ const dv=-(P1*AL(v)-P2*AL(1-v))/s*0.09; v=clamp(v+dv,0.002,0.998); }
  return v;
}
function branch1(dir){                                  /* 준정적 분기 곡선 */
  const pts=[]; let v=dir>0?0.98:0.02;
  for(let k=0;k<=80;k++){ const t=dir>0?k:80-k; const lr=-2+4*t/80;
    v=relax1(v,Math.pow(10,lr),1,260); pts.push([lr,v]); }
  return dir>0?pts:pts.reverse();
}
let BR1U=null, BR1D=null;
function r1(){
  if(!BR1U){ BR1U=branch1(1); BR1D=branch1(-1); }
  const P1=Math.pow(10,+$('c1a').value/40), P2=Math.pow(10,+$('c1b').value/40), Pr=+$('c1r').value/20;
  $('o1a').textContent=fmt(P1,P1<1?3:1); $('o1b').textContent=fmt(P2,P2<1?3:1);
  $('o1r').textContent=fmt(Pr,2);
  v1=relax1(v1,P1,P2,300);
  const a1=AL(v1), a2=AL(1-v1), T1=TR(a1), T2=TR(a2);
  const lr=Math.log10(P1/P2);
  trail1.push([lr,v1]); if(trail1.length>140) trail1.shift();
  const out1=Pr*T1/2, out2=Pr*T2/2, hi=Math.max(T1,T2), lo=Math.min(T1,T2);
  const st=T1>T2?'1':'0';
  const px=x=>196+(x+2)*(428-196)/4, py=y=>206-y*140;
  const path=p=>'M'+p.map(q=>px(q[0]).toFixed(1)+' '+py(q[1]).toFixed(1)).join(' L');
  const bw=p=>Math.max(1.2,1.2+4.2*Math.min(1,p/3));
  $('f1').innerHTML=`
    <path class="wg" stroke-width="1.3" d="M92 22 H92 M62 22 H122"/>
    <text class="m" x="126" y="25" font-size="9">+V 바이어스</text>
    <path class="wg" stroke-width="1.3" d="M92 22 V38"/>
    <rect class="box" x="64" y="38" width="56" height="38" rx="3"/>
    <rect x="64" y="38" width="56" height="38" rx="3" fill="var(--ink)" opacity="${(a1*0.55).toFixed(3)}"/>
    <text class="m" x="92" y="33" font-size="9" text-anchor="middle">창 1 · α=${fmt(a1)}</text>
    <path class="wg" stroke-width="1.3" d="M92 76 V96"/>
    <circle class="pdf" cx="92" cy="86" r="2.6"/>
    <text class="p" x="100" y="89" font-size="9">Vm</text>
    <rect class="box" x="64" y="96" width="56" height="38" rx="3"/>
    <rect x="64" y="96" width="56" height="38" rx="3" fill="var(--ink)" opacity="${(a2*0.55).toFixed(3)}"/>
    <text class="m" x="92" y="147" font-size="9" text-anchor="middle">창 2 · α=${fmt(a2)}</text>
    <path class="wg" stroke-width="1.3" d="M92 134 V152 M76 152 H108 M81 157 H103 M86 162 H98"/>
    <path class="bm" stroke-width="${bw(P1)}" d="M8 57 H62"/>
    <path class="bm" stroke-width="${bw(P2)}" d="M8 115 H62"/>
    <text class="a" x="8" y="50" font-size="9">P1</text>
    <text class="a" x="8" y="108" font-size="9">P2</text>
    <path class="pd" stroke-width="${bw(out1*3)}" d="M122 57 H176"/>
    <path class="pd" stroke-width="${bw(out2*3)}" d="M122 115 H176"/>
    <text class="p" x="176" y="50" font-size="9" text-anchor="end">읽기</text>
    <rect class="fillg" x="30" y="38" width="9" height="96"/>
    <rect class="pdf" x="30" y="${(38+96*(1-v1)).toFixed(1)}" width="9" height="${(96*v1).toFixed(1)}" opacity=".55"/>
    <text class="m" x="34" y="176" font-size="8" text-anchor="middle">바이어스<tspan x="34" dy="10">분배 v</tspan>
    <tspan x="34" dy="10">${fmt(v1)}</tspan></text>
    ${axes(196,206,232,150,'','v')}
    <path class="gridl" stroke-width="1" stroke-dasharray="2 3" d="M${px(0)} 206 V60"/>
    <text class="m" x="${px(0)}" y="218" font-size="8" text-anchor="middle">1:1</text>
    <text class="m" x="196" y="218" font-size="8">0.01</text>
    <text class="m" x="428" y="218" font-size="8" text-anchor="end">100</text>
    <text class="m" x="312" y="230" font-size="8" text-anchor="middle">입력 비율 P1/P2</text>
    <path class="bm" stroke-width="1.6" opacity=".55" d="${path(BR1U)}"/>
    <path class="pd" stroke-width="1.6" opacity=".55" stroke-dasharray="4 3" d="${path(BR1D)}"/>
    <path class="bm" stroke-width="2.4" d="${path(trail1)}" opacity=".9"/>
    <circle class="pdf" cx="${px(clamp(lr,-2,2)).toFixed(1)}" cy="${py(v1).toFixed(1)}" r="4"/>
    <text class="a" x="204" y="74" font-size="8.5">— 올릴 때</text>
    <text class="p" x="204" y="86" font-size="8.5">-- 내릴 때</text>
    <text class="m" x="428" y="74" font-size="8.5" text-anchor="end">두 곡선 사이 = 래치 구간</text>`;
  $('r1').innerHTML=`<div>판정 상태 <b>${st}</b> · 비율 P1/P2 = <b>${fmt(P1/P2,3)}</b></div><div>창 투과 T1 <b>${fmt(T1,3)}</b> / T2 <b>${fmt(T2,3)}</b> · 대비 <b>${fmt(hi/lo,2)}:1</b></div><div>출력 <b>${fmt(out1,3)}</b> / <b>${fmt(out2,3)}</b> ← 세기는 읽기 빔이 만든다</div><div>이득 = 출력차 / 입력합 = <b>${(()=>{const g=Pr*Math.abs(T1-T2)/(P1+P2);return g<0.01?g.toExponential(1):fmt(g,2);})()}</b> ← 입력을 약하게 할수록 커진다</div>`;
}
function sweep1(dir){
  if(anim1) clearInterval(anim1);
  const el=$('c1a');
  anim1=setInterval(()=>{
    const nv=+el.value+dir*3;
    if(nv>100||nv<-100||!shown()){ clearInterval(anim1); anim1=null; return; }
    el.value=nv; r1();
  },45);
}
/* ══ 02 전광 논리 게이트 (SOA 교차이득변조) ═══════════════════
   Agrawal의 이득포화 관계 G = G₀·exp(−(G−1)·P/P_sat) 를 매 단마다 수치로 푼다.
   XGM 인버터: 펌프가 세면 이득이 꺼지니 프로브 출력이 반전된다.
   출력을 다음 단 펌프로 넣으면 「0」 레벨이 0이 아니라 유한해서, 소광비가 깎인다. */
function Gsat(G0,p){
  let G=G0;
  for(let i=0;i<300;i++){ const n=G0*Math.exp(-(G-1)*p); G=G+0.25*(n-G); if(!isFinite(G)) return 1; }
  return Math.max(1,G);
}
function r2(){
  const g0dB=+$('c2g').value, G0=Math.pow(10,g0dB/10);
  const pdB=+$('c2p').value, p1=Math.pow(10,pdB/10);
  const N=Math.round(+$('c2n').value);
  $('o2g').textContent=g0dB+' dB'; $('o2p').textContent=pdB+' dB'; $('o2n').textContent=N+' 단';
  /* 이득포화 곡선 */
  const cv=[]; for(let k=0;k<=70;k++){ const p=Math.pow(10,-3.5+4*k/70); cv.push([Math.log10(p),10*Math.log10(Gsat(G0,p))]); }
  /* 캐스케이드 */
  let hi=p1, lo=p1*0.01, ers=[];
  for(let n=1;n<=10;n++){
    const Ghi=Gsat(G0,hi), Glo=Gsat(G0,lo);
    const oHi=Glo, oLo=Ghi;                              /* 반전: 펌프 低 → 이득 高 */
    ers.push(10*Math.log10(oHi/oLo));
    const s=p1/oHi; hi=oHi*s; lo=oLo*s;                  /* 다음 단 펌프로 재주입 */
  }
  const er1=ers[0], erN=ers[N-1];
  let dead=null; for(let i=0;i<10;i++) if(dead===null&&ers[i]<10) dead=i+1;
  const gMax=10*Math.log10(G0);
  const px=x=>36+(x+3.5)*(390-36)/4, py=y=>120-(y/Math.max(5,gMax))*100;
  const path=p=>'M'+p.map(q=>px(q[0]).toFixed(1)+' '+py(q[1]).toFixed(1)).join(' L');
  let bars='';
  for(let i=0;i<10;i++){
    const x=40+i*35, h=clamp(ers[i]/Math.max(12,er1)*78,0.6,78), on=i<N;
    bars+=`<rect x="${x}" y="${(236-h).toFixed(1)}" width="23" height="${h.toFixed(1)}" rx="2"
      fill="${ers[i]>=10?'var(--probe)':'var(--wall)'}" opacity="${on?0.85:0.16}"/>
      <text class="m" x="${x+11.5}" y="246" font-size="8" text-anchor="middle">${i+1}</text>
      ${on?`<text class="m" x="${x+11.5}" y="${(232-h).toFixed(1)}" font-size="8" text-anchor="middle">${fmt(ers[i],1)}</text>`:''}`;
  }
  const y10=236-clamp(10/Math.max(12,er1)*78,0.6,78);
  $('f2').innerHTML=`
    ${axes(36,120,354,100,'펌프 세기 log₁₀(P/P_sat)','dB')}
    <text class="m" x="33" y="24" font-size="8.5" text-anchor="end">${fmt(gMax,0)}</text>
    <path class="bm" stroke-width="2" d="${path(cv)}"/>
    <circle class="pdf" cx="${px(Math.log10(p1*0.01)).toFixed(1)}" cy="${py(10*Math.log10(Gsat(G0,p1*0.01))).toFixed(1)}" r="3.5"/>
    <circle cx="${px(Math.log10(p1)).toFixed(1)}" cy="${py(10*Math.log10(Gsat(G0,p1))).toFixed(1)}" r="3.5" fill="var(--beam)"/>
    <text class="p" x="${px(Math.log10(p1*0.01))+6}" y="${py(10*Math.log10(Gsat(G0,p1*0.01)))-6}" font-size="8.5">펌프 0</text>
    <text class="a" x="${px(Math.log10(p1))+5}" y="${py(10*Math.log10(Gsat(G0,p1)))+12}" font-size="8.5">펌프 1</text>
    <text class="m" x="390" y="152" font-size="9" text-anchor="end">단수 →</text>
    <text class="m" x="36" y="152" font-size="9">단별 소광비 (dB)</text>
    <path class="gridl" stroke-width="1" stroke-dasharray="3 3" d="M36 ${y10.toFixed(1)} H390"/>
    <text class="m" x="390" y="${(y10-3).toFixed(1)}" font-size="8" text-anchor="end">실용 하한 10 dB(통상)</text>
    ${bars}`;
  $('r2').innerHTML=`<div>1단 소광비 <b>${fmt(er1,2)} dB</b> → ${N}단 후 <b>${fmt(erN,2)} dB</b></div><div>펌프 1에서 이득 <b>${fmt(10*Math.log10(Gsat(G0,p1)),2)} dB</b> (소신호 ${fmt(gMax,1)} dB에서 ${fmt(gMax-10*Math.log10(Gsat(G0,p1)),1)} dB 눌림)</div><div>${dead?`<i>${dead}단에서 10 dB 밑으로 내려간다</i>`:'10단까지 10 dB 유지'}</div>`;
}

/* ══ 03 펨토패럿 O-E-O ════════════════════════════════════════
   순수 산수다 — E=½CV², τ=RC, f₃dB=1/2πRC. 그래서 벽이 어디인지가 선명하다. */
const HV=1.28e-19;                                       /* 1.55 µm 광자 = 0.80 eV */
function oeo(C_fF,V,R_k){
  const C=C_fF*1e-15, E=0.5*C*V*V, tau=R_k*C_fF*1e-12;   /* kΩ·fF = ps */
  return {E:E, tau:tau, f:1/(2*Math.PI*tau), N:E/HV, I:V/(R_k*1e3)};
}
function r3(){
  const C=lg(+$('c3c').value,0.5,200), V=+$('c3v').value/100, R=lg(+$('c3r').value,0.5,200);
  $('o3c').textContent=fmt(C,C<10?2:0)+' fF'; $('o3v').textContent=fmt(V,2)+' V';
  $('o3r').textContent=fmt(R,R<10?2:0)+' kΩ';
  const a=oeo(C,V,R), ref=oeo(2,V,R), big=oeo(50,V,R);
  const mx=Math.max(a.E,big.E);
  const bar=(x,e,lab,col)=>{ const h=clamp(e/mx*40,1,40);
    return `<rect x="${x}" y="${(186-h).toFixed(1)}" width="46" height="${h.toFixed(1)}" rx="2" fill="${col}" opacity=".8"/>
      <text class="m" x="${x+23}" y="199" font-size="8.5" text-anchor="middle">${lab}</text>
      <text class="i" x="${x+23}" y="${(182-h).toFixed(1)}" font-size="8.5" text-anchor="middle">${eng(e,'J',1)}</text>`; };
  const rad=Math.sqrt(C/200)*26+4;                        /* 용량을 면적으로 */
  $('f3').innerHTML=`
    <circle class="pd" stroke-width="1.4" cx="46" cy="52" r="15"/>
    <path class="bm" stroke-width="3.4" d="M8 52 H31"/>
    <text class="m" x="46" y="82" font-size="8.5" text-anchor="middle">PD</text>
    <path class="wg" stroke-width="1.3" d="M61 52 H${(106-rad).toFixed(1)}"/>
    <circle cx="106" cy="52" r="${rad.toFixed(1)}" fill="var(--warm)" opacity=".30"/>
    <circle class="gridl" stroke-width="1.2" cx="106" cy="52" r="${rad.toFixed(1)}" fill="none"/>
    <text class="m" x="106" y="${(52+rad+13).toFixed(1)}" font-size="8.5" text-anchor="middle">C = ${fmt(C,C<10?2:0)} fF</text>
    <path class="wg" stroke-width="1.3" d="M${(106+rad).toFixed(1)} 52 H168"/>
    <rect class="box" x="168" y="36" width="52" height="32" rx="3"/>
    <text class="m" x="194" y="56" font-size="8.5" text-anchor="middle">변조기</text>
    <path class="bm" stroke-width="3.4" d="M220 52 H258"/>
    <text class="a" x="258" y="45" font-size="8.5" text-anchor="end">λ′ 출력</text>
    <text class="m" x="276" y="30" font-size="8.5">배선 없이 맞붙인다</text>
    <text class="m" x="276" y="43" font-size="8.5">→ 기생용량이 안 붙는다</text>
    <text class="p" x="276" y="60" font-size="8.5">τ = RC = ${fmt(a.tau*1e12,2)} ps</text>
    <text class="p" x="276" y="73" font-size="8.5">f₃dB = ${fmt(a.f/1e9,1)} GHz</text>
    <text class="m" x="36" y="100" font-size="9">스위칭 에너지 ½CV² — 같은 V·R에서</text>
    <text class="m" x="36" y="115" font-size="8.5">필요 광자 ${Math.round(a.N).toLocaleString()}개 · 충전 전류 ${eng(a.I,'A',2)}</text>
    <text class="m" x="36" y="128" font-size="8.5">1 pF로 같은 일을 하면 ${eng(oeo(1000,V,R).E,'J',1)} — 500배다</text>
    ${bar(36,ref.E,'2 fF','var(--probe)')}
    ${bar(100,a.E,'현재','var(--beam)')}
    ${bar(164,big.E,'50 fF','var(--wall)')}
    <text class="m" x="222" y="148" font-size="8.5">50 fF 대비 <tspan style="fill:var(--probe)">${fmt(big.E/a.E,1)}배</tspan> 적다</text>
    <text class="m" x="222" y="162" font-size="8.5">전자 CMOS 게이트 ~1 fJ급과</text>
    <text class="m" x="222" y="175" font-size="8.5">같은 자리에 선다</text>
    <text class="m" x="222" y="190" font-size="8.5">(비교값은 통상 범위 — 공정별로</text>
    <text class="m" x="222" y="203" font-size="8.5">다르다)</text>
    <text class="m" x="36" y="220" font-size="8.5" style="fill:var(--wall)">용량이 전부다 — 배선을 없애는 일이 곧 에너지를 줄이는 일이다.</text>`;
  $('r3').innerHTML=`<div>스위칭 에너지 <b>${eng(a.E,'J',2)}</b> · τ=RC <b>${fmt(a.tau*1e12,2)} ps</b></div><div>대역폭 <b>${fmt(a.f/1e9,1)} GHz</b> · 필요 광자 <b>${Math.round(a.N).toLocaleString()}</b>개</div><div>2 fF 기준 대비 <b>${fmt(a.E/ref.E,2)}배</b></div><div><i>전광이 아니다 — 전자를 못 버리는 대신 이득·캐스케이드·파장변환을 얻는다</i></div>`;
}
/* ══ 04 폴라리톤 논리 ═════════════════════════════════════════
   광자에 엑시톤을 섞으면 입자당 상호작용 에너지 g가 생긴다.
   비선형 위상이 π에 닿으려면 (N·g/ℏ)·t = π, 광자 수명 t = Q/ω 이니
   N = πℏω/(g·Q).  상수를 1로 잡은 스케일링 추정이다 — 실측이 아니다. */
const EV=1.602e-19, HW4=2.25*EV;                          /* 유기 캐비티 ~550 nm */
function pol(m,Q){ const g=1e-6*EV*m; const N=Math.PI*HW4/(g*Q); return {N:N,E:N*HW4,g:g/EV*1e6}; }
function r4(){
  const m=lg(+$('c4g').value,1,300), Q=lg(+$('c4q').value,100,1e5);
  $('o4g').textContent=fmt(m,m<10?2:0)+'×'; $('o4q').textContent=Q>=1e4?fmt(Q/1e3,1)+'k':fmt(Q,0);
  const a=pol(m,Q), base=pol(1,Q), rep=pol(60,Q);
  const cv=[]; for(let k=0;k<=70;k++){ const mm=Math.pow(10,2.48*k/70); cv.push([Math.log10(mm),Math.log10(pol(mm,Q).E)]); }
  const yLo=Math.log10(pol(300,Q).E), yHi=Math.log10(pol(1,Q).E), sp=Math.max(0.5,yHi-yLo);
  const px=x=>44+x*(392-44)/2.48, py=y=>146-(y-yLo)/sp*116;
  const path=p=>'M'+p.map(q=>px(q[0]).toFixed(1)+' '+py(clamp(q[1],yLo,yHi)).toFixed(1)).join(' L');
  $('f4').innerHTML=`
    ${axes(44,146,348,120,'','에너지')}
    <text class="m" x="44" y="160" font-size="8">1×</text>
    <text class="m" x="${px(Math.log10(60))}" y="160" font-size="8" text-anchor="middle">60×</text>
    <text class="m" x="392" y="160" font-size="8" text-anchor="end">300×</text>
    <text class="m" x="218" y="172" font-size="8.5" text-anchor="middle">상호작용 배율 (로그)</text>
    <text class="m" x="41" y="30" font-size="8" text-anchor="end">${eng(pol(1,Q).E,'J',0)}</text>
    <text class="m" x="41" y="149" font-size="8" text-anchor="end">${eng(pol(300,Q).E,'J',0)}</text>
    <path class="bm" stroke-width="2" d="${path(cv)}"/>
    <path class="gridl" stroke-width="1" stroke-dasharray="2 3" d="M${px(Math.log10(60))} 146 V${py(clamp(Math.log10(rep.E),yLo,yHi)).toFixed(1)}"/>
    <circle cx="${px(Math.log10(60)).toFixed(1)}" cy="${py(clamp(Math.log10(rep.E),yLo,yHi)).toFixed(1)}" r="3.2" fill="var(--wall)"/>
    <text class="m" x="${(px(Math.log10(60))+6).toFixed(1)}" y="${(py(clamp(Math.log10(rep.E),yLo,yHi))-6).toFixed(1)}" font-size="8" style="fill:var(--wall)">보고 지점 60×</text>
    <circle class="pdf" cx="${px(clamp(Math.log10(m),0,2.48)).toFixed(1)}" cy="${py(clamp(Math.log10(a.E),yLo,yHi)).toFixed(1)}" r="4"/>
    <text class="m" x="44" y="190" font-size="8.5">엑시톤 + 광자 = 폴라리톤 · 입자당 g = ${fmt(a.g,2)} µeV (가정)</text>
    <text class="m" x="44" y="203" font-size="8.5">같은 비선형을 순수 광자로 얻으려면 광자 ${Math.round(base.N).toLocaleString()}개가 필요하다</text>
    <text class="m" x="44" y="216" font-size="8.5" style="fill:var(--wall)">곡선은 N ∝ 1/(g·Q) 스케일링 — 보고값과 자리만 맞춰본 추정이다</text>`;
  $('r4').innerHTML=`<div>필요 광자 <b>${a.N<1?fmt(a.N,2):Math.round(a.N).toLocaleString()}</b>개 · 에너지 <b>${eng(a.E,'J',2)}</b></div><div>1× 대비 <b>${fmt(base.N/a.N,1)}배</b> 줄었다 (g·Q 곱에 반비례)</div><div><i>보고값 10 fJ·상온·60배 — 측정 조건 미확인</i></div>`;
}

/* ══ 05 2D 소재 비선형 ════════════════════════════════════════
   π 위상 길이 L = λ/(2·n₂·I).  n₂는 χ⁽³⁾ 배율에 비례해 커지지만
   흡수도 같은 진동자 세기에서 나오니 함께 커진다 → π당 손실 α·L은 평평해진다.
   그래서 실제 지표는 n₂/α (FOM) 이고, 배율만 올리는 건 어느 선에서 멈춘다. */
const LAM=1.55e-6, N2SI=6e-18, AEFF=1e-13;
function nl(m,P_mW,F){
  const I=P_mW*1e-3/AEFF, n2=N2SI*m;
  const L=LAM/(2*n2*I);                                   /* m */
  const aDB=2+1.0*m/F;                                    /* dB/cm: 기반 2 + 2D층 기여 */
  return {L:L, a:aDB, loss:aDB*L*100, fom:n2/(aDB*LAM)};
}
function r5(){
  const m=lg(+$('c5m').value,1,3000), P=+$('c5p').value*2, F=lg(+$('c5f').value,1,30);
  $('o5m').textContent=fmt(m,m<10?2:0)+'×'; $('o5p').textContent=P+' mW'; $('o5f').textContent=fmt(F,1)+'×';
  const a=nl(m,P,F), b=nl(1,P,F), asym=nl(1e6,P,F);
  const cv=[]; for(let k=0;k<=70;k++){ const mm=Math.pow(10,3.48*k/70); cv.push([Math.log10(mm),nl(mm,P,F).loss]); }
  const lMax=Math.max(b.loss,1);
  const px=x=>44+x*(392-44)/3.48, py=y=>142-clamp(y/lMax,0,1)*110;
  const path=p=>'M'+p.map(q=>px(q[0]).toFixed(1)+' '+py(q[1]).toFixed(1)).join(' L');
  const Lw=clamp(Math.log10(a.L/1e-6)/5.5,0.02,1)*300;    /* 1 µm ~ 30 cm 로그 */
  $('f5').innerHTML=`
    <rect class="fillg" x="36" y="22" width="${Lw.toFixed(1)}" height="16" rx="2"/>
    <rect x="36" y="22" width="${Lw.toFixed(1)}" height="5" rx="1" fill="var(--warm)" opacity=".75"/>
    <path class="bm" stroke-width="3" d="M8 30 H36"/>
    <text class="m" x="36" y="52" font-size="8.5">π 위상 길이 L = ${a.L<1e-3?eng(a.L,'m',1):fmt(a.L*100,2)+' cm'}</text>
    <text class="m" x="36" y="16" font-size="8" style="fill:var(--warm)">2D 층 (χ⁽³⁾ ${fmt(m,m<10?2:0)}×)</text>
    <text class="m" x="392" y="30" font-size="8.5" text-anchor="end">길이는 1/m로 줄어든다</text>
    ${axes(44,142,348,114,'','dB')}
    <text class="m" x="41" y="36" font-size="8" text-anchor="end">${fmt(lMax,0)}</text>
    <text class="m" x="44" y="156" font-size="8">1×</text>
    <text class="m" x="392" y="156" font-size="8" text-anchor="end">3000×</text>
    <text class="m" x="218" y="168" font-size="8.5" text-anchor="middle">χ⁽³⁾ 배율 (로그) · 세로축 = π당 손실 dB</text>
    <path class="bm" stroke-width="2" d="${path(cv)}"/>
    <path class="gridl" stroke-width="1" stroke-dasharray="3 3" d="M44 ${py(asym.loss).toFixed(1)} H392"/>
    <text class="m" x="392" y="${(py(asym.loss)-4).toFixed(1)}" font-size="8" text-anchor="end" style="fill:var(--wall)">바닥 ${fmt(asym.loss,1)} dB — 더는 안 내려간다</text>
    <circle class="pdf" cx="${px(clamp(Math.log10(m),0,3.48)).toFixed(1)}" cy="${py(a.loss).toFixed(1)}" r="4"/>
    <text class="m" x="44" y="186" font-size="8.5">흡수 ${fmt(a.a,1)} dB/cm · 세기 ${eng(P*1e-3/AEFF,'W/m²',1)}</text>
    <text class="m" x="44" y="199" font-size="8.5">바닥값 = (2D층 손실계수)·λ/(2·n₂₀·I) — m이 약분돼 사라진다</text>
    <text class="m" x="44" y="212" font-size="8.5" style="fill:var(--wall)">손실계수는 그래핀 보고 범위(0.05~0.1 dB/µm)에서 잡은 가정이다</text>`;
  $('r5').innerHTML=`<div>π 위상 길이 <b>${a.L<1e-3?eng(a.L,'m',2):fmt(a.L*100,2)+' cm'}</b> (1× 대비 ${fmt(b.L/a.L,0)}배 짧다)</div><div>π당 손실 <b>${fmt(a.loss,2)} dB</b> · 흡수 ${fmt(a.a,1)} dB/cm</div><div>배율을 무한히 올려도 바닥 <i>${fmt(asym.loss,2)} dB</i></div><div>FOM = n₂/(α·λ) <b>${fmt(a.fom/b.fom,2)}배</b> ← 이것만 손실 개선 손잡이로 움직인다</div>`;
}
/* ══ 06 자기 스위칭 · Kerr 비선형 공진기 ══════════════════════
   표준 Kerr 쌍안정 식:  X = Y·[1 + (Δ − Y)²]
   Y = 캐비티 내부 세기, X = 입력, Δ = 정규화 디튜닝(선폭 단위).
   Y로 매개화하면 S곡선이 바로 나오고, 되돌이 지점은 dX/dY=0 →
   Y± = (2Δ ± √(Δ²−3))/3.  Δ > √3 이라야 히스테리시스가 열린다.
   임계 파워의 물리 단위는  P₀ ∝ (n₀²λ²/n₂)·(V/λ³)/Q²  — Q²가 승부처다. */
const XofY=(Y,D)=>Y*(1+Math.pow(D-Y,2));
function turns(D){
  if(D<=Math.sqrt(3)) return null;
  const r=Math.sqrt(D*D-3), Ym=(2*D-r)/3, Yp=(2*D+r)/3;
  return {Ylo:Ym,Yhi:Yp,Xup:XofY(Ym,D),Xdn:XofY(Yp,D)};
}
function solveY(X,D,Ycur){                                /* 안정 분기 중 현재 상태에 가까운 쪽 */
  const rs=[]; let pY=null,pF=null;
  for(let i=0;i<=1400;i++){ const Y=i*(D+6)/1400, F=XofY(Y,D)-X;
    if(pF!==null&&pF*F<=0&&Y>0){ const t=pF/(pF-F); rs.push(pY+t*(Y-pY)); } pY=Y; pF=F; }
  if(!rs.length) return Math.max(0,X);
  const st=rs.filter(Y=>{ const h=1e-4; return (XofY(Y+h,D)-XofY(Y-h,D))>0; });
  const c=st.length?st:rs;
  return c.reduce((a,b)=>Math.abs(b-Ycur)<Math.abs(a-Ycur)?b:a);
}
const P0C=Math.pow(3.5,2)*Math.pow(LAM,2)/N2SI;           /* ≈ 4.9e6 W */
let Y6=0.2;
function r6(){
  const X=+$('c6x').value*0.3, D=+$('c6d').value/10, Q=lg(+$('c6q').value,1e3,1e6), Vr=lg(+$('c6v').value,0.005,0.1);
  $('o6x').textContent=fmt(X,2); $('o6d').textContent=fmt(D,1);
  $('o6q').textContent=Q>=1e5?fmt(Q/1e6,2)+'M':fmt(Q/1e3,0)+'k';
  $('o6v').textContent=fmt(Vr,3)+'λ³';
  const P0=P0C*Vr/(Q*Q);                                  /* 특성 파워 */
  Y6=solveY(X,D,Y6);
  const T=X>1e-6?Y6/X:1/(1+D*D), tp=turns(D);
  const cv=[]; for(let k=0;k<=160;k++){ const Y=k*(D+5)/160; cv.push([XofY(Y,D),Y]); }
  const xMax=Math.max(30,tp?tp.Xup*1.4:20);
  const px=x=>44+clamp(x/xMax,0,1)*(392-44), py=y=>176-clamp(y/(D+5),0,1)*150;
  const seg=p=>'M'+p.map(q=>px(q[0]).toFixed(1)+' '+py(q[1]).toFixed(1)).join(' L');
  let lower=cv,mid=[],upper=[];
  if(tp){ lower=cv.filter(q=>q[1]<=tp.Ylo); mid=cv.filter(q=>q[1]>tp.Ylo&&q[1]<tp.Yhi); upper=cv.filter(q=>q[1]>=tp.Yhi); }
  const jump=tp?`
    <path class="gridl" stroke-width="1" stroke-dasharray="2 3" d="M${px(tp.Xup)} 176 V26"/>
    <path class="gridl" stroke-width="1" stroke-dasharray="2 3" d="M${px(tp.Xdn)} 176 V26"/>
    <text class="a" x="${px(tp.Xup)}" y="22" font-size="8" text-anchor="middle">↑점프 ${fmt(tp.Xup,1)}</text>
    <text class="p" x="${px(tp.Xdn)}" y="22" font-size="8" text-anchor="middle">↓점프 ${fmt(tp.Xdn,1)}</text>`:
    `<text class="m" x="218" y="22" font-size="8.5" text-anchor="middle">Δ ≤ √3 = 1.73 — 히스테리시스가 없다</text>`;
  $('f6').innerHTML=`
    <path class="wg" stroke-width="1.4" d="M20 42 H160"/>
    <path class="bm" stroke-width="3" d="M20 42 H74"/>
    <ellipse class="gridl" stroke-width="1.5" cx="90" cy="60" rx="17" ry="12" fill="var(--warm)" fill-opacity="${clamp(Y6/(D+5),0,1).toFixed(3)}"/>
    <path class="wg" stroke-width="1.4" d="M20 78 H160"/>
    <path class="pd" stroke-width="${(1+4*clamp(T,0,1)).toFixed(2)}" d="M106 78 H160"/>
    <text class="m" x="20" y="36" font-size="8.5">입력</text>
    <text class="p" x="160" y="70" font-size="8.5" text-anchor="end">드롭 출력</text>
    <text class="m" x="196" y="46" font-size="8.5">Q = ${Q>=1e5?fmt(Q/1e6,2)+'M':fmt(Q/1e3,0)+'k'} · V = ${fmt(Vr,3)}λ³</text>
    <text class="m" x="196" y="60" font-size="8.5">특성 파워 P₀ = ${eng(P0,'W',2)}</text>
    <text class="m" x="196" y="74" font-size="8.5" style="fill:var(--wall)">Q 2배 → 임계 1/4</text>
    ${axes(44,176,348,150,'입력 X','Y')}
    ${jump}
    <path class="pd" stroke-width="2" d="${seg(lower)}"/>
    ${mid.length?`<path class="wg" stroke-width="1.6" stroke-dasharray="4 3" d="${seg(mid)}"/>`:''}
    ${upper.length?`<path class="bm" stroke-width="2" d="${seg(upper)}"/>`:''}
    <circle class="pdf" cx="${px(X).toFixed(1)}" cy="${py(Y6).toFixed(1)}" r="4.2"/>
    ${mid.length?`<text class="m" x="392" y="${py(tp.Ylo+(tp.Yhi-tp.Ylo)/2).toFixed(1)}" font-size="8" text-anchor="end">-- 불안정 분기</text>`:''}
    <text class="m" x="44" y="200" font-size="8.5">X를 올렸다 내려보라 — 같은 X에서 Y가 둘이다</text>
    <text class="m" x="44" y="214" font-size="8.5">임계를 내리는 손잡이는 둘뿐이다 — <tspan style="fill:var(--beam)">Q 올리기 · 모드부피 줄이기</tspan></text>
    <text class="m" x="44" y="228" font-size="8.5" style="fill:var(--wall)">P₀는 상수 1로 잡은 스케일링 추정 (보고된 µW~mW 자리와 맞다)</text>`;
  const bist=tp?`쌍안정 창 X <b>${fmt(tp.Xdn,2)} ~ ${fmt(tp.Xup,2)}</b> → <b>${eng(tp.Xdn*P0,'W',1)} ~ ${eng(tp.Xup*P0,'W',1)}</b>`
    :`<i>Δ = ${fmt(D,1)} ≤ 1.73 — 쌍안정 없음. 디튜닝을 올려라</i>`;
  $('r6').innerHTML=`<div>내부 세기 Y <b>${fmt(Y6,2)}</b> · 투과 T = Y/X <b>${fmt(clamp(T,0,1),3)}</b></div><div>${bist}</div><div>입력 파워 <b>${eng(X*P0,'W',2)}</b> · 특성 파워 P₀ ${eng(P0,'W',2)}</div><div><i>P₀ ∝ V/(n₂·Q²) — 그래서 승부가 캐비티 하나로 모인다</i></div>`;
}

/* ══ 07 겹쳐 보면 — 어느 벽의 어느 면을 깎나 ══════════════════ */
function r7(){
  const rows=[
    ['01 S-SEED',       2,1,0,'전원에서 이득을 꺼냈다'],
    ['02 전광 게이트',   1,0,0,'소광비가 단수마다 깎인다'],
    ['03 O-E-O',        2,2,2,'전자를 조금 끼운 대가'],
    ['04 폴라리톤',      0,0,1,'입자를 바꿔 비선형을 키운다'],
    ['05 2D 비선형',     0,0,1,'손실이 같이 커진다'],
    ['06 자기 스위칭',   0,0,1,'임계가 V/Q²로 간다']
  ];
  const cols=['이득','팬아웃','에너지'];
  let g=CMP.tx(`<text class="m" x="10" y="16" font-size="9">여섯이 벽의 어느 면을 깎나 — ●해결 ◐부분 ○미해결 (이 지도의 판단)</text>`);
  cols.forEach((c,j)=>{ g+=`<text class="m" x="${152+j*46}" y="38" font-size="9" text-anchor="middle">${c}</text>`; });
  rows.forEach((r,i)=>{
    const y=58+i*27;
    g+=`<text class="i" x="10" y="${y+4}" font-size="10">${r[0]}</text>`;
    for(let j=0;j<3;j++){
      const lv=r[j+1], cx=152+j*46;
      g+=lv===2?`<circle cx="${cx}" cy="${y}" r="7" fill="var(--probe)" opacity=".85"/>`
        :lv===1?`<circle cx="${cx}" cy="${y}" r="7" fill="var(--warm)" opacity=".30"/><path d="M${cx} ${y-7} A7 7 0 0 1 ${cx} ${y+7} Z" fill="var(--warm)"/>`
        :`<circle class="gridl" stroke-width="1.4" cx="${cx}" cy="${y}" r="7" fill="none"/>`;
    }
    g+=`<text class="m" x="286" y="${y+4}" font-size="8.5">${r[4]}</text>`;
    if(i<5) g+=`<path class="gridl" stroke-width=".7" d="M10 ${y+13.5} H430"/>`;
  });
  g+=`<text class="m" x="10" y="226" font-size="8.5">03만 셋을 다 채운다 — 전광을 포기한 구조가 유일하게 회로가 된다는 게 이 표의 전부다.</text>`;
  $('f7').innerHTML=g;
}

/* ══ 묶기 — 전부 init 안에서만 돈다 (로드 시 자동 렌더 없음) ══════ */
function wire(){
  ['c1a','c1b','c1r'].forEach(id=>$(id).addEventListener('input',()=>{ if(anim1){clearInterval(anim1);anim1=null;} r1(); }));
  $('b1u').addEventListener('click',()=>sweep1(1));
  $('b1d').addEventListener('click',()=>sweep1(-1));
  $('b1z').addEventListener('click',()=>{ if(anim1){clearInterval(anim1);anim1=null;}
    v1=0.5; trail1=[]; $('c1a').value=-60; $('c1b').value=0; r1(); });
  ['c2g','c2p','c2n'].forEach(id=>$(id).addEventListener('input',r2));
  ['c3c','c3v','c3r'].forEach(id=>$(id).addEventListener('input',r3));
  ['c4g','c4q'].forEach(id=>$(id).addEventListener('input',r4));
  ['c5m','c5p','c5f'].forEach(id=>$(id).addEventListener('input',r5));
  ['c6x','c6d','c6q','c6v'].forEach(id=>$(id).addEventListener('input',r6));
  document.querySelectorAll('#d-tabs button').forEach(b=>b.addEventListener('click',()=>{
    showSec(+b.dataset.s);
  }));
}
function showSec(n){
  for(let i=1;i<=7;i++) $('s'+i).hidden=(i!==n);
  $('pend').hidden=(n!==7);
  document.querySelectorAll('#d-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===n)));
  if(anim1&&n!==1){ clearInterval(anim1); anim1=null; }
}

let ready=false;

MOD.d = {
  init(){
    if(ready) return;                    /* 두 번 불려도 상태가 꼬이지 않는다 */
    ready=true;
    v1=0.5; trail1=[]; Y6=0.2;           /* 상태를 들고 있는 카드의 시작점 */
    wire();
    r1();r2();r3();r4();r5();r6();r7();
    showSec(1);
  }
};
})();


}
};
