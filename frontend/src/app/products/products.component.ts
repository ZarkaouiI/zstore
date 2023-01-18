import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../services/products.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products!: Array<Product>; // or : products : Array<any> | undefined;
  currentPage : number = 0;
  pageSize : number = 5;
  totalPages : number = 0;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  currentAction : string = 'all'; //For pagination in search mode and all mode


  constructor(private productsService : ProductsService, private formBuilder : FormBuilder, public authService : AuthenticationService, private router : Router) { }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control(null)
    });
    this.getPageProducts();
  }

  public getPageProducts() {
    this.productsService.getPageProducts(this.currentPage, this.pageSize).subscribe(
      {
        next : (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          // console.log([].constructor(this.totalPages));
        },
        error : (error) => {
          this.errorMessage = error;
        }
      }
    );
  }

  public getAllProducts() {
    this.productsService.getProducts().subscribe(
      {
        next : (data) => {
          this.products = data;
        },
        error : (error) => {
          this.errorMessage = error;
        }
      }
    );
  }


  public deleteProductHandler(p : Product) {
    let confirmDeletion = confirm("Are you sure you want to delete this product?");
    if(!confirmDeletion) return;
    this.productsService.deleteProduct(p.id).subscribe({
      next : (data) => {
        // this.products = data;
        let index = this.products.indexOf(p);
        this.products.splice(index, 1);
      },
      error : (error) => this.errorMessage = error
    });
  }

  public promotionHandler(p: Product) {
    let promotion = p.isPromoted;
    this.productsService.setPromotion(p.id).subscribe(
      {
        next: (data) => {
          p.isPromoted = !promotion;
        },
        error : (error) => this.errorMessage = error
      }
    );
  }

  public searchProductHandler() {
    this.currentAction = 'search';
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productsService.searchProduct(keyword, this.currentPage, this.pageSize).subscribe(
      {
        next: (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
        }
      }
    );
  }

  public goToPage(i: number) {
    this.currentPage = i;
    if(this.currentAction === "all")
      this.getPageProducts();
    else
      this.searchProductHandler();
  }

  editProductHandler(p: Product) {
    this.router.navigateByUrl("/admin/editProduct/" + p.id);
  }
}
