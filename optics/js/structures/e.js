/* E · 변환 앞 — 옛 아티팩트 장(html)과 그 장을 움직이는 코드(run).
   compute.js 가 html 을 페이지 밖 요소 트리로 한 번 만들고 run 을 그 트리에 묶은 뒤,
   고른 구조의 그림·손잡이 요소를 그대로 떼어 그림판·오른쪽 패널에 붙인다(복제·대리 없음).
   run 의 document 는 그 트리를 찾는 좁은 창이다: getElementById · querySelector(All) 만. */
(window.CMP = window.CMP || { groups: {} }).groups.e = {
  id: 'e', name: "E · 변환 앞",
  html: "<section id=\"sec-e\" hidden>\n<p class=\"lede\" style=\"margin-bottom:10px\"><b>E군 · 센서·이미징 앞단.</b> 광 가속기에서 전력을 먹는 건 곱셈이 아니라 ADC·DAC와 메모리 이동이다. 그러면 답은 하나다 — 변환 앞에서 데이터를 줄여라. 네 구조가 각자 다른 지점에서 그걸 한다.</p>\n<div class=\"tabs\" id=\"e-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>In-sensor</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>회절 인코더</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>메타표면 미분</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\"><span class=\"n\">04</span>광 전처리기</button>\n  <button type=\"button\" data-s=\"5\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n\n<div class=\"card sec\" id=\"e-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>In-sensor computing</h2></div>\n    \n  </div>\n  <p class=\"idea\">빛이 전류가 되는 그 지점에서 곱셈을 한다. 화소의 감응도를 전압으로 바꾸면 <span class=\"k\">감응도 자체가 가중치</span>라서, 전하가 모일 때 이미 Σwᵢxᵢ가 끝나 있다. ADC는 화소 수가 아니라 출력 수만큼만 돈다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"e-f1\" viewBox=\"0 0 880 290\" role=\"img\" aria-label=\"장면 → 렌즈 → 감응도가 가중치인 화소 배열 → 전류 합 → TIA → ADC\"></svg></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">입력 영상</span>\n        <button type=\"button\" data-g=\"1in\" data-v=\"V\" aria-pressed=\"true\">세로 경계</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"H\" aria-pressed=\"false\">가로 경계</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"P\" aria-pressed=\"false\">점</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"U\" aria-pressed=\"false\">균일</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c1n\">출력 노드 수</label><input type=\"range\" id=\"e-c1n\" min=\"1\" max=\"4\" step=\"1\" value=\"2\"><output id=\"e-o1n\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b1z\">가중치 0으로</button></div>\n      <div class=\"read\" id=\"e-r1\"></div>\n      <p class=\"note\">왼쪽 격자의 칸을 누르면 그 화소 감응도가 <span class=\"k\">−1 → 0 → +1</span>로 돈다. 출력 노드가 둘 이상일 땐 같은 가중치를 열 방향으로 한 칸씩 밀어 쓴다(한 배열로 여러 특징을 뽑는 방식).</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s2\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>회절 인코더 + 아날로그 전자 (ACCEL)</h2></div>\n    \n  </div>\n  <p class=\"idea\">앞단은 회절이 특징을 뽑고, 뒷단은 아날로그 전자가 바로 분류한다. 둘 사이에 <span class=\"k\">디지털이 없으니 ADC가 빠진다</span>. 광이 혼자 다 하는 게 아니라, 변환을 건너뛰려고 전자를 아날로그로 남겨둔 설계다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f2\" width=\"880\" height=\"360\" aria-label=\"장면 → 렌즈 → 회절층(가중치) → 자유 전파 → PD M개 → TIA → 아날로그 판정, ADC 없음\"></canvas></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">참 라벨</span>\n        <button type=\"button\" data-g=\"2cl\" data-v=\"A\" aria-pressed=\"true\">A (두 점)</button>\n        <button type=\"button\" data-g=\"2cl\" data-v=\"B\" aria-pressed=\"false\">B (한 덩이)</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c2f\">인코더 초점</label><input type=\"range\" id=\"e-c2f\" min=\"-100\" max=\"100\" step=\"1\" value=\"48\"><output id=\"e-o2f\"></output></div>\n        <div class=\"row\"><label for=\"e-c2t\">인코더 기울기</label><input type=\"range\" id=\"e-c2t\" min=\"-60\" max=\"60\" step=\"1\" value=\"16\"><output id=\"e-o2t\"></output></div>\n        <div class=\"row\"><label for=\"e-c2m\">특징 개수 M</label><input type=\"range\" id=\"e-c2m\" min=\"2\" max=\"16\" step=\"2\" value=\"8\"><output id=\"e-o2m\"></output></div>\n        <div class=\"row\"><label for=\"e-c2z\">입력 잡음</label><input type=\"range\" id=\"e-c2z\" min=\"0\" max=\"200\" step=\"2\" value=\"18\"><output id=\"e-o2z\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b2s\">잡음 다시 뽑기</button></div>\n      <div class=\"read\" id=\"e-r2\"></div>\n      <p class=\"note\">128점 입력을 프레넬 전파로 실제 통과시켜 M칸으로 모으고, 그 M개에 선형 판정기(두 클래스 중심의 차 벡터)를 건다. 보고값 <b>74.8 peta-OPS/W</b>는 논문 수치이고 ⚠️ <span class=\"k\">정밀도 bit 정의가 미확인</span>이라 다른 칩과 직접 비교하면 안 된다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s3\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>메타표면 아날로그 연산</h2></div>\n    \n  </div>\n  <p class=\"idea\">한 장 통과로 미분이 끝난다. 주파수 영역에서 전달함수를 <span class=\"k\">i·k 꼴</span>로 깎아놓으면 통과한 빛이 곧 공간 미분이고, 엣지가 저절로 뽑힌다. 전력도 지연도 들지 않는다 — 대신 커널을 바꿀 수가 없다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f3\" width=\"880\" height=\"340\" aria-label=\"장면 → 메타표면(전달함수 = 가중치) → 출력면 카메라 → ADC\"></canvas></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">입력</span>\n        <button type=\"button\" data-g=\"3in\" data-v=\"S\" aria-pressed=\"true\">계단</button>\n        <button type=\"button\" data-g=\"3in\" data-v=\"R\" aria-pressed=\"false\">사각</button>\n        <button type=\"button\" data-g=\"3in\" data-v=\"T\" aria-pressed=\"false\">두 점</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c3c\">개구 차단 fc</label><input type=\"range\" id=\"e-c3c\" min=\"4\" max=\"48\" step=\"1\" value=\"24\"><output id=\"e-o3c\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <span class=\"chip\">차수</span>\n        <button type=\"button\" data-g=\"3o\" data-v=\"1\" aria-pressed=\"true\">1차 (i·k)</button>\n        <button type=\"button\" data-g=\"3o\" data-v=\"2\" aria-pressed=\"false\">2차 (−k²)</button>\n        <span class=\"chip\">장수</span>\n        <button type=\"button\" data-g=\"3s\" data-v=\"1\" aria-pressed=\"true\">1장</button>\n        <button type=\"button\" data-g=\"3s\" data-v=\"2\" aria-pressed=\"false\">2장</button>\n      </div>\n      <div class=\"read\" id=\"e-r3\"></div>\n      <p class=\"note\">전달함수를 <span class=\"k\">|H| ≤ 1</span>로 정규화했다 — 수동 소자라 이득이 없다는 게 이 조건이다. 「2장」을 눌러보면 왜 캐스케이드가 안 되는지 숫자로 나온다. 그래서 현실적 자리는 범용 연산이 아니라 <span class=\"k\">이미징 센서 앞단 전처리</span> 한 장이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s4\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">04</div><h2>광 전처리기</h2></div>\n    \n  </div>\n  <p class=\"idea\">연산을 대신하는 게 아니라 <span class=\"k\">변환 앞에서 신호를 다듬는다</span>. 대역 밖 잡음을 광학에서 먼저 털어내면 ADC가 덮어야 할 동적 범위가 줄고, 그만큼 비트가 빠진다. 가장 지루해 보이지만 가장 직접적인 이득이다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f4\" width=\"880\" height=\"370\" aria-label=\"섬유 어레이 → 격자 결합기 → 도파관 → 링 필터(가중치, 바이어스·파장 락) → PD → TIA → ADC\"></canvas></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c4z\">잡음 세기</label><input type=\"range\" id=\"e-c4z\" min=\"0\" max=\"80\" step=\"1\" value=\"40\"><output id=\"e-o4z\"></output></div>\n        <div class=\"row\"><label for=\"e-c4b\">광학 대역폭</label><input type=\"range\" id=\"e-c4b\" min=\"2\" max=\"64\" step=\"1\" value=\"12\"><output id=\"e-o4b\"></output></div>\n        <div class=\"row\"><label for=\"e-c4e\">요구 분해능</label><input type=\"range\" id=\"e-c4e\" min=\"1\" max=\"10\" step=\"1\" value=\"2\"><output id=\"e-o4e\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b4s\">잡음 다시 뽑기</button><button type=\"button\" id=\"e-b4o\">최적 대역 찾기</button></div>\n      <div class=\"read\" id=\"e-r4\"></div>\n      <p class=\"note\">비트를 <span class=\"k\">두 축으로</span> 센다. ① <b>범위 기준</b> = log₂(2·최대진폭 ÷ 요구 분해능) — 잡음 봉우리가 사라지면 덮을 범위가 줄어 빠지는 몫이고, 보통 1 bit 안쪽이라 작다. ② <b>SNR 기준 등가</b> = SNR 개선분 ÷ 6.02 dB — 잡음을 광학에서 이미 털었으니 뒷단 ENOB 요구가 그만큼 느슨해진다는 몫이고, 이쪽이 크다. 너무 좁히면 신호가 깎여 SNR이 되레 떨어지는데, 그 꺾이는 지점이 「최적 대역」이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"e-s5\" hidden>\n  <h2 style=\"font-size:16px\">넷을 겹쳐 보면</h2>\n  <p style=\"margin-top:8px\"><b>네 구조의 공통점은 연산이 아니라 변환이다.</b> 광 가속기 시스템 에너지의 큰 몫을 ADC·DAC와 메모리 이동이 먹기 때문에, 곱셈을 광으로 빨리 하는 것보다 <span class=\"k\">변환 횟수를 줄이는 것</span>이 더 크게 남는다. E군은 전부 거기를 노린다 — 01은 화소에서 미리 더해 ADC 횟수를 출력 수로 줄이고, 02는 아날로그 전자를 뒤에 붙여 ADC를 아예 빼고, 03·04는 변환 앞에서 데이터를 깎아 필요한 비트를 줄인다.</p>\n  <p><b>그래서 이 그룹은 「전광」이 아니라 electro-optical 하이브리드다.</b> 02가 그 점에서 솔직하다 — 뒷단을 디지털로 올리면 ACCEL의 이점이 사라지니까 전자를 아날로그로 남겨뒀다. 승부처를 변환 경계로 잡으면 광이 어디까지 하고 전자가 어디서 받는지가 설계 변수가 되고, 「빛으로 다 한다」는 축은 자연히 내려간다.</p>\n  <p><b>벽도 같은 자리에서 나온다 — 커널이 고정이다.</b> 02의 회절 마스크와 03의 메타표면은 둘 다 한 번 찍으면 가중치가 굳는다. 그래서 둘 다 추론 앞단 전처리에 서고, 가중치를 바꿔야 하는 자리에는 못 선다. 01이 이 중 유일하게 전압으로 가중치를 쥐고 있고, 그래서 이 그룹에서 가장 범용에 가깝다. <span class=\"k\">가중치 저장·업데이트가 다음 5년 승부처라는 판단과 정확히 같은 결이다</span> — 변환을 줄여 이득을 보려 해도, 바꿀 수 없는 가중치는 그 이득을 쓸 자리를 좁힌다.</p>\n  <p><b>03은 특히 자기 자리를 알아야 쓸 수 있다.</b> 이득이 없으니(|H| ≤ 1) 두 장을 겹치면 신호가 주저앉고, 메모리도 비선형도 없어 층을 쌓을 수가 없다. 범용 연산 후보로 올리면 바로 깨지고, 센서 앞 한 장으로 두면 전력 0·지연 0의 엣지검출기가 된다. 같은 소자가 어디에 놓이느냐로 성패가 갈리는 사례다.</p>\n</div>\n\n<div class=\"pending\" id=\"e-pend\" hidden>\n  <b>이 페이지의 자리</b> — 구조 분류표 A~F군 중 <b>E군(센서·이미징 앞단)</b>이다. A군(행렬곱 여덟 구조)은 <a href=\"https://claude.ai/artifact/1rU7rNCNLmKpuXvThQPB9S\">4×4 메시</a>와 함께 따로 있고, B·C·D·F군은 같은 틀로 이어 만든다.\n</div>\n</section>",
  run: function (document, getComputedStyle, MOD) {


(function(){
const SEC=document.getElementById('sec-e');

const $=id=>document.getElementById(id);
const D2R=Math.PI/180;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(v,n)=>v.toFixed(n==null?2:n);
const COL=k=>getComputedStyle(document.body).getPropertyValue(k).trim();

/* 공용: 길이 N 직접 DFT */
function dftN(re,im,N,inv){
  const R=new Float64Array(N), I=new Float64Array(N), s=inv?1:-1;
  for(let k=0;k<N;k++){let a=0,b=0;
    for(let n=0;n<N;n++){const t=s*2*Math.PI*k*n/N, c=Math.cos(t), q=Math.sin(t);
      a+=re[n]*c-im[n]*q; b+=re[n]*q+im[n]*c;}
    R[k]=inv?a/N:a; I[k]=inv?b/N:b;}
  return [R,I];
}
/* 결정론적 잡음 */
function noise(N,seed){
  const a=new Float64Array(N); let s=seed;
  for(let n=0;n<N;n++){ s=(s*1103515245+12345)&0x7fffffff; a[n]=(s/0x7fffffff)*2-1; }
  return a;
}

/* ── 01 In-sensor computing ─────────────────────── */
const W1=[[1,0,0,-1],[1,0,0,-1],[1,0,0,-1],[1,0,0,-1]];
let in1='V';
function img1(){
  const I=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
    if(in1==='V') I[i][j]= j<2?0.15:0.90;
    else if(in1==='H') I[i][j]= i<2?0.15:0.90;
    else if(in1==='P') I[i][j]= (i>0&&i<3&&j>0&&j<3)?0.95:0.10;
    else I[i][j]=0.55;
  }
  return I;
}
function r1(){
  const Nout=+$('e-c1n').value;
  $('e-o1n').textContent=Nout+'개';
  const I=img1();
  const ys=[];
  for(let o=0;o<Nout;o++){
    let y=0;
    for(let i=0;i<4;i++)for(let j=0;j<4;j++) y+=W1[i][(j+o)%4]*I[i][j];
    ys.push(y);
  }
  // 그림 — 사이클: 장면 → 렌즈 → 화소 배열(감응도 = 가중치, 게이트 전압) → 배선에서 전류 합 → TIA → ADC
  const P=CYC.pen(), Y=120, px=34, GX=210, GY=52, GS=4*px-3;
  // 장면: 들어오는 빛 그 자체(광원이 따로 없다)
  P.lab(56,84,'장면',{a:'middle',c:'ink'});
  for(let i=0;i<4;i++)for(let j=0;j<4;j++) P.rect(28+j*14,92+i*14,13,13,{c:'rule',w:.8,f:'warm',fo:.06+.85*I[i][j],r:1.5});
  P.lab(56,170,'입력 영상',{a:'middle',s:9.5});
  // 빛: 장면 → 렌즈 → 화소면
  P.path(`M84 92 L150 ${Y-62} L${GX} ${GY} L${GX} ${GY+GS} L150 ${Y+62} L84 148 Z`,{c:'none',f:'beam',fo:.07});
  P.beam([[84,92],[150,Y-62],[GX-2,GY]],{w:1.3,op:.8}); P.beam([[84,148],[150,Y+62],[GX-2,GY+GS]],{w:1.3,op:.8});
  P.beam([[84,120],[GX-4,120]],{w:1.3,op:.5,arrow:true});
  P.lens(150,Y,132,{lab:''}); P.lab(150,Y+82,'렌즈',{a:'middle'});
  // 화소 배열: 밑색 = 들어온 빛, 테두리·기호 = 감응도 가중치(+ 붉음 · − 파랑). 칸을 누르면 돈다
  const g=[];
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
    const x=GX+j*px, y=GY+i*px, w=W1[i][j];
    g.push(`<rect x="${x}" y="${y}" width="${px-3}" height="${px-3}" rx="3" fill="var(--warm)" opacity="${(0.05+0.55*I[i][j]).toFixed(2)}"/>`);
    const st= w>0?'var(--beam)': (w<0?'var(--probe)':'var(--rule)');
    g.push(`<rect class="cell" data-i="${i}" data-j="${j}" x="${x}" y="${y}" width="${px-3}" height="${px-3}" rx="3" fill="transparent" stroke="${st}" stroke-width="${w===0?1:2}" style="cursor:pointer"/>`);
    g.push(`<text class="${w>0?'a':(w<0?'p':'m')}" x="${x+(px-3)/2}" y="${y+21}" font-size="12" text-anchor="middle" pointer-events="none">${w>0?'+':(w<0?'−':'0')}</text>`);
  }
  P.lab(GX+GS/2,GY-10,'화소 = 가중치',{a:'middle',c:'ink'});
  P.raw(g.join(''));
  P.mark('pd',[GX,GY,GS,GS],[GX+GS+2,GY-2]);
  // 게이트 전압: 화소마다 감응도를 정하는 제어선
  P.box(GX+GS/2,226,82,22,'게이트 V',{tone:'probe',s:10});
  P.wire([[GX+GS/2,215],[GX+GS/2,GY+GS+5]]);
  P.lab(GX+GS/2+48,230,'칸 누르면 −/0/+',{s:9.5});
  // 전류 합: 화소 광전류가 한 배선에 모인다(키르히호프) — 출력 노드마다 가중치를 한 칸씩 밀어 쓴다
  const BX=372;
  for(let i=0;i<4;i++) P.wire([[GX+GS+2,GY+i*px+15],[BX,GY+i*px+15]],{arrow:false,op:.6});
  P.path(`M${BX} ${GY+15} V${GY+3*px+15}`,{c:'probe',w:1.6});
  for(let o=0;o<Nout;o++){
    const cy=Y+(o-(Nout-1)/2)*40, mag=clamp(Math.abs(ys[o])/3.2,0,1);
    P.wire([[BX,Y],[BX+14,Y],[BX+24,cy],[BX+32,cy]],{w:1+2.6*mag,op:.35+.65*mag,arrow:false});
    P.circ(BX+44,cy,11,{c:'probe',w:1.3,f:'panel'}); P.text(BX+44,cy+4,'Σ',{a:'middle',c:'probe',s:11});
    P.wire([[BX+55,cy],[BX+84,cy]]);
    P.box(BX+108,cy,46,24,'TIA',{id:o===0?'tia':undefined,s:10});
    P.wire([[BX+131,cy],[BX+156,cy]]);
    P.box(BX+178,cy,42,24,'ADC',{id:o===0?'adc':undefined,s:10});
    P.text(BX+208,cy+4,fmt(ys[o],2),{c:ys[o]>=0?'probe':'beam',s:12,b:1});
  }
  P.lab(BX+44,Y-Nout*20-14,'전류 합',{a:'middle'});
  // 보조: ADC 변환 횟수 — 화소를 그대로 읽을 때와 견주기
  P.aux(660,44,206,128,'ADC 변환 횟수');
  [['화소 그대로',16,'wall'],['출력 노드',Nout,'probe']].forEach(([t,n,c],k)=>{
    const y=78+k*44; P.lab(672,y,t,{s:10});
    P.rect(672,y+6,150*n/16,12,{c:'none',f:c,fo:.75,r:1.5}); P.text(672+150*n/16+6,y+16,n+'회',{s:10.5,c:c,b:1});
  });
  P.lab(672,166,`→ ${fmt(16/Nout,1)}배 줄었다`,{s:10,c:'ink'});
  P.legend(16,264,['장면','렌즈','화소 = 가중치','전류 합','TIA·ADC']);
  $('e-f1').innerHTML=P.out();
  $('e-f1').querySelectorAll('.cell').forEach(c=>c.addEventListener('click',()=>{
    const i=+c.dataset.i, j=+c.dataset.j;
    W1[i][j]= W1[i][j]===-1?0:(W1[i][j]===0?1:-1);
    r1();
  }));
  const macs=16*Nout, nz=W1.flat().filter(v=>v!==0).length;
  $('e-r1').innerHTML=
    `<div>출력 <b>${ys.map(v=>fmt(v,2)).join(' · ')}</b></div>`+
    `<div>아날로그 곱셈·누적 <b>${macs}</b>회 (화소 16 × 출력 ${Nout})</div>`+
    `<div>ADC 변환 — 화소를 그대로 읽으면 <b>16</b>회, 여기선 <b>${Nout}</b>회 → <b>${fmt(16/Nout,1)}배</b> 줄었다</div>`+
    `<div>0이 아닌 가중치 ${nz}/16개</div>`;
}

/* ── 02 회절 인코더 + 아날로그 전자 ─────────────── */
const N2=128;
let cl2='A', seed2=7;
function proto2(kind){
  const a=new Float64Array(N2);
  const bump=(c,w,h)=>{for(let n=0;n<N2;n++){const u=(n-c)/w; a[n]+=h*Math.exp(-(u*u));}};
  if(kind==='A'){ bump(44,4.5,1); bump(86,4.5,1); } else { bump(64,13,1); }
  return a;
}
function encode2(src,foc,tilt,M){
  const re=Float64Array.from(src), im=new Float64Array(N2);
  // 마스크: 2차 위상(초점) + 1차 위상(기울기)
  for(let n=0;n<N2;n++){
    const u=(n-N2/2)/N2;
    const ph=-foc*0.06*u*u*N2 + tilt*0.0096*u*N2;
    const c=Math.cos(ph), s=Math.sin(ph), a=re[n], b=im[n];
    re[n]=a*c-b*s; im[n]=a*s+b*c;
  }
  // 프레넬 전파
  let [R,I]=dftN(re,im,N2,false);
  for(let k=0;k<N2;k++){
    const f=(k<N2/2?k:k-N2)/N2;
    const ph=-Math.PI*f*f*40;
    const c=Math.cos(ph), s=Math.sin(ph), a=R[k], b=I[k];
    R[k]=a*c-b*s; I[k]=a*s+b*c;
  }
  const [or_,oi]=dftN(R,I,N2,true);
  const Iout=new Float64Array(N2);
  for(let n=0;n<N2;n++) Iout[n]=or_[n]*or_[n]+oi[n]*oi[n];
  // M칸으로 모은다 = 검출기 M개
  const f=new Float64Array(M), per=N2/M;
  for(let n=0;n<N2;n++) f[clamp(Math.floor(n/per),0,M-1)]+=Iout[n];
  let s=0; for(let m=0;m<M;m++) s+=f[m];
  if(s>0) for(let m=0;m<M;m++) f[m]/=s;
  return [f,Iout];
}
function r2(){
  const foc=+$('e-c2f').value, tilt=+$('e-c2t').value, M=+$('e-c2m').value, nz=+$('e-c2z').value/100;
  $('e-o2f').textContent=foc; $('e-o2t').textContent=tilt; $('e-o2m').textContent=M+'개'; $('e-o2z').textContent=fmt(nz*100,0)+'%';
  // 입력 = 참 라벨 프로토타입 + 잡음
  const base=proto2(cl2), nn=noise(N2,seed2);
  const x=new Float64Array(N2);
  for(let n=0;n<N2;n++) x[n]=Math.max(0, base[n]+nz*nn[n]);
  // 판정기: 두 클래스 중심의 차 (아날로그 전자가 하는 선형 결합)
  const [fA]=encode2(proto2('A'),foc,tilt,M);
  const [fB]=encode2(proto2('B'),foc,tilt,M);
  const [fx,Iout]=encode2(x,foc,tilt,M);
  let score=0, nrm=0;
  for(let m=0;m<M;m++){ const w=fA[m]-fB[m]; score+=w*(fx[m]-(fA[m]+fB[m])/2); nrm+=w*w; }
  const margin= nrm>0 ? score/Math.sqrt(nrm) : 0;
  const pred= score>0?'A':'B', ok= pred===cl2;
  // 그림 — 사이클: 장면 → 렌즈 → 회절층(위상 = 가중치) → 자유 전파 → PD M개 → TIA → 아날로그 판정 (ADC 없음)
  const cv=$('e-f2'), cx=cv.getContext('2d'), W=cv.width, H=cv.height;
  cx.clearRect(0,0,W,H);
  const P=CYC.pen(cx), Y=110, T=45, B=175, xm=Math.max(...x,1e-9), im=Math.max(...Iout,1e-9), fm=Math.max(...fx,1e-9);
  // 장면: 1차원 입력을 세로 띠로(밝기 = 세기)
  P.lab(38,32,'장면',{a:'middle',c:'ink'});
  P.rect(24,T,28,B-T,{c:'rule',w:1,f:'panel',r:2});
  for(let k=0;k<32;k++){ let v=0; for(let n=k*4;n<k*4+4;n++) v+=x[n]; P.rect(26,T+1+k*(B-T-2)/32,24,(B-T-2)/32,{c:'none',f:'warm',fo:clamp(v/4/xm,0,1)*.9,r:0}); }
  P.lab(38,B+16,'라벨 '+cl2,{a:'middle',s:9.5});
  // 빛: 장면 → 렌즈 → 회절층
  P.path(`M52 ${T} L130 ${T} L200 ${T+6} L200 ${B-6} L130 ${B} L52 ${B} Z`,{c:'none',f:'beam',fo:.07});
  P.beam([[52,T],[130,T],[198,T+6]],{w:1.3,op:.8}); P.beam([[52,B],[130,B],[198,B-6]],{w:1.3,op:.8});
  P.lens(130,Y,B-T+8,{lab:''}); P.lab(130,B+16,'렌즈',{a:'middle'});
  // 회절층: 자리마다 위상(초점·기울기 손잡이) — 무늬가 가중치
  const ph=u=>-foc*0.06*u*u*N2 + tilt*0.0096*u*N2;
  P.plate(204,Y,B-T-8,{n:18,vals:[...Array(18)].map((_,i)=>.5+.5*Math.cos(ph((i+.5)/18-.5)))});
  P.lab(204,B+16,'회절층',{a:'middle'});
  // 자유 전파: 퍼져 나가 검출면에 세기 분포가 맺힌다
  P.zone(214,T-8,180,B-T+16,'',{fo:.25});
  P.lab(304,T-14,'자유 전파',{a:'middle',s:10});
  for(let k=0;k<9;k++){ const y0=T+8+k*(B-T-16)/8; P.beam([[210,y0],[388,T+(y0-T)*.9+6]],{w:.8,op:.18}); }
  const PX=412;
  P.path('M'+[...Iout].map((v,n)=>`${(PX-6-(v/im)*70).toFixed(1)} ${(T+n*(B-T)/(N2-1)).toFixed(1)}`).join(' L'),{c:'beam',w:1.6});
  // 검출기 M개: 칸마다 모인 빛(파랑 채움 = 특징 값)
  const dh=(B-T)/M;
  P.part('pd',[PX-1,T,16,B-T],()=>{ for(let m=0;m<M;m++){
    P.rect(PX,T+m*dh+1,13,dh-2,{c:'ink',w:1,f:'panel',r:1.5});
    P.rect(PX,T+m*dh+1,13,dh-2,{c:'none',f:'probe',fo:.1+.8*fx[m]/fm,r:1.5}); } });
  P.lab(PX+7,B+16,'PD ×'+M,{a:'middle'});
  for(let m=0;m<M;m++) P.wire([[PX+14,T+(m+.5)*dh],[462,T+(m+.5)*dh]],{arrow:false,op:.6});
  P.box(480,Y,34,B-T,'TIA',{id:'tia',s:10});
  // 아날로그 전자: 특징 전압 M개를 디지털로 올리지 않고 가중합·문턱
  for(let m=0;m<M;m++){ const y0=T+(m+.5)*dh; P.wire([[497,y0],[520,y0],[548,Y-34+(m+.5)*68/M]],{arrow:false,op:.6}); }
  P.lab(524,T-10,'ADC 없음',{a:'middle',c:'probe',s:10,b:1});
  P.box(600,Y,104,84,'',{id:'eana'});
  P.text(600,Y-12,'Σ wₘ·vₘ',{a:'middle',c:'ink',s:11.5}); P.text(600,Y+8,'문턱 > 0 ?',{a:'middle',c:'muted',s:10.5});
  P.lab(600,Y+58,'아날로그 판정',{a:'middle'});
  P.wire([[652,Y],[690,Y]]);
  P.rect(694,Y-28,56,56,{c:ok?'probe':'beam',w:2,r:4});
  P.text(722,Y+9,pred,{a:'middle',c:ok?'probe':'beam',s:24,b:1});
  P.lab(722,Y+44,ok?'맞음':'틀림',{a:'middle',c:ok?'probe':'beam'});
  // 선택: 판정 한 값만 디지털로 올릴 때의 ADC(점선)
  P.wire([[750,Y],[786,Y]],{dash:[3,3]});
  P.part('adc',[790,Y-13,52,26],()=>P.rect(790,Y-13,52,26,{c:'faint',w:1.2,dash:[3,3],r:3}));
  P.text(816,Y+4,'ADC',{a:'middle',c:'faint',s:10}); P.lab(816,Y+30,'선택 · 1값',{a:'middle',s:9.5});
  // 보조: 입력과 전파 후 세기 — 128점을 실제로 프레넬 전파시킨 값
  P.aux(392,214,474,132,'입력 → 전파 후 세기 → 특징');
  const tr=(x0,w,arr,mx,c,t)=>{ P.lab(x0,248,t,{s:10}); P.path(`M${x0} 330 H${x0+w}`,{c:'rule',w:1});
    P.path('M'+arr.map((v,n)=>`${(x0+n*w/(arr.length-1)).toFixed(1)} ${(330-v/mx*68).toFixed(1)}`).join(' L'),{c,w:1.6}); };
  tr(404,140,[...x],xm,'beam','입력 (라벨 '+cl2+'+잡음)');
  tr(560,140,[...Iout],im,'beam','전파 후 세기');
  P.lab(716,248,'특징 '+M+'개',{s:10}); P.path('M716 330 H856',{c:'rule',w:1});
  const bw=Math.min(16,140/M-2);
  for(let m=0;m<M;m++){ const h=fx[m]/fm*68; P.rect(716+m*(bw+2),330-h,bw,h,{c:'none',f:'probe',fo:.8,r:1}); }
  P.legend(16,300,['장면','렌즈','회절층 = 가중치','PD','TIA','아날로그 판정']);
  CYC.seal(P);
  $('e-r2').innerHTML=
    `<div>판정 <b>${pred}</b> (참 ${cl2}) — ${ok?'맞음':'<span style="color:var(--beam)">틀림</span>'} · 마진 <b>${fmt(margin,3)}</b></div>`+
    (nz>=1 ? `<div style="color:var(--wall)">잡음이 신호만큼 커졌다 — 여기서부터 판정이 무너진다</div>` : '')+
    `<div>입력 128점 → 특징 <b>${M}</b>개 · 압축 <b>${fmt(128/M,0)}배</b></div>`+
    `<div>뒷단이 받는 데이터 — 화소를 다 읽으면 <b>128</b>개, 여기선 <b>${M}</b>개</div>`+
    `<div>ADC 변환 <b>0회</b> — 아날로그 전자가 M개를 바로 받는다</div>`;
}

/* ── 03 메타표면 미분 ───────────────────────────── */
const N3=128;
let in3='S', ord3=1, sheets3=1;
function sig3(){
  const a=new Float64Array(N3);
  if(in3==='S'){
    // 조리개를 부드럽게 닫아 주기 경계의 가짜 엣지를 없앤다 (초고차 가우시안 조명)
    for(let n=0;n<N3;n++){
      const u=(n-N3/2)/46, env=Math.exp(-(u*u*u*u));
      a[n]=env*(0.12+0.80/(1+Math.exp(-(n-N3/2)/2.2)));
    }
  }
  else if(in3==='R'){ for(let n=0;n<N3;n++) a[n]= (n>40&&n<88)?0.9:0.1; }
  else { for(let n=0;n<N3;n++){ const u1=(n-44)/5, u2=(n-84)/5; a[n]=0.08+0.9*Math.exp(-(u1*u1))+0.9*Math.exp(-(u2*u2)); } }
  return a;
}
function meta3(src,fc,order,sheets){
  let re=Float64Array.from(src), im=new Float64Array(N3);
  for(let p=0;p<sheets;p++){
    let [R,I]=dftN(re,im,N3,false);
    for(let k=0;k<N3;k++){
      const kk=(k<N3/2?k:k-N3);
      if(Math.abs(kk)>fc){ R[k]=0; I[k]=0; continue; }
      const t=kk/fc;                       // |t| <= 1 → |H| <= 1 (수동, 이득 없음)
      let hr,hi;
      if(order===1){ hr=0; hi=t; }         // i·k
      else { hr=-(t*t); hi=0; }            // -k^2
      const a=R[k], b=I[k];
      R[k]=a*hr-b*hi; I[k]=a*hi+b*hr;
    }
    const [or_,oi]=dftN(R,I,N3,true);
    re=or_; im=oi;
  }
  const amp=new Float64Array(N3);
  for(let n=0;n<N3;n++) amp[n]=Math.hypot(re[n],im[n]);
  return amp;
}
function r3(){
  const fc=+$('e-c3c').value;
  $('e-o3c').textContent=fc;
  const x=sig3();
  const y=meta3(x,fc,ord3,sheets3);
  const mxIn=Math.max(...x), mxOut=Math.max(...y);
  const eIn=x.reduce((s,v)=>s+v*v,0), eOut=y.reduce((s,v)=>s+v*v,0);
  // 그림 — 사이클: 장면(들어오는 빛) → 메타표면(전달함수 = 가중치) → 출력면 카메라 → ADC
  const cv=$('e-f3'), cx=cv.getContext('2d'), W=cv.width;
  cx.clearRect(0,0,W,cv.height);
  const P=CYC.pen(cx), Y=110, T=40, B=180, rows=(arr,k,n)=>{ let v=0; const a=Math.floor(k*N3/n), b=Math.floor((k+1)*N3/n); for(let i=a;i<b;i++) v+=arr[i]; return v/(b-a); };
  const NAME={S:'계단',R:'사각',T:'두 점'}, pass=Math.sqrt(eOut/eIn);
  // 장면: 1차원 입력을 줄무늬 상으로(밝기 = 세기)
  P.lab(56,T-8,'장면',{a:'middle',c:'ink'});
  P.rect(30,T,52,B-T,{c:'rule',w:1,f:'panel',r:2});
  for(let k=0;k<32;k++) P.rect(32,T+1+k*(B-T-2)/32,48,(B-T-2)/32,{c:'none',f:'warm',fo:clamp(rows(x,k,32)/mxIn,0,1)*.9,r:0});
  P.lab(56,B+16,'입력 '+NAME[in3],{a:'middle',s:9.5});
  // 빛: 장면 → 메타표면(평행광 그대로)
  const MX=250;
  P.path(`M82 ${T} L${MX} ${T} L${MX} ${B} L82 ${B} Z`,{c:'none',f:'beam',fo:.07});
  P.beam([[82,T],[MX-6,T]],{w:1.3,op:.8}); P.beam([[82,B],[MX-6,B]],{w:1.3,op:.8}); P.beam([[100,Y],[MX-10,Y]],{w:1.3,op:.5,arrow:true});
  // 메타표면: 칸 무늬 = |H(k)| (가운데 = 낮은 주파수, 차단 fc 밖은 0)
  const hv=[...Array(20)].map((_,i)=>{ const kk=((i+.5)/20-.5)*N3; if(Math.abs(kk)>fc) return 0; const t=Math.abs(kk/fc); return ord3===1?t:t*t; });
  for(let p=0;p<sheets3;p++){ P.plate(MX+p*36,Y,B-T,{id:p?false:'meta',n:20,vals:hv}); if(p) P.at2('meta',[MX+p*36+5,T]); }
  const ME=MX+(sheets3-1)*36;
  P.lab((MX+ME)/2,B+16,sheets3===1?'메타표면':'2장',{a:'middle'});
  P.lab((MX+ME)/2,B+30,ord3===1?'H = i·k/fc':'H = −(k/fc)²',{a:'middle',s:9.5,c:'beam'});
  // 통과한 빛: 엣지만 남고 훨씬 어둡다(같은 눈금) — 이득이 없다
  const CX=480;
  P.path(`M${ME+5} ${T} L${CX-30} ${T} L${CX-30} ${B} L${ME+5} ${B} Z`,{c:'none',f:'beam',fo:.07*clamp(pass*3,.08,1)});
  P.beam([[ME+5,T],[CX-34,T]],{w:1.3,op:clamp(pass*3,.12,.8)}); P.beam([[ME+5,B],[CX-34,B]],{w:1.3,op:clamp(pass*3,.12,.8)});
  P.lab((ME+CX-30)/2,T-8,'통과 '+fmt(pass*pass*100,1)+'%',{a:'middle',s:10});
  // 출력면 카메라: 엣지 상(자체 눈금)
  P.cam(CX,Y,60,B-T,{n:16,vals:(i)=>clamp(rows(y,i,16)/(mxOut||1),0,1),lab:''});
  P.lab(CX,B+16,'카메라',{a:'middle'});
  P.wire([[CX+31,Y],[CX+64,Y]]);
  P.box(CX+92,Y,50,30,'ADC',{id:'adc'});
  P.wire([[CX+118,Y],[CX+146,Y]]);
  P.text(CX+152,Y-8,'출력/입력',{s:10.5,c:'muted'});
  P.text(CX+152,Y+14,fmt(mxOut/mxIn*100,1)+'%',{s:17,c:sheets3===2?'wall':'probe',b:1});
  P.text(CX+152,Y+32,'최대 진폭',{s:10,c:'muted'});
  // 보조: 입력과 출력을 같은 눈금으로 · 출력만 자체 눈금으로
  P.aux(400,222,466,108,'');
  const tr=(x0,w,arr,mx,c,t)=>{ if(t) P.lab(x0,240,t,{s:10}); P.path(`M${x0} 318 H${x0+w}`,{c:'rule',w:1});
    P.path('M'+arr.map((v,n)=>`${(x0+n*w/(arr.length-1)).toFixed(1)} ${(318-v/mx*66).toFixed(1)}`).join(' L'),{c,w:1.6}); };
  tr(412,210,[...x],mxIn,'beam','입력 · 출력 (같은 눈금)'); tr(412,210,[...y],mxIn,'probe','');
  tr(642,210,[...y],mxOut||1,'probe','출력 (자체 눈금) — 엣지');
  P.legend(16,296,['장면','메타표면 = 가중치','카메라','ADC']);
  CYC.seal(P);
  $('e-r3').innerHTML=
    `<div>최대 진폭 — 입력 <b>${fmt(mxIn,3)}</b> → 출력 <b>${fmt(mxOut,4)}</b> (<b>${fmt(mxOut/mxIn*100,1)}%</b>)</div>`+
    `<div>통과 광량 <b>${fmt(eOut/eIn*100,2)}%</b> — 수동 소자라 이득이 없다</div>`+
    (sheets3===2
      ? `<div style="color:var(--wall)">2장을 겹치니 ${fmt(mxOut/mxIn*100,2)}%까지 주저앉았다 — 캐스케이드가 안 되는 이유가 이것이다</div>`+
        (ord3===1?`<div>그리고 1차 2장은 「2차 1장」과 <b>수치가 똑같다</b> — (i·k)² = −k²라서 겹치면 다음 차수가 될 뿐, 새 층이 되지 않는다</div>`:'')
      : `<div>1장이면 쓸 만하다. 「2장」을 눌러 겹쳐보면 왜 층을 못 쌓는지 보인다</div>`)+
    `<div>소비 전력 <b>0</b> · 지연 <b>빛의 통과 시간</b> · 커널 <b>고정</b></div>`;
}

/* ── 04 광 전처리기 ─────────────────────────────── */
const N4=256;
let seed4=11;
function clean4(){
  const a=new Float64Array(N4);
  const bump=(c,w,h)=>{for(let n=0;n<N4;n++){const u=(n-c)/w; a[n]+=h*Math.exp(-(u*u));}};
  bump(52,16,1); bump(120,9,0.7); bump(196,22,0.85);
  return a;
}
function lowpass(src,fc){
  const [R,I]=dftN(src,new Float64Array(N4),N4,false);
  for(let k=0;k<N4;k++){
    const f=(k<N4/2?k:k-N4);
    const h=Math.exp(-((f/fc)*(f/fc)));
    R[k]*=h; I[k]*=h;
  }
  const [or_]=dftN(R,I,N4,true);
  return or_;
}
function metrics4(nz,fc,epsPct){
  const s=clean4(), nn=noise(N4,seed4);
  const y=new Float64Array(N4);
  for(let n=0;n<N4;n++) y[n]=s[n]+nz*nn[n];
  const yf=lowpass(y,fc);
  const es=s.reduce((a,v)=>a+v*v,0);
  let e1=0,e2=0;
  for(let n=0;n<N4;n++){ e1+=(y[n]-s[n])*(y[n]-s[n]); e2+=(yf[n]-s[n])*(yf[n]-s[n]); }
  const snrIn=10*Math.log10(es/Math.max(e1,1e-12));
  const snrOut=10*Math.log10(es/Math.max(e2,1e-12));
  const As=Math.max(...s);
  const eps=epsPct/100*As;                       // 요구 분해능 = 신호 최대의 몇 %
  const pk1=Math.max(...[...y].map(Math.abs));
  const pk2=Math.max(...[...yf].map(Math.abs));
  const bitsF=p=>Math.log2(2*p/eps);                 // 범위 ÷ 분해능
  return {s,y,yf,snrIn,snrOut,
    f1:bitsF(pk1), f2:bitsF(pk2),
    b1:Math.max(1,Math.ceil(bitsF(pk1))), b2:Math.max(1,Math.ceil(bitsF(pk2))),
    pk1,pk2,eps};
}
function r4(){
  const nz=+$('e-c4z').value/100, fc=+$('e-c4b').value, ep=+$('e-c4e').value;
  $('e-o4z').textContent=fmt(nz*100,0)+'%'; $('e-o4b').textContent=fc; $('e-o4e').textContent=ep+'%';
  const m=metrics4(nz,fc,ep);
  // 그림 — 사이클: 섬유 어레이 → 격자 결합기 → 도파관 → 링 필터(대역 = 가중치, 바이어스로 튜닝 · 파장 락) → PD → TIA → ADC(적은 비트)
  const cv=$('e-f4'), cx=cv.getContext('2d'), W=cv.width;
  cx.clearRect(0,0,W,cv.height);
  const P=CYC.pen(cx), mx=Math.max(Math.max(...[...m.y].map(Math.abs)),1e-9);
  const spark=(x0,w,yb,amp,arr,c,op)=>P.path('M'+[...Array(65)].map((_,k)=>{ const v=arr[Math.min(N4-1,k*4)]; return `${(x0+k*w/64).toFixed(1)} ${(yb-v/mx*amp).toFixed(1)}`; }).join(' L'),{c,w:1.2,op});
  const YB=96, RX=270, R1=114, R2=146, YD=164;
  // 섬유 어레이: 멀리서 실려 온 신호(빛은 여기서 처음 온다)
  P.part('farr',[16,30,40,38],()=>{ P.rect(16,30,40,38,{c:'ink',w:1.3,r:2}); [38,46,54,62].forEach(y=>P.path(`M4 ${y} H54`,{c:'faint',w:1.2})); });
  P.lab(36,84,'섬유 어레이',{a:'middle',c:'ink'});
  P.beam([[56,54],[82,54],[104,84]],{w:2,arrow:true});
  // 칩
  P.zone(90,66,346,134,'',{fo:.3}); P.lab(98,192,'칩',{s:10});
  // 격자 결합기: 위에서 내려온 빛을 도파관으로
  P.part('coup',[96,86,30,20],()=>{ P.path(`M98 86 L98 106 L124 ${YB+2} L124 ${YB-2} Z`,{c:'ink',w:1.2,f:'grid'}); [102,106,110,114].forEach(x=>P.path(`M${x} 89 V103`,{c:'ink',w:1})); });
  P.lab(111,124,'격자 결합기',{a:'middle',s:9.5});
  // 도파관(버스): 잡음 섞인 신호가 링까지 온다 — 링 뒤 통과 포트는 버린다
  P.part('wg',[124,YB-3,300,6],()=>{ P.path(`M124 ${YB} H${RX}`,{c:'beam',w:2}); P.path(`M${RX} ${YB} H424`,{c:'beam',w:1.4,op:.3}); },[200,YB-3]);
  P.lab(424,YB-6,'버림',{a:'end',s:9.5});
  spark(140,104,84,12,m.y,'beam',.9); P.lab(192,YB+18,'잡음 섞인 신호',{a:'middle',s:9.5});
  // 링 두 개(2차 필터): 공진 대역이 가중치 — 넓을수록 잡음이 많이 지나간다
  P.ring(RX,R1,14,{red:true,fill:clamp(fc/64,.05,1)*.5}); P.ring(RX,R2,14,{red:true,fill:clamp(fc/64,.05,1)*.5,id:false});
  P.lab(RX+22,R1-2,'링 필터',{c:'ink',s:10}); P.lab(RX+22,R1+11,'대역 '+fc,{s:9.5,c:'beam'});
  // 드롭 포트: 대역 안만 빠져나와 PD 로
  P.beam([[RX-8,YD],[400,YD]],{w:2}); spark(316,84,YD-10,12,m.yf,'beam',.9);
  P.pd(410,YD,{v:clamp(m.pk2/mx,0,1)}); P.lab(414,YD+24,'PD',{a:'middle'});
  // 바이어스: 링 히터를 구동해 대역을 옮긴다 — 파장 락이 붙잡는다
  P.box(200,226,64,24,'바이어스',{id:'bias',tone:'probe',s:10});
  P.wire([[232,226],[244,226],[244,R2],[RX-16,R2]]); P.wire([[244,R2],[244,R1],[RX-16,R1]]);
  P.lab(250,194,'히터',{s:9.5,c:'probe'});
  P.lock(160,208,84,36,{lab:'파장 락',lx:100,ly:230});
  // 전자: TIA → ADC — 잡음이 이미 빠져 비트가 준다
  P.wire([[420,YD],[456,YD]]); P.box(480,YD,44,26,'TIA',{id:'tia'});
  P.wire([[503,YD],[532,YD]]); P.box(558,YD,50,30,'ADC',{id:'adc'});
  P.text(592,YD-4,m.b2+' bit',{s:16,c:'probe',b:1}); P.text(592,YD+14,'필터 없이 '+m.b1,{s:10,c:'muted'});
  // 되먹임: 받은 신호로 공진 위치를 재서 바이어스에 돌려준다
  P.wire([[480,YD+14],[480,264],[200,264],[200,245]]); P.lab(340,259,'되먹임 — 대역을 신호 파장에',{a:'middle',s:9.5,c:'probe'});
  // 보조: ADC 앞 파형과 필요한 비트 — 필터 없이 / 링 통과
  P.aux(510,206,356,156,'ADC 앞 — 필요 비트');
  const tr=(x0,arr,c,t,bits,f)=>{ P.lab(x0,240,t,{s:10}); P.path(`M${x0} 306 H${x0+160}`,{c:'rule',w:1});
    P.path('M'+[...m.s].map((v,n)=>`${(x0+n*160/(N4-1)).toFixed(1)} ${(306-v/mx*56).toFixed(1)}`).join(' L'),{c:'muted',w:1.2,op:.45});
    P.path('M'+[...arr].map((v,n)=>`${(x0+n*160/(N4-1)).toFixed(1)} ${(306-v/mx*56).toFixed(1)}`).join(' L'),{c,w:1.5});
    for(let b=0;b<14;b++) P.rect(x0+b*9,322,7,12,{c:'none',f:b<bits?c:'grid',fo:b<bits?.85:.8,r:1});
    P.text(x0+130,333,bits+' bit',{s:10.5,c,b:1}); P.lab(x0,352,'범위 기준 '+fmt(f,1),{s:9.5}); };
  tr(522,m.y,'beam','필터 없이',m.b1,m.f1);
  tr(696,m.yf,'probe','링 통과',m.b2,m.f2);
  P.legend(16,306,['섬유','결합기','도파관','링 = 가중치','PD','TIA·ADC']);
  CYC.seal(P);
  const dSNR=m.snrOut-m.snrIn, dRange=m.f1-m.f2, dEq=dSNR/6.02;
  const dB=v=>v>60?'&gt;60':fmt(v,1);
  $('e-r4').innerHTML=
    (nz===0?`<div style="color:var(--wall)">잡음 0 — 털어낼 게 없으니 필터는 신호만 깎는다</div>`:'')+
    `<div>SNR <b>${dB(m.snrIn)} dB</b> → <b>${dB(m.snrOut)} dB</b>${nz===0?'':` (${dSNR>=0?'+':''}${fmt(dSNR,1)} dB)`}</div>`+
    `<div>덮어야 할 최대 진폭 <b>${fmt(m.pk1,2)}</b> → <b>${fmt(m.pk2,2)}</b> · 요구 분해능 ${fmt(m.eps,3)}</div>`+
    `<div>범위 기준 비트 <b>${fmt(m.f1,1)}</b> → <b>${fmt(m.f2,1)}</b> (${dRange>=0?'−':'+'}${fmt(Math.abs(dRange),1)} bit) → ADC는 <b>${m.b1}</b>bit → <b>${m.b2}</b>bit</div>`+
    (nz===0?'':`<div>SNR 기준 등가 <b>${dEq>=0?'−':'+'}${fmt(Math.abs(dEq),1)} bit</b> (6.02 dB = 1 bit)</div>`)+
    (m.snrOut<m.snrIn
      ? `<div style="color:var(--wall)">대역을 너무 좁혀 신호까지 깎였다 — SNR이 되레 떨어졌다</div>`
      : `<div>대역 안에 신호가 들어와 있다</div>`);
}
function opt4(){
  const nz=+$('e-c4z').value/100, ep=+$('e-c4e').value;
  let best=2, bs=-1e9;
  for(let fc=2;fc<=64;fc++){ const m=metrics4(nz,fc,ep); if(m.snrOut>bs){bs=m.snrOut;best=fc;} }
  $('e-c4b').value=best; r4();
}

/* ── 묶기 ───────────────────────────────────────── */
SEC.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>{
  const g=b.dataset.g;
  SEC.querySelectorAll(`[data-g="${g}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  if(g==='1in'){ in1=b.dataset.v; r1(); }
  else if(g==='2cl'){ cl2=b.dataset.v; r2(); }
  else if(g==='3in'){ in3=b.dataset.v; r3(); }
  else if(g==='3o'){ ord3=+b.dataset.v; r3(); }
  else if(g==='3s'){ sheets3=+b.dataset.v; r3(); }
}));
$('e-c1n').addEventListener('input',r1);
$('e-b1z').addEventListener('click',()=>{ for(let i=0;i<4;i++)for(let j=0;j<4;j++) W1[i][j]=0; r1(); });
['e-c2f','e-c2t','e-c2m','e-c2z'].forEach(id=>$(id).addEventListener('input',r2));
$('e-b2s').addEventListener('click',()=>{ seed2=(seed2*7919+13)&0x7fffffff; r2(); });
$('e-c3c').addEventListener('input',r3);
['e-c4z','e-c4b','e-c4e'].forEach(id=>$(id).addEventListener('input',r4));
$('e-b4s').addEventListener('click',()=>{ seed4=(seed4*7919+13)&0x7fffffff; r4(); });
$('e-b4o').addEventListener('click',opt4);

/* ── 탭 ─────────────────────────────────────────── */
function showSec(n){
  for(let i=1;i<=5;i++) $('e-s'+i).hidden=(i!==n);
  $('e-pend').hidden=(n!==5);
  SEC.querySelectorAll('#e-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===n)));
}
SEC.querySelectorAll('#e-tabs button').forEach(b=>b.addEventListener('click',()=>{
  showSec(+b.dataset.s);
  window.scrollTo({top:0,behavior:'smooth'});
}));

/* ── 합본 진입점 ─────────────────────────────────── */
let started=false;

MOD.e={ init(){
  if(started) return;        // 두 번 불러도 안전
  started=true;
  r1();r2();r3();r4();
  showSec(1);
}};
})();


}
};
