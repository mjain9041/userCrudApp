import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../service/crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  baseUrl: string = 'http://localhost:8000/';
  imageUrl: any;
  getId: any;
  updateForm: FormGroup;
  selectedFile: any;
  errorMessage: any;
  errorFlag: Boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.crudService.GetUser(this.getId).subscribe((res) => {
      this.imageUrl = `${this.baseUrl}${res.image}`
      this.updateForm.setValue({
        first_name: res['first_name'],
        last_name: res['last_name'],
        email: res['email'],
        phone_number: res['phone_number'],
        image: res['image'],
      });
    });

    this.updateForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
      phone_number: ['', [Validators.required, Validators.pattern(/[0-9\+\-\ ]/), Validators.minLength(9), Validators.maxLength(12)]],
      image: ['']
    });
  }

  ngOnInit() {}

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onUpdate(): any {
    console.log(111111)
    const formData = new FormData();
    if(this.selectedFile)
      formData.append('image', this.selectedFile)

    for ( var key in this.updateForm.value ) {
      if(key != 'image')
        formData.append(key, this.updateForm.value[key]);
    }
    this.crudService.updateUser(this.getId, formData).subscribe(
      () => {
        console.log('Data updated successfully!');
        this.ngZone.run(() => this.router.navigateByUrl('/users-list'));
      },
      (err) => {
        console.log((err))
        this.errorFlag = true
        this.errorMessage = err
      }
    );
  }
}
