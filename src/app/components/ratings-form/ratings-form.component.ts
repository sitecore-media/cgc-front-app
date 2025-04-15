// // ratings-form.component.ts
// import { Component, Input, OnInit } from '@angular/core';
// import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
// import { FormStateService } from 'src/services/form-state.service';
// import { HttpClient } from '@angular/common/http';
// import { ButtonFormField, FormTracker } from '@sitecore-jss/sitecore-jss-forms';

// @Component({
//   selector: 'app-ratings-form',
//   templateUrl: './ratings-form.component.html',
//   styleUrls: ['./ratings-form.component.css']
// })
// export class RatingsFormComponent implements OnInit {
//   @Input() rendering!: ComponentRendering;
//   @Input() fields: any[];
//   //Label for the form
//   titleLable: string = Array.isArray(this.rendering?.fields?.fields) ? (this.rendering.fields.fields[0] as any)?.model.text : '';
//   field: ButtonFormField;
//   tracker = new FormTracker({ endpoint: '/api/sitecore/Forms/TrackEvent' });
//   isCollapsed = false;
//   isNoSelected = false;

//   constructor(
//     public formState: FormStateService,
//     private http: HttpClient,

//   ) { }

//   ngOnInit(): void {
//     this.formState.resetFieldsState();
//     console.log(this.field);
//   }

//   toggleCollapse(option: 'yes' | 'no') {
//     this.isCollapsed = true;
//     this.isNoSelected = option === 'no';
//   }

//   closeCollapse() {
//     this.isCollapsed = false;
//     this.formState.resetFieldsState();
//   }

//   onSubmit() {
//     if (this.formState.state.errors.length === 0) {
//       const formData = {
//         FormSessionId: (this.rendering?.fields?.formSessionId as any)?.value,
//         FormItemId: (this.rendering.fields.formItemId as any)?.value,
//         PageItemId: (this.rendering.fields.pageItemId as any)?.value,
//         __RequestVerificationToken: (this.rendering.fields.antiForgeryToken as any)?.value,
//         Fields: this.getFieldValues()
//       };

//       this.http.post('https://cd.mom.dev/api/sitecore/FormSubmission/SubmitFormDetails', formData).subscribe({
//         next: () => this.handleSuccess(),
//         error: (error) => this.handleError(error)
//       });
//     }
//   }

//   private getFieldValues() {
//     return Object.keys(this.formState.state)
//       .filter(key => !['errors', 'nextForm', 'submitButton'].includes(key))
//       .map(key => ({
//         FieldId: key,
//         Value: this.formState.state[key].value,
//         FormFieldName: this.getFieldName(key),
//         Type: this.getFieldType(key)
//       }));
//   }

//   private getFieldName(fieldId: string): string {
//     const field = this.fields.find(f => f.model.itemId === fieldId);
//     return field?.model.name || '';
//   }

//   private getFieldType(fieldId: string): string {
//     const field = this.fields.find(f => f.model.itemId === fieldId);
//     return field?.model.fieldTypeItemId || '';
//   }

//   private handleSuccess() {
//     this.closeCollapse();
//     // Add success notification
//   }

//   private handleError(error: any) {
//     console.error('Form submission error:', error);
//     this.formState.setState({ errors: ['Submission failed. Please try again.'] });
//   }
// }

import { Component, OnInit, Input } from "@angular/core";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  ButtonFormField,
  FormTracker,
  ListFieldItem,
  ListViewModel,
  MultiLineStringInputViewModel,
  ValueFormField,
} from "@sitecore-jss/sitecore-jss-forms";
import { FormStateService } from "../../../../src/services/form-state.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JssContextService } from "../../jss-context.service";

@Component({
  selector: "app-ratings-form",
  templateUrl: "./ratings-form.component.html",
  styleUrls: ["./ratings-form.component.css"],
})
export class RatingsFormComponent implements OnInit {
  @Input() rendering!: ComponentRendering; // Input from Sitecore JSS
  isCollapsed: boolean = false;
  isNoSelected: boolean = false;
  fieldTest: ButtonFormField[] = [];
  questionField: any = null;
  field: any = null;
  secondField: any = null;
  group: FormGroup | null = null;
  titleLabel: string = "";
  secondTitleLabel: string = "";
  questionTitleLabel: string = "";

