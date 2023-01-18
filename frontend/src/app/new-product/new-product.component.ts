import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Product} from "../model/product.model";
import {ProductsService} from "../services/products.service";
import {UUID} from "angular2-uuid";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  newProductFormGroup! : FormGroup;

  constructor(private productService : ProductsService, private formBuilder : FormBuilder, private router : Router) { }

  ngOnInit(): void {
    this.newProductFormGroup = this.formBuilder.group({
      name : this.formBuilder.control(null, [Validators.required, Validators.minLength(4)]),
      description : this.formBuilder.control(null, [Validators.required, Validators.minLength(4)]),
      price : this.formBuilder.control(null, [Validators.required, Validators.min(0)]),
      isPromoted : this.formBuilder.control(false, [Validators.required])
    });
  }

  addNewProductHandler() {
    // console.log(this.newProductFormGroup.value);

    let product = this.newProductFormGroup.value;
    this.productService.addNewProduct(product).subscribe({
      next : (data) => {
        alert("Product has been added successfully");
        this.newProductFormGroup.reset();
        this.router.navigateByUrl("/admin/products");
      },
      error : (error) => {
        console.log(error);
      }
    })
  }

  public getErrorMessage(fieldName: string, error : ValidationErrors) {
    console.log(error);
    let errorMessage = "";
    if(error['required']){
      errorMessage = fieldName + " is required";
      return errorMessage;
    }
    return errorMessage;
  }
}
