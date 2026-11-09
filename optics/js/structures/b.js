/* B · 신경망 — 옛 아티팩트 장(html)과 그 장을 움직이는 코드(run).
   compute.js 가 html 을 페이지 밖 요소 트리로 한 번 만들고 run 을 그 트리에 묶은 뒤,
   고른 구조의 그림·손잡이 요소를 그대로 떼어 그림판·오른쪽 패널에 붙인다(복제·대리 없음).
   run 의 document 는 그 트리를 찾는 좁은 창이다: getElementById · querySelector(All) 만. */
(window.CMP = window.CMP || { groups: {} }).groups.b = {
  id: 'b', name: "B · 신경망",
  html: "<section id=\"sec-b\" hidden>\n  <p class=\"lede\" style=\"margin-bottom:4px\">A군이 「행렬곱을 어떻게 광으로 하나」였다면 여기는 「신경망의 어느 부분을 광에 맡기나」다. 넷 다 학습이나 비선형을 광 쪽으로 밀어내려는 시도이고, 밀어낸 만큼 다른 데서 비용을 치른다.</p>\n<div class=\"tabs\" id=\"b-tabs\" role=\"tablist\">\n  <button type=\"button\" data-s=\"1\" aria-pressed=\"true\"><span class=\"n\">01</span>리저버 컴퓨팅</button>\n  <button type=\"button\" data-s=\"2\" aria-pressed=\"false\"><span class=\"n\">02</span>스파이킹 광 뉴런</button>\n  <button type=\"button\" data-s=\"3\" aria-pressed=\"false\"><span class=\"n\">03</span>포토닉 텐서코어</button>\n  <button type=\"button\" data-s=\"4\" aria-pressed=\"false\"><span class=\"n\">04</span>전광 RNN</button>\n  <button type=\"button\" data-s=\"5\" aria-pressed=\"false\">겹쳐 보면</button>\n</div>\n\n<div class=\"card sec\" id=\"b-s1\">\n  <div class=\"head\">\n    <div><div class=\"num\">01</div><h2>리저버 컴퓨팅</h2></div>\n    \n  </div>\n  <p class=\"idea\">저수지 내부는 <span class=\"k\">아무렇게나 두고 건드리지 않는다.</span> 학습은 출력 한 층만 — 선형 회귀 한 번이면 끝이라 역전파 회로가 칩에 필요 없다. 광으로 만들기 쉬운 게 바로 「고정된 랜덤 결합」이라서 궁합이 맞는다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"b-f1\" width=\"880\" height=\"360\"></canvas></div>\n    <div>\n      <div class=\"btns\" style=\"margin-bottom:8px\">\n        <span class=\"chip\">과제</span>\n        <button type=\"button\" data-g=\"task\" data-v=\"narma\" aria-pressed=\"true\">NARMA10</button>\n        <button type=\"button\" data-g=\"task\" data-v=\"sine\" aria-pressed=\"false\">사인파 5스텝 앞</button>\n      </div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"b-c1n\">노드 수 N</label><input type=\"range\" id=\"b-c1n\" min=\"10\" max=\"60\" step=\"2\" value=\"30\"><output id=\"b-o1n\"></output></div>\n        <div class=\"row\"><label for=\"b-c1r\">스펙트럴 반경</label><input type=\"range\" id=\"b-c1r\" min=\"5\" max=\"150\" step=\"1\" value=\"90\"><output id=\"b-o1r\"></output></div>\n        <div class=\"row\"><label for=\"b-c1l\">누설률</label><input type=\"range\" id=\"b-c1l\" min=\"5\" max=\"100\" step=\"1\" value=\"80\"><output id=\"b-o1l\"></output></div>\n        <div class=\"row\"><label for=\"b-c1i\">입력 세기</label><input type=\"range\" id=\"b-c1i\" min=\"5\" max=\"200\" step=\"5\" value=\"60\"><output id=\"b-o1i\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"b-b1s\">저수지 다시 뽑기</button>\n        <button type=\"button\" id=\"b-b1f\" aria-pressed=\"true\">읽기층 학습 ON</button>\n      </div>\n      <div class=\"read\" id=\"b-r1\"></div>\n      <p class=\"note\">저수지 30노드를 실제로 돌리고(tanh 포화), 읽기층은 릿지 회귀(λ=1e-6)를 가우스 소거로 직접 푼다. <span class=\"k\">다시 뽑기</span>를 눌러도 NRMSE가 비슷하게 돌아오는 것 — 그게 「내부를 안 건드려도 된다」는 주장의 실물이다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"b-s2\">\n  <div class=\"head\">\n    <div><div class=\"num\">02</div><h2>스파이킹 광 뉴런</h2></div>\n    \n  </div>\n  <p class=\"idea\">세기를 계속 흘리는 대신 <span class=\"k\">역치를 넘을 때만 한 발씩</span> 쏜다. 공명터널다이오드(RTD)의 음성미분저항이 적분·발화·불응을 전자 쪽에서 만들고 레이저가 그걸 광 펄스로 내보낸다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"b-f2\" width=\"880\" height=\"360\"></canvas></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"b-c2i\">입력 세기</label><input type=\"range\" id=\"b-c2i\" min=\"0\" max=\"300\" step=\"2\" value=\"150\"><output id=\"b-o2i\"></output></div>\n        <div class=\"row\"><label for=\"b-c2th\">역치</label><input type=\"range\" id=\"b-c2th\" min=\"20\" max=\"150\" step=\"1\" value=\"70\"><output id=\"b-o2th\"></output></div>\n        <div class=\"row\"><label for=\"b-c2rf\">불응기</label><input type=\"range\" id=\"b-c2rf\" min=\"0\" max=\"400\" step=\"5\" value=\"100\"><output id=\"b-o2rf\"></output></div>\n        <div class=\"row\"><label for=\"b-c2ta\">막 시정수 τ</label><input type=\"range\" id=\"b-c2ta\" min=\"20\" max=\"400\" step=\"5\" value=\"120\"><output id=\"b-o2ta\"></output></div>\n        <div class=\"row\"><label for=\"b-c2nz\">잡음</label><input type=\"range\" id=\"b-c2nz\" min=\"0\" max=\"60\" step=\"1\" value=\"8\"><output id=\"b-o2nz\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <span class=\"chip\">입력 모양</span>\n        <button type=\"button\" data-g=\"drv\" data-v=\"dc\" aria-pressed=\"true\">일정</button>\n        <button type=\"button\" data-g=\"drv\" data-v=\"step\" aria-pressed=\"false\">계단</button>\n        <button type=\"button\" data-g=\"drv\" data-v=\"burst\" aria-pressed=\"false\">펄스열</button>\n      </div>\n      <div class=\"read\" id=\"b-r2\"></div>\n      <p class=\"note\">적분발화식 <span class=\"k\">τ dV/dt = −V + I(t)</span>를 전진 오일러(Δt = 1 ps, 2000스텝 = 2 ns)로 적분한다. 잰 간격이 해석해 <span class=\"k\">t<sub>ref</sub> − τ·ln(1 − θ/I)</span> 와 맞는지 같이 띄운다. 숫자 단위는 RTD 뉴런의 보고된 시간 규모(수백 ps~ns)에 맞춰 붙인 것이고 특정 소자의 측정값이 아니다 — <span class=\"w\">모델이지 소자 시뮬레이터가 아니다</span>.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"b-s3\">\n  <div class=\"head\">\n    <div><div class=\"num\">03</div><h2>포토닉 텐서코어</h2></div>\n    \n  </div>\n  <p class=\"idea\">A군 05의 PCM 크로스바에 <span class=\"k\">파장 다중을 얹는다.</span> 셀은 그대로인데 파장 N개가 동시에 지나가니 한 번의 통과로 행렬곱 N벌이 나온다 — 면적을 안 늘리고 처리량만 N배로 미는 방식.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><svg class=\"f\" id=\"b-f3\" viewBox=\"0 0 880 370\" role=\"img\" aria-label=\"WDM이 얹힌 PCM 크로스바\"></svg></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"b-c3n\">파장 수 N</label><input type=\"range\" id=\"b-c3n\" min=\"1\" max=\"64\" step=\"1\" value=\"16\"><output id=\"b-o3n\"></output></div>\n        <div class=\"row\"><label for=\"b-c3m\">행렬 한 변 M</label><input type=\"range\" id=\"b-c3m\" min=\"2\" max=\"32\" step=\"1\" value=\"4\"><output id=\"b-o3m\"></output></div>\n        <div class=\"row\"><label for=\"b-c3b\">셀 비트수</label><input type=\"range\" id=\"b-c3b\" min=\"1\" max=\"8\" step=\"1\" value=\"4\"><output id=\"b-o3b\"></output></div>\n        <div class=\"row\"><label for=\"b-c3f\">변조 속도</label><input type=\"range\" id=\"b-c3f\" min=\"1\" max=\"50\" step=\"1\" value=\"10\"><output id=\"b-o3f\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\"><button type=\"button\" id=\"b-b3r\">가중치·입력 다시 뽑기</button></div>\n      <div class=\"read\" id=\"b-r3\"></div>\n      <p class=\"note\">M×M 가중치를 비트수대로 양자화해 <span class=\"k\">N벌의 행렬-벡터 곱을 실제로 계산</span>하고, 양자화 안 한 참값과의 RMS 오차를 잰다. 아래 TOPS는 코어만 센 상한이다. <span class=\"k\">파장 수를 늘려도 TOPS/W는 꿈쩍 안 한다</span> — 변환 한 번에 곱셈을 몇 번 했나(=M)만 효율을 정하기 때문이다. 파장은 처리량을 늘릴 뿐 효율은 못 늘린다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec\" id=\"b-s4\">\n  <div class=\"head\">\n    <div><div class=\"num\">04</div><h2>전광 RNN</h2></div>\n    \n  </div>\n  <p class=\"idea\">되먹임 고리를 전기로 안 내리고 <span class=\"k\">광에서 그대로 돌린다.</span> χ² 비선형(광파라메트릭 증폭)이 활성화 함수 노릇을 하고, 고리 한 바퀴가 곧 한 타임스텝이다. 이득이 <span class=\"k\">음수</span>인 건 고리 한 바퀴의 위상이 π라는 뜻 — 돌아온 빛이 입력을 상쇄하는 쪽으로 붙는다.</p>\n  <div class=\"split\">\n    <div class=\"fig\"><canvas class=\"f\" id=\"b-f4\" width=\"880\" height=\"350\"></canvas></div>\n    <div>\n      <div class=\"ctl\">\n        <div class=\"row\"><label for=\"b-c4g\">고리 이득 g</label><input type=\"range\" id=\"b-c4g\" min=\"-300\" max=\"300\" step=\"2\" value=\"-200\"><output id=\"b-o4g\"></output></div>\n        <div class=\"row\"><label for=\"b-c4d\">지연 D</label><input type=\"range\" id=\"b-c4d\" min=\"1\" max=\"24\" step=\"1\" value=\"3\"><output id=\"b-o4d\"></output></div>\n        <div class=\"row\"><label for=\"b-c4u\">입력 구동</label><input type=\"range\" id=\"b-c4u\" min=\"-100\" max=\"100\" step=\"2\" value=\"20\"><output id=\"b-o4u\"></output></div>\n        <div class=\"row\"><label for=\"b-c4L\">고리 길이</label><input type=\"range\" id=\"b-c4L\" min=\"1\" max=\"100\" step=\"1\" value=\"30\"><output id=\"b-o4L\"></output></div>\n      </div>\n      <div class=\"btns\" style=\"margin-top:8px\">\n        <button type=\"button\" id=\"b-b4n\" aria-pressed=\"true\">χ² 비선형 ON</button>\n      </div>\n      <div class=\"read\" id=\"b-r4\"></div>\n      <p class=\"note\"><span class=\"w\">정직하게 적을 것</span> — Marandi 그룹이 보인 100 GHz급 전광 되먹임의 비선형 소자는 <span class=\"k\">벌크 RPE-PPLN 결정</span>이지 TFLN 칩이 아니다. 칩 위 χ²는 별개의 숙제다. 아래 「고리 길이 → 타임스텝」 환산은 n<sub>g</sub>=2.2 가정으로 계산한 값이다. 손잡이로 <span class=\"k\">g를 −1 위아래로 넘겨보면</span> 수렴과 진동의 경계가 보인다.</p>\n    </div>\n  </div>\n</div>\n\n<div class=\"card sec close\" id=\"b-s5\">\n  <h2 style=\"font-size:16px\">넷을 겹쳐 보면</h2>\n  <p style=\"margin-top:8px\"><b>전부 「학습을 어디로 치우나」의 변주다.</b> 리저버(01)는 학습을 출력 한 층으로 몰아 칩에서 아예 빼버린다. 텐서코어(03)는 학습된 가중치를 받아 추론만 빠르게 하겠다는 쪽이라 학습을 밖에 둔다. 스파이킹(02)과 전광 RNN(04)은 반대로 <span class=\"k\">비선형과 상태를 광 안에 두려는</span> 시도인데, 그 대가로 둘 다 「그래서 학습은 어떻게 하나」가 미해결로 남는다.</p>\n  <p><b>그리고 넷 다 같은 자리에서 막힌다 — 상태를 어디에 담아두나.</b> 리저버의 저수지 상태, 스파이킹 뉴런의 막전위, RNN의 고리 안 진폭은 전부 <span class=\"k\">빛이 지나가는 동안만</span> 존재한다. 빛은 멈추지 않으니 상태를 붙잡으려면 고리를 돌리거나(04) 전자로 내려야 한다(01·02). 광 메모리가 승부처라는 말이 여기서도 똑같이 나온다.</p>\n  <p><b>03만 성격이 다르다.</b> PCM 셀에 가중치가 꺼도 남으니 상태 문제의 절반은 푼 셈인데, 대신 쓰기가 느려서 <span class=\"k\">추론 전용</span>이 된다. 학습 중에 가중치가 매 스텝 바뀌는 워크로드에는 들어갈 자리가 없다.</p>\n  <p><b>숫자를 볼 때 조심할 것.</b> 이 네 구조의 논문 수치는 거의 전부 코어만 센 것이다 — 03 탭에서 ADC 전력을 켜고 끄며 보면 같은 설계에서 자릿수가 어떻게 달라지는지 보인다. 시스템급 실측으로 GPU를 넘긴 플랫폼은 아직 없다.</p>\n</div>\n</section>",
  run: function (document, getComputedStyle, MOD) {


(function(){
'use strict';
  let done=false, ROOT=null;
  const $=id=>document.getElementById('b-'+id);   // 배열구동·'s'+i 조립까지 전부 여기서 접두어가 붙는다
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=(v,n)=>v.toFixed(n==null?2:n);
  const cs=()=>getComputedStyle(document.body);
  const col=k=>cs().getPropertyValue(k).trim();

  /* 재현 가능한 난수 — 같은 씨앗이면 같은 저수지 */
  function rng(seed){let s=seed>>>0;return function(){s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}

  /* 대칭 아닌 일반 선형계 풀이 — 부분 피벗 가우스 소거 */
  function solve(A,b,n){
    for(let i=0;i<n;i++){
      let p=i;
      for(let r=i+1;r<n;r++) if(Math.abs(A[r][i])>Math.abs(A[p][i])) p=r;
      if(p!==i){const t=A[p];A[p]=A[i];A[i]=t;const u=b[p];b[p]=b[i];b[i]=u;}
      const d=A[i][i]||1e-12;
      for(let r=i+1;r<n;r++){
        const f=A[r][i]/d; if(f===0) continue;
        for(let c=i;c<n;c++) A[r][c]-=f*A[i][c];
        b[r]-=f*b[i];
      }
    }
    const x=new Float64Array(n);
    for(let i=n-1;i>=0;i--){let s=b[i];for(let c=i+1;c<n;c++) s-=A[i][c]*x[c];x[i]=s/(A[i][i]||1e-12);}
    return x;
  }

  /* ── 01 리저버 컴퓨팅 ───────────────────────────── */
  let seed1=7, task1='narma', train1=true;
  const WASH=120, TRAIN=500, TEST=220;

  function makeSignal(T,kind,rnd){
    const u=new Float64Array(T), y=new Float64Array(T);
    if(kind==='narma'){
      for(let t=0;t<T;t++) u[t]=rnd()*0.5;
      for(let t=0;t<T;t++){
        if(t<10){y[t]=0.1;continue;}
        let s=0; for(let i=0;i<10;i++) s+=y[t-1-i];
        y[t]=0.3*y[t-1]+0.05*y[t-1]*s+1.5*u[t-10]*u[t-1]+0.1;
        if(!isFinite(y[t])||Math.abs(y[t])>5) y[t]=clamp(y[t]||0,-5,5);
      }
    }else{
      for(let t=0;t<T;t++) u[t]=0.5*Math.sin(0.21*t)+0.3*Math.sin(0.0731*t*Math.PI);
      for(let t=0;t<T;t++) y[t]=u[Math.min(T-1,t+5)];
    }
    return [u,y];
  }

  function runReservoir(){
    const N=+$('c1n').value, rho=+$('c1r').value/100, leak=+$('c1l').value/100, isc=+$('c1i').value/100;
    const rnd=rng(seed1*2654435761);
    // 저수지 행렬: 밀도 0.2 희소, 스펙트럴 반경을 거듭제곱법으로 재서 맞춘다
    const W=[]; for(let i=0;i<N;i++){const r=new Float64Array(N);for(let j=0;j<N;j++) r[j]=rnd()<0.2?(rnd()*2-1):0;W.push(r);}
    let v=new Float64Array(N).fill(1/Math.sqrt(N)), lam=1;
    for(let k=0;k<60;k++){
      const w=new Float64Array(N);
      for(let i=0;i<N;i++){let s=0;for(let j=0;j<N;j++) s+=W[i][j]*v[j];w[i]=s;}
      let nn=0; for(let i=0;i<N;i++) nn+=w[i]*w[i]; nn=Math.sqrt(nn);
      if(nn<1e-12){lam=0;break;}
      lam=nn; for(let i=0;i<N;i++) v[i]=w[i]/nn;
    }
    const sc=lam>1e-9?rho/lam:0;
    for(let i=0;i<N;i++) for(let j=0;j<N;j++) W[i][j]*=sc;
    const Win=new Float64Array(N); for(let i=0;i<N;i++) Win[i]=(rnd()*2-1)*isc;

    const T=WASH+TRAIN+TEST;
    const [u,y]=makeSignal(T,task1,rng(20260101));
    const F=N+2;                       // 특징 = 노드 N개 + 입력 + 바이어스
    const X=[]; let x=new Float64Array(N);
    for(let t=0;t<T;t++){
      const nx=new Float64Array(N);
      for(let i=0;i<N;i++){
        let s=Win[i]*u[t];
        for(let j=0;j<N;j++) s+=W[i][j]*x[j];
        nx[i]=(1-leak)*x[i]+leak*Math.tanh(s);
      }
      x=nx;
      const f=new Float64Array(F);
      for(let i=0;i<N;i++) f[i]=x[i];
      f[N]=u[t]; f[N+1]=1;
      X.push(f);
    }
    // 릿지 회귀 — 정규방정식 (XᵀX + λI) w = Xᵀy
    let wout;
    if(train1){
      const A=[]; for(let i=0;i<F;i++) A.push(new Float64Array(F));
      const bb=new Float64Array(F);
      for(let t=WASH;t<WASH+TRAIN;t++){
        const f=X[t];
        for(let i=0;i<F;i++){const fi=f[i];for(let j=i;j<F;j++) A[i][j]+=fi*f[j];bb[i]+=fi*y[t];}
      }
      for(let i=0;i<F;i++){for(let j=0;j<i;j++) A[i][j]=A[j][i];A[i][i]+=1e-6;}
      wout=solve(A,bb,F);
    }else{
      const rr=rng(seed1*97+5); wout=new Float64Array(F);
      for(let i=0;i<F;i++) wout[i]=(rr()*2-1)*0.3;
    }
    const pred=new Float64Array(T);
    for(let t=0;t<T;t++){let s=0;const f=X[t];for(let i=0;i<F;i++) s+=wout[i]*f[i];pred[t]=s;}
    // NRMSE — 테스트 구간만
    let me=0,my=0,n0=0;
    for(let t=WASH+TRAIN;t<T;t++){me+=(pred[t]-y[t])*(pred[t]-y[t]);my+=y[t];n0++;}
    my/=n0; let vr=0;
    for(let t=WASH+TRAIN;t<T;t++) vr+=(y[t]-my)*(y[t]-my);
    const nrmse=Math.sqrt((me/n0)/Math.max(vr/n0,1e-12));
    return {N,F,y,pred,x,W,nrmse,rho,T};
  }

  function r1(){
    $('o1n').textContent=$('c1n').value;
    $('o1r').textContent=fmt(+$('c1r').value/100,2);
    $('o1l').textContent=fmt(+$('c1l').value/100,2);
    $('o1i').textContent=fmt(+$('c1i').value/100,2);
    const R=runReservoir();
    const cv=$('f1'), g=cv.getContext('2d'), W=cv.width, H=cv.height;
    g.clearRect(0,0,W,H);
    g.font='12px IBM Plex Mono, monospace';
    const N=R.N;
    const box=(x,y,w,hh,t,c)=>{ g.fillStyle=col('--panel'); g.fillRect(x,y,w,hh); g.strokeStyle=c||col('--ink'); g.lineWidth=1.2; g.strokeRect(x,y,w,hh);
      g.fillStyle=col('--ink'); g.textAlign='center'; g.fillText(t,x+w/2,y+hh/2+4); g.textAlign='left'; };
    // ── 칩: 수동 실리콘 포토닉 저수지(겐트식). 노드 = 2×2 결합기, 노드 사이 도파로 = 지연선, 노드마다 PD 탭 ──
    const CX=118, CY=56, CW=300, CH=262;
    g.fillStyle=col('--grid'); g.globalAlpha=.55; g.fillRect(CX,CY,CW,CH); g.globalAlpha=1;
    g.strokeStyle=col('--rule'); g.lineWidth=1.2; g.strokeRect(CX,CY,CW,CH);
    g.fillStyle=col('--muted'); g.fillText('실리콘 포토닉 칩 — 수동 저수지 '+N+'노드, 학습 안 함',CX,CY-10);
    const cols=Math.ceil(Math.sqrt(N)), rows=Math.ceil(N/cols);
    const gx=(CW-40)/Math.max(1,cols-1), gy=(CH-40)/Math.max(1,rows-1);
    const P=i=>[CX+20+(i%cols)*gx, CY+20+Math.floor(i/cols)*gy];
    // 도파로 — 이웃끼리, 줄마다 방향을 바꿔 소용돌이로. 가운데 굽이가 「길이 = 기억」
    const meander=(ax,ay,bx,by)=>{ const dx=bx-ax, dy=by-ay, L=Math.hypot(dx,dy)||1, nx=-dy/L*5, ny=dx/L*5, mx=(ax+bx)/2, my=(ay+by)/2;
      g.beginPath(); g.moveTo(ax,ay); g.lineTo(mx-dx*.2,my-dy*.2);
      g.bezierCurveTo(mx-dx*.1+nx*2,my-dy*.1+ny*2, mx+dx*.1-nx*2,my+dy*.1-ny*2, mx+dx*.2,my+dy*.2); g.lineTo(bx,by); g.stroke();
      // 방향 화살
      const ux=dx/L, uy=dy/L, hx=bx-ux*9, hy=by-uy*9; g.beginPath(); g.moveTo(hx-uy*3,hy+ux*3); g.lineTo(bx-ux*5,by-uy*5); g.lineTo(hx+uy*3,hy-ux*3); g.stroke(); };
    g.strokeStyle=col('--faint'); g.lineWidth=1.3;
    for(let i=0;i<N;i++){ const r=Math.floor(i/cols), c=i%cols, [x,y]=P(i);
      if(c+1<cols && i+1<N){ const [x2,y2]=P(i+1); if(r%2) meander(x2,y2,x,y); else meander(x,y,x2,y2); }
      if(i+cols<N){ const [x2,y2]=P(i+cols); if(c%2) meander(x2,y2,x,y); else meander(x,y,x2,y2); } }
    // 노드 — 2×2 결합기(네모, 채움 = 지금 상태) + PD 탭(검은 점)
    for(let i=0;i<N;i++){ const [x,y]=P(i), v=clamp(Math.abs(R.x[i]),0,1);
      g.fillStyle=col('--panel'); g.fillRect(x-5,y-5,10,10);
      g.fillStyle=R.x[i]>=0?col('--beam'):col('--probe'); g.globalAlpha=.2+.8*v; g.fillRect(x-5,y-5,10,10); g.globalAlpha=1;
      g.strokeStyle=col('--ink'); g.lineWidth=1; g.strokeRect(x-5,y-5,10,10);
      g.fillStyle=col('--ink'); g.beginPath(); g.arc(x+7,y+7,2,0,2*Math.PI); g.fill(); }
    // ── 입력 사슬: CW 레이저 → EO 변조기(u(t)) → 1×k 분배 → 첫 열 노드들 ──
    const iy=CY+CH/2;
    g.strokeStyle=col('--beam'); g.lineWidth=2; g.beginPath(); g.moveTo(44,iy); g.lineTo(104,iy); g.stroke();
    for(let r=0;r<rows;r++){ const i=r*cols; if(i>=N) continue; const [x,y]=P(i); g.lineWidth=1.2; g.beginPath(); g.moveTo(104,iy); g.lineTo(x-5,y); g.stroke(); }
    box(14,iy-11,30,22,'LD'); box(56,iy-11,34,22,'EOM');
    g.fillStyle=col('--muted'); g.fillText('레이저',10,iy+26); g.fillText('변조기',56,iy+26); g.fillText('u(t)',62,iy-16); g.fillText('1×k',96,iy-16);
    // ── 읽기: 모든 PD → TIA → ADC → FPGA 읽기층(W_out — 학습되는 유일한 층) ──
    const EX=452, EW=108;
    g.strokeStyle=col('--muted'); g.setLineDash([4,3]); g.lineWidth=1.2; g.beginPath(); g.moveTo(CX+CW,iy); g.lineTo(EX,iy); g.stroke(); g.setLineDash([]);
    g.fillStyle=col('--muted'); g.fillText('PD '+N+'개',CX+CW+4,iy-8);
    box(EX,CY+24,EW,30,'TIA ×'+N); box(EX,CY+92,EW,30,'ADC ×'+N); box(EX,CY+160,EW,62,'',col('--probe'));
    g.fillStyle=col('--probe'); g.textAlign='center'; g.fillText('FPGA',EX+EW/2,CY+184); g.fillText('W_out 읽기층',EX+EW/2,CY+202); g.textAlign='left';
    g.strokeStyle=col('--muted'); g.lineWidth=1.2;
    [[CY+54,CY+92],[CY+122,CY+160]].forEach(([y1,y2])=>{ g.beginPath(); g.moveTo(EX+EW/2,y1); g.lineTo(EX+EW/2,y2-6); g.stroke(); g.beginPath(); g.moveTo(EX+EW/2-3,y2-9); g.lineTo(EX+EW/2,y2-3); g.lineTo(EX+EW/2+3,y2-9); g.stroke(); });
    g.beginPath(); g.moveTo(EX+EW/2,CY+222); g.lineTo(EX+EW/2,CY+250); g.lineTo(596,CY+250); g.stroke();
    g.fillStyle=col('--muted'); g.fillText('학습 = 이 한 층',EX,CY+268); g.fillText('(릿지 회귀 1회)',EX,CY+284);
    // ── 오른쪽: FPGA 출력 vs 목표 (테스트 구간) ──
    const x0=600, x1=862, yt=56, yb=300;
    const t0=WASH+TRAIN, t1=R.T;
    let mn=1e9,mx=-1e9;
    for(let t=t0;t<t1;t++){mn=Math.min(mn,R.y[t],R.pred[t]);mx=Math.max(mx,R.y[t],R.pred[t]);}
    if(!isFinite(mn)||!isFinite(mx)||mx-mn<1e-9){mn-=.5;mx+=.5;}
    const pad=(mx-mn)*0.12; mn-=pad; mx+=pad;
    const X_=t=>x0+(t-t0)/(t1-t0-1)*(x1-x0);
    const Y_=v=>yb-(clamp(v,mn,mx)-mn)/(mx-mn)*(yb-yt);
    g.strokeStyle=col('--rule'); g.lineWidth=1;
    g.strokeRect(x0,yt,x1-x0,yb-yt);
    g.strokeStyle=col('--muted'); g.lineWidth=2; g.globalAlpha=.75; g.beginPath();
    for(let t=t0;t<t1;t++){const X2=X_(t),Y2=Y_(R.y[t]);t===t0?g.moveTo(X2,Y2):g.lineTo(X2,Y2);} g.stroke();
    g.globalAlpha=1; g.strokeStyle=col('--beam'); g.lineWidth=2; g.beginPath();
    for(let t=t0;t<t1;t++){const X2=X_(t),Y2=Y_(R.pred[t]);t===t0?g.moveTo(X2,Y2):g.lineTo(X2,Y2);} g.stroke();
    g.fillStyle=col('--muted'); g.fillText('목표',x0,yt-10);
    g.fillStyle=col('--beam'); g.fillText('FPGA 출력',x0+44,yt-10);
    g.fillStyle=col('--muted'); g.fillText('테스트 '+TEST+'스텝 (학습에 안 쓴 구간)',x0,yb+18);
    g.fillText('세로축 '+fmt(mn,2)+' ~ '+fmt(mx,2),x0,yb+34);
    g.fillText('도파로 길이 = 기억 · 결합기의 고정된 섞임 = 내부 가중치 · PD 제곱검출 = 비선형',14,348);

    const full=R.N*R.N+R.N;
    $('r1').innerHTML=
      '<div>NRMSE <b>'+fmt(R.nrmse,4)+'</b> · 저수지 씨앗 <b>#'+seed1+'</b></div>'+
      '<div>학습한 가중치 <b>'+R.F+'</b>개 (읽기층만) · 내부까지 학습하면 <b>'+full+'</b>개</div>'+
      '<div>'+(train1?'읽기층 = 릿지 최소제곱 해':'<span style="color:var(--wall)">읽기층 무작위 — 저수지만으로는 답이 안 나온다</span>')+'</div>';
  }

  /* ── 02 스파이킹 광 뉴런 ────────────────────────── */
  let drv2='dc';
  function r2(){
    const I0=+$('c2i').value/100, th=+$('c2th').value/100, tref=+$('c2rf').value, tau=+$('c2ta').value, nz=+$('c2nz').value/1000;
    $('o2i').textContent=fmt(I0,2); $('o2th').textContent=fmt(th,2);
    $('o2rf').textContent=tref+' ps'; $('o2ta').textContent=tau+' ps'; $('o2nz').textContent=fmt(nz,3);
    const STEP=2000, dt=1;   // 1 ps 간격, 총 2 ns
    const V=new Float64Array(STEP), Iv=new Float64Array(STEP);
    const spikes=[]; const rnd=rng(424242);
    let v=0, refLeft=0;
    for(let t=0;t<STEP;t++){
      let I=I0;
      if(drv2==='step') I=I0*(t<STEP*0.35?0.25:(t<STEP*0.7?1:0.55));
      else if(drv2==='burst') I=I0*(Math.floor(t/160)%2===0?1.45:0.1);
      I+=(rnd()*2-1)*nz*8;
      Iv[t]=I;
      if(refLeft>0){ refLeft-=dt; v=0; }
      else{
        v+=dt*(-v+I)/tau;
        if(v>=th){ spikes.push(t); v=1.25; refLeft=tref; }
      }
      V[t]=v;
    }
    const cv=$('f2'), g=cv.getContext('2d'), W=cv.width, H=cv.height;
    g.clearRect(0,0,W,H);
    // ── 사이클: 입력 스파이크 → 감쇠기(시냅스 w) → PD → RTD(음성미분저항, 바이어스 = 역치) → 레이저 구동 → 출력 펄스 → 다음 뉴런 ──
    const P=CYC.pen(g), Y=92, iv=clamp(I0/3,0,1);
    // 입력 스파이크 열 — 입력 모양을 따른다
    P.beam([[16,Y],[96,Y]],{w:1,op:.5});
    for(let k=0;k<6;k++){ const t=Math.floor(k*STEP/6), a=clamp(Iv[t]/3,0,1); P.path('M'+(22+k*13)+' '+Y+' v'+(-4-16*a),{c:'beam',w:2,op:.35+.65*a}); }
    P.lab(16,Y+20,'입력 광',{s:10});
    P.part('voa',[100,Y-8,32,16],()=>{ P.rect(100,Y-8,32,16,{c:'ink',w:1.2}); P.rect(103,Y-5,26*iv,10,{c:'none',f:'beam',fo:.8,r:1}); });
    P.lab(116,Y+22,'시냅스 w',{a:'middle',s:9.5});
    P.beam([[132,Y],[170,Y]],{w:1+2*iv,op:.4+.6*iv});
    // 뉴런 한 개 = 광-전-광 (PD → RTD → LD)
    P.zone(158,Y-46,262,96,'뉴런 하나 — 광 → 전자 → 광');
    P.pd(178,Y,{v:iv,lab:'PD'});
    P.wire([[188,Y],[226,Y]]); P.lab(207,Y-8,'I',{a:'middle',s:9.5,c:'probe'});
    P.part('rtd',[228,Y-22,76,44],()=>{
      P.rect(228,Y-22,76,44,{c:'ink',w:1.3});
      // N자 I–V: 오르다 꺾여 내려가는 구간 = 음성미분저항
      P.path('M238 '+(Y+14)+' C246 '+(Y-14)+' 252 '+(Y-14)+' 258 '+(Y-2)+' S270 '+(Y+12)+' 276 '+(Y+6)+' L294 '+(Y-16),{c:'probe',w:1.5});
      P.text(266,Y-10,'RTD',{a:'middle',c:'ink',s:10});
    });
    P.lab(282,Y+36,'음성미분저항',{a:'middle',s:9.5});
    P.box(244,Y+78,70,22,'바이어스',{id:'bias',tone:'probe',s:10});
    P.wire([[244,Y+67],[244,Y+23]]); P.lab(284,Y+82,'역치 '+fmt(th,2),{s:9.5,c:'probe'});
    P.wire([[304,Y],[352,Y]]); P.lab(328,Y-8,'발화',{a:'middle',s:9.5,c:'probe'});
    P.laser(378,Y,{lab:'LD'});
    // 출력 펄스 — 시뮬레이션의 스파이크 열 그대로
    P.beam([[401,Y],[600,Y]],{w:1,op:.45});
    spikes.forEach(t=>{ const x=408+t/(STEP-1)*186; P.path('M'+x.toFixed(1)+' '+Y+' v-18',{c:'beam',w:2}); });
    P.lab(500,Y+20,'출력 광 펄스',{a:'middle',s:10});
    P.iso(624,Y,{lab:'역류 차단'});
    P.beam([[638,Y],[680,Y]],{w:1.6});
    P.coil(700,Y,{r:11,lab:'축삭 지연'});
    P.beam([[718,Y],[770,Y]],{w:1.6,arrow:true});
    P.lab(778,Y+4,'다음 뉴런',{s:10,c:'ink'});
    P.lab(778,Y+20,'의 PD 로',{s:9.5});
    P.legend(16,282,['입력 광','PD','RTD 발화','LD','출력 펄스']);
    CYC.seal(P);
    // ── 보조 패널: 막전위 V(t) 와 출력 펄스 (옛 그래프) ──
    P.aux(330,196,542,158,'막전위 V(t) · 출력 펄스 — 2 ns');
    const x0=372, x1=858, yt=220, yb=292;
    const X_=t=>x0+t/(STEP-1)*(x1-x0);
    const vmax=Math.max(1.3, th*1.5);
    const Y_=val=>yb-clamp(val,0,vmax)/vmax*(yb-yt);
    g.font='10px IBM Plex Mono, monospace';
    g.strokeStyle=col('--rule'); g.lineWidth=1; g.strokeRect(x0,yt,x1-x0,yb-yt);
    g.strokeStyle=col('--warm'); g.globalAlpha=.5; g.lineWidth=1.2; g.beginPath();
    for(let t=0;t<STEP;t+=2){const X2=X_(t),Y2=Y_(Iv[t]);t===0?g.moveTo(X2,Y2):g.lineTo(X2,Y2);} g.stroke();
    g.globalAlpha=1;
    g.strokeStyle=col('--probe'); g.setLineDash([5,4]); g.lineWidth=1.1;
    g.beginPath(); g.moveTo(x0,Y_(th)); g.lineTo(x1,Y_(th)); g.stroke(); g.setLineDash([]);
    g.fillStyle=col('--probe'); g.fillText('역치',x1-28,Y_(th)-4);
    g.strokeStyle=col('--beam'); g.lineWidth=1.5; g.beginPath();
    for(let t=0;t<STEP;t++){const X2=X_(t),Y2=Y_(V[t]);t===0?g.moveTo(X2,Y2):g.lineTo(X2,Y2);} g.stroke();
    g.fillStyle=col('--beam'); g.fillText('V(t)',x0-34,yt+10); g.fillStyle=col('--warm'); g.fillText('I(t)',x0-34,yt+24);
    g.fillStyle=col('--muted'); g.fillText('펄스',x0-34,326);
    g.strokeStyle=col('--rule'); g.beginPath(); g.moveTo(x0,328); g.lineTo(x1,328); g.stroke();
    g.strokeStyle=col('--beam'); g.lineWidth=2;
    spikes.forEach(t=>{const X2=X_(t);g.beginPath();g.moveTo(X2,328);g.lineTo(X2,306);g.stroke();});
    g.fillStyle=col('--muted');
    g.fillText('0',x0-3,344); g.fillText('1 ns',(x0+x1)/2-12,344); g.fillText('2 ns',x1-24,344);

    let isi='—', jit='—';
    if(spikes.length>=3){
      const d=[]; for(let i=1;i<spikes.length;i++) d.push(spikes[i]-spikes[i-1]);
      const mu=d.reduce((a,b)=>a+b,0)/d.length;
      let s2=0; d.forEach(x=>s2+=(x-mu)*(x-mu));
      isi=fmt(mu,0)+' ps'; jit=fmt(Math.sqrt(s2/d.length),1)+' ps';
    }
    const rate=spikes.length/2; // 2 ns 동안의 발화 수 → GHz
    const fmax=1000/Math.max(tref+1,1);
    $('r2').innerHTML=
      '<div>스파이크 <b>'+spikes.length+'</b>발 / 2 ns → <b>'+fmt(rate,2)+' GHz</b></div>'+
      '<div>간격 평균 <b>'+isi+'</b> · 흔들림 <b>'+jit+'</b></div><div>'+
      (spikes.length===0
        ? '<span style="color:var(--wall)">한 발도 못 쏜다 — V는 I까지만 차오르는데 그게 역치 아래다</span>'
        : '불응기 상한 <b>'+fmt(fmax,2)+' GHz</b> · 해석해 간격 <b>'+(I0>th?fmt(tref-tau*Math.log(1-th/I0),0)+' ps':'—')+'</b>')+'</div>';
  }

  /* ── 03 포토닉 텐서코어 ─────────────────────────── */
  let seed3=3;
  function r3(){
    const N=+$('c3n').value, M=+$('c3m').value, B=+$('c3b').value, F=+$('c3f').value;
    $('o3n').textContent=N; $('o3m').textContent=M+'×'+M;
    $('o3b').textContent=B+' bit'; $('o3f').textContent=F+' GHz';
    const rnd=rng(seed3*48271+11);
    const lv=(1<<B)-1;
    // 가중치는 0~1 (PCM 투과율은 음수가 안 된다 — 음수는 차동 쌍이 필요하다)
    const Wt=[], Wq=[];
    for(let i=0;i<M;i++){
      const a=new Float64Array(M), b=new Float64Array(M);
      for(let j=0;j<M;j++){a[j]=rnd();b[j]=lv>0?Math.round(a[j]*lv)/lv:0;}
      Wt.push(a); Wq.push(b);
    }
    // 파장 N개가 각자 입력 벡터 하나를 싣고 동시에 통과
    let se=0, sy=0, cnt=0, first=null;
    for(let k=0;k<N;k++){
      const x=new Float64Array(M); for(let j=0;j<M;j++) x[j]=rnd();
      const ye=new Float64Array(M), yq=new Float64Array(M);
      for(let i=0;i<M;i++){let s=0,q=0;for(let j=0;j<M;j++){s+=Wt[i][j]*x[j];q+=Wq[i][j]*x[j];}ye[i]=s;yq[i]=q;}
      for(let i=0;i<M;i++){se+=(yq[i]-ye[i])*(yq[i]-ye[i]);sy+=ye[i]*ye[i];cnt++;}
      if(k===0) first=[ye,yq];
    }
    const rms=Math.sqrt(se/cnt)/Math.sqrt(sy/cnt)*100;
    const macs=N*M*M;                       // 한 사이클당 곱셈누적
    const tops=2*macs*F*1e9/1e12;           // 코어만 — 2 OP/MAC
    const adcs=N*M*F*1e9;                   // 출력마다 변환 한 번
    const eadc=1e-12;                       // 가정: 1 pJ/변환
    const padc=adcs*eadc;                   // W
    const effCore=tops/Math.max(padc,1e-12);

    // ── 사이클: 콤 → 파장 분리 → 파장마다 1×M 분배 + 변조기 한 벌(입력 벡터) → 행마다 파장 합침 → PCM 크로스바(가중치) → 행 PD → TIA → ADC → FPGA ─
    //    쓰기 경로: FPGA 가 셀을 되읽고 펄스 레이저로 다시 쓴다(추론 경로와 따로)
    const P=CYC.pen(), YL=[82,130,178], RY=[94,118,142,166], OFF=[-9,-3,3,9];
    P.laser(36,130,{id:'src-comb'});
    P.beam([[59,130],[73,130]],{w:2.4});
    P.wdm(84,130,116,{w:22});
    YL.forEach((y,k)=>{
      P.beam([[95,y],[106,y]],{w:1.6});
      P.split(106,y,OFF.map(o=>y+o),{L:22,w:1.1,id:k?false:'ysplit'});
      const bank=()=>{ P.rect(130,y-14,36,28,{c:'ink',w:1.2}); OFF.forEach(o=>{ P.path('M130 '+(y+o)+' H166',{c:'beam',w:1,op:.5}); P.path('M135 '+(y+o-2.2)+' H161',{c:'probe',w:2}); }); };
      if(k) bank(); else P.part('eom',[130,y-14,36,28],bank);
      P.lab(148,y-18,k===2?'λN · 벡터 N':'λ'+(k+1)+' · 벡터 '+(k+1),{a:'middle',s:9.5});
      // 변조기 j 번째 출력 → 크로스바 j 행의 파장 합침기
      OFF.forEach((o,j)=>{ const ya=y+o, yb=RY[j]+(k-1)*6;
        P.path('M166 '+ya+' C200 '+ya+' 206 '+yb+' 239 '+yb,{c:'beam',w:1,op:.55}); });
    });
    P.lab(148,212,'입력 벡터 ×N',{a:'middle'});
    RY.forEach((y,j)=>{ P.wdm(246,y,22,{w:14,flip:true,id:false}); P.beam([[253,y],[278,y]],{w:1.8}); });
    P.at2('wdm',[253,RY[0]-11]);
    RY.forEach(y=>P.path('M278 '+y+' H394',{c:'faint',w:1,op:.6}));
    P.grid(280,82,112,96,4,4,{id:'pcm',vals:(i,j)=>.12+.88*Wq[i%M][j%M],lab:'PCM 가중치 W'});
    RY.forEach((y,i)=>{
      const fv=first?clamp(first[1][i%M]/Math.max(M*0.7,1e-9),0,1):0;
      P.beam([[394,y],[406,y]],{w:1+1.6*fv,op:.4+.6*fv});
      P.pd(414,y,{v:fv,id:i?false:'pd'});
      P.wire([[423,y],[456,y]],{arrow:false});
    });
    P.lab(414,194,'행 PD',{a:'middle'});
    P.box(478,130,40,100,'TIA',{id:'tia'}); P.wire([[498,130],[518,130]]);
    P.box(540,130,40,100,'ADC',{id:'adc'}); P.wire([[560,130],[588,130]]);
    P.box(620,130,60,40,'FPGA',{id:'fpga',tone:'probe'});
    P.text(660,126,'y = Wx',{s:10.5}); P.text(660,142,'N벌 동시',{s:9.5});
    // 쓰기 경로 — 셀을 녹였다 굳혀 가중치를 쓴다
    P.laser(336,38,{id:'src-pulse',lab:''}); P.lab(306,42,'쓰기 펄스',{a:'end',s:9.5});
    P.beam([[336,52],[336,78]],{dash:[4,3],arrow:true,w:1.6});
    P.wire([[620,110],[620,38],[361,38]]); P.lab(490,32,'되읽고 다시 쓰기',{a:'middle',s:9.5,c:'probe'});
    P.legend(16,252,['콤','파장 분리','변조 x','PCM 가중치','PD','ADC·FPGA']);
    // ── 보조 패널: 파장 수 N 을 늘리면 — 처리량은 N배, ADC 로 나눈 효율은 그대로 ──
    P.aux(470,222,402,142,'파장 수 N → 처리량 · 효율');
    const ax0=500, ax1=858, ay0=340, ay1=252, NX=n=>ax0+(n-1)/63*(ax1-ax0);
    P.path('M'+ax0+' '+ay1+' V'+ay0+' H'+ax1,{c:'rule',w:1});
    P.path('M'+NX(1)+' '+ay0+' L'+NX(64)+' '+ay1,{c:'beam',w:1.8});
    P.path('M'+ax0+' '+(ay0-30)+' H'+ax1,{c:'probe',w:1.6,dash:[5,3]});
    const ny=ay0-(N-1)/63*(ay0-ay1);
    P.circ(NX(N),ny,3.5,{c:'none',f:'beam'}); P.circ(NX(N),ay0-30,3.2,{c:'none',f:'probe'});
    P.text(ax0+8,ay1+10,'처리량 '+fmt(tops,1)+' TOPS (N='+N+')',{s:10,c:'beam'});
    P.text(ax1,ay0-36,'TOPS/W (ADC) '+fmt(effCore,0)+' — 그대로',{s:9.5,c:'probe',a:'end'});
    P.text(ax0,ay0+14,'N=1',{s:9.5}); P.text(ax1,ay0+14,'64',{s:9.5,a:'end'});
    $('f3').innerHTML=P.out();

    $('r3').innerHTML=
      '<div>한 사이클 MAC <b>'+macs.toLocaleString()+'</b>개 · 코어만 <b>'+fmt(tops,2)+' TOPS</b></div>'+
      '<div>양자화 오차 RMS <b>'+fmt(rms,2)+'%</b> ('+B+'비트 = '+(lv+1)+'단계)</div>'+
      '<div>ADC만 세면 <b>'+fmt(padc,2)+' W</b> (초당 '+(adcs/1e9).toFixed(1)+'G 변환 × 1 pJ 가정)</div>'+
      '<div>→ ADC 전력으로 나눈 효율 <b>'+fmt(effCore,2)+' TOPS/W</b> <span style="color:var(--wall)">— 레이저·구동·메모리 아직 안 뺐다</span></div>';
  }

  /* ── 04 전광 RNN ────────────────────────────────── */
  let nl4=true;
  function r4(){
    const g0=+$('c4g').value/100, D=+$('c4d').value, u0=+$('c4u').value/100, L=+$('c4L').value;
    $('o4g').textContent=fmt(g0,2); $('o4d').textContent=D+' 바퀴';
    $('o4u').textContent=fmt(u0,2); $('o4L').textContent=L+' mm';
    const STEP=600;
    const x=new Float64Array(STEP);
    const hist=new Float64Array(Math.max(D,1)).fill(0);
    let railed=false;
    for(let t=0;t<STEP;t++){
      const past=t>=D?x[t-D]:0;
      let a=g0*past+u0;
      // χ²(파라메트릭) 포화 — 펌프 고갈이 만드는 tanh 꼴. 끄면 순수 선형 고리
      let v=nl4?Math.tanh(a):a;
      if(!isFinite(v)||Math.abs(v)>1e8){v=Math.sign(v||1)*1e8;railed=true;}
      x[t]=v;
    }
    // 마지막 200스텝으로 상태 판정
    const tail=Array.from(x.slice(STEP-200));
    const mn=Math.min.apply(null,tail), mx=Math.max.apply(null,tail);
    const span=mx-mn;
    let period=0;
    if(span>1e-6){
      for(let p=1;p<=60;p++){
        let e=0,n=0;
        for(let i=p;i<tail.length;i++){e+=Math.abs(tail[i]-tail[i-p]);n++;}
        if(e/n<span*0.02){period=p;break;}
      }
    }
    let regime, rcol;
    if(railed||Math.abs(mx)>1e6){regime='발산 — 되먹임이 손실을 이긴다';rcol='var(--wall)';}
    else if(span<1e-6){regime='수렴 — 고정점 하나';rcol='var(--probe)';}
    else if(period>0){regime='주기 '+period+' 진동';rcol='var(--beam)';}
    else{regime='비주기 (카오스로 보임)';rcol='var(--beam)';}

    const cv=$('f4'), c=cv.getContext('2d'), W=cv.width, H=cv.height;
    c.clearRect(0,0,W,H);
    // ── 사이클: 펄스 LD → 변조기(입력 u) → 결합기로 고리에 넣음 → [위상 φ · 감쇠(|g|) · 지연선 D · χ² PPLN] 한 바퀴 → 결합기에서 다시 섞임 → 탭 PD → ADC ──
    const P=CYC.pen(c), last=x[STEP-1], av=clamp(Math.abs(last),0,1), lw=1+2*av, lo=.35+.65*av;
    const YI=130, YB=110, YT=30, XL=180, XR=540;
    P.laser(38,YI,{id:'src-pulse',lab:'펄스 LD'}); P.lab(38,YI+40,'타임스텝 시계',{a:'middle',s:9.5});
    P.beam([[61,YI],[100,YI]],{w:2});
    P.mod(120,YI,{lab:'u',sub:'입력 '+fmt(u0,2),drive:true});
    P.beam([[140,YI],[202,YI]],{w:1+1.5*Math.abs(u0),op:.4+.6*Math.abs(u0)});
    // 고리: 결합기 r1 → 아래 변(오른쪽으로) → 오른 변(위로) → 위 변(왼쪽으로) → 왼 변(아래로) → 결합기 l1
    P.path('M238 '+YB+' H'+(XR-20)+' Q'+XR+' '+YB+' '+XR+' '+(YB-20)+' V'+(YT+20)+' Q'+XR+' '+YT+' '+(XR-20)+' '+YT+' H'+(XL+20)+' Q'+XL+' '+YT+' '+XL+' '+(YT+20)+' V'+(YB-20)+' Q'+XL+' '+YB+' 202 '+YB,{c:'beam',w:lw,op:lo});
    [[480,YB,1],[260,YT,-1]].forEach(([ax,ay,d])=>P.path('M'+(ax-5*d)+' '+(ay-4)+' L'+ax+' '+ay+' L'+(ax-5*d)+' '+(ay+4),{c:'beam',w:1.4}));
    P.path('M'+XR+' 74 l-4 6 M'+XR+' 74 l4 6',{c:'beam',w:1.4}); P.path('M'+XL+' 66 l-4 -6 M'+XL+' 66 l4 -6',{c:'beam',w:1.4});
    P.coupler(220,YB+10,{w:36,g:10});
    P.lab(220,YI+24,'결합기',{a:'middle',s:9.5});
    // 고리 안 부품
    P.ps(300,YB+1,{w:26,v:g0<0?1:.35}); P.lab(284,YB-4,g0<0?'φ=π':'φ=0',{a:'end',s:9.5});
    P.part('voa',[386,YB-8,32,16],()=>{ P.rect(386,YB-8,32,16,{c:'ink',w:1.2}); P.rect(389,YB-5,26*clamp(Math.abs(g0)/3,0,1),10,{c:'none',f:'beam',fo:.8,r:1}); });
    P.lab(382,YB-4,'|g| '+fmt(Math.abs(g0),2),{a:'end',s:9.5});
    P.coil(430,YT,{r:11});
    P.lab(414,YT+30,'지연 D='+D,{a:'middle',s:9.5});
    P.lock(402,YT-18,56,36,{lab:'락',lx:462,ly:YT-20});
    P.box(300,YT,62,22,'χ² PPLN',{id:'freq',f:nl4?'warm':'panel',fo:nl4?.55:1,s:9.5});
    P.lab(300,YT+28,nl4?'포화 = 활성화':'비선형 꺼짐',{a:'middle',s:9.5});
    P.lab(360,74,'한 바퀴 = 한 타임스텝 · '+L+' mm',{a:'middle',s:9.5});
    // 탭 → PD → ADC
    P.beam([[238,YI],[592,YI]],{w:lw*.7,op:lo});
    P.pd(600,YI,{v:av,lab:'탭 PD'});
    P.wire([[610,YI],[640,YI]]);
    P.box(664,YI,44,28,'ADC',{id:'adc'});
    P.text(700,YI-6,'x(t)',{s:10.5}); P.text(700,YI+12,fmt(last,2),{s:15,c:'probe',b:1});
    P.legend(16,296,['펄스 LD','변조 u','χ² 고리','탭 PD','ADC']);
    CYC.seal(P);
    // ── 보조 패널: 고리 안 진폭 x(t) (옛 그래프) ──
    P.aux(470,190,402,152,'고리 안 진폭 x(t) — 마지막 120바퀴');
    const x0=500, x1=860, yt=212, yb=318;
    let a0=Math.min.apply(null,Array.from(x)), b0=Math.max.apply(null,Array.from(x));
    if(!isFinite(a0)||!isFinite(b0)||b0-a0<1e-9){a0-=1;b0+=1;}
    a0=clamp(a0,-4,4); b0=clamp(b0,-4,4); if(b0-a0<1e-6){a0-=.5;b0+=.5;}
    const SHOW=120, s0=STEP-SHOW;          // 정착한 뒤 마지막 120바퀴만 — 주기가 눈에 보이게
    const X_=t=>x0+(t-s0)/(SHOW-1)*(x1-x0);
    const Y_=v=>yb-(clamp(v,a0,b0)-a0)/(b0-a0)*(yb-yt);
    c.strokeStyle=col('--rule'); c.lineWidth=1; c.strokeRect(x0,yt,x1-x0,yb-yt);
    if(a0<0&&b0>0){c.strokeStyle=col('--rule');c.setLineDash([4,4]);c.beginPath();c.moveTo(x0,Y_(0));c.lineTo(x1,Y_(0));c.stroke();c.setLineDash([]);}
    c.strokeStyle=col('--beam'); c.lineWidth=1.3; c.globalAlpha=.55; c.beginPath();
    for(let t=s0;t<STEP;t++){const X2=X_(t),Y2=Y_(x[t]);t===s0?c.moveTo(X2,Y2):c.lineTo(X2,Y2);} c.stroke();
    c.globalAlpha=1; c.fillStyle=col('--beam');
    for(let t=s0;t<STEP;t++){c.beginPath();c.arc(X_(t),Y_(x[t]),1.7,0,2*Math.PI);c.fill();}
    c.fillStyle=col('--muted'); c.font='10px IBM Plex Mono, monospace';
    c.fillText(fmt(b0,2),x0-28,yt+8); c.fillText(fmt(a0,2),x0-28,yb);
    c.fillText('점 하나 = 한 바퀴',x1-100,yb+16);

    const ng=2.2, c0=299792458;
    const trt=L*1e-3*ng/c0;        // 초
    const frep=1/trt;
    $('r4').innerHTML=
      '<div>상태 <b style="color:'+rcol+'">'+regime+'</b> · 끝값 범위 '+fmt(mn,3)+' ~ '+fmt(mx,3)+'</div>'+
      '<div>한 바퀴 <b>'+fmt(trt*1e12,1)+' ps</b> → 타임스텝 속도 <b>'+fmt(frep/1e9,1)+' GHz</b> (n<sub>g</sub>=2.2 가정)</div><div>'+
      (nl4
        ? (g0<-1 ? '고리 위상 π + |g|&gt;1 → <b>주기 2D = '+(2*D)+'</b> 짜리 진동이 선다. 포화가 없으면 이 진동도 터진다'
               : 'χ² 포화가 걸려 있어 |g|를 올려도 <b>터지지 않고 ±1 사이에 갇힌다</b>')
        : '<span style="color:var(--wall)">비선형 OFF — |g|&gt;1이면 그냥 발산한다. 포화가 활성화 함수 노릇을 하는 이유</span>')+'</div>';
  }

  /* ── 합본용 등록 — 합본이 B 탭을 처음 열 때 init()을 부른다 ── */
  
  MOD.b={init(){
      if(done) return;        // 두 번 불러도 안전
      done=true;
      ROOT=document.getElementById('sec-b');
      ['c1n','c1r','c1l','c1i'].forEach(id=>$(id).addEventListener('input',r1));
      $('b1s').addEventListener('click',()=>{seed1=(seed1*31+17)%9973;r1();});
      $('b1f').addEventListener('click',()=>{train1=!train1;$('b1f').setAttribute('aria-pressed',String(train1));$('b1f').textContent='읽기층 학습 '+(train1?'ON':'OFF');r1();});
      ['c2i','c2th','c2rf','c2ta','c2nz'].forEach(id=>$(id).addEventListener('input',r2));
      ['c3n','c3m','c3b','c3f'].forEach(id=>$(id).addEventListener('input',r3));
      $('b3r').addEventListener('click',()=>{seed3=(seed3*41+7)%9973;r3();});
      ['c4g','c4d','c4u','c4L'].forEach(id=>$(id).addEventListener('input',r4));
      $('b4n').addEventListener('click',()=>{nl4=!nl4;$('b4n').setAttribute('aria-pressed',String(nl4));$('b4n').textContent='χ² 비선형 '+(nl4?'ON':'OFF');r4();});
      ROOT.querySelectorAll('[data-g]').forEach(b=>b.addEventListener('click',()=>{
        const gg=b.dataset.g;
        ROOT.querySelectorAll('[data-g="'+gg+'"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
        if(gg==='task'){task1=b.dataset.v;r1();} else {drv2=b.dataset.v;r2();}
      }));

      function showSec(n){
        for(let i=1;i<=5;i++) $('s'+i).hidden=(i!==n);
        ROOT.querySelectorAll('#b-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===n)));
      }
      ROOT.querySelectorAll('#b-tabs button').forEach(b=>b.addEventListener('click',()=>{
        showSec(+b.dataset.s);
        ROOT.scrollIntoView({block:'start',behavior:'smooth'});
      }));
      showSec(1);
      r1();r2();r3();r4();
    }};
})();


}
};