  //button code To be removed
  buttonRemovedField: ButtonFormField;
  buttonRemovedTitle: string = "";
  // button submit code
  buttonSubmitField: ButtonFormField;
  buttonSubmitTitle: string = "";

  //Checkbox List code
  checkBoxField: ValueFormField<ListViewModel>;
  checkBoxFieldList: ListFieldItem[] = [];
  checkBoxNoField: ValueFormField<ListViewModel>;
  checkBoxNoFieldList: ListFieldItem[] = [];
  value: string[] = [];
  valueNo: string[] = [];
  tracker: FormTracker;
  formState: FormStateService;
  public Items: ListFieldItem[];
  //TextArea code
  textAreaField: ValueFormField<MultiLineStringInputViewModel>;
  //current language
  currentLanguage: string = "";
  currentWordYes: string = "";
  currentWordNo: string = "";
  viewTextArea: boolean = false;
  pageUniqueItemId:string="";
  ratingFormShow:boolean=true;
  constructor(
    private formStateService: FormStateService,
    private fb: FormBuilder,
    private http: HttpClient,
    private jssService: JssContextService
  ) {
    this.formState = this.formStateService;
    // this.initializeForm();
  }

  ngOnInit(): void {
    this.pageUniqueItemId=this.jssService.stateValue.sitecore.route.itemId;
    this.ratingFormShow=localStorage.getItem(this.pageUniqueItemId) !=null ? false:true;
    //
    this.currentLanguage =
      this.jssService.stateValue.language.toLowerCase() === "ar-sa"
        ? "ar-sa"
        : "en";
    this.checkBoxField = (this.rendering?.fields?.fields as any[])?.[3] || null;
    this.checkBoxFieldList = this.checkBoxField?.model?.items || [];
    this.questionLable();
    this.yesButtonClicked();
    this.noButtonClicked();
    this.initializeCheckboxList();
    this.initializeNoCheckboxList();
    this.initializeTextArea();
    this.removeButtonClicked();
    this.submitButtonClicked();
    this.initForm();
    this.updateDocumentAttributes();
  }

  questionLable() {
    if (
      this.rendering?.fields?.fields &&
      Array.isArray(this.rendering.fields.fields)
    ) {
      // Access the second object in the array (index 1 because arrays start from 0)
      this.questionField = this.rendering.fields.fields[0] as any;
      this.questionTitleLabel = this.questionField?.model?.text || "Submit";
    }
  }

  removeButtonClicked() {
    if (
      this.rendering?.fields?.fields &&
      Array.isArray(this.rendering.fields.fields)
    ) {
      // Access the Remove object in the array (index 7 because arrays start from 0)
      this.buttonRemovedField = this.rendering.fields
        .fields[7] as unknown as ButtonFormField;

      if (this.buttonRemovedField && this.buttonRemovedField.buttonField) {
      } else {
        console.warn("No buttonField found in the second object");
      }
    } else {
      console.warn("No fields found in rendering object");
    }

    this.buttonRemovedTitle = this.buttonRemovedField?.model?.title || "Submit";
  }

  submitButtonClicked() {
    if (
      this.rendering?.fields?.fields &&
      Array.isArray(this.rendering.fields.fields)
    ) {
      // Access the Remove object in the array (index 7 because arrays start from 0)
      this.buttonSubmitField = this.rendering.fields
        .fields[6] as unknown as ButtonFormField;

      if (this.buttonSubmitField && this.buttonSubmitField.buttonField) {
      } else {
        console.warn("No buttonField found in the second object");
      }
    } else {
      console.warn("No fields found in rendering object");
    }

    this.buttonSubmitTitle = this.buttonSubmitField?.model?.title || "Submit";
  }

  yesButtonClicked() {
    if (
      this.rendering?.fields?.fields &&
      Array.isArray(this.rendering.fields.fields)
    ) {
      // Extract button field
      this.field =
        this.rendering.fields.fields.find((field: any) => field?.buttonField) ||
        null;

      // Extract label/title
      this.titleLabel = this.field?.model?.title || "Submit";

    } else {
      console.warn("No fields found in rendering object");
    }
  }

