if(!(window.OPT_LEGACY&&window.OPT_LEGACY.e)){(window.OPT_LEGACY=window.OPT_LEGACY||{}).e={html:"<section id=\"sec-e\" hidden>\n<p class=\"lede\" style=\"margin-bottom:10px\"><b>E군 · 센서·이미징 앞단.</b> 광 가속기에서 전력을 먹는 건 곱셈이 아니라 ADC·DAC와 메모리 이동이다. 그러면 답은 하나다 — 변환 앞에서 데이터를 줄여라. 네 구조가 각자 다른 지점에서 그걸 한다.</p>\n<div class=\"tabs\" id=\"e-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>In-sensor</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>회절 인코더</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>메타표면 미분</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\"><span class=\"n\">04</span>광 전처리기</button>\n  <button type=\"button\" data-s=\"5\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n\n<div class=\"card sec\" id=\"e-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>In-sensor computing</h2></div>\n    <div class=\"chips\"><span class=\"chip\">하버드 Donhee Ham</span><span class=\"chip wall\">가중치 정밀도 · 화소당 튜닝 회로</span></div>\n  </div>\n  <p class=\"idea\">빛이 전류가 되는 그 지점에서 곱셈을 한다. 화소의 감응도를 전압으로 바꾸면 <span class=\"k\">감응도 자체가 가중치</span>라서, 전하가 모일 때 이미 Σwᵢxᵢ가 끝나 있다. ADC는 화소 수가 아니라 출력 수만큼만 돈다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"e-f1\" viewBox=\"0 0 440 262\" role=\"img\" aria-label=\"4x4 화소 배열의 감응도 가중치와 출력 노드\"></svg></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">입력 영상</span>\n        <button type=\"button\" data-g=\"1in\" data-v=\"V\" aria-pressed=\"true\">세로 경계</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"H\" aria-pressed=\"false\">가로 경계</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"P\" aria-pressed=\"false\">점</button>\n        <button type=\"button\" data-g=\"1in\" data-v=\"U\" aria-pressed=\"false\">균일</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c1n\">출력 노드 수</label><input type=\"range\" id=\"e-c1n\" min=\"1\" max=\"4\" step=\"1\" value=\"2\"><output id=\"e-o1n\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b1z\">가중치 0으로</button></div>\n      <div class=\"read\" id=\"e-r1\"></div>\n      <p class=\"note\">왼쪽 격자의 칸을 누르면 그 화소 감응도가 <span class=\"k\">−1 → 0 → +1</span>로 돈다. 출력 노드가 둘 이상일 땐 같은 가중치를 열 방향으로 한 칸씩 밀어 쓴다(한 배열로 여러 특징을 뽑는 방식).</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s2\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>회절 인코더 + 아날로그 전자 (ACCEL)</h2></div>\n    <div class=\"chips\"><span class=\"chip\">칭화 (Nature 623, 2023)</span><span class=\"chip wall\">커널 고정 · 보고 수치의 bit 정의 미확인</span></div>\n  </div>\n  <p class=\"idea\">앞단은 회절이 특징을 뽑고, 뒷단은 아날로그 전자가 바로 분류한다. 둘 사이에 <span class=\"k\">디지털이 없으니 ADC가 빠진다</span>. 광이 혼자 다 하는 게 아니라, 변환을 건너뛰려고 전자를 아날로그로 남겨둔 설계다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f2\" width=\"880\" height=\"320\"></canvas></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">참 라벨</span>\n        <button type=\"button\" data-g=\"2cl\" data-v=\"A\" aria-pressed=\"true\">A (두 점)</button>\n        <button type=\"button\" data-g=\"2cl\" data-v=\"B\" aria-pressed=\"false\">B (한 덩이)</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c2f\">인코더 초점</label><input type=\"range\" id=\"e-c2f\" min=\"-100\" max=\"100\" step=\"1\" value=\"48\"><output id=\"e-o2f\"></output></div>\n        <div class=\"row\"><label for=\"e-c2t\">인코더 기울기</label><input type=\"range\" id=\"e-c2t\" min=\"-60\" max=\"60\" step=\"1\" value=\"16\"><output id=\"e-o2t\"></output></div>\n        <div class=\"row\"><label for=\"e-c2m\">특징 개수 M</label><input type=\"range\" id=\"e-c2m\" min=\"2\" max=\"16\" step=\"2\" value=\"8\"><output id=\"e-o2m\"></output></div>\n        <div class=\"row\"><label for=\"e-c2z\">입력 잡음</label><input type=\"range\" id=\"e-c2z\" min=\"0\" max=\"200\" step=\"2\" value=\"18\"><output id=\"e-o2z\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b2s\">잡음 다시 뽑기</button></div>\n      <div class=\"read\" id=\"e-r2\"></div>\n      <p class=\"note\">128점 입력을 프레넬 전파로 실제 통과시켜 M칸으로 모으고, 그 M개에 선형 판정기(두 클래스 중심의 차 벡터)를 건다. 보고값 <b>74.8 peta-OPS/W</b>는 논문 수치이고 ⚠️ <span class=\"k\">정밀도 bit 정의가 미확인</span>이라 다른 칩과 직접 비교하면 안 된다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s3\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>메타표면 아날로그 연산</h2></div>\n    <div class=\"chips\"><span class=\"chip\">Capasso 계보</span><span class=\"chip wall\">커널 고정 · 이득 없음 · 캐스케이드 불가</span></div>\n  </div>\n  <p class=\"idea\">한 장 통과로 미분이 끝난다. 주파수 영역에서 전달함수를 <span class=\"k\">i·k 꼴</span>로 깎아놓으면 통과한 빛이 곧 공간 미분이고, 엣지가 저절로 뽑힌다. 전력도 지연도 들지 않는다 — 대신 커널을 바꿀 수가 없다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f3\" width=\"880\" height=\"300\"></canvas></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">입력</span>\n        <button type=\"button\" data-g=\"3in\" data-v=\"S\" aria-pressed=\"true\">계단</button>\n        <button type=\"button\" data-g=\"3in\" data-v=\"R\" aria-pressed=\"false\">사각</button>\n        <button type=\"button\" data-g=\"3in\" data-v=\"T\" aria-pressed=\"false\">두 점</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c3c\">개구 차단 fc</label><input type=\"range\" id=\"e-c3c\" min=\"4\" max=\"48\" step=\"1\" value=\"24\"><output id=\"e-o3c\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <span class=\"chip\">차수</span>\n        <button type=\"button\" data-g=\"3o\" data-v=\"1\" aria-pressed=\"true\">1차 (i·k)</button>\n        <button type=\"button\" data-g=\"3o\" data-v=\"2\" aria-pressed=\"false\">2차 (−k²)</button>\n        <span class=\"chip\">장수</span>\n        <button type=\"button\" data-g=\"3s\" data-v=\"1\" aria-pressed=\"true\">1장</button>\n        <button type=\"button\" data-g=\"3s\" data-v=\"2\" aria-pressed=\"false\">2장</button>\n      </div>\n      <div class=\"read\" id=\"e-r3\"></div>\n      <p class=\"note\">전달함수를 <span class=\"k\">|H| ≤ 1</span>로 정규화했다 — 수동 소자라 이득이 없다는 게 이 조건이다. 「2장」을 눌러보면 왜 캐스케이드가 안 되는지 숫자로 나온다. 그래서 현실적 자리는 범용 연산이 아니라 <span class=\"k\">이미징 센서 앞단 전처리</span> 한 장이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"e-s4\" hidden>\n  <div class=\"head\">\n    <div><div class=\"num\">04</div><h2>광 전처리기</h2></div>\n    <div class=\"chips\"><span class=\"chip\">HHI</span><span class=\"chip wall\">필터가 고정 · 좁히면 신호도 깎인다</span></div>\n  </div>\n  <p class=\"idea\">연산을 대신하는 게 아니라 <span class=\"k\">변환 앞에서 신호를 다듬는다</span>. 대역 밖 잡음을 광학에서 먼저 털어내면 ADC가 덮어야 할 동적 범위가 줄고, 그만큼 비트가 빠진다. 가장 지루해 보이지만 가장 직접적인 이득이다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"e-f4\" width=\"880\" height=\"340\"></canvas></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"e-c4z\">잡음 세기</label><input type=\"range\" id=\"e-c4z\" min=\"0\" max=\"80\" step=\"1\" value=\"40\"><output id=\"e-o4z\"></output></div>\n        <div class=\"row\"><label for=\"e-c4b\">광학 대역폭</label><input type=\"range\" id=\"e-c4b\" min=\"2\" max=\"64\" step=\"1\" value=\"12\"><output id=\"e-o4b\"></output></div>\n        <div class=\"row\"><label for=\"e-c4e\">요구 분해능</label><input type=\"range\" id=\"e-c4e\" min=\"1\" max=\"10\" step=\"1\" value=\"2\"><output id=\"e-o4e\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"e-b4s\">잡음 다시 뽑기</button><button type=\"button\" id=\"e-b4o\">최적 대역 찾기</button></div>\n      <div class=\"read\" id=\"e-r4\"></div>\n      <p class=\"note\">비트를 <span class=\"k\">두 축으로</span> 센다. ① <b>범위 기준</b> = log₂(2·최대진폭 ÷ 요구 분해능) — 잡음 봉우리가 사라지면 덮을 범위가 줄어 빠지는 몫이고, 보통 1 bit 안쪽이라 작다. ② <b>SNR 기준 등가</b> = SNR 개선분 ÷ 6.02 dB — 잡음을 광학에서 이미 털었으니 뒷단 ENOB 요구가 그만큼 느슨해진다는 몫이고, 이쪽이 크다. 너무 좁히면 신호가 깎여 SNR이 되레 떨어지는데, 그 꺾이는 지점이 「최적 대역」이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"e-s5\" hidden>\n  <h2 style=\"font-size:16px\">넷을 겹쳐 보면</h2>\n  <p style=\"margin-top:8px\"><b>네 구조의 공통점은 연산이 아니라 변환이다.</b> 광 가속기 시스템 에너지의 큰 몫을 ADC·DAC와 메모리 이동이 먹기 때문에, 곱셈을 광으로 빨리 하는 것보다 <span class=\"k\">변환 횟수를 줄이는 것</span>이 더 크게 남는다. E군은 전부 거기를 노린다 — 01은 화소에서 미리 더해 ADC 횟수를 출력 수로 줄이고, 02는 아날로그 전자를 뒤에 붙여 ADC를 아예 빼고, 03·04는 변환 앞에서 데이터를 깎아 필요한 비트를 줄인다.</p>\n  <p><b>그래서 이 그룹은 「전광」이 아니라 electro-optical 하이브리드다.</b> 02가 그 점에서 솔직하다 — 뒷단을 디지털로 올리면 ACCEL의 이점이 사라지니까 전자를 아날로그로 남겨뒀다. 승부처를 변환 경계로 잡으면 광이 어디까지 하고 전자가 어디서 받는지가 설계 변수가 되고, 「빛으로 다 한다」는 축은 자연히 내려간다.</p>\n  <p><b>벽도 같은 자리에서 나온다 — 커널이 고정이다.</b> 02의 회절 마스크와 03의 메타표면은 둘 다 한 번 찍으면 가중치가 굳는다. 그래서 둘 다 추론 앞단 전처리에 서고, 가중치를 바꿔야 하는 자리에는 못 선다. 01이 이 중 유일하게 전압으로 가중치를 쥐고 있고, 그래서 이 그룹에서 가장 범용에 가깝다. <span class=\"k\">가중치 저장·업데이트가 다음 5년 승부처라는 판단과 정확히 같은 결이다</span> — 변환을 줄여 이득을 보려 해도, 바꿀 수 없는 가중치는 그 이득을 쓸 자리를 좁힌다.</p>\n  <p><b>03은 특히 자기 자리를 알아야 쓸 수 있다.</b> 이득이 없으니(|H| ≤ 1) 두 장을 겹치면 신호가 주저앉고, 메모리도 비선형도 없어 층을 쌓을 수가 없다. 범용 연산 후보로 올리면 바로 깨지고, 센서 앞 한 장으로 두면 전력 0·지연 0의 엣지검출기가 된다. 같은 소자가 어디에 놓이느냐로 성패가 갈리는 사례다.</p>\n</div>\n\n<div class=\"pending\" id=\"e-pend\" hidden>\n  <b>이 페이지의 자리</b> — 구조 분류표 A~F군 중 <b>E군(센서·이미징 앞단)</b>이다. A군(행렬곱 여덟 구조)은 <a href=\"https://claude.ai/artifact/1rU7rNCNLmKpuXvThQPB9S\">4×4 메시</a>와 함께 따로 있고, B·C·D·F군은 같은 틀로 이어 만든다.\n</div>\n</section>",run:function(getComputedStyle){


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
  // 그림
  const g=[];
  const px=34, x0=26, y0=46;
  g.push(`<text class="m" x="${x0}" y="26" font-size="10">화소 4×4 — 밑색은 들어온 빛, 테두리와 기호는 감응도 가중치</text>`);
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
    const x=x0+j*px, y=y0+i*px, w=W1[i][j];
    g.push(`<rect class="fillg" x="${x}" y="${y}" width="${px-3}" height="${px-3}" rx="3" opacity="${(0.15+0.85*I[i][j]).toFixed(2)}"/>`);
    const st= w>0?'var(--beam)': (w<0?'var(--probe)':'var(--rule)');
    g.push(`<rect class="cell" data-i="${i}" data-j="${j}" x="${x}" y="${y}" width="${px-3}" height="${px-3}" rx="3" fill="transparent" stroke="${st}" stroke-width="${w===0?1:2}"/>`);
    g.push(`<text class="${w>0?'a':(w<0?'p':'m')}" x="${x+(px-3)/2}" y="${y+21}" font-size="12" text-anchor="middle" pointer-events="none">${w>0?'+':(w<0?'−':'0')}</text>`);
  }
  g.push(`<text class="m" x="${x0}" y="${y0+4*px+14}" font-size="9.5">칸을 눌러 가중치를 돌린다</text>`);
  // 합산 배선 + 출력 노드
  const bx=226;
  g.push(`<path class="wg" stroke-width="1.2" opacity=".45" d="M${x0+4*px-4} ${y0+54} H${bx-14}"/>`);
  for(let o=0;o<Nout;o++){
    const cy=52+o*44;
    const mag=clamp(Math.abs(ys[o])/3.2,0,1);
    g.push(`<path class="bm" stroke-width="${(1+3.4*mag).toFixed(2)}" opacity="${(0.25+0.75*mag).toFixed(2)}" d="M${bx-14} ${y0+54} C${bx+6} ${y0+54} ${bx+6} ${cy+13} ${bx+26} ${cy+13}"/>`);
    g.push(`<rect class="pd" x="${bx+28}" y="${cy}" width="46" height="26" rx="4" stroke-width="1.2"/>`);
    g.push(`<text class="${ys[o]>=0?'p':'a'}" x="${bx+51}" y="${cy+18}" font-size="11" text-anchor="middle">${fmt(ys[o],2)}</text>`);
    g.push(`<path class="wg" stroke-width="1.1" opacity=".5" d="M${bx+74} ${cy+13} H${bx+96}"/>`);
    g.push(`<rect class="box" x="${bx+98}" y="${cy+1}" width="40" height="24" rx="4" stroke-width="1"/>`);
    g.push(`<text class="m" x="${bx+118}" y="${cy+17}" font-size="10" text-anchor="middle">ADC</text>`);
  }
  g.push(`<text class="m" x="${bx+28}" y="${52+Nout*44+14}" font-size="9.5">출력 노드 ${Nout}개 → ADC ${Nout}회</text>`);
  g.push(`<text class="m" x="${bx+28}" y="36" font-size="9.5">전하가 모이며 Σwx가 끝난다</text>`);
  $('e-f1').innerHTML=g.join('');
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
  // 그림
  const cv=$('e-f2'), cx=cv.getContext('2d'), W=cv.width, H=cv.height;
  cx.clearRect(0,0,W,H);
  cx.font='13px IBM Plex Mono, monospace';
  const trace=(x0,w,arr,color,title)=>{
    const mx=Math.max(...arr,1e-9);
    cx.fillStyle=COL('--muted'); cx.fillText(title,x0,26);
    cx.strokeStyle=COL('--rule'); cx.lineWidth=1;
    cx.beginPath(); cx.moveTo(x0,250); cx.lineTo(x0+w,250); cx.stroke();
    cx.strokeStyle=COL(color); cx.lineWidth=2; cx.beginPath();
    for(let n=0;n<arr.length;n++){const px=x0+n*(w/arr.length), py=250-(arr[n]/mx)*190; n?cx.lineTo(px,py):cx.moveTo(px,py);}
    cx.stroke();
  };
  trace(20,230,[...x],'--beam','입력 (라벨 '+cl2+' + 잡음)');
  // 인코더 면
  cx.strokeStyle=COL('--warm'); cx.lineWidth=3; cx.beginPath(); cx.moveTo(286,46); cx.lineTo(286,250); cx.stroke();
  cx.fillStyle=COL('--muted'); cx.fillText('회절 인코더',250,274);
  cx.strokeStyle=COL('--beam'); cx.globalAlpha=.22; cx.lineWidth=1;
  for(let k=0;k<7;k++){const y=70+k*26; cx.beginPath(); cx.moveTo(260,148); cx.lineTo(286,y); cx.lineTo(330,148); cx.stroke();}
  cx.globalAlpha=1;
  trace(344,180,[...Iout],'--beam','전파 후 세기');
  // 특징 막대 M개
  const bx=560, bw=Math.min(22,200/M);
  cx.fillStyle=COL('--muted'); cx.fillText('검출기 '+M+'개 → 특징',bx,26);
  const fm=Math.max(...fx,1e-9);
  for(let m=0;m<M;m++){
    const h=(fx[m]/fm)*180;
    cx.fillStyle=COL('--probe'); cx.globalAlpha=.8;
    cx.fillRect(bx+m*(bw+2),250-h,bw,h); cx.globalAlpha=1;
  }
  cx.strokeStyle=COL('--rule'); cx.lineWidth=1;
  cx.beginPath(); cx.moveTo(bx,250); cx.lineTo(bx+M*(bw+2),250); cx.stroke();
  cx.fillStyle=COL('--muted'); cx.fillText('ADC 없음 · 아날로그 전자로 바로',bx,274);
  // 판정
  const dx=790;
  cx.strokeStyle=COL(ok?'--probe':'--beam'); cx.lineWidth=2;
  cx.strokeRect(dx,96,70,58);
  cx.fillStyle=COL(ok?'--probe':'--beam'); cx.font='26px IBM Plex Mono, monospace';
  cx.fillText(pred,dx+24,136);
  cx.font='13px IBM Plex Mono, monospace'; cx.fillStyle=COL('--muted');
  cx.fillText(ok?'맞음':'틀림',dx+14,174);
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
  const cv=$('e-f3'), cx=cv.getContext('2d'), W=cv.width;
  cx.clearRect(0,0,W,cv.height);
  cx.font='13px IBM Plex Mono, monospace';
  const trace=(x0,w,arr,mx,color,title,sub)=>{
    cx.fillStyle=COL('--muted'); cx.fillText(title,x0,26);
    if(sub) cx.fillText(sub,x0,274);
    cx.strokeStyle=COL('--rule'); cx.lineWidth=1;
    cx.beginPath(); cx.moveTo(x0,248); cx.lineTo(x0+w,248); cx.stroke();
    cx.strokeStyle=COL(color); cx.lineWidth=2; cx.beginPath();
    for(let n=0;n<arr.length;n++){const px=x0+n*(w/arr.length), py=248-(arr[n]/mx)*190; n?cx.lineTo(px,py):cx.moveTo(px,py);}
    cx.stroke();
  };
  trace(20,250,[...x],mxIn,'--beam','입력 세기','공간 좌표 →');
  // 메타표면 한/두 장
  for(let p=0;p<sheets3;p++){
    const px=320+p*44;
    cx.strokeStyle=COL('--warm'); cx.lineWidth=4;
    cx.beginPath(); cx.moveTo(px,50); cx.lineTo(px,248); cx.stroke();
    cx.strokeStyle=COL('--warm'); cx.lineWidth=1; cx.globalAlpha=.6;
    for(let k=0;k<10;k++){cx.beginPath();cx.moveTo(px-5,60+k*20);cx.lineTo(px+5,60+k*20);cx.stroke();}
    cx.globalAlpha=1;
  }
  cx.fillStyle=COL('--muted');
  cx.fillText(sheets3===1?'메타표면 1장':'2장 캐스케이드',292,274);
  cx.fillText(ord3===1?'H(k) = i·k/fc':'H(k) = −(k/fc)²',292,296);
  // 출력은 입력과 같은 눈금으로 그려 이득 없음을 보이게
  trace(448,250,[...y],mxIn,'--probe','출력 (입력과 같은 눈금)','엣지가 뽑힌다 — 다만 훨씬 작다');
  // 출력 자체 눈금으로 한 번 더
  trace(730,130,[...y],mxOut||1,'--probe','출력 (자체 눈금)','모양만 보면 이렇다');
  $('e-f3').style.opacity=1;
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
  const cv=$('e-f4'), cx=cv.getContext('2d'), W=cv.width;
  cx.clearRect(0,0,W,cv.height);
  cx.font='13px IBM Plex Mono, monospace';
  const mx=Math.max(Math.max(...[...m.y].map(Math.abs)),1e-9);
  const trace=(x0,w,arr,color,title,sub,alpha)=>{
    cx.fillStyle=COL('--muted'); if(title) cx.fillText(title,x0,26); if(sub) cx.fillText(sub,x0,296);
    cx.strokeStyle=COL('--rule'); cx.lineWidth=1;
    cx.beginPath(); cx.moveTo(x0,200); cx.lineTo(x0+w,200); cx.stroke();
    cx.strokeStyle=COL(color); cx.lineWidth=2; cx.globalAlpha=alpha==null?1:alpha; cx.beginPath();
    for(let n=0;n<arr.length;n++){const px=x0+n*(w/arr.length), py=200-(arr[n]/mx)*150; n?cx.lineTo(px,py):cx.moveTo(px,py);}
    cx.stroke(); cx.globalAlpha=1;
  };
  trace(20,380,[...m.y],'--beam','ADC 앞 — 광학 필터 없이','잡음이 봉우리를 만든다');
  trace(20,380,[...m.s],'--muted',null,null,.45);
  trace(450,380,[...m.yf],'--probe','ADC 앞 — 광학 필터 통과','봉우리가 깎여 범위가 줄었다');
  trace(450,380,[...m.s],'--muted',null,null,.45);
  // 비트 막대
  const bar=(x0,bits,color,lab)=>{
    cx.fillStyle=COL('--muted'); cx.font='12px IBM Plex Mono, monospace';
    cx.fillText(lab,x0,246);
    for(let b=0;b<14;b++){
      cx.fillStyle=COL(b<bits?color:'--grid'); cx.globalAlpha=b<bits?.85:.6;
      cx.fillRect(x0+b*13,254,10,16); cx.globalAlpha=1;
    }
    cx.fillStyle=COL(color); cx.fillText(bits+' bit',x0+192,268);
  };
  bar(20,m.b1,'--beam','필요 ADC 비트 '+fmt(m.f1,1));
  bar(450,m.b2,'--probe','필요 ADC 비트 '+fmt(m.f2,1));
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
window.MOD=window.MOD||{};
window.MOD.e={ init(){
  if(started) return;        // 두 번 불러도 안전
  started=true;
  r1();r2();r3();r4();
  showSec(1);
}};
})();


}};
}
window.dispatchEvent(new Event("opt-ready"));
