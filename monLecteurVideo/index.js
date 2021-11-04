import "./lib/webaudio-controls.js";

const getBaseURL = () => {
  return new URL(".", import.meta.url);
};

let style = `
body {  background-color: black; color: #ffffe0; font-family: Arial, sans-serif; }
video {
  border: 1px solid black;
  padding: 0; margin: 0;
  width: 550px;
  background-color: black;
  margin: auto;
  float: center;
}
div video {
    display: block;
    margin-bottom:10px;
  }
  
  .eq {
    margin: 32px;
    border:1px solid;
    border-radius:15px;
    background-color:lightGrey;
    padding:10px;
    width:320px;
    box-shadow: 10px 10px 5px grey;
    text-align:center;
    font-family: "Open Sans";
    font-size: 12px;
  }
  .controls {
    background-color: #eedfbb;
    width: 250px;
    margin: auto;
    float: center;

  }
  
  div.controls:hover {
    color:blue;
    font-weight:bold;
  }
  div.controls label {
    display: inline-block;
    text-align: center;
    width: 50px;
  }
  
  div.controls label, div.controls input, output {
      vertical-align: middle;
      padding: 0;
      margin: 0;
     font-family: "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
    font-size: 12px;
  }
   
  html,
  body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 50vh;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #000;
  }
  
  .glow-on-hover {
      width: 220px;
      height: 50px;
      border: none;
      outline: none;
      color: #fff;
      background: #111;
      cursor: pointer;
      position: relative;
      z-index: 0;
      border-radius: 10px;
  }
  
  .glow-on-hover:before {
      content: '';
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
      position: absolute;
      top: -2px;
      left:-2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      animation: glowing 20s linear infinite;
      opacity: 0;
      transition: opacity .3s ease-in-out;
      border-radius: 10px;
  }
  
  .glow-on-hover:active {
      color: #000
  }
  
  .glow-on-hover:active:after {
      background: transparent;
  }
  
  .glow-on-hover:hover:before {
      opacity: 1;
  }
  
  .glow-on-hover:after {

      z-index: -1;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: #111;
      left: 0;
      top: 0;
      border-radius: 10px;
  }
  
  @keyframes glowing {
      0% { background-position: 0 0; }
      50% { background-position: 400% 0; }
      100% { background-position: 0 0; }
  }
  
  .wrapper {
    text-align: center; 
    margin-top : 1%
}
`;
let template = /*html*/ `

  <div class="wrapper">
  <video id="player"  crossorigin="anonymous"  >
      <br>
  </video>
  <br>
  <button id="play" class="glow-on-hover" type="button">Play</button>
  <button id="pause" class="glow-on-hover" type="button">Pause</button>
  <button id="reset" class="glow-on-hover" type="button">Reset</button>
  <br>
  <button id="SlowDown" class="glow-on-hover" type="button">Speed (slower)</button>
  <button id="SpeedNormal" class="glow-on-hover" type="button">Speed (normal)</button>
  <button id="SpeedUp" class="glow-on-hover" type="button">Speed (faster)</button>
  <br>
  <button id="back4s" class="glow-on-hover" type="button">Time -4s</button>
  <button id="advance4s" class="glow-on-hover" type="button">Time +4s</button>
  <button id="SwitchVideo" class="glow-on-hover" type="button" >Switch video</button>
  <br>
  <webaudio-knob id="volume" min=0 max=1 value=0.5 step="0.01" 
         tooltip="%s" diameter="100" src="./assets/vintage.png" sprites="100"></webaudio-knob>  
         <div class="controls">
         <label>60Hz</label>
         <input type="range" id="range1" value="0" step="1" min="-30" max="30"></input>
       <output id="gain1">0 dB</output>
       </div>
       <div class="controls">
         <label>170Hz</label>
         <input type="range" id="range2" value="0" step="1" min="-30" max="30"></input>
     <output id="gain2">0 dB</output>
       </div>
       <div class="controls">
         <label>350Hz</label>
         <input type="range" id="range3" value="0" step="1" min="-30" max="30"></input>
     <output id="gain3">0 dB</output>
       </div>
       <div class="controls">
         <label>1000Hz</label>
         <input type="range" id="range4" value="0" step="1" min="-30" max="30"></input>
     <output id="gain4">0 dB</output>
       </div>
       <div class="controls">
         <label>3500Hz</label>
         <input type="range" id="range5" value="0" step="1" min="-30" max="30"></input>
     <output id="gain5">0 dB</output>
       </div>
       <div class="controls">
         <label>10000Hz</label>
         <input type="range" id="range6" value="0" step="1" min="-30" max="30"></input>
     <output id="gain6">0 dB</output>
       </div>
     </div>
     </div>
   `;