  noButtonClicked() {
    if (
      this.rendering?.fields?.fields &&
      Array.isArray(this.rendering.fields.fields)
    ) {
      // Access the second object in the array (index 1 because arrays start from 0)
      this.secondField = this.rendering.fields.fields[2] as any;

      if (this.secondField && this.secondField.buttonField) {
      } else {
        console.warn("No buttonField found in the second object");
      }
    } else {
      console.warn("No fields found in rendering object");
    }

    this.secondTitleLabel = this.secondField?.model?.title || "Submit";
  }

  checkListForYes() {
    // Ensure 'rendering.fields.fields' exists and has at least 4 elements
    if (!this.rendering?.fields?.fields) {
      console.error(
        "Invalid fields structure:",
        this.rendering?.fields?.fields
      );
      this.Items = [];
      return;
    }

    // Access the third index (fourth item) safely
    const fieldsArray = this.rendering.fields.fields as any[];
    const fieldObject = fieldsArray[3] as ValueFormField<ListViewModel>;

    // Ensure fieldObject has a valid model and items array
    if (!fieldObject?.model?.items || !Array.isArray(fieldObject.model.items)) {
      console.error("Invalid field model or items:", fieldObject);
      this.Items = [];
      return;
    }

    // Extract the items array
    this.Items = fieldObject.model.items;

    // Get selected values
    this.value = this.Items.filter((i) => i.selected).map((i) => i.value);

  }

  initializeCheckboxList(): void {
    // Ensure rendering.fields.fields exists and has elements
    if (
      !this.rendering?.fields?.fields ||
      !Array.isArray(this.rendering.fields.fields)
    ) {
      console.error(
        "Invalid fields structure:",
        this.rendering?.fields?.fields
      );
      return;
    }

    // Access the checkbox field (in your case, the fourth item at index 3)
    const fieldsArray = this.rendering.fields.fields;
    if (fieldsArray.length <= 3) {
      console.error("Field at index 3 does not exist");
      return;
    }

    // The entire field at index 3 is already a ValueFormField<ListViewModel>
    this.checkBoxField =
      fieldsArray[3] as unknown as ValueFormField<ListViewModel>;

    // Now you can access the items through checkboxField.model.items
    this.checkBoxFieldList = this.checkBoxField.model.items as ListFieldItem[];

    // Initialize value array with already selected items
    this.value = this.checkBoxFieldList
      .filter((item) => item.selected)
      .map((item) => item.value);


  }

  initializeNoCheckboxList(): void {
    // Ensure rendering.fields.fields exists and has elements
    if (
      !this.rendering?.fields?.fields ||
      !Array.isArray(this.rendering.fields.fields)
    ) {
      console.error(
        "Invalid fields structure:",
        this.rendering?.fields?.fields
      );
      return;
    }

    // Access the checkbox field (in your case, the fourth item at index 3)
    const fieldsArray = this.rendering.fields.fields;
    if (fieldsArray.length <= 4) {
      console.error("Field at index 4 does not exist");
      return;
    }

    // The entire field at index 4 is already a ValueFormField<ListViewModel>
    this.checkBoxNoField =
      fieldsArray[4] as unknown as ValueFormField<ListViewModel>;

    // Now you can access the items through checkboxField.model.items
    this.checkBoxNoFieldList = this.checkBoxNoField.model
      .items as ListFieldItem[];

    // Initialize value array with already selected items
    this.valueNo = this.checkBoxNoFieldList
      .filter((item) => item.selected)
      .map((item) => item.value);

  }

  onChangeCheckBoxListForYes(_$event: any): void {
    let valid = true;
    const errorMessages = [];

    if (_$event.target.checked) {
      this.value.push(_$event.target.value);
    } else {
      this.value.filter((v) => v !== _$event.target.value);
    }

    if (this.checkBoxField.model.required && !this.value.length) {
      valid = false;
      errorMessages.push(`${this.checkBoxField.model.title} is required`);
    }

    this.formState.setFieldState(
      this.checkBoxField.valueField.name,
      _$event.target.value,
      valid,
      errorMessages
    );
  }

  onFocusCheckBoxListForYes(_$event: any): void {
    this.tracker.onFocusField(
      this.checkBoxField,
      <string>this.checkBoxField.model.value
    );
  }

  onBlurCheckBoxListForYes(_$event: any): void {
    this.tracker.onBlurField(
      this.checkBoxField,
      <string>this.checkBoxField.model.value
    );
  }

