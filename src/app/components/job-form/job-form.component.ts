//import { Component, OnInit, Input } from '@angular/core';
//import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
//////
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { environment } from '../../../environments/environment';

import { JssContextService } from "../../jss-context.service";
import { ActivatedRoute } from '@angular/router';
import { dictionaryServiceFactory } from "../../lib/dictionary-service-factory";



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  @Input() rendering: ComponentRendering;
    dynamicForm!: FormGroup;
    fieldsData: any[] = [];  // Store backend response
    base64String: string | null = null;
    selectedFile: File | null = null;
    fileName: string;
    titleForm:string="";
    pageid:string="";
    messageSuccessfully:string="";
    messageError:string="";
    fieldsRequired:string="";
    dictionary = dictionaryServiceFactory.create();
    btnsubmit:string="Submit";
    messageSizeFileAndExtension:string="";
    MessageMaxSizeFile:string="";
    MessageExtensionFile:string="";
    SelectedFile:string="";
    constructor(
      private http: HttpClient,
      private jssService: JssContextService,
      private route: ActivatedRoute,
      private fb: FormBuilder
      //private fb: FormBuilder
    ) { }
  
    getParameterUrl() {
      this.route.queryParams.subscribe(params => {
        this.pageid = params['Pageid']; // Ensure correct casing: 'pageid', not 'Pageid'
    console.log("this.pageid=",this.pageid);
        const apiUrl = `${environment.sitecoreApiHost}/sitecore/api/layout/render/jss/`;
    
        const paramsObj = new HttpParams()
          .set("item", "{3E3E14C5-849B-4230-9222-EFCB9FBA6E41}")
          .set("sc_apikey", environment.sitecoreApiKey)
          .set("sc_lang", this.jssService?.stateValue?.language || "en")
          .set("sc_site", environment.sitecoreSiteName)
          .set("tracking", "true")
          .set("page", "2")
          .set("pageid", this.pageid || "default-pageid"); // Fallback to avoid undefined
    
        console.log("Final API Request:", apiUrl + '?' + paramsObj.toString());
    
        this.http.get(apiUrl, { params: paramsObj }).subscribe({
          next: (response: any) => {
            console.log("API Response:", response);
            this.titleForm= response?.sitecore?.route?.placeholders?.["jss-main"]?.[0]?.fields?.jobTitle;
          },
          error: (error) => {
            console.error("API Error:", error);
          },
        });
      });
    }
    
    ngOnInit() {
      this.getParameterUrl();
      this.titleForm =(this.rendering?.fields as any)?.jobTitle;
      this.initializeFieldsData();
      this.createForm();
      console.log("Dynamic Form:", this.dynamicForm);
      //console.log("lllllllll=",this.rendering?.fields?.includeSitemap?.value)
      //this.jssService.state.subscribe((jsssstate:any) =>{
        //console.log("jsssstate.sitecore?.route",jsssstate.sitecore?.route);
      //});
      console.log("path==",this.jssService.stateValue.sitecore.context.itemPath)
      console.log("pathincludeSitemap==",this.jssService.stateValue.sitecore.route.fields.includeSitemap)
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

     this.fieldsData  =(this.rendering?.fields?.form as any)?.fields as any[] || [];
      this.btnsubmit=((this.rendering?.fields?.form as any)?.fields as any[])[6]?.model.title;
     
      console.log("Fields Data:", this.fieldsData);
      console.log("btnsubmit Data:", this.btnsubmit);
    }
  
    private createForm(): void {
     // const formGroup: { [key: string]: FormControl } = {};
  
      //this.fieldsData.forEach(field => {
        //formGroup[field.model.name] = new FormControl(
          //field.model.value || '',
         // field.model.required ? Validators.required : []
       // );
     // });

     //this.fieldsData.forEach(field => {
      //const validators = [];
   
      //if (field.model.required) {
        //validators.push(Validators.required);
      //}
    
      //if (this.getTypeofInput(field.model.fieldTypeItemId) ==='text') {
        //validators.push(Validators.email);
      //}
    
      //if (this.getTypeofInput(field.model.fieldTypeItemId) ==='phone') {
        //validators.push(Validators.pattern(/^\+?\d{10,15}$/)); // Adjust regex as needed for phone validation
      //}
    
      //formGroup[field.model.name] = new FormControl(
        //field.model.value || '',
        //validators
      //);
    //});
    
// Custom phone validator


// Creating FormGroup dynamically

  
     // this.dynamicForm = new FormGroup(formGroup);
     
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
     
    }
  
    formatMessage(message: string, fieldName: string): string {
      return message.replace('{0}', fieldName);
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
      else if (type === "{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}")
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
      //if (!this.dynamicForm.valid) {
        // alert('يرجى ملء جميع الحقول المطلوبة.');
       // this.popUp(this.fieldsRequired, false);
        //return;
      //}
      console.log("this.dynamicForm.valid=",this.dynamicForm.valid);
      if (!this.dynamicForm.valid) {
        // alert('يرجى ملء جميع الحقول المطلوبة.');
        this.openPopUp(this.fieldsRequired, false);
        return;
      }
  
      const apiUrl = environment.sitecoreApiHost + '/api/forms/submit/?sc_apikey={5958A16E-D09D-40DE-9116-10DB3F15ED05}';
      const headers = new HttpHeaders({ "Content-Type": "application/json" });
      const fileBase64 = this.removeBeforeFirstComma(this.base64String);
     
      const formData = {
        FormId: "D2094DD-214F-4932-90A7-8DCD62FB970C",
        Fields: [
          { FieldId: "2DEFC07A-0B29-40BD-AA74-D7CEBB112EBD", Value: this.dynamicForm.value.FirstName, FormFieldName: "FirstName", Type: "{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}" },
          { FieldId: "DCBFDB9E-1D28-448F-82F2-BDDF007434AD", Value: this.dynamicForm.value.LastName, FormFieldName: "LastName", Type: "{{4EE89EA7-CEFE-4C8E-8532-467EF64591FC}}" },
          { FieldId: "F4644927-5539-47A5-B7F7-6C7251869881", Value: this.dynamicForm.value.Email, FormFieldName: "Email", Type: "{04C39CAC-8976-4910-BE0D-879ED3368429}" },
          { FieldId: "18EAE87F-8963-4E21-916A-6E5358AFD22E", Value: this.dynamicForm.value.CountryCode, FormFieldName: "CountryCode", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
          { FieldId: "2EA67B0F-A298-4488-BEEF-9DB6AC4A54B4", Value: this.dynamicForm.value.Phone, FormFieldName: "Phone", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
          { FieldId: "2EA67B0F-A298-4488-BEEF-9DB6AC4A55B9", Value: this.pageid || '{C6E2C4CC-25A1-406D-ABE7-4256A62F5BEC}', FormFieldName: "JobId", Type: "{5B153FC0-FC3F-474F-8CB8-233FB1BEF292}" },
          { FieldId: "67F93A6E-2E15-4DA3-9FBD-282C3A98AC5D", Value: fileBase64, FormFieldName: "Files", FileName: this.selectedFile?.name, Type: "{7E9A0903-A52C-4843-BBE1-5B26BD162BED}" }
        ]
      };
      if(!fileBase64)
        formData.Fields.pop();

      this.http.post(apiUrl, JSON.stringify(formData), { headers })
        .subscribe({
          next: response => {
            console.log('✅ Form submitted successfully:', response);
            console.table(formData.Fields);
            console.log("JSON.stringify(formData)=",JSON.stringify(formData));
            // alert('تم إرسال النموذج بنجاح!');
            this.openPopUp(this.messageSuccessfully, true);
            this.dynamicForm.reset();
            this.base64String=null;
          },
          error: error => {
            console.error('❌ Error submitting form:', error);
            console.table(formData.Fields);
            console.log("JSON.stringify(formData)=",JSON.stringify(formData));
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
    openPopUp(message: string = ' ', isSuccess: boolean = false) {
      this.isContactOpen = true;
      this.isSuccess = isSuccess;
      this.message = message;
      setTimeout(() => {
        this.isContactOpen = false;
      }, 3000);
    }
  }
  
