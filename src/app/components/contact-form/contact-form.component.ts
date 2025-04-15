import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { environment } from '../../../environments/environment';
import { JssContextService } from "../../jss-context.service";
import { dictionaryServiceFactory } from "../../lib/dictionary-service-factory";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  dynamicForm!: FormGroup;
  fieldsData: any[] = [];  // Store backend response
  base64String: string | null = null;
  selectedFile: File | null = null;
  fileName: string;
  messageSuccessfully: string = "";
  messageError: string = "";
  fieldsRequired: string = "";
  dictionary = dictionaryServiceFactory.create();
  btnsubmit: string = "Submit";
  messageSizeFileAndExtension: string = "";
  MessageMaxSizeFile: string = "";
  MessageExtensionFile: string = "";
  SelectedFile: string = "";

  constructor(
    private http: HttpClient,
    private jssService: JssContextService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeFieldsData();
    this.createForm();

    console.log("Dynamic Form:", this.dynamicForm);
    //get dictoniay 
    this.dictionary
    .fetchDictionaryData(this.jssService.stateValue.language)
    .then((data:any) => {
      console.log("Dictionary Data Images:", data);
      this.fieldsRequired = data.FieldsRequired;
      console.log("this.fieldsRequired=",this.fieldsRequired);
      this.messageError = data.MessageError;
      console.log("this.MessageError=",this.messageError);
      this.messageSuccessfully = data.MessageSuccessfully;
      console.log("this.MessageSuccessfully=",this.messageSuccessfully);
      this.messageSizeFileAndExtension = data.MessageSizeFileAndExtension;
      console.log("this.MessageSizeFileAndExtension=",this.messageSizeFileAndExtension);
      this.MessageMaxSizeFile = data.MessageMaxSizeFile;
      console.log("this.MessageMaxSizeFile=",this.MessageMaxSizeFile);
      this.MessageExtensionFile = data.MessageExtensionFile;
      console.log("this.MessageExtensionFile=",this.MessageExtensionFile);
      this.SelectedFile = data.SelectedFile;
      console.log("this.SelectedFile=",this.SelectedFile);
     
      
    });

  }

  private initializeFieldsData(): void {
    this.fieldsData = this.rendering?.fields?.fields as any[] || [];
    console.log("Fields Data:", this.fieldsData);
  }
  private createForm(): void {
    this.dynamicForm = this.fb.group({}); // Initialize the FormGroup

    this.fieldsData.forEach((field) => {
      const { name, value = '', required, validationDataModels } = field.model;
      const validators = [];

      let regexPattern: RegExp | null = null;

      if (validationDataModels) {
        try {
          if (Array.isArray(validationDataModels)) {
            validationDataModels.forEach((validation) => {
              if (validation.modelType.includes('RegularExpressionValidation')) {
                const params = JSON.parse(validation.parameters);
                if (params.regularExpression) {
                  validators.push(Validators.pattern(params.regularExpression));
                }
              }
            });
          } else if (validationDataModels.parameters) {
            const parsedParams = JSON.parse(validationDataModels.parameters);
            if (parsedParams.regularExpression) {
              regexPattern = new RegExp(parsedParams.regularExpression);
            }
          }
        } catch (error) {
          console.error('Error parsing validation parameters:', error);
        }
      }

      // Add required validator if applicable
      if (required) {
        validators.push(Validators.required);
      }

      // Apply regex validator if extracted
      if (regexPattern) {
        validators.push(Validators.pattern(regexPattern));
      }

      // Add the control dynamically
      this.dynamicForm.addControl(name, this.fb.control(value, validators));
    });

    console.log('Generated dynamicForm:', this.dynamicForm.value);
  }





  getTypeofInput(type: string): string {
    let inputType = "text"; // Correct variable initialization

    if (type === "{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}")
      inputType = "text"; // Example: Assigning a return value
    else if (type === "{E0CFADEE-1AC0-471D-A820-2E70D1547B4B}")
      inputType = "select";
    else if (type === "{A296A1C1-0DA0-4493-A92E-B8191F43AEC6}")
      inputType = "textarea";
    else if (type === "{7CE25CAB-EF3A-4F73-AB13-D33BDC1E4EE2}")
      inputType = "button";
    else if (type === "{7E9A0903-A52C-4843-BBE1-5B26BD162BED}")
      inputType = "file";
    else if (type === "{04C39CAC-8976-4910-BE0D-879ED3368429}")
      inputType = "email";
    else if (type === "{DF74F55B-47E6-4D1C-92F8-B0D46A7B2704}")
      inputType = "phone";
    return inputType; // Ensure the function always returns a string
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      // alert('الحد الأقصى لحجم الملف هو 2 ميجابايت');
      this.openPopUp(this.MessageMaxSizeFile, false);
      input.value = ''; // Clear input
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      // alert('صيغة الملف غير مدعومة، الرجاء اختيار jpg أو png أو pdf.');
      this.openPopUp(this.MessageExtensionFile, false);
      input.value = ''; // Clear input
      return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.base64String = result;
        this.selectedFile = file;
      }
    };
    reader.readAsDataURL(file);
  }


  //contactForm: FormGroup;
  removeBeforeFirstComma(value: string): string {
    if (!value) return "";
    return value.includes(',') ? value.split(',').slice(1).join(',') : value;
  }

  onSubmit(): void {
    console.log('Form submitted:', this.dynamicForm);
    if (!this.dynamicForm.valid) {
      // alert('يرجى ملء جميع الحقول المطلوبة.');
      this.openPopUp(this.fieldsRequired, false);
      return;
    }

    const apiUrl = environment.sitecoreApiHost + '/api/forms/submit/?sc_apikey={5958A16E-D09D-40DE-9116-10DB3F15ED05}';
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const fileBase64 = this.removeBeforeFirstComma(this.base64String);

    const formData = {
      FormId: "FDBBDD9A-C060-4B7E-8EA3-38863056C810",
      Fields: [
        { FieldId: "B9FDD960-3264-45BC-BB7D-96DE60154228", Value: this.dynamicForm.value.FirstName, FormFieldName: "FirstName", Type: "{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}" },
        { FieldId: "D14ABFE8-8CA1-475C-AA75-39C9CDA4CB32", Value: this.dynamicForm.value.LastName, FormFieldName: "LastName", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
        { FieldId: "51CE45DC-CFC5-48D9-8A45-5979E8BF124C", Value: this.dynamicForm.value.Email, FormFieldName: "Email", Type: "{04C39CAC-8976-4910-BE0D-879ED3368429}" },
        { FieldId: "C6BCD9A6-6060-423F-B98D-A5B5A79A732A", Value: this.dynamicForm.value.CountryCode, FormFieldName: "CountryCode", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
        { FieldId: "71911098-7075-4687-9A80-56F3B1006F87", Value: this.dynamicForm.value.Phone, FormFieldName: "Phone", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
        { FieldId: "4846162A-4553-403D-9A4D-B37E3119B11A", Value: this.dynamicForm.value.Subject, FormFieldName: "Subject", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
        { FieldId: "2F4154B3-7266-46F3-B2B3-828FB96EEC53", Value: this.dynamicForm.value.Help, FormFieldName: "Help", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
        { FieldId: "DAB914FD-C807-40ED-9F9F-31687553F159", Value: this.dynamicForm.value.Category, FormFieldName: "Category", Type: "{E0CFADEE-1AC0-471D-A820-2E70D1547B4B}" },
        { FieldId: "67F93A6E-2E15-4DA3-9FBD-282C3A98AC5D", Value: fileBase64, FormFieldName: "Files", FileName: this.selectedFile?.name, Type: "{7E9A0903-A52C-4843-BBE1-5B26BD162BED}" }
      ]
    };
    if (!fileBase64)
      formData.Fields.pop();

    this.http.post(apiUrl, JSON.stringify(formData), { headers })
      .subscribe({
        next: (response: any) => {
          console.log('✅ Form submitted successfully:', response);
          console.table(formData.Fields);
          // alert('تم إرسال النموذج بنجاح!');
          if (response.Data.success) {
            this.openPopUp(this.messageSuccessfully, true);
            this.dynamicForm.reset();
            this.base64String = null;
          } else {
            this.openPopUp(this.messageError, false);
          }
        },
        error: error => {
          console.error('❌ Error submitting form:', error);
          console.table(formData.Fields);
          // alert('حدث خطأ أثناء إرسال النموذج.');
          this.openPopUp(this.messageError, false);
        }
      });
  }


  isContactOpen = false;
  closePopUp() {
    this.isContactOpen = false;
    this.message = '';
  }
  isSuccess = false;
  message = '';
  openPopUp(message: string = 'Error', isSuccess: boolean = false) {

    this.isSuccess = isSuccess;
    this.message = message;


    this.isContactOpen = true;
    setTimeout(() => {
      this.isContactOpen = false;
    }, 5000);
  }
  formatMessage(message: string, fieldName: string): string {
    return message.replace('{0}', fieldName);
  }
}
