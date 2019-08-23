class VisualArray {
  constructor(array = [1, 2, 3, 4, 5, 6], pixi = null, app = null) {
    this._array = array;
    this.pixi = pixi;
    this.app = app;
    this._rects = null;

    this.currentAnimation = null;
    this._animationArray = [];

    this._animationValues = {
      i: -1,
      j: -1,
      animationPaused: true,
      animationSpeed: 5,
      animationTime: 0,


      // -1 -> animation end
      //  0 -> animation start
      //  1 -> going top and bottom
      //  2 -> going left and right
      //  3 -> going back bottom and top
      //  4 -> arr swap
      swapStage: -1,

      swapFirst: {
        x: 0,
        y: 0
      },
      swapSecond: {
        x: 0,
        y: 0
      },

      
      highlightDuration: 200,
    }


    this._rectProps = {
      n: this._array.length,
      width: 100,
      height: 50
    }

    this._props = {
      gap: 10,
      radius: Math.min(this._rectProps.width, this._rectProps.height) * 0.3,
      innerColor: 0xcccccc,
      outerColor: 0x333333,
      textColor: 0x000000,

      normalAlpha: .5,
      highlightedAlpha: .8,
      activeAlpha: 1
    }

    this._state = {
      hoveredIndex: -1
    }
    // if (this.constructor === VisualArray) {
    //   throw new TypeError('Abstract class "VisualArray" cannot be instantiated directly.');
    // }

    // if (this.render === undefined) {
    //   throw new TypeError('Classes extending the widget abstract class');
    // }
  }

  get props() {
    return this._props;
  }

  get hoveredIndex() {
    return this._state.hoveredIndex;
  }

  set hoveredIndex(index) {
    this._state.hoveredIndex = index;
  }

  get nodes() {
    return this._array.map((v, i) => {
      let x = 100 + i * (this._rectProps.width + this._props.gap);
      let y = 100;
      let width = this._rectProps.width;
      let height = this._rectProps.height;

      return {
        val: v,
        x,
        y,
        width,
        height,
        center: {
          x: width / 2,
          y: height / 2
        },
        isHovered: this._state.hoveredIndex == i
      }
    })
  }

  get len() {
    return this._array.length;
  }

  drawRect(graphics, r, i) {
    graphics.beginFill(this.props.innerColor);
    graphics.lineStyle(4, this.props.outerColor);
    graphics.drawRoundedRect(
      // r.x,
      // r.y,
      0,
      0,
      r.width,
      r.height,
      this.props.radius
    );
    graphics.alpha = this.props.normalAlpha;
    graphics.x = r.x;
    graphics.y = r.y;

    let text = new this.pixi.Text(r.val, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: this.props.textColor,
      align: 'right'
    });
    text.anchor.set(0.5, 0.5);
    text.position.set(r.center.x, r.center.y);

    graphics.addChild(text);

    graphics.endFill();
    this._rects.addChild(graphics);

    graphics.buttonMode = true;

    graphics.defaultCursor = 'pointer';

    graphics.interactive = true;
    graphics.hitArea = new this.pixi.Rectangle(
      // r.x,
      // r.y,
      0,
      0,
      r.width,
      r.height
    );

    return graphics;
  }

  drawRects() {
    this._rects = new this.pixi.Graphics();
    return this.nodes.map((r, i) => {
      let rectGraphics = new this.pixi.Graphics();

      let rect = this.drawRect(rectGraphics, r, i);

      rectGraphics.mouseover = () => {
        this.hoveredIndex = i;
        rectGraphics.alpha = 1;
      };

      rectGraphics.mouseout = () => {
        rectGraphics.alpha = this.props.normalAlpha;
      };

      this.app.stage.addChild(this._rects);

      return rect;
    })
  }

  swapAnimation1(i, j) {
    // console.log(this._rects.children[i].y, this._animationValues.swapSecond.y + this._rectProps.height + this._props.gap)
    if (this._rects.children[i].y < this._animationValues.swapSecond.y + this._rectProps.height + this._props.gap) {
      this._rects.children[i].y += this._animationValues.animationSpeed;
      this._rects.children[j].y -= this._animationValues.animationSpeed;
    } else {
      this._animationValues.swapStage++;
    }
  }

  swapAnimation2(i, j) {
    if (this._rects.children[i].x < this._animationValues.swapSecond.x) {
      this._rects.children[i].x += this._animationValues.animationSpeed * Math.log(j-i+1);
      this._rects.children[j].x -= this._animationValues.animationSpeed * Math.log(j-i+1);
    } else {
      this._rects.children[i].x = this._animationValues.swapSecond.x;
      this._rects.children[j].x = this._animationValues.swapFirst.x;
      this._animationValues.swapStage++;
    }
  }

  swapAnimation3(i, j) {
    if (this._rects.children[i].y > this._animationValues.swapFirst.y) {
      this._rects.children[i].y -= this._animationValues.animationSpeed;
      this._rects.children[j].y += this._animationValues.animationSpeed;
    } else {
      this._animationValues.swapStage++;
    }
  }

  drawSwap() {
    let i = this._animationValues.i;
    let j = this._animationValues.j;

    switch (this._animationValues.swapStage) {
      case -1:
        this._animationValues.i = this.currentAnimation.i;
        this._animationValues.j = this.currentAnimation.j;
        this._animationValues.swapStage = 0;
        break;
      case 0:
        this._animationValues.swapFirst.x = this._rects.children[i].x;
        this._animationValues.swapFirst.y = this._rects.children[i].y;
        this._animationValues.swapSecond.x = this._rects.children[j].x;
        this._animationValues.swapSecond.y = this._rects.children[j].y;
        this._animationValues.swapStage++;
        break;
      case 1:
        this.swapAnimation1(i, j);
        break;
      case 2:
        this.swapAnimation2(i, j);
        break;
      case 3:
        this.swapAnimation3(i, j);
        break;
      case 4:
        [this._rects.children[i], this._rects.children[j]] = [this._rects.children[j], this._rects.children[i]];
        this._animationValues.swapStage = -1;
        this.currentAnimation = null;
        break;
    }
  }

  swap(i, j) {
    if (i === j)
      return;

    [this._array[i], this._array[j]] = [this._array[j], this._array[i]];

    if (i < j)
      this._animationArray.unshift({
        type: "swap",
        i,
        j
      });
    else
      this._animationArray.unshift({
        type: "swap",
        j,
        i
      });
  }

                // highlight, active  
  mark(indices, markType="highlight") {
    this._animationArray.unshift({
      type: "mark",
      indices,
      markType
    });
  }

  drawMarked() {
    for (const rect of this._rects.children) {
      rect.alpha = this.props.normalAlpha;
    }

    for (const i of this.currentAnimation.indices) {
      if(this.currentAnimation.markType === "highlight")
        this._rects.children[i].alpha = this.props.highlightedAlpha;
      else if(this.currentAnimation.markType === "active")
      this._rects.children[i].alpha = this.props.activeAlpha;
    }

    this._animationValues.animationTime+=this._animationValues.animationSpeed;
    if(this._animationValues.animationTime >= this._animationValues.highlightDuration)
      this.currentAnimation = null;
  }

  draw() {
    if(this._animationValues.animationPaused)
      return;
    // console.log(this._animationArray.length)
    if (!this.currentAnimation) {
      this.currentAnimation = this._animationArray.pop();
      this._animationValues.animationTime = 0;
      return;
    }
    switch (this.currentAnimation.type) {
      case "swap":
        this.drawSwap();
        break;
      case "mark":
        this.drawMarked();
        break;
    }
  }
}

export default function (array, pixi, app) {
  return new VisualArray(array, pixi, app);
}