function markElementsAndPivot(arr, i, j, pivot) {
  arr.mark([{
      index: i,
      markType: "highlight"
    },
    {
      index: j,
      markType: "highlight"
    },
    {
      index: pivot,
      markType: "active"
    }
  ], "mixed");
}

function partition(arr, left, right) {
  let pivotIndex = Math.floor((right + left) / 2);
  let pivot = arr._array[pivotIndex], //middle element
    i = left, //left pointer
    j = right; //right pointer
  while (i <= j) {
    markElementsAndPivot(arr, i, j, pivotIndex);
    while (arr._array[i] < pivot) {
      i++;
      markElementsAndPivot(arr, i, j, pivotIndex);
    }
    while (arr._array[j] > pivot) {
      j--;
      markElementsAndPivot(arr, i, j, pivotIndex);
    }
    if (i <= j) {
      arr.mark([{
          index: pivotIndex,
          markType: "highlight"
        },
        {
          index: i,
          markType: "active"
        },
        {
          index: j,
          markType: "active"
        }
      ], "mixed");
      arr.swap(i, j); //sawpping two elements
      i++;
      j--;
    }
  }
  arr.mark([],"highlight",true);
  return i;
}

function _quickSort(arr, left, right) {
  let index;
  if (arr.len > 1 && left < right) {
    index = partition(arr, left, right); //index returned from partition
    _quickSort(arr, left, index - 1);
    _quickSort(arr, index, right);
  }
  arr.mark([]);
  return arr;
}

function quickSort(arr) {
  _quickSort(arr, 0, arr.len - 1)
}

export default quickSort
// first call to quick sort
// let sortedArray = quickSort(items, 0, items.length - 1);
// console.log(sortedArray); //prints [2,3,5,6,7,9]