  onChangeCheckBoxListForNo(_$event: any): void {
    let valid = true;
    const errorMessages = [];

    if (_$event.target.checked) {
      this.value.push(_$event.target.value);
    } else {
      this.value.filter((v) => v !== _$event.target.value);
    }

    if (this.checkBoxNoField.model.required && !this.value.length) {
      valid = false;
      errorMessages.push(`${this.checkBoxNoField.model.title} is required`);
    }

    this.formState.setFieldState(
      this.checkBoxNoField.valueField.name,
      _$event.target.value,
      valid,
      errorMessages
    );
  }

  onFocusCheckBoxListForNo(_$event: any): void {
    this.tracker.onFocusField(
      this.checkBoxNoField,
      <string>this.checkBoxNoField.model.value
    );
  }

  onBlurCheckBoxListForNo(_$event: any): void {
    this.tracker.onBlurField(
      this.checkBoxNoField,
      <string>this.checkBoxNoField.model.value
    );
  }

  // toggleCollapse(option: string) {
  //   this.isCollapsed = true;
  //   this.isNoSelected = option === "no";

  //   console.log("isNoSelected:", this.isNoSelected);
  //   console.log("checkBoxField:", this.checkBoxField);
  //   console.log("checkBoxField.model:", this.checkBoxField?.model);
  //   console.log("checkBoxFieldList:", this.checkBoxFieldList);
  //   /// ---- console Object In Form ---- ///
  //   console.log("isNoSelected:", this.isNoSelected);
  //   // this.userRating = option;
  //   // this.selectedReasons = []; // Reset reasons when changing rating
  //   // this.userComment = ''; // Reset comment
  //   // this.cd.detectChanges(); // Force update
  //   /// ---- console Object In Form With FieldID---- ///

  //   // this.feedbackForm.patchValue({
  //   //   isUseful: response
  //   // });

  //   // // Reset previously selected reasons when toggling
  //   // this.selectedReasons = [];

  //   // console.log('User selected:', response);
  //   // console.log('Form state after selection:', this.feedbackForm.value);
  // }

  // closeCollapse() {
  //   this.isCollapsed = false;
  //   //------------ console object on form ------------//
  //   // this.resetForm();
  // }

  clickmethod() {
  }

  //TextArea code
  initializeTextArea(): void {
    // Ensure rendering.fields.fields exists and has elements
    if (
      !this.rendering?.fields?.fields ||
      !Array.isArray(this.rendering.fields.fields)
    ) {
      console.error(
        "Invalid fields structure:",
        this.rendering?.fields?.fields
      );
      return;
    }

    // Access the textarea field (in your case, the fifth item at index 4)
    const fieldsArray = this.rendering.fields.fields;
    if (fieldsArray.length <= 5) {
      console.error("Field at index 5 does not exist");
      return;
    }

    // The entire field at index 5 is already a ValueFormField<MultiLineStringInputViewModel>
    this.textAreaField =
      fieldsArray[5] as unknown as ValueFormField<MultiLineStringInputViewModel>;

  }

  onChangeTextArea(_$event: any): void {
    let valid = true;
    const errorMessages = [];

    // custom client validation logic here
    if (this.textAreaField.model.required && !_$event.target.value) {
      valid = false;
      errorMessages.push(`${this.textAreaField.model.title} is required`);
    }

    this.formState.setFieldState(
      this.textAreaField.valueField.name,
      _$event.target.value,
      valid,
      errorMessages
    );
  }

  onFocusTextArea(_$event: any): void {
    this.tracker.onFocusField(
      this.textAreaField,
      <string>this.textAreaField.model.value
    );
  }

  onBlurTextArea(_$event: any): void {
    this.tracker.onBlurField(
      this.textAreaField,
      <string>this.textAreaField.model.value
    );
  }

  ///////////// Console Object In Form  This is Console From   ////////////////////
  // ratingForm: FormGroup;
  // userRating: string = '';
  // selectedReasons: string[] = [];
  // userComment: string = '';

  // initializeForm(): void {
  //   this.ratingForm = this.fb.group({
  //     rating: [''],
  //     reasons: this.fb.array([]),
  //     comment: ['']
  //   });
  // }

