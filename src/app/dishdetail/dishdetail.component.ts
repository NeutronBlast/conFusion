import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

/* For form */
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  /* For form */
  commentForm: FormGroup;
  comment: Comment;

  // To reset form to pristine value
  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': "Author's name is required",
      'minlength': "Author's name cannot be shorter than 3 characters",
      'maxlength': "Author's name cannot be greater than 100 characters",
    },
    'rating': {
      'required': 'Rating is required',
    },
    'comment': {
      'required': 'Comment is required',
      'minlength': 'Comment cannot be shorter than 2 characters',
      'maxlength': 'Comment cannot be longer than 1000 characters'
    }
  }

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private dishService: DishService,
    private route: ActivatedRoute, 
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit(): void {
    /* Get all dish Ids */
    this.dishService.getDishIds()
      .subscribe((dishIds) => {
        this.dishIds = dishIds;
      });
    
    /* Fetches the ID from the parameter */
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];

  }

  goBack(): void{
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      rating:[
        5,
        [
          Validators.required,
        ]
      ],
      comment:[
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(1000)
        ]
      ]
    });

    this.commentForm.valueChanges
      .subscribe(data => {
        this.onValueChange(data);
      });

    this.onValueChange(); //(re)set form validation messages
  }

  onValueChange(data?: any){
    /* If form hasn't been created */
    if (!this.commentForm){
      return;
    }

    const form = this.commentForm;
    for (const field in this.formErrors){
      if (this.formErrors.hasOwnProperty(field)){
        // clear previous error message if any
        this.formErrors[field] = '';
        const control = form.get(field);

        // if field is modified by user
        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];

          // check if i'm adding the error message to the field
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = new Comment();
    this.comment.author = this.commentForm.value.author;
    this.comment.rating = this.commentForm.value.rating;
    this.comment.comment = this.commentForm.value.comment;
    this.comment.date = new Date().toISOString();

    this.dish.comments.push(this.comment);
    
    // Reset form to normal state removing all the inputs
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm();
  }
}
