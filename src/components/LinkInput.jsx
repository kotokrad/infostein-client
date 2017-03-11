import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import LinkPreview from './LinkPreview';
import './LinkInput.css';

export default class LinkInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      links: [],
      hosts: [
        'sigmatv.com.ua',
        'mariupolskoe.tv',
      ],
    };
  }

  handleInputChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }

  addLink(e) {
    e.preventDefault();
    const links = this.state.links;
    const link = this.state.inputValue;
    const parser = document.createElement('a');
    const local = document.createElement('a');
    parser.href = this.state.inputValue;
    local.href = "";
    if (this.state.hosts.includes(parser.host) && !links.includes(link)) {
      this.setState({
        links: links.concat(link),
      });
    }
    this.setState({
      inputValue: '',
    });
  }

  getItems() {
    if (this.state.links.length) {
      const url = 'https://lit-refuge-84110.herokuapp.com/items'
      axios.post(url, {
        links: this.state.links,
      }).then(res => {
        this.generateDocument(res.data);
        this.setState({
          links: [],
        })
      });
    }
  }

  generateDocument(items) {
    const templateURL = 'https://lit-refuge-84110.herokuapp.com/template.docx';
    JSZipUtils.getBinaryContent(templateURL, (error, content) => {
      if (error) {
        throw error;
      }
      const zip = new JSZip(content);
      const doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        items,
      });

      try {
        doc.render();
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        throw error;
      }
      const output = doc.getZip().generate({
          type:"blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const fileName = `${items[0].channel}, ${items[0].program}, ${items[0].time.replace(':', '.')} ${items[0].date}.docx`;
      FileSaver.saveAs(output, fileName);
    });
  }

  getValidationState() {
    // eslint-disable-next-line
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const value = this.state.inputValue
    if (value && urlRegex.test(value)) {
      return 'success';
    }
  }

  renderLinkPreviews() {
    return this.state.links.map((link, i) => (
      <LinkPreview key={link.substr(link.lastIndexOf('/'))} link={link} />
    ));
  }

  render() {
    return (
      <div className="link-input col-md-6 col-md-offset-3">
        <form onSubmit={this.addLink.bind(this)}>
          <FormGroup role="form" validationState={this.getValidationState()}>
            <FormControl
              onChange={this.handleInputChange.bind(this)}
              value={this.state.inputValue}
              type="text"
              className="form-control"
              placeholder="Добавьте ссылку и нажмите Enter"
              autoFocus
            ></FormControl>
            <FormControl.Feedback />
          </FormGroup>
          {this.renderLinkPreviews()}
        </form>
        <Button onClick={this.getItems.bind(this)} className="btn btn-large btn-primary">Получить документ</Button>
      </div>
    );
  }
}
