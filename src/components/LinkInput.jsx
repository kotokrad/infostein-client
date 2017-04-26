import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  Button,
  InputGroup,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import axios from 'axios';
import classnames from 'classnames';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import { endpoint } from '../App';
import LinkPreviewList from './LinkPreviewList';
import './LinkInput.css';


export default class LinkInput extends Component {
  constructor(props) {
    super(props);
    console.log(process.env.NODE_ENV);
    this.state = {
      inputValue: '',
      links: [],
      hosts: [
        'sigmatv.com.ua',
        'www.mariupolskoe.tv',
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
    let link = this.state.inputValue;
    if (link[link.length - 1] === '/') {
      link = link.substr(0, link.length - 1)
    }
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
      const url = `${endpoint}/items`;
      axios.post(url, {
        links: this.state.links,
      }).then(res => {
        try {
          this.generateDocument(res.data.filter(item => item.status === 'OK'));
          this.setState({
            links: [],
          });
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

  generateDocument(items) {
    const templateURL = `${endpoint}/template.docx`;
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

  render() {
    const buttonClassName = classnames(
      'btn',
      { 'btn-success': !!this.getValidationState() }
    );
    const tooltip = (
      <Tooltip id="tooltip">Получить документ</Tooltip>
    );
    return (
      <div>
        <Form
          inline
          className="link-input col-md-6 col-md-offset-3"
          onSubmit={this.addLink.bind(this)}
        >
          <FormGroup role="form" validationState={this.getValidationState()}>
            <InputGroup>
              <FormControl
                onChange={this.handleInputChange.bind(this)}
                value={this.state.inputValue}
                type="text"
                placeholder="Добавьте ссылку и нажмите Enter"
                autoFocus
              ></FormControl>
              <InputGroup.Button>
                <Button
                  type="submit"
                  className={buttonClassName}
                  disabled={!this.getValidationState()}
                >
                  <Glyphicon glyph="plus" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
            {/* <FormControl.Feedback /> */}
          </FormGroup>
          {' '}
          <OverlayTrigger rootClose="true" placement="right" overlay={tooltip}>
            <Button
              onClick={this.getItems.bind(this)}
              className="btn-download btn btn-primary"
              disabled={!this.state.links.length}
              ><Glyphicon glyph="save"/>
            </Button>
          </OverlayTrigger>
        </Form>
        <LinkPreviewList links={this.state.links} />
      </div>
    );
  }
}
