import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import config from '../config.json';
import LinkInput from './components/LinkInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="container">
          <LinkInput />
          <div className="App-description col-md-8 col-md-offset-2">
            <p>
              Приложение разрабатывается для личного использования и автоматизации работы.
              Основная задача и возможность - парсинг сайтов с новостными сюжетами и генерация docx документа с полученными данными, приведёнными к единому стандарту, включая исправление типичных ошибок, изменение структуры текста.
              Присутствует предпросмотр текста сюжета (клик на превью документа).<br />
              <br />
              При добавлении валидной ссылки на превью появляется заголовок и дата сюжета. Произойти это может не сразу, т.к. серверу heroku требуется несколько секунд, чтобы проснуться.<br />
              <br />
              На данный момент поддерживаются два сайта. Ссылки для теста:<br />
            </p>
            <ul>
              <li>http://www.mariupolskoe.tv/news/news-story/rabota-kontaktno-kommunikatsionnogo-tsentra-2/</li>
              <li>http://www.mariupolskoe.tv/news/news-story/v-mariupole-poyavilas-alleya-sakury/</li>
              <li>http://sigmatv.com.ua/news/view/20027</li>
              <li>http://sigmatv.com.ua/news/view/21011</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
export const endpoint = process.env.NODE_ENV === 'development' ?
  config.endpointDev : config.endpointProd;
