import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    expand(),
    visibility()
  ]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackResponse: Feedback;
  feedbackErrorMessage: string;
  contactType = ContactType;
  visibility = 'hidden';
  formVisibility = 'shown';
  sent = false;

  // Reset form back to pristine value
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': '',
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': 'First name must not be more than 50 characters long',
    },

    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name must not be more than 50 characters long',
    },

    'telnum': {
      'required': 'Telephone number is required',
      'pattern': 'Telephone number must contain only numbers'
    },

    'email': {
      'required': 'Email is required',
      'email': 'Email must have a valid format'
    }
  }

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],
      telnum: [
        0,
        [
          Validators.required,
          Validators.pattern
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      agree: false,
      contacttype: 'None',
      message: '',
    });

    this.feedbackForm.valueChanges
      .subscribe(data => {
        this.onValueChange(data);
      });

    this.onValueChange(); //(re)set form validation messages
  }

  onValueChange(data?: any){
    /* If form hasn't been created */
    if (!this.feedbackForm){
      return;
    }

    const form = this.feedbackForm;
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
    this.sent = true;
    this.feedback = this.feedbackForm.value;

    this.feedbackService.postFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedbackResponse = feedback;
        console.log(feedback);
      }, errorMessage => {
        this.feedbackErrorMessage = <any>errorMessage;
      })

    
    // Reset form to normal state removing all the inputs
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackFormDirective.resetForm();
    this.visibility = 'shown';
    this.formVisibility = 'hidden';

    setTimeout(() => {
      this.feedbackResponse = null;
      this.sent = false;
      this.visibility = 'hidden';
      this.formVisibility = 'shown';
    }, 5000)
  }
}
