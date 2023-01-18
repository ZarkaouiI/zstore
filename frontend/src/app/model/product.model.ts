export interface Product {
  id : string;
  name : string;
  description : string;
  price : number;
  isPromoted : boolean
}

export interface PageProduct{
  products : Product[],
  page : number,
  size : number,
  totalPages : number
}
