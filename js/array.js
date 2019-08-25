class VisualArray {
  constructor(array = [1, 2, 3, 4, 5, 6], pixi = null, app = null) {
    this._array = array;
    this.pixi = pixi;
    this.app = app;
    this._rects = null;

    this.currentAnimation = null;
    this._animationArray = [];

    this.editMode = true;

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

    this._layoutProps = {
      x: (window.innerWidth - (this._rectProps.n * this._rectProps.width) - (this._rectProps.n * this.props.gap)) / 2,
      y: (window.innerHeight - this._rectProps.height) / 2
    }

    this.addNode = null;

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

  generateNodePosition(i) {
    let x = this._layoutProps.x + i * (this._rectProps.width + this._props.gap);
    let y = this._layoutProps.y;
    return {
      x,
      y
    }
  }

  repositionateNodes() {
    this._rects.children.forEach((node, i) => {
      node._customIndex = i;

      let {
        x,
        y
      } = this.generateNodePosition(i);
      node.x = x;
      node.y = y;
    })

    let {
      x,
      y
    } = this.generateNodePosition(this._rects.children.length);
    this.addNode.x = x;
    this.addNode.y = y;
  }

  generateNode(v, i) {
    let {
      x,
      y
    } = this.generateNodePosition(i);
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
      }
    }
  }

  get nodes() {
    return this._array.map((v, i) => {
      return this.generateNode(v, i)
    })
  }

  get len() {
    return this._array.length;
  }

  set animationSpeed(val) {
    this._animationValues.animationSpeed = val;
  }

  getRect(i) {
    return this._rects.children[i].children[0];
  }

  getNode(i) {
    return this._rects.children[i];
  }

  addDelete(node, i) {
    let deleteGraphics = new this.pixi.Graphics();
    deleteGraphics.beginFill(0xBB0000);
    deleteGraphics.alpha = this.props.normalAlpha;
    deleteGraphics.lineStyle(1, this.props.outerColor);
    deleteGraphics.x = node.width - 5;
    deleteGraphics.drawCircle(
      0,
      0,
      10,
    );

    deleteGraphics.endFill();

    deleteGraphics.buttonMode = true;

    deleteGraphics.defaultCursor = 'pointer';

    deleteGraphics.interactive = true;
    deleteGraphics.hitArea = new this.pixi.Circle(
      0,
      0,
      10,
    );
    

    let text = new this.pixi.Text(
      '-', {
        fontFamily: 'Arial',
        fontSize: 25,
        fill: 0x999999,
        align: 'center'
      });
    text.anchor.set(0.5, 0.5);
    text.position.set(0,-2);
    deleteGraphics.addChild(text);

    node.addChild(deleteGraphics);

    deleteGraphics.click = () => {
      if (!this.editMode)
        return;

      let index = deleteGraphics.parent._customIndex;

      this._array.splice(index, 1);
      deleteGraphics.parent.destroy();

      this.repositionateNodes();
    };

    return deleteGraphics;
  }

  drawRect(r, color = null) {
    let graphics = new this.pixi.Graphics();
    graphics.beginFill(color ? color : this.props.innerColor);
    graphics.lineStyle(4, this.props.outerColor);
    graphics.drawRoundedRect(
      0,
      0,
      r.width,
      r.height,
      this.props.radius
    );
    graphics.alpha = this.props.normalAlpha;
    // graphics.x = r.x;
    // graphics.y = r.y;
    graphics.endFill();

    graphics.buttonMode = true;

    graphics.defaultCursor = 'pointer';

    graphics.interactive = true;
    graphics.hitArea = new this.pixi.Rectangle(
      0,
      0,
      r.width,
      r.height
    );

    let text = new this.pixi.Text(r.val, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: this.props.textColor,
      align: 'right'
    });
    text.anchor.set(0.5, 0.5);
    text.position.set(r.center.x, r.center.y);

    graphics.addChild(text);



    return graphics;
  }

  createNode(rect, r) {
    let nodeGraphics = new this.pixi.Graphics();

    nodeGraphics.x = r.x;
    nodeGraphics.y = r.y;
    nodeGraphics.addChild(rect);

    return nodeGraphics;
  }

  _addHoverEvent(graphics, mode = "normal") {
    graphics.mouseover = () => {
      if (mode == "edit" && !this.editMode)
        return;
      graphics.alpha = 1;
    };

    graphics.mouseout = () => {
      if (mode == "edit" && !this.editMode)
        return;
      graphics.alpha = this.props.normalAlpha;
    };
  }

  drawRects() {
    this._rects = new this.pixi.Graphics();
    let rects = this.nodes.map((r, i) => {

      let rect = this.drawRect(r);
      this._addHoverEvent(rect);

      let node = this.createNode(rect, r);
      node._customIndex = i;
      let deleteNode = this.addDelete(node, i);
      this._addHoverEvent(deleteNode);

      this._rects.addChild(node);

      return node;
    })
    this.app.stage.addChild(this._rects);


    // TODO -> add node for adding new element

    let addR = this.generateNode('+', this._rects.children.length);
    let addRect = this.drawRect(addR, 0x22ED34);
    this.addNode = this.createNode(addRect, addR);

    if (!this.editMode)
      addRect.alpha = 0

    this._addHoverEvent(addRect, "edit");

    this.app.stage.addChild(this.addNode);

    return rects;
  }

  swapAnimation1(i, j) {
    if (this.getNode(i).y < this._animationValues.swapSecond.y + this._rectProps.height + this._props.gap) {
      this.getNode(i).y += this._animationValues.animationSpeed;
      this.getNode(j).y -= this._animationValues.animationSpeed;
    } else {
      this.getNode(i).y = this._animationValues.swapSecond.y + this._rectProps.height + this._props.gap;
      this.getNode(j).y = this._animationValues.swapSecond.y - this._rectProps.height - this._props.gap;
      this._animationValues.swapStage++;
    }
  }

  swapAnimation2(i, j) {
    if (this.getNode(i).x < this._animationValues.swapSecond.x) {
      this.getNode(i).x += this._animationValues.animationSpeed * Math.log(j - i + 1);
      this.getNode(j).x -= this._animationValues.animationSpeed * Math.log(j - i + 1);
    } else {
      this.getNode(i).x = this._animationValues.swapSecond.x;
      this.getNode(j).x = this._animationValues.swapFirst.x;
      this._animationValues.swapStage++;
    }
  }

  swapAnimation3(i, j) {
    if (this.getNode(i).y > this._animationValues.swapFirst.y) {
      this.getNode(i).y -= this._animationValues.animationSpeed;
      this.getNode(j).y += this._animationValues.animationSpeed;
    } else {
      this.getNode(i).y = this._animationValues.swapFirst.y;
      this.getNode(j).y = this._animationValues.swapSecond.y;
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
        this._animationValues.swapFirst.x = this.getNode(i).x;
        this._animationValues.swapFirst.y = this.getNode(i).y;
        this._animationValues.swapSecond.x = this.getNode(j).x;
        this._animationValues.swapSecond.y = this.getNode(j).y;
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
        // [this.getRect(i), this.getRect(j)] =
        // [this.getRect(j), this.getRect(i)];
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
  mark(indices = [], markType = "highlight", all = false) {
    this._animationArray.unshift({
      type: "mark",
      indices,
      markType,
      all
    });
  }

  drawMarked() {
    for (const rect of this._rects.children) {
      rect.children[0].alpha = this.props.normalAlpha;
    }

    if (this.currentAnimation.all === true) {
      this.currentAnimation.indices = []
      for (let i = 0; i < this.len; i++)
        this.currentAnimation.indices.push(i);
    }

    for (const item of this.currentAnimation.indices) {
      if (this.currentAnimation.markType === "highlight")
        this.getRect(item).alpha = this.props.highlightedAlpha;
      else if (this.currentAnimation.markType === "active")
        this.getRect(item).alpha = this.props.activeAlpha;
      else if (this.currentAnimation.markType === "mixed") {
        if (item.markType === "highlight") {
          this.getRect(item.index).alpha = this.props.highlightedAlpha;
        } else if (item.markType === "active") {
          this.getRect(item.index).alpha = this.props.activeAlpha;
        }
      }
    }

    this._animationValues.animationTime += this._animationValues.animationSpeed;
    if (this._animationValues.animationTime >= this._animationValues.highlightDuration)
      this.currentAnimation = null;
  }

  _shuffle() {
    for (let i = this.len - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let rects = this._rects.children;

      [rects[i].x, rects[j].x] = [rects[j].x, rects[i].x];
      [rects[i].y, rects[j].y] = [rects[j].y, rects[i].y];

      [rects[i], rects[j]] = [rects[j], rects[i]];
      [this._array[i], this._array[j]] = [this._array[j], this._array[i]];
    }
  }

  shuffle() {
    for (let i = this.len - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let rects = this._rects.children;

      [rects[i].x, rects[j].x] = [rects[j].x, rects[i].x];
      [rects[i].y, rects[j].y] = [rects[j].y, rects[i].y];

      [rects[i], rects[j]] = [rects[j], rects[i]];
      [this._array[i], this._array[j]] = [this._array[j], this._array[i]];
    }
  }

  draw() {
    if (this._animationValues.animationPaused)
      return;

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