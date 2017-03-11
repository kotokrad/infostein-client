import React, { Component } from 'react';
import axios from 'axios';

import { endpoint } from '../App';
import './LinkPreview.css';

export default class LinkPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      date: '',
    }
  }

  componentWillMount() {
    const url = `${endpoint}/items`;
    axios.post(url, {
      links: [this.props.link],
    }).then(res => {
      const item = res.data[0];
      this.setState({
        status: item.status,
        title: item.title,
        date: item.date,
      });
    });
  }

  renderInfo() {
    return (
      this.state.status === 'ERROR' ?
        <dt>
          <b className="text-danger">Ошибка! Проверьте ссылку</b>
        </dt>:
        <dt>
          <b className="text-primary">{this.state.title}</b>
          <br/>
          <span className="small">{this.state.date}</span>
        </dt>
    );
  }

  render() {
    return (
      <dl className="link-preview">
        {this.renderInfo()}
        <dd>{this.props.link}</dd>
      </dl>
    );
  }
}