  // resetForm() {
  //   this.userRating = '';
  //   this.selectedReasons = [];
  //   this.userComment = '';
  // }

  // onCheckboxChange(event: any, reason: string) {
  //   if (event.target.checked) {
  //     this.selectedReasons.push(reason);
  //   } else {
  //     const index = this.selectedReasons.indexOf(reason);
  //     if (index !== -1) {
  //       this.selectedReasons.splice(index, 1);
  //     }
  //   }
  // }

  // updateComment(event: any) {
  //   this.userComment = event.target.value;
  // }

  // submitForm() {
  //   // Create the form data object
  //   const formData = {
  //     rating: this.userRating,
  //     reasons: this.selectedReasons,
  //     comment: this.userComment
  //   };

  //   // API URL
  //   const apiUrl = 'https://cd.mom.dev/api/ratings/get-page-views?pageId={BAE9DE15-BEC9-458D-A355-4D073F9FC94A}';

  //   // Make the POST request
  //   this.http.post(apiUrl, formData).subscribe({
  //     next: (response) => {
  //       console.log('Form successfully submitted:', response);
  //       // Optionally, display success message to the user
  //       alert('Form submitted successfully!');
  //       this.closeCollapse(); // Reset and close the form
  //     },
  //     error: (error) => {
  //       console.error('Error submitting form:', error);
  //       // Optionally, display error message to the user
  //       alert('Failed to submit form. Please try again.');
  //     }
  //   });

  //       // Log the form data to console
  //       console.log('Form submitted with data:', formData);

  //       // Reset and close form
  //       this.closeCollapse();
  // }

  /////////////////////////////////////Console form please about using field ID//////////////////////////////////////////////////////////////////////

  feedbackForm: FormGroup;
  selectedReasons: string[] = [];

  currentSelectedOption: "yes" | "no" | null = null;

  // Constants for form submission - Yes button - IsUseful
  private readonly YES_FORM_ID = "{81692002-0AEB-49C2-B4A3-AB7F9ED3D03A}";
  private readonly YES_FIELD_ID = "{73FFF2A2-0FC5-439C-9B13-C4ABFC4D4D79}";
  private readonly YES_FIELD_NAME = "btn-yes";
  private readonly YES_FIELD_TYPE = "{7CE25CAB-EF3A-4F73-AB13-D33BDC1E4EE2}";

  // Constants for form submission - No button - NotUseful
  private readonly NO_FORM_ID = "{81692002-0AEB-49C2-B4A3-AB7F9ED3D03A}";
  private readonly NO_FIELD_ID = "{df80a557-074d-4793-abdc-bb2b7a3fc07e}";
  private readonly NO_FIELD_NAME = "btn-No";
  private readonly NO_FIELD_TYPE = "{7CE25CAB-EF3A-4F73-AB13-D33BDC1E4EE2}";

  // Constants for reasons - Yes - PositiveReasons
  private readonly YES_REASONS_FIELD_ID =
    "{6594cbcf-4a43-485d-8784-c96d04487b72}";
  private readonly YES_REASONS_FIELD_NAME = "chkList-yes";
  private readonly YES_REASONS_FIELD_TYPE =
    "{D86A361A-D4FF-46B2-9E97-A37FC5B1FE1A}";

  // Constants for reasons - No - NegativeReasons
  private readonly NO_REASONS_FIELD_ID =
    "{fac10389-2664-43d7-8143-066c9c1f58c5}";
  private readonly NO_REASONS_FIELD_NAME = "chkList-No";
  private readonly NO_REASONS_FIELD_TYPE =
    "{D86A361A-D4FF-46B2-9E97-A37FC5B1FE1A}";

  // Constants for comment - Comment
  private readonly COMMENT_FIELD_ID = "{93fdea4a-6b6c-458d-b7ae-90e7f12c547c}";
  private readonly COMMENT_FIELD_NAME = "txt-other";
  private readonly COMMENT_FIELD_TYPE =
    "{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}";

  // API endpoint
  private readonly API_ENDPOINT = "https://cd.mom.dev/api/forms/submit";

  private updateDocumentAttributes(): void {
    const currentWordYes = this.currentLanguage === "ar-sa" ? "نعم" : "Yes";
    const currentWordNo = this.currentLanguage === "ar-sa" ? "لا" : "No";
    this.currentWordYes = currentWordYes;
    this.currentWordNo = currentWordNo;
  }

