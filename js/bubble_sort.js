let bubbleSort = (arr) => {
  for (let i = 0; i < arr.len; i++) {
    // for (let j = 0; j < arr.len-1-i; j++) {
    for (let j = 0; j < arr.len-1; j++) {
      arr.mark([j,j+1]);
      if (arr._array[j] > arr._array[j + 1]) {
        arr.mark([j,j+1],"active");
        arr.swap(j, j + 1);
      }
    }
  }
  arr.mark([]);
};

export default bubbleSort