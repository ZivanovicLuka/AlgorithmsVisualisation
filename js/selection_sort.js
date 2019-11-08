"use strict";

let selectionSort = (arr) => {
  for (let i = 0; i < arr.len; i++) {
    let min = i;
    for (let j = i + 1; j < arr.len; j++) {
      arr.mark([i,j]);
      if (arr._array[j] < arr._array[min]) {
        min = j;
      }
    }

    if (min !== i) {
      arr.mark([i,min],"active");
      arr.swap(i, min);
    }
  }
  arr.mark([]);
};

export default selectionSort