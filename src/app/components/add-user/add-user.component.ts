import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../../service/crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  selectedFile: any;
  userForm: FormGroup;
  errorMessage: any;
  errorFlag: Boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: CrudService
  ) {
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
      phone_number: ['', [Validators.required, Validators.pattern(/[0-9\+\-\ ]/), Validators.minLength(9), Validators.maxLength(12)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): any {
    const formData = new FormData();
    formData.append('image', this.selectedFile)
    for ( var key in this.userForm.value ) {
      if(key != 'image')
        formData.append(key, this.userForm.value[key]);
    }

    this.crudService.AddUser(formData).subscribe(
      (data) => {
        console.log('Data added successfully!');
        this.ngZone.run(() => this.router.navigateByUrl('/users-list'));
      },
      (err) => {
        this.errorFlag = true
        this.errorMessage = err
      }
    );
  }

}
