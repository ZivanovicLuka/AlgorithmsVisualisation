class Modal {
  constructor(overlay) {
    this.overlay = overlay;
    const closeButton = overlay.find('.button-close');
    const btn1 = overlay.find('.button1');

    this.open = () => {
      this.overlay.removeClass('is-hidden');
    }

    this.close = () => {
      this.overlay.addClass('is-hidden');
    }

    closeButton.click(e => {
      this.close()
    })

    this.overlay.click(e => {
      if (!$(e.target).closest("#modal").length)
        this.close()
    })

    this.asignBtn1 = f => {
      btn1.click(f);
    }
  }

  get value() {
    return this.overlay.find('.modal-input').val();
  }
}

export default Modal