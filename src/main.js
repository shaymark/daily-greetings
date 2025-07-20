import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

window.OneSignal = window.OneSignal || [];
OneSignal.push(function () {
  OneSignal.init({
    allowLocalhostAsSecureOrigin: true,
    appId: "cac1d3e5-aea5-476a-a35d-f3ab9a167f80",
    safari_web_id: "web.onesignal.auto.017f9378-7499-4b97-8d47-e55f2bb151c0",
    notifyButton: {
      enable: true,
    },
  });
});
