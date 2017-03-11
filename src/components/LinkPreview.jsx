import React, { Component } from 'react';
import axios from 'axios';

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
    const url = 'https://lit-refuge-84110.herokuapp.com/items'
    axios.post(url, {
      links: [this.props.link],
    }).then(res => {
      const item = res.data[0];
      this.setState({
        title: item.title,
        date: item.date,
      });
    });
  }

  renderInfo() {
    return (
      <dt>
        <b>{this.state.title}</b><br/>
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