  initForm(): void {
    this.feedbackForm = this.fb.group({
      isUseful: [""],
      comment: [""],
    });
  }

  toggleCollapse(response: string): void {
    // If clicking the same option again, do nothing
    if (this.currentSelectedOption === response) return;

    // Update current selected option
    this.currentSelectedOption = response as "yes" | "no";

    this.isCollapsed = true;
    this.isNoSelected = response === "no";
    this.feedbackForm.patchValue({
      isUseful: response,
    });

    // Reset previously selected reasons when toggling
    this.selectedReasons = [];


  }

  closeCollapse(): void {
    this.isCollapsed = false;

    // Reset selected option
    this.currentSelectedOption = null;

    this.selectedReasons = [];
    this.feedbackForm.patchValue({
      comment: "",
      isUseful: "",
    });

    
  }

  onCheckboxChange(event: any, reason3: any): void {

    let reason = reason3.value;
    if (event.target.checked) {
      if (this.selectedReasons.length < 2) {
        if (reason3.itemId.includes("{94E83C35-F675-42C0-B0B5-67800EB30004}") || reason3.itemId.includes("{3D28BF94-ADAF-40B6-8FD9-80AA15D9B93D}")) {
          this.viewTextArea = true;
        }
        this.selectedReasons.push(reason);
      } else {
        event.target.checked = false;
        return;
      }
    } else {
      const index = this.selectedReasons.indexOf(reason);
      if (index > -1) {
        this.selectedReasons.splice(index, 1);
        if (reason3.itemId.includes("{94E83C35-F675-42C0-B0B5-67800EB30004}") || reason3.itemId.includes("{3D28BF94-ADAF-40B6-8FD9-80AA15D9B93D}")) {
          this.viewTextArea = false;
        }
      }
    }

    // const reasonType = this.isNoSelected ? "negative" : "positive";
    // console.log(`Selected ${reasonType} reasons:`, this.selectedReasons);
  }

  updateComment(event: any): void {
    this.feedbackForm.patchValue({
      comment: event.target.value,
    });
  }

  submitForm(): void {
    if (this.selectedReasons.length === 0) {
      //alert("الرجاء اختيار سبب واحد على الأقل");
      this.openPopUp("الرجاء اختيار سبب واحد على الأقل");
      return;
    }

    const isUseful = this.feedbackForm.value.isUseful === "yes";
    const comment = this.feedbackForm.value.comment;

    // Prepare the form data structure based on user response
    const formData = {
      FormId: isUseful ? this.YES_FORM_ID : this.NO_FORM_ID,
      Fields: [
        {
          FieldId: isUseful ? this.YES_FIELD_ID : this.NO_FIELD_ID,
          Value: isUseful ? this.currentWordYes : this.currentWordNo,
          FormFieldName: isUseful ? this.YES_FIELD_NAME : this.NO_FIELD_NAME,
          Type: isUseful ? this.YES_FIELD_TYPE : this.NO_FIELD_TYPE,
        },
        {
          FieldId: isUseful
            ? this.YES_REASONS_FIELD_ID
            : this.NO_REASONS_FIELD_ID,
          Value: this.selectedReasons.join(", "),
          FormFieldName: isUseful
            ? this.YES_REASONS_FIELD_NAME
            : this.NO_REASONS_FIELD_NAME,
          Type: isUseful
            ? this.YES_REASONS_FIELD_TYPE
            : this.NO_REASONS_FIELD_TYPE,
        }, {
          FieldId: "6594CBCF-4A43-485D-8784-C96D04487B71",
          Value: this.jssService.stateValue.sitecore.route.name,
          FormFieldName: "lbl-page",
          Type: ""
        }
      ],
    };

    // Add comment field if provided
    if (comment && comment.trim()) {
      formData.Fields.push({
        FieldId: this.COMMENT_FIELD_ID,
        Value: comment,
        FormFieldName: this.COMMENT_FIELD_NAME,
        Type: this.COMMENT_FIELD_TYPE,
      });
    }

    // console.table(formData.Fields);

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.http
      .post(this.API_ENDPOINT, JSON.stringify(formData), { headers })
      .subscribe(
        (response) => {
          // Parsing and displaying form fields
          const responseData = response as { Data?: { message?: string } };

          if (responseData.Data?.message) {
            try {
              // // Extract the JSON string part from the message
              // const dataString = responseData.Data.message.replace(
              //   "Form submitted successfully with data: ",
              //   ""
              // );

              // // Parse the JSON string into an array of form fields
              // const formFields = JSON.parse(dataString);

              // // Display form fields
              
              // formFields.forEach((field: any) => {
              //   console.log(`Field Name: ${field.FormFieldName}`);
              //   console.log(`Value: ${field.Value}`);
              //   console.log("---");
              // });
            } catch (error) {
              console.error("Error parsing form fields:", error);
            }
          }

          // Check language before showing the popup message
          const successMessage = this.currentLanguage === "ar-sa" ? "تم إرسال التعليق بنجاح!" : "Comment submitted successfully!";
          // Show success or error message based on the language
          this.openPopUp(successMessage, true);
          localStorage.setItem(this.pageUniqueItemId, 'Page is rated');
          this.closeCollapse()
        },
        (error) => {
          // Check language before showing the popup message
          const errorMessage = this.currentLanguage === "ar-sa" ? "حدث خطأ أثناء إرسال النموذج" : "An error occurred while submitting the form";
          console.error("Error submitting form", error);
          this.openPopUp(errorMessage, false);
        }
      );
  }

