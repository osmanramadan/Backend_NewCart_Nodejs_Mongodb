import { product } from "../types/product";



const Pagination = (page: number, jsonArray: product[], itemsPerPage: number = 10):product[] => {
  try {
    const array:product[] = [];
    for (const item of jsonArray) {
      array.push(item);
    }

    const arraySize = array.length;
    let desiredPage = 0;

    if (page && page !== 0) {
      desiredPage = page - 1;
    }

    const firstElement = desiredPage * itemsPerPage;
    const lastElement = desiredPage * itemsPerPage + itemsPerPage;

    if (desiredPage === 0 || firstElement >= arraySize) {
      if (arraySize <= itemsPerPage) {
        return array;
      } else {
        return array.slice(0, itemsPerPage);
      }
    }

    return array.slice(firstElement, lastElement);
  } catch (error) {
    throw error;
  }
};

export default Pagination;