class MyVideoPlayer extends HTMLElement {
  count = 1;
  videos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ];

  constructor() {
    super();
    console.log("BaseURL = " + getBaseURL());
    this.attachShadow({ mode: "open" });
  }

  fixRelativeURLs() {
    // pour les knobs
    let knobs = this.shadowRoot.querySelectorAll(
      "webaudio-knob, webaudio-switch, webaudio-slider"
    );
    knobs.forEach((e) => {
      let path = e.getAttribute("src");
      e.src = getBaseURL() + "/" + path;
    });
  }

  switchVideo(n) {
    if (n >= this.videos.length) {
      n = 0;
      this.count = 0;
    }
    this.mediaElement.setAttribute("src", this.videos[n]);
    this.mediaElement.setAttribute("crossorigin", "anonymous");
    this.play();
  }

  connectedCallback() {
    // Appelée avant affichage du composant
    //this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;

    this.fixRelativeURLs();

    this.player = this.shadowRoot.querySelector("#player");
    // récupération de l'attribut HTML
    this.player.src = this.getAttribute("src");

    // déclarer les écouteurs sur les boutons

    this.filters = [];
    this.definitEqualizer();
    this.definitEcouteurs();
  }

  changeGain(nbFilter, sliderVal) {
    this.value = parseFloat(sliderVal);
    this.filters[nbFilter - 1].gain.value = this.value;

    // update output labels
    this.output = this.shadowRoot.querySelector("#gain" + nbFilter);
    this.output.value = this.value + " dB";
  }

  definitEqualizer() {
    //new equalizer instance
    this.ctx = window.AudioContext || window.webkitAudioContext;
    this.context = new this.ctx();

    this.mediaElement = this.shadowRoot.getElementById("player");
    this.sourceNode = this.context.createMediaElementSource(this.mediaElement);

    this.mediaElement.onplay = function () {
      this.play();
    };
    [60, 170, 350, 1000, 3500, 10000].forEach(function (freq, i) {
      var eq = this.context.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    }, this);
    // Connect filters in serie
    this.sourceNode.connect(this.filters[0]);
    for (var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }
    console.log("INFO : " + this.context.destination);
    // connect the last filter to the speakers*/
    this.filters[this.filters.length - 1].connect(this.context.destination);
  }

  definitEcouteurs() {
    console.log("ecouteurs définis");
    this.shadowRoot.querySelector("#play").onclick = () => {
      this.play();
    };
    this.shadowRoot.querySelector("#pause").onclick = () => {
      this.pause();
    };
    this.shadowRoot.querySelector("#advance4s").onclick = () => {
      this.mediaElement.currentTime += 4;
    };
    this.shadowRoot.querySelector("#back4s").onclick = () => {
      this.mediaElement.currentTime -= 4;
    };
    this.shadowRoot.querySelector("#reset").onclick = () => {
      this.mediaElement.currentTime = 0;
      this.mediaElement.playbackRate = 1;
    };
    this.shadowRoot.querySelector("#SwitchVideo").onclick = () => {
      this.switchVideo(this.count);
      this.count++;
    };
    this.shadowRoot.querySelector("#SpeedUp").onclick = () => {
      this.mediaElement.playbackRate += 0.2;
    };
    this.shadowRoot.querySelector("#SpeedNormal").onclick = () => {
      this.mediaElement.playbackRate = 1;
    };
    this.shadowRoot.querySelector("#SlowDown").onclick = () => {
      this.mediaElement.playbackRate -= 0.2;
    };
    this.shadowRoot.querySelector("#volume").oninput = (event) => {
      const vol = parseFloat(event.target.value);
      this.player.volume = vol;
    };
    // To improve
    let i = 1;
    while (i < this.filters.length) {
      this.OninputListener(i);
      i++;
    }
  }

  OninputListener(i) {
    this.shadowRoot.querySelector("#range" + i).oninput = (event) => {
      this.changeGain(i, parseFloat(event.target.value));
    };
  }
  // API de mon composant
  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }
}

customElements.define("my-player", MyVideoPlayer);
