import { Component, OnInit } from '@angular/core';
import {Product} from "../model/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsService} from "../services/products.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId! : string;
  product! : Product;
  editProductFormGroup! : FormGroup;

  constructor(private route : ActivatedRoute, private productService : ProductsService, private formBuilder : FormBuilder, private router : Router) {
    this.productId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe({
      next : (data) => {
        this.product = data; //we get the product :
        this.editProductFormGroup = this.formBuilder.group({
          name : this.formBuilder.control(this.product.name, [Validators.required, Validators.minLength(4)]),
          description : this.formBuilder.control(this.product.description, [Validators.required, Validators.minLength(4)]),
          price : this.formBuilder.control(this.product.price, [Validators.required, Validators.min(0)]),
          isPromoted : this.formBuilder.control(this.product.isPromoted, [Validators.required])
        });
      },
      error : (error) => console.log(error)
    });
  }

  updateProductHandler() {
    let currentProduct = this.editProductFormGroup.value;
    currentProduct.id = this.product.id;
    this.productService.updateProduct(currentProduct).subscribe({
      next : (data) => {
        alert("The product has been updated Successfully");
        this.router.navigateByUrl("/admin/products");
      },
      error : (error) => console.log(error)
    });
  }
}
