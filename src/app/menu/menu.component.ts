import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})


export class MenuComponent implements OnInit {
  dishes: Dish [];
  selectedDish: Dish;

  constructor(private dishService: DishService) { }

  /* getDishes method will always resolve so we can use just the .then for now */
  ngOnInit(): void {
    this.dishService.getDishes().then((dishes) => {
      this.dishes = dishes;
    });
  }

  onSelected(dish: Dish){
    this.selectedDish = dish;
  }

}
