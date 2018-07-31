import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-spinner/paper-spinner.js';

/**
 * `submit-an-idea-ui`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SubmitAnIdeaUi extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: center;
        }
        paper-input, paper-button {
          width: 100%;
          padding: 15px 0px 15px 0px;
        }

        paper-button {
          text-align: center;
        }

        paper-button.custom:hover {
          background-color: var(--paper-light-blue-50);
        }

        paper-item {
          justify-content: center;
        }

        paper-spinner {
          padding: 0;
          max-width: 0;
          max-height: 0;
        }
        
        paper-spinner.active {
          max-width: initial;
          max-height: initial;
          height: 15px;
          width: 15px;
          margin: 0px 0px 0px -15px
        }
        </style>
        <paper-input 
          always-float-label
          label="Your Email Address"
          id="submitEmail"
          required
          auto-validate
          error-message="Please enter your email in case we would like to contact you!"
          on-keydown="_checkForEnter"></paper-input>
        <paper-input 
          always-float-label
          label="Submit Idea or game"
          id="submitIdea"
          required
          auto-validate
          error-message="Please enter an idea or game you would like to see implemented"
          on-keydown="_checkForEnter"></paper-input>
        <paper-button toggles raised class="custom" on-tap="_invokeApi"><paper-spinner id="spinner" active=[[active]]></paper-spinner>Submit</paper-button>
        <paper-item>[[display]]</paper-item>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      display: {
        type: String
      }
    };
  }

  _checkForEnter(key) {
    if (key.keyCode === 13) {
      this._invokeApi();
    }
  }

  _invokeApi() {
    this.display = "";
    const submitEmailValidate = this.$.submitEmail.validate();
    const submitIdeaValidate = this.$.submitIdea.validate();
    if(submitEmailValidate
        && submitIdeaValidate){
      this.$.spinner.active = true;
      this.$.spinner.classList.add('active');

      var url = 'https://xupmhdl2g5.execute-api.us-east-1.amazonaws.com/api/submit-an-idea-api';
      var data = {idea: this.$.submitIdea.value, email: this.$.submitEmail.value};
      let err = false;

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => {
        this.$.spinner.active = false;
        this.$.spinner.classList.remove('active');
        console.error('Error:', error);
        this.display = 'There was an error processing your request. Please try again later.';
        err = true;
      })
      .then(response => {
        if(err){
          return;
        }
        this.display = response.message;
        this.$.spinner.active = false;
        this.$.spinner.classList.remove('active');
      });
    }
  }
}

window.customElements.define('submit-an-idea-ui', SubmitAnIdeaUi);
