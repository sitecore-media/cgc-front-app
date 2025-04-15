import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { FormTracker, ListFieldItem, ListViewModel, ValueFormField } from '@sitecore-jss/sitecore-jss-forms';
import { FormStateService } from '../../../../src/services/form-state.service';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.css']
})
export class CheckboxListComponent implements OnInit {
  @Input() rendering: ComponentRendering;
  @Input() field: ValueFormField<ListViewModel>;
  @Input() tracker: FormTracker;
  
  public items: ListFieldItem[] = [];
  public value: string[] = [];

  constructor(private formState: FormStateService) { }

  ngOnInit(): void {
    // Ensure field model exists and has items
    if (this.field?.model?.items && Array.isArray(this.field.model.items)) {
      this.items = this.field.model.items;
      
      // Initialize value array with pre-selected items
      this.value = this.items
        .filter(item => item.selected)
        .map(item => item.value);
      
      console.log('Initialized checkbox list items:', this.items);
      console.log('Pre-selected values:', this.value);
    } else {
      console.error('Invalid field structure or missing items:', this.field);
    }
  }

  onChange(event: any): void {
    const targetValue = event.target.value;
    const isChecked = event.target.checked;
    
    // Update value array based on checkbox state
    if (isChecked) {
      // Add value if checked and not already in array
      if (!this.value.includes(targetValue)) {
        this.value.push(targetValue);
      }
    } else {
      // Remove value if unchecked
      this.value = this.value.filter(v => v !== targetValue);
    }
    
    // Validate field
    let valid = true;
    const errorMessages: string[] = [];
    
    // Check if field is required and no items are selected
    if (this.field.model.required && this.value.length === 0) {
      valid = false;
      errorMessages.push(`${this.field.model.title || 'This field'} is required`);
    }
    
    // Update form state with the entire value array
    this.formState.setFieldState(
      this.field.valueField.name,
      this.value.join(','), // Store as comma-separated string
      valid,
      errorMessages
    );
    
    console.log('Updated values:', this.value);
  }

  // onFocus(event: any): void {
  //   if (this.tracker) {
  //     this.tracker.onFocusField(this.field, this.value.join(','));
  //   }
  // }

  // onBlur(event: any): void {
  //   if (this.tracker) {
  //     this.tracker.onBlurField(this.field, this.value.join(','));
  //   }
  // }

  // Helper method to check if an item is selected
  isSelected(optionValue: string): boolean {
    return this.value.includes(optionValue);
  }
}
