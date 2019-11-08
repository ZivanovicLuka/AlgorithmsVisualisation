"use strict";

class Modal {
  constructor(overlay) {
    this.overlay = overlay;

    this._closeButton = overlay.find('.button-close');
    this._modalInput = overlay.find('.modal-input').focus();
    this._btn1 = overlay.find('.button1');
    this._title = overlay.find('h2');

    this._btn1Assigned = false;
    this._enterAssigned = false;

    this.open = () => {
      this.overlay.removeClass('is-hidden');
      this._modalInput.focus();
    }

    this.cleanInput = () => {
      this._modalInput.val('');
    }

    this.close = () => {
      this.cleanInput();
      this.overlay.addClass('is-hidden');
    }

    this._closeButton.click(e => {
      this.close()
    })

    this.overlay.click(e => {
      if (!$(e.target).closest("#modal").length)
        this.close()
    })

    this.asignEnter = (f, close = true) => {
      if (!this._enterAssigned) {
        this._modalInput.keypress(function (e) {
          if (e.which == 13) {
            f();
            if(close)
              this.close();
          }
        }.bind(this));
        this._enterAssigned = true;
      }
    }

    this.asignBtn1 = (f, close = true) => {
      if (!this._btn1Assigned) {
        this._btn1.click(f);
        if(close)
          this._btn1.click(this.close);
        this.btn1Assigned = true;
      }
    }
  }

  get value() {
    return this.overlay.find('.modal-input').val();
  }

  title(text) {
    this._title.text(text);
  }
}

export default Modal