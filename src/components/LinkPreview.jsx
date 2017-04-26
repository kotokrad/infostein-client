import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import { endpoint } from '../App';

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
      console.log(item);
      this.setState({
        status: item.status,
        title: item.title,
        date: item.date,
        body: item.body,
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
    const previewClassName = classnames({
      'preview': true,
      'active': this.props.isActive,
    });
    return (
      <dl
        className={previewClassName}
        onClick={() => this.props.onPreviewClick({
          name: this.props.name,
          text: this.state.body,
        })}
      >
        {this.renderInfo()}
        <dd>{this.props.link}</dd>
      </dl>
    );
  }
}
