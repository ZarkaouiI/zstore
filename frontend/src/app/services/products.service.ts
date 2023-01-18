import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../model/product.model";
import {UUID} from "angular2-uuid";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public products! : Array<Product>;

  constructor() {
    this.products = [
      {id : UUID.UUID(), name : "Bottle", description : "This is the description of this product", price : 34.5, isPromoted: false},
      {id : UUID.UUID(), name : "Key", description : "This is the description of this product", price : 3.00, isPromoted: true},
      {id : UUID.UUID(), name : "Keyboard", description : "This is the description of this product", price : 20.00, isPromoted: false},
      {id : UUID.UUID(), name : "Mug", description : "This is the description of this product", price : 17.5, isPromoted: true},
      {id : UUID.UUID(), name : "Mouse", description : "This is the description of this product", price : 11.00, isPromoted: true},
    ];

    for(let i=0; i<10; i++) {
      this.products.push({id : UUID.UUID(), name : "Charger", description : "This is the description of this product", price : 55.5, isPromoted: false});
      this.products.push({id : UUID.UUID(), name : "Shoes", description : "This is the description of this product", price : 17.00, isPromoted: true});
      this.products.push({id : UUID.UUID(), name : "Keyboard", description : "This is the description of this product", price : 20.00, isPromoted: false});
      this.products.push({id : UUID.UUID(), name : "Notebook", description : "This is the description of this product", price : 19.5, isPromoted: true});
      this.products.push({id : UUID.UUID(), name : "Pen", description : "This is the description of this product", price : 11.00, isPromoted: true});
    }
  }
  //Get all products :
  public getProducts() : Observable<Product[]> {
    let r = Math.random();
    if(r < 0.1) {
      return throwError(() => new Error("Something went wrong. Please try again!"));
    } else {
      return of(this.products);
    }
  }

  //Add new product :
  public addNewProduct(product : Product) : Observable<Product> {
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  //Pagination :
  public getPageProducts(page : number, size : number) : Observable<PageProduct> {
    let totalPages = ~~(this.products.length/size);
    let index = page*size;
    let productsPerPage = this.products.slice(index, index + size);

    if(this.products.length % 2 == 0) {
      //If we have an element alone :
      totalPages += 1;
    }

    return of({
      page: page, size : size, totalPages: totalPages, products : productsPerPage
    });
  }
  //End pagination ____________

  //Delete a product :
  public deleteProduct(id : string) : Observable<Product[]> {
    this.products = this.products.filter(p => p.id != id);
    return of(this.products);
    // let index = this.products.indexOf(p);
    // this.products.splice(index, 1);
  }

  //Handle promotion :
  public setPromotion(id : string) : Observable<boolean> {
    let [product] = this.products.filter(p => p.id == id);
    if(product != undefined) {
      product.isPromoted = !product.isPromoted;
      return of(true);
    } else
      return throwError(() => new Error("Product not found!"));
  }

  //Search product :
  public searchProduct(keyword : string, page : number, size : number) : Observable<PageProduct> {
    let foundProducts = this.products.filter(p => p.name.includes(keyword));
    let totalPages = ~~(foundProducts.length/size);
    let index = page*size;

    let productsPerPage = foundProducts.slice(index, index + size);

    if(this.products.length % 2 == 0) {
      //If we have an element alone :
      totalPages += 1;
    }
    return of({page: page, size: size, totalPages: totalPages, products: productsPerPage});
  }


  public getProductById(id : string) : Observable<Product> {
    let product = this.products.find(p => p.id === id);
    if(product) {
      return of(product);
    } else {
      return throwError(() => new Error("Product not found!"));
    }
  }

  updateProduct(product: Product) : Observable<Product> {
    this.products = this.products.map(p => (p.id == product.id) ? product : p);
    return of(product);
  }
}
