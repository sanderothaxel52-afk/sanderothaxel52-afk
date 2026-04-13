const aiPool = [
  {name:"GPT Core", power:2, income:20, rarity:"Common"},
  {name:"VisionNet", power:3, income:35, rarity:"Uncommon"},
  {name:"Alpha Strategist", power:5, income:60, rarity:"Rare"},
  {name:"Quantum Mind", power:8, income:120, rarity:"Epic"},
  {name:"AGI Prototype", power:12, income:250, rarity:"Legendary"}
];

let state = {
  cash:500,
  heat:0,
  baseLevel:1,
  powerCap:5,
  ais:[]
};

function randomAI(){ return aiPool[Math.floor(Math.random()*aiPool.length)]; }

function render(){
  cashDisplay.textContent = "$"+state.cash;
  heatDisplay.textContent = state.heat;
  ownedDisplay.textContent = state.ais.length;
  powerDisplay.textContent = state.ais.reduce((a,b)=>a+b.power,0)+" / "+state.powerCap;
  baseLevelDisplay.textContent = state.baseLevel;

  baseList.innerHTML = "";
  state.ais.forEach(ai=>{
    let div=document.createElement("div"); div.className="item";
    div.textContent = ai.name+" (+$"+ai.income+"/day)";
    baseList.appendChild(div);
  });
}

function generateMarket(){
  marketList.innerHTML="";
  for(let i=0;i<3;i++){
    let ai=randomAI();
    let price=ai.income*5;
    let div=document.createElement("div"); div.className="item";
    div.innerHTML = ai.name+" - $"+price+" <button>Buy</button>";
    div.querySelector("button").onclick=()=>{
      let usedPower = state.ais.reduce((a,b)=>a+b.power,0);
      if(state.cash>=price && usedPower+ai.power<=state.powerCap){
        state.cash-=price; state.ais.push(ai); render();
      }
    };
    marketList.appendChild(div);
  }
}

function tick(){
  let income = state.ais.reduce((a,b)=>a+b.income,0);
  state.cash+=income;
  state.heat+=Math.floor(state.ais.length/2);
  log("Earned $"+income);
  if(state.heat>50){ log("⚠️ Enforcement raid! Lost an AI"); state.ais.pop(); state.heat=20; }
  render();
}

function raid(){
  if(Math.random()<0.5){
    let ai=randomAI();
    state.ais.push(ai);
    log("Stole "+ai.name);
  } else {
    state.heat+=10;
    log("Raid failed. Heat increased.");
  }
  render();
}

function upgradeBase(){
  let cost = state.baseLevel*300;
  if(state.cash>=cost){
    state.cash-=cost;
    state.baseLevel++;
    state.powerCap+=5;
    log("Base upgraded");
    render();
  }
}

function log(msg){
  let div=document.createElement("div");
  div.textContent=msg;
  eventLog.prepend(div);
}

tickBtn.onclick=tick;
raidBtn.onclick=raid;
upgradeBaseBtn.onclick=upgradeBase;
rerollBtn.onclick=generateMarket;

render(); generateMarket();