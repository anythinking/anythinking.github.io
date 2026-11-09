/* D · 논리 — 옛 아티팩트 장(html)과 그 장을 움직이는 코드(run).
   compute.js 가 html 을 페이지 밖 요소 트리로 한 번 만들고 run 을 그 트리에 묶은 뒤,
   고른 구조의 그림·손잡이 요소를 그대로 떼어 그림판·오른쪽 패널에 붙인다(복제·대리 없음).
   run 의 document 는 그 트리를 찾는 좁은 창이다: getElementById · querySelector(All) 만. */
(window.CMP = window.CMP || { groups: {} }).groups.d = {
  id: 'd', name: "D · 논리",
  html: "<section id=\"sec-d\" hidden>\n<div class=\"eyebrow\">D군 · 디지털 전광 논리 · 벽은 클럭이 아니다</div>\n<p class=\"lede\" style=\"margin:6px 0 10px\">빛으로 0과 1을 세우려는 여섯 시도. 전부 같은 벽 앞에 서 있다 — 이득·팬아웃·에너지. 손으로 돌려보면 어느 구조가 그 벽의 어느 면을 깎고 있는지 갈린다.</p>\n<div class=\"tabs\" id=\"d-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>S-SEED</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>전광 논리 게이트</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>펨토패럿 O-E-O</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\"><span class=\"n\">04</span>폴라리톤 논리</button>\n  <button type=\"button\" data-s=\"5\" aria-pressed=\"false\"><span class=\"n\">05</span>2D 소재 비선형</button>\n  <button type=\"button\" data-s=\"6\" aria-pressed=\"false\"><span class=\"n\">06</span>자기 스위칭</button>\n  <button type=\"button\" data-s=\"7\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n<div class=\"card sec\" id=\"d-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>S-SEED · 대칭 자기전기광학 소자</h2></div>\n    \n  </div>\n  <p class=\"idea\">1기에서 <span class=\"k\">유일하게 실제로 돌아간</span> 광 논리 소자. 두 입력 빔의 <span class=\"k\">절대 세기가 아니라 비율</span>로 판정하고, 출력 세기는 입력이 아니라 <span class=\"k\">전원과 읽기 빔</span>이 만든다. 이 둘이 묶여서 「이득」이 생긴다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f1\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"LD → 1×3 분배 → P1·P2 변조 → PBS·렌즈 → 직렬 SEED 쌍 → 반사 출력\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c1a\">입력 P1</label><input type=\"range\" id=\"d-c1a\" min=\"-100\" max=\"100\" step=\"1\" value=\"-60\"><output id=\"d-o1a\"></output></div>\n        <div class=\"row\"><label for=\"d-c1b\">입력 P2</label><input type=\"range\" id=\"d-c1b\" min=\"-100\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o1b\"></output></div>\n        <div class=\"row\"><label for=\"d-c1r\">읽기 빔</label><input type=\"range\" id=\"d-c1r\" min=\"1\" max=\"100\" step=\"1\" value=\"40\"><output id=\"d-o1r\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"d-b1u\">P1 천천히 올리기</button>\n        <button type=\"button\" id=\"d-b1d\">천천히 내리기</button>\n        <button type=\"button\" id=\"d-b1z\">초기화</button>\n      </div>\n      <div class=\"read\" id=\"d-r1\"></div>\n      <p class=\"note\">슬라이더를 <span class=\"k\">올렸다 내려보면</span> 같은 비율에서 상태가 갈린다. 그 갈림이 래치다 — 비율이 1 근처로 와도 직전 상태를 붙잡고 있다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s2\">\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>전광 논리 게이트 · XGM / XPM / FWM</h2></div>\n    \n  </div>\n  <p class=\"idea\">데이터 빛이 매질의 이득이나 굴절률을 흔들어 다른 빛을 스위칭한다. 논문은 수천 편인데 <span class=\"k\">실물 회로가 거의 없는</span> 이유는 한 단이 아니라 <span class=\"k\">여러 단을 이을 때</span> 드러난다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f2\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"펌프 λ1 + 프로브 λ2 → WDM 합침 → SOA 이득포화 → 아이솔레이터 → λ2만 → 반전 출력\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c2g\">소신호 이득 G₀</label><input type=\"range\" id=\"d-c2g\" min=\"10\" max=\"35\" step=\"1\" value=\"30\"><output id=\"d-o2g\"></output></div>\n        <div class=\"row\"><label for=\"d-c2p\">펌프 「1」 세기</label><input type=\"range\" id=\"d-c2p\" min=\"-30\" max=\"10\" step=\"1\" value=\"-13\"><output id=\"d-o2p\"></output></div>\n        <div class=\"row\"><label for=\"d-c2n\">캐스케이드 단수</label><input type=\"range\" id=\"d-c2n\" min=\"1\" max=\"10\" step=\"1\" value=\"6\"><output id=\"d-o2n\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r2\"></div>\n      <p class=\"note\">이득포화 G = G₀·exp(−(G−1)P/P<sub>sat</sub>)를 매 단마다 실제로 푼다. 출력을 다음 단 펌프로 그대로 넣으면 「0」 레벨이 올라오고, 소광비는 단수마다 깎인다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s3\">\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>펨토패럿 O-E-O</h2></div>\n    \n  </div>\n  <p class=\"idea\">전광을 고집하지 않는다. 광검출기와 변조기를 <span class=\"k\">배선 없이 맞붙여</span> 용량을 fF로 떨어뜨리면, 전자 한 토막이 끼어도 에너지가 fJ에 머문다. 대신 전광이 못 주던 것 셋 — <span class=\"k\">이득·캐스케이드·파장변환</span> — 이 한 번에 들어온다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f3\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"입력 빛 → fF PD → 배선 없는 노드 → 나노캐비티 변조기가 CW λ′ 변조 → WDM 출력\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c3c\">용량 C</label><input type=\"range\" id=\"d-c3c\" min=\"0\" max=\"100\" step=\"1\" value=\"12\"><output id=\"d-o3c\"></output></div>\n        <div class=\"row\"><label for=\"d-c3v\">구동 전압 V</label><input type=\"range\" id=\"d-c3v\" min=\"10\" max=\"200\" step=\"5\" value=\"50\"><output id=\"d-o3v\"></output></div>\n        <div class=\"row\"><label for=\"d-c3r\">부하 저항 R</label><input type=\"range\" id=\"d-c3r\" min=\"0\" max=\"100\" step=\"1\" value=\"50\"><output id=\"d-o3r\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r3\"></div>\n      <p class=\"note\">E = ½CV², τ = RC, f₃dB = 1/2πRC를 그대로 계산한다. 광자 수는 1.55 µm(0.80 eV) 기준. 보통 소자(수십 fF)와 2 fF를 나란히 둔 막대가 전부를 말한다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s4\">\n  <div class=\"head\">\n    <div><div class=\"num\">04</div><h2>폴라리톤 논리</h2></div>\n    \n  </div>\n  <p class=\"idea\">빛과 물질을 섞어버린다. 광자에 엑시톤을 입히면 <span class=\"k\">광자끼리 서로를 느끼게</span> 되고, 그러면 스위칭에 필요한 광자 수가 내려간다. 비선형을 매질에서 꺼내는 게 아니라 <span class=\"k\">입자를 바꿔</span> 꺼낸다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f4\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"펄스 펌프 + 감쇠한 제어 펄스 → 빔 분할기 → 렌즈 → 폴라리톤 미세공동 → 카메라\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c4g\">상호작용 배율</label><input type=\"range\" id=\"d-c4g\" min=\"0\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o4g\"></output></div>\n        <div class=\"row\"><label for=\"d-c4q\">캐비티 Q</label><input type=\"range\" id=\"d-c4q\" min=\"0\" max=\"100\" step=\"1\" value=\"33\"><output id=\"d-o4q\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r4\"></div>\n      <p class=\"note\"><i>보고값</i> — 비선형 60배 · 10 fJ · 상온 동작(IBM 취리히 유기 폴라리톤 소자). <b>측정 조건과 재현성은 확인되지 않았다 — 미확인으로 둔다.</b> 아래 숫자는 N = πℏω/(g·Q) 스케일링이고 상수는 1로 잡은 추정이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s5\">\n  <div class=\"head\">\n    <div><div class=\"num\">05</div><h2>2D 소재 비선형</h2></div>\n    \n  </div>\n  <p class=\"idea\">구조를 바꾸는 게 아니라 <span class=\"k\">재료의 χ⁽³⁾ 자체를 키운다</span>. 도파로 위에 2D 층을 덮으면 n₂가 수백~수천 배로 뛴다. 그러면 π 위상을 만드는 길이가 그만큼 짧아진다 — 거기까지는 맞다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f5\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"펄스 → 격자 결합기 → 2D 층 덮인 도파로(위상) → 결합기 간섭 → PD\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c5m\">χ⁽³⁾ 배율</label><input type=\"range\" id=\"d-c5m\" min=\"0\" max=\"100\" step=\"1\" value=\"50\"><output id=\"d-o5m\"></output></div>\n        <div class=\"row\"><label for=\"d-c5p\">광 파워</label><input type=\"range\" id=\"d-c5p\" min=\"1\" max=\"100\" step=\"1\" value=\"30\"><output id=\"d-o5p\"></output></div>\n        <div class=\"row\"><label for=\"d-c5f\">손실 개선</label><input type=\"range\" id=\"d-c5f\" min=\"0\" max=\"100\" step=\"1\" value=\"0\"><output id=\"d-o5f\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r5\"></div>\n      <p class=\"note\">π 위상 길이 L = λ/(2n₂I)를 실제로 계산한다. <span class=\"k\">χ⁽³⁾ 배율만 올려보라</span> — 길이는 줄는데 π당 손실은 어느 값에서 멈춘다. 흡수도 같은 진동자 세기에서 나오니 같이 커지기 때문이다. 내려가는 건 「손실 개선」 손잡이뿐이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"d-s6\">\n  <div class=\"head\">\n    <div><div class=\"num\">06</div><h2>자기 스위칭 · PhC / SWG 비선형 공진기</h2></div>\n    \n  </div>\n  <p class=\"idea\">제어 빛이 따로 없다. <span class=\"k\">입력 자신의 세기가 공진 조건을 밀어서</span> 스스로 경로를 바꾼다. 소자가 가장 단순한 대신 승부는 하나로 모인다 — 임계 세기를 어디까지 내리나.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"d-f6\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"LD → 감쇠기(세기 X) → 결합기 → 버스 도파로 → Kerr 공진기(쌍안정) → 투과·드롭 PD\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"d-c6x\">입력 세기 X</label><input type=\"range\" id=\"d-c6x\" min=\"0\" max=\"100\" step=\"1\" value=\"20\"><output id=\"d-o6x\"></output></div>\n        <div class=\"row\"><label for=\"d-c6d\">디튜닝 Δ</label><input type=\"range\" id=\"d-c6d\" min=\"0\" max=\"80\" step=\"1\" value=\"40\"><output id=\"d-o6d\"></output></div>\n        <div class=\"row\"><label for=\"d-c6q\">Q</label><input type=\"range\" id=\"d-c6q\" min=\"0\" max=\"100\" step=\"1\" value=\"40\"><output id=\"d-o6q\"></output></div>\n        <div class=\"row\"><label for=\"d-c6v\">모드부피 V</label><input type=\"range\" id=\"d-c6v\" min=\"0\" max=\"100\" step=\"1\" value=\"30\"><output id=\"d-o6v\"></output></div>\n      </div>\n      <div class=\"read\" id=\"d-r6\"></div>\n      <p class=\"note\">Y³ − 2ΔY² + (1+Δ²)Y = X를 푼다. <span class=\"k\">Δ &gt; √3</span>이라야 히스테리시스가 열리고, 그 아래선 그냥 휘어진 곡선이다. X를 올렸다 내려보면 점프 지점이 갈린다. Q 손잡이가 임계를 <span class=\"k\">Q²로</span> 끌어내린다 — 그게 이 구조의 전부다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"d-s7\">\n  <h2 style=\"font-size:16px\">여섯을 겹쳐 보면</h2>\n  <div class=\"fig\" style=\"margin:12px 0 4px\"><svg class=\"f\" id=\"d-f7\" viewBox=\"0 0 440 230\" role=\"img\" aria-label=\"여섯 구조가 깎는 벽의 면\"></svg></div>\n  <p style=\"margin-top:10px\"><b>벽은 클럭이 아니었다.</b> 광 논리가 전자를 못 이긴 이유로 흔히 속도를 꼽지만, 벨연구소가 1990~93년에 이 길을 접은 실제 이유는 셋이었다 — <span class=\"k\">이득이 없고, 팬아웃이 안 되고, 에너지가 안 맞았다</span>. 게이트 하나는 빠르게 돌아도 그 출력이 다음 게이트 둘을 켜지 못하면 회로가 서지 않는다. 트랜지스터가 공짜로 주던 것(전원에서 이득을 꺼내 쓰기, 출력 하나로 입력 여럿 때리기, 상태를 유지할 때 전력 안 먹기)을 빛은 하나도 공짜로 주지 않는다.</p>\n  <p><b>01이 유일하게 돌아간 건 이득을 포기하지 않았기 때문이다.</b> S-SEED는 입력 빔으로 연산하지 않는다 — 입력은 <span class=\"k\">상태만</span> 정하고, 출력 세기는 바이어스 전원과 읽기 빔이 만든다. 전자회로가 하는 일을 그대로 베낀 셈이다. 그래서 캐스케이드가 됐고, 그래서 1기에서 유일하게 실물이 나왔다. 02가 논문만 많고 회로가 없는 이유는 그 반대다 — 입력 빛 자체가 출력을 만들어서, 슬라이더로 단수를 늘려보면 소광비가 몇 단 안에 주저앉는다.</p>\n  <p><b>03~06은 같은 벽을 서로 다른 면에서 깎는다.</b> 03은 전광을 포기하는 대신 전자 토막을 극단적으로 줄여 이득·캐스케이드·파장변환을 한꺼번에 사온다 — 가장 실용적이고, 가장 「순수하지 않은」 길이다. 04는 광자를 폴라리톤으로 바꿔 상호작용을 키우고, 05는 재료의 χ⁽³⁾를 키우고, 06은 캐비티로 같은 빛을 수천 번 되돌려 실효 비선형을 키운다. 셋은 전부 「같은 광자 수로 더 큰 비선형」을 노리는 같은 문제의 다른 답이다.</p>\n  <p><b>그리고 셋의 바닥이 한 군데서 만난다.</b> 05를 돌려보면 비선형만 키워도 π당 손실이 안 내려간다 — 흡수가 같이 커진다. 06을 돌려보면 임계가 <span class=\"k\">V/Q²</span>로 간다. 04의 스케일링도 g·Q 곱에 묶인다. 결국 전부 <span class=\"k\">캐비티를 작게, Q를 높게</span>로 수렴한다. 재료를 바꾸는 길도, 입자를 바꾸는 길도, 마지막엔 그 작은 캐비티를 만들 수 있느냐에 걸린다.</p>\n  <p><b>남는 질문은 물리가 아니라 사람 수다.</b> 네 경로(폴라리톤 · PhC 나노캐비티와 광 RAM · 펨토패럿 O-E-O · 초전도 광전자)는 물리적으로 열려 있지만, 각각 세계적으로 연구그룹이 얇다. 벽을 낮추는 방법을 아는 것과 그걸 할 자리가 있는 것은 다른 문제다.</p>\n</div>\n\n<div class=\"pending\" id=\"d-pend\">\n  <b>같은 틀의 다른 묶음</b> — A군(행렬곱 여덟 구조)과 4×4 MZI 메시는 따로 있다. B군(리저버·스파이킹·포토닉 텐서코어) · C군(이징 머신) · E군(in-sensor·메타표면) · F군(선형광학 양자컴·주파수 콤)은 이어서 만든다.\n</div>\n</section>",
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

/* ── 사이클 그림 공통 — 부품 도우미(parts.js)에 없는 부품을 이 군 안에서 그린다 ──
   P.part(id, 상자, 그리기) 로 감싸 BOM 마커 자리를 남긴다. 그림 폭 880, 위 = 사이클, 오른쪽 아래 = 옛 그래프(보조 패널). */
const XP={
  // 큐브(편광·빔 분할): '\\' 는 왼쪽으로 오는 빛을 위로, '/' 는 위로 오는 빛을 오른쪽으로 꺾는다
  cube(P,cx,cy,s,id,diag){
    P.part(id,[cx-s/2,cy-s/2,s,s],()=>{
      P.rect(cx-s/2,cy-s/2,s,s,{c:'ink',w:1.3,f:'grid',fo:.6,r:1});
      P.path(diag==='/'?`M${cx-s/2} ${cy+s/2} L${cx+s/2} ${cy-s/2}`:`M${cx-s/2} ${cy-s/2} L${cx+s/2} ${cy+s/2}`,{c:'ink',w:1.1});
    });
  },
  // SEED 창: MQW 줄무늬 + 흡수 a 만큼 어둡게
  seed(P,cx,cy,w,h,a,id){
    P.part(id,[cx-w/2,cy-h/2,w,h],()=>{
      P.rect(cx-w/2,cy-h/2,w,h,{c:'ink',w:1.3,r:2});
      P.rect(cx-w/2,cy-h/2,w,h,{c:'none',f:'ink',fo:a*.55,r:2});
      for(let i=1;i<5;i++) P.path(`M${cx-w/2+3} ${cy-h/2+i*h/5} H${cx+w/2-3}`,{c:'faint',w:.8});
    });
  },
  bias(P,cx,cy,lab,at){
    P.part('bias',[cx-17,cy-9,34,18],()=>{ P.rect(cx-17,cy-9,34,18,{c:'probe',w:1.2}); P.text(cx,cy+4,lab||'+V',{a:'middle',c:'probe',s:10}); },at);
  },
  // 가변 감쇠기: 상자 안 쐐기(ND)
  voa(P,cx,cy,lab){
    P.part('voa',[cx-17,cy-10,34,20],()=>{ P.rect(cx-17,cy-10,34,20,{c:'ink',w:1.3}); P.path(`M${cx-12} ${cy+6} L${cx+12} ${cy-6} V${cy+6} Z`,{c:'none',f:'ink',fo:.35}); });
    if(lab) P.lab(cx,cy+23,lab,{a:'middle'});
  },
  // 격자 결합기: 넓은 쪽에 홈
  coup(P,cx,cy){
    P.part('coup',[cx-12,cy-10,24,20],()=>{
      P.path(`M${cx-12} ${cy-9} L${cx+12} ${cy-3} V${cy+3} L${cx-12} ${cy+9} Z`,{c:'ink',w:1.1,f:'grid'});
      for(let i=0;i<4;i++) P.path(`M${cx-9+i*4} ${cy-7+i} V${cy+7-i}`,{c:'ink',w:1});
    });
  },
  // 도파로: 옅은 굵은 띠(빛은 그 위에 빨강으로)
  wg(P,x0,y,x1,id,at){ P.part(id,[x0,y-3,x1-x0,6],()=>P.path(`M${x0} ${y} H${x1}`,{c:'faint',w:5,op:.4}),at); },
  // Kerr·2D 층: 도파로 위 붉은 판
  kerr(P,x,y,w,v){ P.part('kerr',[x,y-7,w,5],()=>P.rect(x,y-7,w,5,{c:'none',f:'beam',fo:.3+.65*v,r:1.5})); },
  // 광결정 나노캐비티: 구멍 격자 + 가운데 줄의 빠진 구멍(결함) — 갇힌 빛만큼 노랗게
  phc(P,x,y,w,h,id,v){
    P.part(id,[x,y,w,h],()=>{
      P.rect(x,y,w,h,{c:'ink',w:1.1,f:'grid',fo:.6,r:2});
      const s=7, nx=Math.floor((w-4)/s), ny=Math.floor((h-2)/s), ox=x+(w-(nx-1)*s)/2, oy=y+(h-(ny-1)*s)/2, mj=Math.floor(nx/2), mi=Math.floor(ny/2);
      for(let i=0;i<ny;i++) for(let j=0;j<nx;j++){
        const hx=ox+j*s+(i%2?s/2:0); if(hx>x+w-2) continue;
        if(i===mi&&Math.abs(j-mj)<=1) continue;
        P.circ(hx,oy+i*s,1.7,{c:'none',f:'ink',fo:.55});
      }
      P.circ(ox+mj*s+(mi%2?s/2:0),oy+mi*s,5,{c:'none',f:'warm',fo:.15+.6*v});
    });
  },
  // 미세공동: DBR 거울 둘 사이 유기층 — 응집이 서면 가운데가 밝아진다
  dbr(P,cx,cy,h,v){
    P.part('cav',[cx-14,cy-h/2,28,h],()=>{
      [cx-10,cx+10].forEach(x0=>{ for(let k=0;k<4;k++) P.rect(x0-4+k*2,cy-h/2,2,h,{c:'none',f:k%2?'ink':'faint',fo:.6,r:0}); });
      P.rect(cx-6,cy-h/2,12,h,{c:'none',f:'beam',fo:.12+.45*v,r:0});
      P.circ(cx,cy,4+5*v,{c:'none',f:'warm',fo:.25+.6*v});
    });
  }
};
// 보조 패널 축 · 점 목록 → path
function axP(P,x0,y0,w,h,xl,yl){
  P.path(`M${x0} ${y0-h} V${y0} H${x0+w}`,{c:'rule',w:1});
  if(xl) P.text(x0+w,y0+13,xl,{a:'end',s:9});
  if(yl) P.text(x0-4,y0-h-3,yl,{a:'end',s:9});
}
const pth=pts=>'M'+pts.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L');
// 비트열 파형(작은 사각파)
function wave(P,x,y,bits,c){
  let d=`M${x} ${y-(bits[0]?8:0)}`, cx=x;
  bits.forEach((b,i)=>{ const yy=y-(b?8:0); if(i) d+=` V${yy}`; cx+=8; d+=` H${cx}`; });
  P.path(d,{c:c,w:1.2});
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
  // 사이클: LD → 1×3 분배(입력 둘 + 읽기) → P1·P2 변조 → PBS → λ/4 → 렌즈 → 직렬 SEED 쌍(+V) → 반사 → PBS 가 위로 → 다음 단(끝 단만 PD)
  const P=CYC.pen(), bw=p=>Math.max(1.2,1.2+3.4*Math.min(1,p/3)), YA=72, YB=113, YR=154;
  P.laser(38,YB);
  P.split(61,YB,[YA,YB,YR],{L:44});
  P.beam([[105,YA],[130,YA]],{w:1.6}); P.mod(150,YA,{lab:'P1',drive:true});
  P.beam([[105,YB],[130,YB]],{w:1.6}); P.mod(150,YB,{lab:'P2',drive:true}); P.at2('eom',[170,YB-11]);
  P.lab(112,YR-8,'읽기 빔',{s:10});
  P.beam([[170,YA],[200,YA],[234,99],[345,99]],{w:bw(P1)});
  P.beam([[170,YB],[345,YB]],{w:bw(P2)});
  P.beam([[105,YR],[200,YR],[234,127],[345,127]],{w:bw(Pr)});
  XP.cube(P,262,113,56,'pbs','\\'); P.lab(262,156,'PBS',{a:'middle'});
  P.rect(309,85,5,56,{c:'ink',w:1,f:'grid',r:1}); P.lab(312,79,'λ/4',{a:'middle',s:9.5});
  P.lens(345,113,84);
  // 렌즈가 세 빔을 두 창에 모은다 — 읽기 빔은 두 창을 같이 덮는다
  P.path('M351 121 L408 91 L408 135 L351 133 Z',{c:'none',f:'beam',fo:.06+.16*Math.min(1,Pr/3)});
  P.beam([[351,99],[408,101]],{w:bw(P1)}); P.beam([[351,113],[408,125]],{w:bw(P2)});
  XP.seed(P,420,101,24,20,a1,'seed'); XP.seed(P,420,125,24,20,a2,false); P.at2('seed',[432,115]);
  // 직렬 회로: +V → 창 1 → Vm → 창 2 → 접지
  P.wire([[420,91],[420,80],[457,80]],{arrow:false}); XP.bias(P,474,80,'+V',[500,80]);
  P.wire([[432,113],[444,113]],{arrow:false}); P.circ(444,113,2.4,{c:'none',f:'probe'}); P.lab(449,117,'Vm',{s:9.5,c:'probe'});
  P.wire([[420,135],[420,146]],{arrow:false}); P.path('M408 146 H432 M412 150 H428 M416 154 H424',{c:'ink',w:1.2});
  P.lab(420,172,'SEED 쌍',{a:'middle'});
  P.text(452,136,'상태 '+st,{s:10.5,c:'probe',b:1});
  // 반사된 읽기 빔(출력)이 같은 축으로 돌아와 PBS 에서 위로 갈린다
  P.beam([[408,104],[253,104]],{w:1,dash:[3,3]}); P.beam([[408,121],[269,121]],{w:1,dash:[3,3]});
  P.beam([[253,104],[253,30],[598,30]],{w:bw(out1*3),arrow:true}); P.beam([[269,121],[269,54],[598,54]],{w:bw(out2*3),arrow:true});
  P.lab(430,23,'반사 출력 → 다음 단',{s:10});
  P.pd(608,30,{v:T1}); P.pd(608,54,{id:false,v:T2,lab:'끝 단만'});
  P.wire([[618,30],[640,30],[640,42],[660,42]]); P.wire([[618,54],[640,54],[640,42]],{arrow:false});
  P.box(688,42,56,26,'판정',{tone:'probe',s:10}); P.text(724,48,st,{s:16,c:'probe',b:1});
  P.legend(16,250,['광원','변조 P1·P2','PBS·렌즈','SEED 쌍','반사 출력']);
  // 보조 패널: 쌍안정 래치(옛 그래프)
  P.aux(470,222,402,142,'쌍안정 래치 — 올릴 때 · 내릴 때가 갈린다');
  const gx=x=>506+(x+2)*340/4, gy=y=>340-y*86, gp=p=>pth(p.map(q=>[gx(q[0]),gy(q[1])]));
  axP(P,506,340,340,90,'','v');
  P.path(`M${gx(0)} 340 V254`,{c:'rule',w:1,dash:[2,3]}); P.text(gx(0)+4,262,'1:1',{s:9});
  P.text(506,353,'0.01',{s:9}); P.text(846,353,'100',{a:'end',s:9}); P.text(676,353,'입력 비율 P1/P2',{a:'middle',s:9});
  P.path(gp(BR1U),{c:'beam',w:1.6,op:.55}); P.path(gp(BR1D),{c:'probe',w:1.6,op:.55,dash:[4,3]});
  P.path(gp(trail1),{c:'beam',w:2.4,op:.9});
  P.circ(gx(clamp(lr,-2,2)),gy(v1),4,{c:'none',f:'probe'});
  P.text(520,300,'— 올릴 때',{s:9,c:'beam'}); P.text(520,312,'-- 내릴 때',{s:9,c:'probe'});
  $('f1').innerHTML=P.out();
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
  const gMax=10*Math.log10(G0), g1=10*Math.log10(Gsat(G0,p1)), cmp=clamp((gMax-g1)/Math.max(1,gMax),0,1);
  // 사이클: λ1 LD → EOM(데이터) ┐ λ2 CW 프로브 ┘ → WDM 합침 → SOA(이득포화) → 아이솔레이터 → WDM 이 λ2 만 → 반전 출력 → 다음 단 펌프
  const P=CYC.pen(), YP=78, YQ=150, YM=114, pw=1.2+2.6*clamp((pdB+30)/40,0,1);
  P.zone(180,50,282,128,'한 단 · XGM 인버터');
  P.laser(38,YP,{lab:'λ1 펌프'});
  P.beam([[61,YP],[100,YP]],{w:2}); P.mod(120,YP,{lab:'data',drive:true});
  P.beam([[140,YP],[189,YP]],{w:pw}); wave(P,148,YP-8,[1,0,1,1,0],'beam');
  P.laser(38,YQ,{lab:'λ2 CW 프로브'}); P.at2('src-cw',[61,YQ-14]);
  P.beam([[61,YQ],[189,YQ]],{w:1.8});
  P.wdm(200,YM,84,{flip:true});
  P.beam([[211,YM],[272,YM]],{w:2.2});
  P.box(300,YM,56,30,'SOA',{id:'amp'}); P.rect(272,YM-15,56,30,{c:'none',f:'beam',fo:.06+.3*cmp,r:3});
  P.lab(300,YM+28,'이득포화',{a:'middle',s:10});
  P.beam([[328,YM],[356,YM]],{w:2}); P.iso(370,YM); P.beam([[384,YM],[419,YM]],{w:2});
  P.wdm(430,YM,84);
  P.beam([[441,92],[556,92]],{w:1.4+1.8*clamp(erN/Math.max(10,er1),0,1),arrow:true}); wave(P,470,84,[0,1,0,0,1],'beam');
  P.lab(500,108,'λ2 = NOT data',{a:'middle',s:9.5});
  P.beam([[441,140],[476,140]],{w:1.4,op:.35}); P.lab(482,144,'λ1 버림',{s:9.5});
  P.pd(566,92,{v:clamp(erN/Math.max(10,er1),0,1),lab:'끝 단만'});
  P.beam([[524,92],[524,198],[160,198],[160,YP+3]],{w:1.2,dash:[4,3],op:.7,arrow:true});
  P.lab(342,193,`다음 단 펌프로 · ${N}단 이어 붙임`,{a:'middle',s:9.5});
  P.legend(16,250,['펌프·프로브','WDM 합침','SOA 이득포화','λ2 거름','출력']);
  // 보조 패널: 이득포화 곡선 + 단별 소광비(옛 그래프)
  P.aux(470,222,402,142,'이득포화 · 단마다 깎이는 소광비');
  const gx=x=>500+(x+3.5)*165/4, gy=y=>340-(y/Math.max(5,gMax))*84;
  axP(P,500,340,165,90,'','dB'); P.text(665,353,'펌프 log P/Psat',{a:'end',s:9});
  P.text(496,gy(gMax)+3,fmt(gMax,0),{a:'end',s:8.5});
  P.path(pth(cv.map(q=>[gx(q[0]),gy(q[1])])),{c:'beam',w:2});
  const q0=[gx(Math.log10(p1*0.01)),gy(10*Math.log10(Gsat(G0,p1*0.01)))], q1=[gx(Math.log10(p1)),gy(g1)];
  P.circ(q0[0],q0[1],3.5,{c:'none',f:'probe'}); P.circ(q1[0],q1[1],3.5,{c:'none',f:'beam'});
  P.text(q0[0]+6,q0[1]-6,'펌프 0',{s:9,c:'probe'}); P.text(q1[0]+5,q1[1]+13,'펌프 1',{s:9,c:'beam'});
  const y10=340-clamp(10/Math.max(12,er1)*78,0.6,78);
  P.text(690,254,'단별 소광비 dB',{s:9}); P.text(860,254,`${N}단 ${fmt(erN,1)}`,{a:'end',s:9,c:'probe'});
  for(let i=0;i<10;i++){
    const x=690+i*17, h=clamp(ers[i]/Math.max(12,er1)*78,0.6,78), on=i<N;
    P.rect(x,340-h,13,h,{c:'none',f:ers[i]>=10?'probe':'wall',fo:on?.85:.16,r:1.5});
    P.text(x+6.5,353,String(i+1),{a:'middle',s:8.5});
  }
  P.path(`M688 ${y10.toFixed(1)} H862`,{c:'faint',w:1,dash:[3,3]}); P.text(862,y10-3,'10 dB',{a:'end',s:8.5});
  $('f2').innerHTML=P.out();
  $('r2').innerHTML=`<div>1단 소광비 <b>${fmt(er1,2)} dB</b> → ${N}단 후 <b>${fmt(erN,2)} dB</b></div><div>펌프 1에서 이득 <b>${fmt(g1,2)} dB</b> (소신호 ${fmt(gMax,1)} dB에서 ${fmt(gMax-g1,1)} dB 눌림)</div><div>${dead?`<i>${dead}단에서 10 dB 밑으로 내려간다</i>`:'10단까지 10 dB 유지'}</div>`;
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
  // 사이클: 입력 빛 λ → (감쇠) → fF PD(−V) → 배선 없는 노드 → 나노캐비티 변조기가 CW λ′ 를 켜고 끈다 → WDM 이 λ′ 만 → 다음 단
  const P=CYC.pen(), YI=100, YC=162, rad=Math.sqrt(C/200)*10+2.5, lit=clamp(V/1.2,0.15,1);
  P.zone(198,66,128,124,'');
  P.beam([[20,YI],[95,YI]],{w:2.4}); P.lab(20,91,'입력 λ (앞 단)',{s:10});
  XP.voa(P,112,YI);
  P.beam([[129,YI],[240,YI]],{w:2.4,arrow:true});
  P.pd(250,YI); P.lab(238,91,'PD',{a:'end',s:10});
  XP.bias(P,250,40,'−V'); P.wire([[250,49],[250,90]],{arrow:false});
  // 노드: PD 와 변조기 전극이 맞붙어 있다 — 배선이 없어 용량이 fF 에 머문다
  P.wire([[250,110],[250,144]],{arrow:false,w:1.6});
  P.circ(250,127,rad,{c:'warm',w:1,f:'warm',fo:.3});
  P.lab(268,123,`C ${fmt(C,C<10?1:0)} fF`,{s:9.5,c:'ink'}); P.lab(268,136,'배선 없음',{s:9.5,c:'probe'});
  P.laser(50,YC,{lab:'CW λ′'});
  P.split(73,YC,[YC,200],{L:40});
  P.beam([[113,YC],[218,YC]],{w:2});
  P.beam([[113,200],[170,200]],{w:1.2,op:.3,dash:[4,3]}); P.lab(176,204,'다른 게이트로',{s:9.5});
  XP.phc(P,218,YC-14,64,28,'cav',lit);
  P.part('eom',[226,143,48,5],()=>P.rect(226,143,48,4,{c:'none',f:'probe',fo:.85,r:1}),[220,140]);
  P.beam([[218,YC],[282,YC]],{w:1.4,op:.6});
  P.lab(250,188,'나노캐비티 변조기',{a:'middle',s:9.5});
  P.beam([[282,YC],[349,YC]],{w:1+2.4*lit});
  P.wdm(360,YC,60);
  P.beam([[371,146],[452,146]],{w:1+2.4*lit,arrow:true}); P.lab(390,139,'λ′ 출력',{s:9.5});
  P.beam([[371,178],[398,178]],{w:1.2,op:.3}); P.lab(404,182,'λ 잔여',{s:9.5});
  P.pd(462,146,{id:false,v:lit,lab:'다음 단 PD'});
  P.legend(16,250,['입력 빛','PD','fF 노드','나노 변조기','λ′ 출력']);
  // 보조 패널: 스위칭 에너지 막대(옛 그래프)
  P.aux(470,222,402,142,'용량이 전부다 — E = ½CV²');
  const mx=Math.max(a.E,big.E);
  [[500,ref.E,'2 fF','probe'],[560,a.E,'현재','beam'],[620,big.E,'50 fF','wall']].forEach(([x,e,lab,c])=>{
    const h=clamp(e/mx*66,1,66);
    P.rect(x,340-h,44,h,{c:'none',f:c,fo:.8,r:2});
    P.text(x+22,353,lab,{a:'middle',s:9}); P.text(x+22,336-h,eng(e,'J',1),{a:'middle',s:9,c:'ink'});
  });
  P.path('M494 340 H670',{c:'rule',w:1});
  P.text(700,270,`τ = RC = ${fmt(a.tau*1e12,2)} ps`,{s:10,c:'probe'});
  P.text(700,290,`f₃dB = ${fmt(a.f/1e9,1)} GHz`,{s:10,c:'probe'});
  P.text(700,310,`광자 ${Math.round(a.N).toLocaleString()}개`,{s:10,c:'ink'});
  P.text(700,330,`50 fF 대비 ${fmt(big.E/a.E,1)}배 적다`,{s:10});
  $('f3').innerHTML=P.out();
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
  const v=clamp((yHi-Math.log10(a.E))/sp,0,1);           /* 필요 에너지가 내려간 만큼 응집이 선다(그림용) */
  // 사이클: 펄스 펌프 ┐ 펄스 제어 → 감쇠 ┘ → 빔 분할기로 겹침 → 렌즈 → DBR 미세공동(폴라리톤 응집) → 방출 → 렌즈 → 카메라 → 판정
  const P=CYC.pen(), Y=90;
  P.laser(38,Y,{id:'src-pulse',lab:'펄스 펌프'}); P.beam([[61,Y],[180,Y]],{w:2.2});
  P.laser(38,168,{id:'src-pulse',lab:'펄스 제어'}); P.at2('src-pulse',[61,154]);
  P.beam([[61,168],[103,168]],{w:2}); XP.voa(P,120,168,'광자 수');
  P.beam([[137,168],[200,168],[200,111]],{w:1.2+1.2*v,arrow:true});
  XP.cube(P,200,Y,40,'bs','/'); P.lab(200,62,'빔 분할',{a:'middle',s:9.5});
  P.beam([[220,Y],[264,Y]],{w:2.4});
  P.lens(270,Y,70);
  P.path(`M276 ${Y-12} L334 ${Y} L276 ${Y+12} Z`,{c:'none',f:'beam',fo:.22});
  XP.dbr(P,340,Y,70,v); P.lab(340,140,'미세공동',{a:'middle'}); P.lab(340,153,'DBR · 유기층',{a:'middle',s:9});
  P.path(`M354 ${Y} L404 ${Y-16} L404 ${Y+16} Z`,{c:'none',f:'beam',fo:.08+.35*v});
  P.lens(410,Y,60,{id:false});
  P.path(`M416 ${Y-16} L468 ${Y} L416 ${Y+16} Z`,{c:'none',f:'beam',fo:.08+.35*v});
  P.cam(490,Y,44,44,{vals:(i,j)=>Math.hypot(i-1.5,j-1.5)<1?v:.05+.1*v});
  P.wire([[512,Y],[548,Y]]); P.box(582,Y,60,28,'판정',{tone:'probe',s:10}); P.text(620,Y+6,v>.5?'1':'0',{s:16,c:'probe',b:1});
  P.legend(16,250,['펄스 둘','감쇠·BS','렌즈','폴라리톤 공동','카메라']);
  // 보조 패널: 상호작용 배율 → 필요 에너지(옛 그래프)
  P.aux(470,222,402,142,'상호작용을 키우면 필요한 에너지가 준다');
  const gx=x=>506+x*340/2.48, gy=y=>340-(clamp(y,yLo,yHi)-yLo)/sp*84;
  axP(P,506,340,340,90,'','');
  P.text(502,gy(yHi)+3,eng(pol(1,Q).E,'J',0),{a:'end',s:8.5}); P.text(502,343,eng(pol(300,Q).E,'J',0),{a:'end',s:8.5});
  P.text(510,252,'필요 에너지',{s:9});
  P.text(506,353,'1×',{s:9}); P.text(gx(Math.log10(60)),353,'60×',{a:'middle',s:9}); P.text(846,353,'300×',{a:'end',s:9});
  P.text(640,353,'상호작용 배율 (로그)',{a:'middle',s:9});
  P.path(pth(cv.map(q=>[gx(q[0]),gy(q[1])])),{c:'beam',w:2});
  const rx=gx(Math.log10(60)), ry=gy(Math.log10(rep.E));
  P.path(`M${rx.toFixed(1)} 340 V${ry.toFixed(1)}`,{c:'rule',w:1,dash:[2,3]});
  P.circ(rx,ry,3.2,{c:'none',f:'wall'}); P.text(rx+6,ry-6,'보고 지점 60×',{s:8.5,c:'wall'});
  P.circ(gx(clamp(Math.log10(m),0,2.48)),gy(Math.log10(a.E)),4,{c:'none',f:'probe'});
  $('f4').innerHTML=P.out();
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
  const m=lg(+$('c5m').value,1,3000), P0=+$('c5p').value*2, F=lg(+$('c5f').value,1,30);
  $('o5m').textContent=fmt(m,m<10?2:0)+'×'; $('o5p').textContent=P0+' mW'; $('o5f').textContent=fmt(F,1)+'×';
  const a=nl(m,P0,F), b=nl(1,P0,F), asym=nl(1e6,P0,F);
  const cv=[]; for(let k=0;k<=70;k++){ const mm=Math.pow(10,3.48*k/70); cv.push([Math.log10(mm),nl(mm,P0,F).loss]); }
  const lMax=Math.max(b.loss,1);
  const Ls=a.L<1e-3?eng(a.L,'m',1):fmt(a.L*100,2)+' cm';
  const Lw=clamp(Math.log10(a.L/1e-6)/5.5,0.04,1)*150;    /* 2D 층 길이 = π 위상에 드는 길이(1 µm ~ 30 cm 로그) */
  const Tout=Math.pow(10,-a.loss/10);
  // 사이클: 펄스 LD → 격자 결합기 → 도파로 → 결합기(둘로) → 위 팔: 2D 층(세기로 위상) / 아래 팔: 기준 → 결합기 간섭(위상 → 세기) → PD → 판정
  const P=CYC.pen(), YU=84, YL=148, YM=116;
  P.zone(96,52,372,134,''); P.lab(102,46,'칩 — 2D 층을 덮은 도파로',{s:10});
  P.laser(38,YU,{id:'src-pulse'}); P.beam([[61,YU],[106,YU]],{w:2.4});
  XP.coup(P,118,YU);
  P.path(`M130 ${YU} H170`,{c:'faint',w:5,op:.4});
  XP.wg(P,210,YU,410,'wg'); P.path(`M210 ${YL} H410`,{c:'faint',w:5,op:.4});
  P.path(`M450 ${YU} H468 M450 ${YL} H468`,{c:'faint',w:5,op:.4});
  P.coupler(190,YM,{w:40,g:32});
  P.coupler(430,YM,{w:40,g:32}); P.at2('bs',[450,YM-34]);
  P.beam([[130,YU],[170,YU]],{w:2.2});
  P.beam([[210,YU],[410,YU]],{w:1.8}); P.beam([[210,YL],[410,YL]],{w:1.8});
  XP.kerr(P,232,YU,Lw,clamp(Math.log10(m)/3.48,0,1));
  P.lab(232,68,`2D 층 ${fmt(m,m<10?1:0)}× · π 길이 ${Ls}`,{s:9.5,c:'beam'});
  P.lab(232,YL+18,'기준 팔',{s:9.5});
  P.beam([[450,YU],[476,YU]],{w:1+2.4*Tout}); P.beam([[450,YL],[476,YL]],{w:1,op:.35});
  P.pd(486,YU,{v:Tout}); P.pd(486,YL,{id:false,v:.05});
  P.lab(486,YU+24,`−${fmt(a.loss,1)} dB`,{a:'middle',s:9.5});
  P.wire([[496,YU],[522,YU],[522,YM],[538,YM]]); P.wire([[496,YL],[522,YL],[522,YM]],{arrow:false});
  P.box(566,YM,56,28,'판정',{tone:'probe',s:10});
  P.legend(16,250,['펄스','결합기','2D 층 도파로','간섭','PD','판정']);
  // 보조 패널: 배율 → π당 손실(옛 그래프)
  P.aux(470,222,402,142,'배율만 올리면 π당 손실이 바닥에서 멈춘다');
  const gx=x=>506+x*340/3.48, gy=y=>340-clamp(y/lMax,0,1)*86;
  axP(P,506,340,340,90,'','dB'); P.text(502,gy(lMax)+3,fmt(lMax,0),{a:'end',s:8.5});
  P.text(506,353,'1×',{s:9}); P.text(846,353,'3000×',{a:'end',s:9}); P.text(676,353,'χ⁽³⁾ 배율 (로그) · π당 손실',{a:'middle',s:9});
  P.path(pth(cv.map(q=>[gx(q[0]),gy(q[1])])),{c:'beam',w:2});
  const fy=gy(asym.loss);
  P.path(`M506 ${fy.toFixed(1)} H846`,{c:'faint',w:1,dash:[3,3]}); P.text(846,fy-4,`바닥 ${fmt(asym.loss,1)} dB`,{a:'end',s:8.5,c:'wall'});
  P.circ(gx(clamp(Math.log10(m),0,3.48)),gy(a.loss),4,{c:'none',f:'probe'});
  $('f5').innerHTML=P.out();
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
  const xMax=Math.max(30,tp?tp.Xup*1.4:20);
  const cv=[]; for(let k=0;k<=160;k++){ const Y=k*(D+5)/160, x=XofY(Y,D); if(x<=xMax) cv.push([x,Y]); }   /* 패널 밖(오른쪽)으로 나가는 위 가지는 자른다 */
  let lower=cv,mid=[],upper=[];
  if(tp){ lower=cv.filter(q=>q[1]<=tp.Ylo); mid=cv.filter(q=>q[1]>tp.Ylo&&q[1]<tp.Yhi); upper=cv.filter(q=>q[1]>=tp.Yhi); }
  const Tc=clamp(T,0,1), fy=clamp(Y6/(D+5),0,1), on=!!tp&&Y6>=tp.Yhi*0.98;
  // 사이클: LD → (아이솔레이터) → 감쇠기(입력 세기 X) → 결합기 → 버스 도파로 → Kerr 공진기(링·PhC, 쌍안정) → 투과·드롭 → PD → 판정
  const P=CYC.pen(), YB=96, RX=360, R=26, RY=YB+8+R, YD=RY+R+8, xw=1.2+3*clamp(X/30,0,1);
  P.zone(226,58,326,138,''); P.lab(232,52,'칩 — Kerr 공진기',{s:10});
  P.laser(38,YB); P.beam([[61,YB],[84,YB]],{w:2}); P.iso(98,YB);
  P.beam([[112,YB],[133,YB]],{w:2}); XP.voa(P,150,YB,'입력 X');
  P.beam([[167,YB],[200,YB]],{w:xw}); XP.coup(P,212,YB);
  XP.wg(P,224,YB,540,'wg',[282,YB]); P.path(`M300 ${YD} H540`,{c:'faint',w:5,op:.4});
  P.beam([[224,YB],[RX,YB]],{w:xw});
  P.beam([[RX,YB],[540,YB]],{w:1+2.4*clamp(1-Tc*.85,0,1)*clamp(X/30,.2,1)});
  P.beam([[RX,YD],[540,YD]],{w:1+3*Tc*clamp(X/30,.2,1),op:.4+.6*Tc});
  // 공진기: 서브파장 격자(SWG) 링 — 갇힌 세기 Y 만큼 노랗게, Kerr 매질(붉음)이 공진을 스스로 민다
  P.part('ring',[RX-R-3,RY-R-3,2*R+6,2*R+6],()=>{
    P.circ(RX,RY,R,{c:'faint',w:5,op:.4,f:'warm',fo:.4*fy});
    P.circ(RX,RY,R,{c:'beam',w:1.6,dash:[3,2.5],op:.45+.55*fy});
  },[RX-R-6,RY]);
  P.part('kerr',[RX,RY,R+3,R+3],()=>P.path(`M${RX+R} ${RY} A${R} ${R} 0 0 1 ${RX} ${RY+R}`,{c:'beam',w:3.2,op:.35+.65*fy}));
  P.at2('coup',[RX+6,YB+3]); P.lab(RX-36,YB+16,'간격 g',{s:9,a:'end'});
  // 같은 자리의 다른 구현: 광결정 나노캐비티
  P.rect(436,106,96,34,{c:'rule',w:1,f:'panel',dash:[3,3],r:4});
  XP.phc(P,446,111,76,24,'cav',fy); P.lab(484,153,'또는 PhC 캐비티',{a:'middle',s:9.5});
  P.pd(566,YB,{v:clamp(1-Tc*.85,0,1)}); P.lab(566,YB-16,'투과',{a:'middle',s:9.5});
  P.pd(566,YD,{id:false,v:Tc}); P.lab(566,YD+24,'드롭',{a:'middle',s:9.5});
  P.wire([[576,YB],[600,YB],[600,RY],[614,RY]]); P.wire([[576,YD],[600,YD],[600,RY]],{arrow:false});
  P.box(644,RY,58,28,'판정',{tone:'probe',s:10}); P.text(682,RY+6,on?'1':'0',{s:16,c:'probe',b:1});
  P.legend(16,250,['광원','세기 X','결합','Kerr 공진기','PD','판정']);
  // 보조 패널: 쌍안정 S곡선(옛 그래프)
  P.aux(470,222,402,142,'쌍안정 S곡선 — 같은 X 에 Y 가 둘');
  const gx=x=>506+clamp(x/xMax,0,1)*340, gy=y=>340-clamp(y/(D+5),0,1)*86, gp=p=>pth(p.map(q=>[gx(q[0]),gy(q[1])]));
  axP(P,506,340,340,90,'입력 X','Y');
  if(tp){
    P.path(`M${gx(tp.Xup).toFixed(1)} 340 V258 M${gx(tp.Xdn).toFixed(1)} 340 V258`,{c:'rule',w:1,dash:[2,3]});
    P.text(gx(tp.Xup)+3,266,'↑ '+fmt(tp.Xup,1),{s:8.5,c:'beam'}); P.text(gx(tp.Xdn)-3,266,'↓ '+fmt(tp.Xdn,1),{a:'end',s:8.5,c:'probe'});
  } else P.text(676,262,'Δ ≤ √3 — 히스테리시스 없음',{a:'middle',s:9});
  if(lower.length>1) P.path(gp(lower),{c:'probe',w:2});
  if(mid.length>1) P.path(gp(mid),{c:'faint',w:1.6,dash:[4,3]});
  if(upper.length>1) P.path(gp(upper),{c:'beam',w:2});
  P.circ(gx(X),gy(Y6),4.2,{c:'none',f:'probe'});
  $('f6').innerHTML=P.out();
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
