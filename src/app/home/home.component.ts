import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionsService } from '../services/promotions.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrorMessage: string;
  leaderErrorMessage: string;
  promotionErrorMessage: string;

  constructor(private dishService: DishService,
    private promotionsService: PromotionsService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe((dish) => {
      this.dish = dish
    }, errorMessage => {
      this.dishErrorMessage = <any>errorMessage;
      //console.log(this.dishErrorMessage)
    })

    this.promotionsService.getFeaturedPromotion().subscribe((promotion) => {
      this.promotion = promotion;
    }, errorMessage => {
      this.promotionErrorMessage = <any>errorMessage;
    });
    
    this.leaderService.getFeaturedLeader().subscribe((leader) => {
      this.leader = leader;
    }, errorMessage => {
      this.leaderErrorMessage = <any>errorMessage;
    });
  }

}