  isContactOpen = false;
  closePopUp() {
    this.isContactOpen = false;
    this.message = '';
  }
  isSuccess = false;
  message = '';
  openPopUp(message: string = ' ', isSuccess: boolean = false) {
    this.isContactOpen = true;
    this.isSuccess = isSuccess;
    this.message = message;
    setTimeout(() => {
      this.isContactOpen = false;
    }, 3000);
  }
}

// toggleCollapse(option: string) {
//   this.isCollapsed = true;
//   this.isNoSelected = option === "no";

//   // Reinitialize checkboxes when opening
//   if (!this.isNoSelected) {
//     this.initializeCheckboxList();
//   }
//   this.changeDetector.detectChanges();
// }

// onChange(event: Event): void {
//   const target = event.target as HTMLInputElement;
//   const value = target.value;

//   // Update selected values
//   this.value = target.checked
//     ? [...this.value, value]
//     : this.value.filter((v) => v !== value);

//   // Update form state
//   const isValid =
//     !this.checkBoxField?.model.required || this.value.length > 0;
//   const errors = isValid
//     ? []
//     : [`${this.checkBoxField?.model.title || "This field"} is required`];

//   if (this.checkBoxField) {
//     this.formState.setFieldState(
//       this.checkBoxField.valueField.name,
//       this.value, // Store array of selected values
//       isValid,
//       errors
//     );
//   }

//   // Update tracking
//   if (this.tracker && this.checkBoxField) {
//     this.tracker.onFocusField(this.checkBoxField, this.value);
//     this.tracker.onBlurField(this.checkBoxField, this.value);
//   }
// }

// initializeCheckboxList(): void {
//   try {
//     if (!this.rendering?.fields?.fields) {
//       throw new Error("Invalid fields data structure");
//     }

//     // Get the checkbox list field (index 3)
//     const checkboxField = (this.rendering.fields.fields as any[])[3];

//     // Validate field structure
//     if (!checkboxField?.model?.items) {
//       throw new Error("Checkbox list field missing required properties");
//     }

//     // Type assertion with proper validation
//     this.checkBoxField = checkboxField as ValueFormField<ListViewModel>;

//     // Map API response to ListFieldItem
//     this.checkBoxFieldList = this.checkBoxField.model.items.map((item) => ({
//       itemId: item.itemId || "",
//       selected: item.selected || false,
//       text: item.text || "",
//       value: item.value || String(item.value) || "",
//     }));

//     // Initialize selected values
//     this.value = this.checkBoxFieldList
//       .filter((item) => item.selected)
//       .map((item) => item.value);

//     console.log("Checkbox Data:", {
//       field: this.checkBoxField,
//       items: this.checkBoxFieldList,
//       selected: this.value,
//     });
//   } catch (error) {
//     console.error("Checkbox initialization error:", error);
//     this.checkBoxFieldList = [];
//     this.value = [];
//   }
// }
