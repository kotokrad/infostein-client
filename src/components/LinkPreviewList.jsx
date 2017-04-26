import React, { Component } from 'react';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import LinkPreview from './LinkPreview';
import './LinkPreviewList.css';

export default class LinkPreviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      active: '',
    }
  }

  onPreviewClick(data) {
    this.setState({
      active: data.name,
      text: data.text,
    });
  }

  renderPreviews() {
    return this.props.links.map((link, i) => {
      const name = link.substr(link.lastIndexOf('/') + 1);
      const isActive = this.state.active === name;
      return (
        <LinkPreview
          key={name}
          name={name}
          link={link}
          isActive={isActive}
          onPreviewClick={this.onPreviewClick.bind(this)}
        />
      )
    });
  }

  renderText() {
    return this.state.text.map((p, i) => (
      <ReactCSSTransitionGroup
        key={i}
        transitionName="paragraphs"
        transitionAppear="true"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {/* <img src={props.imageSrc} key={props.imageSrc} /> */}
        <p>{p.paragraph}</p>
      </ReactCSSTransitionGroup>
    ));
  }

  render() {
    const tableClassName = classnames(
      'link-preview-list',
      {
        'hidden': !this.props.links.length,
        'col-md-6 col-md-offset-3': !this.state.text.length,
        'table:': !!this.state.text.length,
      }
    );
    const textClassName = classnames(
      'preview-text', 'col-md-6',
      { 'hidden': !this.state.text.length }
    );
    return (
      <table className={tableClassName}>
        <tbody>
          <tr>
            <td className="preview-list col-md-6">
              {this.renderPreviews()}
            </td>
            <td className={textClassName}>
              {this.renderText()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
