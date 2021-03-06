import React, { Component } from "react";
import browser from "webextension-polyfill";
import generateLangOptions from "src/common/generateLangOptions";
import openUrl from "src/common/openUrl";
import "../styles/Footer.scss";
import { generateTranslateLinkUrl } from "src/common/translateService";

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.langList = generateLangOptions();
  }

  handleLinkClick = async () => {
    const { tabUrl, targetLang } = this.props;
    const encodedUrl = encodeURIComponent(tabUrl);
    const translateUrl = generateTranslateLinkUrl(targetLang, encodedUrl);
    openUrl(translateUrl);
  };

  handleChange = e => {
    const lang = e.target.value;
    this.props.handleLangChange(lang);
  };

  render() {
    const { tabUrl, targetLang } = this.props;

    return (
      <div id="footer">
        <div className="translateLink">
          {tabUrl && <a onClick={this.handleLinkClick}>{browser.i18n.getMessage("showLink")}</a>}
        </div>
        <div className="selectWrap">
          <select
            id="langList"
            value={targetLang}
            onChange={this.handleChange}
            title={browser.i18n.getMessage("targetLangLabel")}
          >
            {this.langList.map(option => (
              <option value={option.value} key={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
