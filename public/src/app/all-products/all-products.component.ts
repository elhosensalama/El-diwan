import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../services/products.service';
import { productInterface } from '../product.interface';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  // All products
  products: productInterface[] = [];

  constructor(private service: ProductsService, private router: Router, private http: HttpClient) { }
  
  ngOnInit(): void {
    // get all products 
    this.products = this.service.getProducts();
    console.log(this.products);
  }

  // if we select product
  selectedProduct(productID: string){
    this.router.navigate(['/product', productID]);
  }
}
